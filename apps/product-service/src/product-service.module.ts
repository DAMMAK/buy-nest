import { Module } from '@nestjs/common';
import { ProductController } from './product/product.controller';
import { ProductServiceService } from './product.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductServiceService],
})
export class ProductServiceModule {}
