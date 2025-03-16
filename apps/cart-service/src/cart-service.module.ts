import { Module } from '@nestjs/common';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';

@Module({
  imports: [],
  controllers: [CartController],
  providers: [CartService],
})
export class CartServiceModule {}
