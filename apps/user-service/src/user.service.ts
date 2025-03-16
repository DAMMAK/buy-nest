import { CreateUserDto } from '@app/shared';
import { UpdateUserDto } from '@app/shared/dto/update-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }
  findAll() {
    return this.userRepository.find();
  }
  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    var user = await this.findOne(id);
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.password = updateUserDto.password;
    return await this.userRepository.save(user);
  }
  async remove(id: string) {
    var user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return new BadRequestException('Invalid user ');
    }
    var { id } = user;
    this.userRepository.softDelete({ id });
  }
}
