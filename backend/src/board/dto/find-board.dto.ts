import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindBoardDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
