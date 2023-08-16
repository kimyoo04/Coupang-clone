import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength } from 'class-validator';

export class SigninReqDto {
  @ApiProperty({
    required: true,
    example: 'test@test.com',
    description: '이메일',
  })
  @IsEmail()
  @MaxLength(30)
  email: string;

  @ApiProperty({
    required: true,
    example: 'Password123!',
    description: '비밀번호',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,20}$/)
  password: string;
}

export class SignupReqDto {
  @ApiProperty({ required: true, example: 'Kim Lee', description: '이름' })
  name: string;

  @ApiProperty({
    required: true,
    example: 'test@test.com',
    description: '이메일',
  })
  @IsEmail()
  @MaxLength(30)
  email: string;

  @ApiProperty({
    required: true,
    example: 'Password123!',
    description: '비밀번호',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,20}$/)
  password: string;

  @ApiProperty({
    required: true,
    example: 'Password123!',
    description: '비밀번호',
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,20}$/)
  passwordConfirm: string;

  @ApiProperty({
    required: false,
    example: 'kjqdklsdjqpoczxc1wk-10wdk',
    description: '이메일 인증 토큰',
  })
  oauthProvider: string;

  @ApiProperty({
    required: false,
    example: 'kim@gmail.com',
    description: 'Oauth 아이디',
  })
  oauthId: string;

  @ApiProperty({
    required: false,
    example: 'https://www.google.com/profile.jpg',
    description: '프로필 사진 URL',
  })
  profilePictureUrl: string;
}
