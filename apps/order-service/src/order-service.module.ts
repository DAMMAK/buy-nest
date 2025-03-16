import { Module } from '@nestjs/common';
import { OrderService } from './order/order.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OrderService],
})
export class OrderServiceModule {}
