// api-gateway/src/dto/update-cart-item.dto.ts
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@order-service/order/entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description:
      'Order Status e.g PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
