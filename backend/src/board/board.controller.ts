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
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from '@/common/dto/req.dto';
import {
  CreateBoardReqDto,
  FindBoardReqDto,
  UpdateBoardReqDto,
} from './dto/req.dto';
import { ApiGetResponse } from '@/common/decorator/swagger.decorator';
import { FindBoardResDto } from './dto/res.dto';

@ApiTags('Board')
@ApiExtraModels(FindBoardResDto)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('exception')
  exception() {
    throw new HttpException('Not Found Exception', HttpStatus.NOT_FOUND);
  }

  @Get()
  findAll(@Query() { page }: PageReqDto) {
    return this.boardService.findAll();
  }

  @Get(':id')
  @ApiGetResponse(FindBoardResDto)
  find(@Param('id') { id }: FindBoardReqDto) {
    return this.boardService.find(id);
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateBoardReqDto) {
    return this.boardService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') { id }: FindBoardReqDto,
    @Body(new ValidationPipe()) body: UpdateBoardReqDto,
  ) {
    return this.boardService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') { id }: FindBoardReqDto) {
    return this.boardService.remove(id);
  }
}
