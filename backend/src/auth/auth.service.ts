import { UserService } from 'src/user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return null;
  }

  async signup(name: string, email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user) throw new BadRequestException('이미 존재하는 이메일입니다.');
    const newUser = await this.userService.create(name, email, password);
    return newUser;
  }

  async signin(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('존재하지 않는 이메일입니다.');

    const isMatch = password === user.password;
    if (!isMatch)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async createOrUpdateUserFromOAuth(
    oauthProvider: string,
    oauthId: string,
    email: string,
    name: string,
    profilePictureUrl: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { oauthProvider, oauthId },
    });

    if (!user) {
      // OAuth로 처음 로그인한 사용자라면 새로운 유저 엔티티 생성
      user = new User();
      user.oauthProvider = oauthProvider;
      user.oauthId = oauthId;
    }

    // 이메일, 이름, 프로필 사진 URL 업데이트
    user.email = email;
    user.name = name;
    user.profilePictureUrl = profilePictureUrl;

    return await this.userRepository.save(user);
  }
}
