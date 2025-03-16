import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user-service.controller';
import { UserServiceService } from './user.service';

describe('UserServiceController', () => {
  let userServiceController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserServiceService],
    }).compile();

    userServiceController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userServiceController.getHello()).toBe('Hello World!');
    });
  });
});
