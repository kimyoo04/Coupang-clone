import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PageReqDto } from '@/common/dto/req.dto';
import { FindBoardDto } from './dto/find-board.dto';

@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('exception')
  exception() {
    throw new HttpException('Not Found Exception', HttpStatus.NOT_FOUND);
  }

  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.boardService.findAll();
  }

  @Get(':id')
  find(@Param('id') { id }: FindBoardDto) {
    return this.boardService.find(id);
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateBoardDto) {
    return this.boardService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') { id }: FindBoardDto,
    @Body(new ValidationPipe()) body: UpdateBoardDto,
  ) {
    return this.boardService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') { id }: FindBoardDto) {
    return this.boardService.remove(id);
  }
}
