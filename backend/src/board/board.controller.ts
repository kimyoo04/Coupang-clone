import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('board')
export class BoardController {
  @Get()
  findAll() {
    return 'find All';
  }

  @Get(':id')
  find(@Param('id') id: number) {
    return `find ${id}`;
  }

  @Post()
  create(@Body() body: any) {
    console.log(body);
    return 'create';
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    console.log(id, body);
    return 'update';
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return `remove ${id}`;
  }
}
