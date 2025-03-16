import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product-service.controller';
import { ProductServiceService } from './product.service';

describe('ProductServiceController', () => {
  let productServiceController: ProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductServiceService],
    }).compile();

    productServiceController = app.get<ProductController>(ProductController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productServiceController.getHello()).toBe('Hello World!');
    });
  });
});
