import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageReqDto {
  @ApiPropertyOptional({ description: '페이지. Default = 1' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  page?: number = 1;
}
