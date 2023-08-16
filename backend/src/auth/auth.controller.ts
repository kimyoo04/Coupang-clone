import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { AuthService } from './auth.service';
import { SigninResDto, SignupResDto } from './dto/res.dto';
import { Public } from '@/common/decorator/public.decorator';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto, SigninResDto)
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBearerAuth()
  @ApiPostResponse(SignupResDto)
  @Post('signup')
  async signup(
    @Body() { name, email, password, passwordConfirm }: SignupReqDto,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }
    const { id } = await this.authService.signup(name, email, password);
    return id;
  }

  @Public()
  @ApiBearerAuth()
  @ApiPostResponse(SigninResDto)
  @Post('signin')
  async signin(@Body() { email, password }: SigninReqDto) {
    return this.authService.signin(email, password);
  }

  @Public()
  @ApiBearerAuth()
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
