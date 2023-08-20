import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { AuthService } from './auth.service';
import { RefreshResDto, SigninResDto, SignupResDto } from './dto/res.dto';
import { Public } from '@/common/decorator/public.decorator';
import { User, UserAfterAuth } from '@/common/decorator/user.decorator';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto, SigninResDto, RefreshResDto)
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiPostResponse(SignupResDto)
  @Public()
  async signup(
    @Body() { name, email, password, passwordConfirm }: SignupReqDto,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }
    const { id, accessToken, refreshToken } = await this.authService.signup(
      name,
      email,
      password,
    );
    return id;
  }

  @Public()
  @ApiPostResponse(SigninResDto)
  @Post('signin')
  async signin(@Body() { email, password }: SigninReqDto) {
    return this.authService.signin(email, password);
  }

  @ApiPostResponse(RefreshResDto)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @User() user: UserAfterAuth,
  ) {
    const token = authorization.split(' ')[1];
    const { accessToken, refreshToken } = await this.authService.refresh(
      token,
      user.id,
    );
    return { accessToken, refreshToken };
  }

  @Public()
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
