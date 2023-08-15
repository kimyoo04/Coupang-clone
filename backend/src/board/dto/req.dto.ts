import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, IsUUID } from 'class-validator';

export class CreateBoardReqDto {
  @ApiProperty({
    description: 'The title of a board',
    minimum: 2,
    maximum: 10,
    default: 'title',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  title: string;

  @ApiProperty({
    description: 'The content of a board',
    default: 'content',
  })
  @IsNotEmpty()
  content: string;
}

export class UpdateBoardReqDto {
  @ApiProperty({
    description: 'The title of a board',
    minimum: 2,
    maximum: 10,
    default: 'title',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(10)
  title?: string;

  @ApiProperty({
    description: 'The content of a board',
    default: 'content',
  })
  @IsNotEmpty()
  content?: string;
}

export class FindBoardReqDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
