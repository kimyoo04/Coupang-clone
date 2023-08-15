import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/oauth')
  async createUserFromOAuth(@Body() requestBody: any) {
    const { oauthProvider, oauthId, email, name, profilePictureUrl } =
      requestBody;

    if (!oauthProvider || !oauthId || !email || !name || !profilePictureUrl) {
      throw new BadRequestException('Missing required fields.');
    }

    try {
      const user = await this.userService.createOrUpdateUserFromOAuth(
        oauthProvider,
        oauthId,
        email,
        name,
        profilePictureUrl,
      );

      return {
        message: 'User created/updated successfully',
        user,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create/update user.');
    }
  }
}
