import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ApiGetResponse } from '@/common/decorator/swagger.decorator';
import { FindUserResDto } from './dto/res.dto';
import { User, UserAfterAuth } from '@/common/decorator/user.decorator';

@ApiTags('User')
@ApiExtraModels(FindUserResDto)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserAfterAuth) {
    console.log(user); // custom param decorator
    return this.userService.findOne(id);
  }
}
