import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ApiGetResponse } from '@/common/decorator/swagger.decorator';
import { FindUserResDto } from './dto/res.dto';

@ApiTags('User')
@ApiExtraModels(FindUserResDto)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
