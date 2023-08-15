import { ApiProperty } from '@nestjs/swagger';

export class SigninResDto {
  @ApiProperty({ required: true })
  accessToken: string;
}

export class SignupResDto {
  @ApiProperty({ required: true })
  id: string;
}
