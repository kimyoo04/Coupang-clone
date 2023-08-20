import { RefreshToken } from './../entity/refresh-token.entity';
import { UserService } from 'src/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private dataSource: DataSource,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let error;

    try {
      const user = await this.userService.findOneByEmail(email);
      if (user) throw new UnauthorizedException('이미 존재하는 이메일입니다.');

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userEntity = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      await queryRunner.manager.save(userEntity);

      const accessToken = this.generateAccesToken(userEntity.id);

      const refreshToken = this.generateRefreshToken(userEntity.id);
      const refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: userEntity.id },
        token: refreshToken,
      });
      await queryRunner.manager.save(refreshTokenEntity);
      await queryRunner.commitTransaction(); // 트랜잭션 내용 저장

      return { id: userEntity.id, accessToken, refreshToken };
    } catch (e) {
      await queryRunner.rollbackTransaction(); // 트랜잭션 롤백
      error = e;
    } finally {
      await queryRunner.release(); // 쿼리 러너 해제
      if (error) throw error;
    }
  }

  async signin(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const refreshToken = this.generateRefreshToken(user.id);
    await this.createRefreshTokenUsingUser(user.id, refreshToken);

    return {
      accessToken: this.generateAccesToken(user.id),
      refreshToken,
    };
  }

  async refresh(token: string, userId: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      token,
    });
    if (!refreshTokenEntity) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }
    const accessToken = this.generateAccesToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    refreshTokenEntity.token = refreshToken;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return { accessToken, refreshToken };
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

  private generateAccesToken(userId: string) {
    const payload = { sub: userId, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private generateRefreshToken(userId: string) {
    const payload = { sub: userId, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private async createRefreshTokenUsingUser(
    userId: string,
    refreshToken: string,
  ) {
    let refreshTokenEntity = await this.refreshTokenRepository.findOneBy({
      user: { id: userId },
    });

    if (!refreshTokenEntity) {
      // 새로운 리프레시 토큰이라면 엔티티 생성
      refreshTokenEntity = this.refreshTokenRepository.create({
        user: { id: userId },
        token: refreshToken,
      });
    } else {
      // 이미 존재하는 리프레시 토큰이라면 토큰만 업데이트
      refreshTokenEntity.token = refreshToken;
    }
    await this.refreshTokenRepository.save(refreshTokenEntity);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('존재하지 않는 이메일입니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return user;
  }
}
