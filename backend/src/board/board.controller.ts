import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from '@/common/dto/req.dto';
import {
  CreateBoardReqDto,
  FindBoardReqDto,
  UpdateBoardReqDto,
} from './dto/req.dto';
import { ApiGetResponse } from '@/common/decorator/swagger.decorator';
import { FindBoardResDto } from './dto/res.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from '@/common/guard/throttler-behind-proxy.guard';

@ApiTags('Board')
@ApiExtraModels(FindBoardResDto)
@UseGuards(ThrottlerBehindProxyGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth()
  @Get()
  findAll(@Query() { page }: PageReqDto) {
    return this.boardService.findAll();
  }

  @ApiBearerAuth()
  @ApiGetResponse(FindBoardResDto)
  @SkipThrottle() // ThrottlerGuard를 거치지 않음
  @Get(':id')
  find(@Param('id') { id }: FindBoardReqDto) {
    return this.boardService.find(id);
  }

  @ApiBearerAuth()
  @Throttle(3, 60) // 60초에 3번 요청 가능
  @Post()
  create(@Body(new ValidationPipe()) body: CreateBoardReqDto) {
    return this.boardService.create(body);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id') { id }: FindBoardReqDto,
    @Body(new ValidationPipe()) body: UpdateBoardReqDto,
  ) {
    return this.boardService.update(id, body);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') { id }: FindBoardReqDto) {
    return this.boardService.remove(id);
  }
}
