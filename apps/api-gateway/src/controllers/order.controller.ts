import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from '@app/shared/dto/create-order.dto';
import { UpdateOrderStatusDto } from '@app/shared/dto/update-order-status.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientKafka,
    @Inject('CART_SERVICE') private readonly cartClient: ClientKafka,
  ) {}

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    // Add user ID to the order
    const orderWithUserId = {
      ...createOrderDto,
      userId: req.user.id,
    };

    // Create the order
    const order = await firstValueFrom(
      this.orderClient.send('create_order', orderWithUserId),
    );

    // Clear the cart after successful order creation
    await firstValueFrom(this.cartClient.send('clear_cart', req.user.id));

    return order;
  }

  @Get()
  async findByUser(@Request() req) {
    const userId = req.user.id;
    return firstValueFrom(
      this.orderClient.send('find_orders_by_user_id', userId),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(this.orderClient.send('find_order_by_id', id));
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return firstValueFrom(
      this.orderClient.send('update_order_status', {
        id,
        status: updateOrderStatusDto.status,
      }),
    );
  }
}
