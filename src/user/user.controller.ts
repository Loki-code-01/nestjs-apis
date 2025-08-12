import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/create-relation')
  createRelation(@Body() createUserDto: CreateUserDto) {
    return this.userService.createRelation(createUserDto);
  }

  @Post('/create-users')
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createMany(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/get-user')
  findOne(@Query('email') email: string) {
    return this.userService.findOne(email);
  }

  @Put(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(email, updateUserDto);
  }

  @Delete('/delete-users')
  removeMany(@Query('user_id') user_id: string) {
    const userids = user_id.split(',');
    return this.userService.deleteMany(userids);
  }
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.userService.remove(email);
  }

  @Post('/roles')
  addRoles(@Body() roles: { name: string }[]) {
    return this.userService.addRoles(roles);
  }
}
