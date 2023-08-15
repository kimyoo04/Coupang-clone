import { ApiProperty } from '@nestjs/swagger';

export class PageResDto<TData> {
  @ApiProperty({ required: true })
  currentPage: number;

  @ApiProperty({ required: true })
  totalPages: number;

  items: TData[];
}
