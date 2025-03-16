// api-gateway/src/controllers/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from '@app/shared/dto/create-user.dto';
import { UpdateUserDto } from '@app/shared/dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(this.userClient.send('create_user', createUserDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    return firstValueFrom(this.userClient.send('find_all_users', {}));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.userClient.send('find_user_by_id', id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return firstValueFrom(
      this.userClient.send('update_user', { id, updateUserDto }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return firstValueFrom(this.userClient.send('delete_user', id));
  }
}
