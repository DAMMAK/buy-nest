// user-service/src/user/user.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../user.service';
import { CreateUserDto } from '@app/shared/dto/create-user.dto';
import { UpdateUserDto } from '@app/shared/dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('create_user')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('find_all_users')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('find_user_by_id')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('update_user')
  update(
    @Payload() updateUserData: { id: string; updateUserDto: UpdateUserDto },
  ) {
    return this.userService.update(
      updateUserData.id,
      updateUserData.updateUserDto,
    );
  }

  @MessagePattern('delete_user')
  remove(@Payload() id: string) {
    return this.userService.remove(id);
  }
}
