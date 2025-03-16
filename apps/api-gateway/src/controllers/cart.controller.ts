import {
  Body,
  Controller,
  Delete,
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
import { AddCartItemDto } from '@app/shared/dto/add-cart-item.dto';
import { UpdateCartItemDto } from '@app/shared/dto/update-cart-item.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(
    @Inject('CART_SERVICE') private readonly cartClient: ClientKafka,
  ) {}

  @Post('items')
  async addItem(@Request() req, @Body() addCartItemDto: AddCartItemDto) {
    const userId = req.user.id;
    return firstValueFrom(
      this.cartClient.send('add_cart_item', {
        userId,
        item: addCartItemDto,
      }),
    );
  }

  @Get()
  async getCart(@Request() req) {
    const userId = req.user.id;
    return firstValueFrom(this.cartClient.send('get_cart', userId));
  }

  @Put('items/:productId')
  async updateItemQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    // api-gateway/src/controllers/cart.controller.ts (continued)
    const userId = req.user.id;
    return firstValueFrom(
      this.cartClient.send('update_cart_item_quantity', {
        userId,
        productId,
        quantity: updateCartItemDto.quantity,
      }),
    );
  }

  @Delete('items/:productId')
  async removeItem(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.id;
    return firstValueFrom(
      this.cartClient.send('remove_cart_item', { userId, productId }),
    );
  }

  @Delete()
  async clearCart(@Request() req) {
    const userId = req.user.id;
    return firstValueFrom(this.cartClient.send('clear_cart', userId));
  }
}
