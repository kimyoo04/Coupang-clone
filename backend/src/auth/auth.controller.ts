import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupReqDto: SignupReqDto) {
    return this.authService.signup('email', 'password');
  }

  @Post('signin')
  async signin(@Body() signinReqDto: SigninReqDto) {
    return this.authService.signin({});
  }

  @Post('/oauth')
  async createUserFromOAuth(@Body() requestBody: any) {
    const { oauthProvider, oauthId, email, name, profilePictureUrl } =
      requestBody;

    if (!oauthProvider || !oauthId || !email || !name || !profilePictureUrl) {
      throw new BadRequestException('Missing required fields.');
    }

    try {
      const user = await this.authService.createOrUpdateUserFromOAuth(
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
