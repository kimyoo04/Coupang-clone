import { ApiProperty } from '@nestjs/swagger';

export class FindBoardResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  createdAt: string;

  @ApiProperty({ required: true })
  user: {
    id: string;
    email: string;
    name: string;
  };
}
