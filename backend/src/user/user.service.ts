import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
