// cart-service/src/cart/cart.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { CartItem } from '@app/shared/interfaces/cart-item.interface';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('add_cart_item')
  addItem(@Payload() data: { userId: string; item: CartItem }) {
    return this.cartService.addItem(data.userId, data.item);
  }

  @MessagePattern('get_cart')
  getCart(@Payload() userId: string) {
    return this.cartService.getCart(userId);
  }

  @MessagePattern('update_cart_item_quantity')
  updateItemQuantity(
    @Payload() data: { userId: string; productId: string; quantity: number },
  ) {
    return this.cartService.updateItemQuantity(
      data.userId,
      data.productId,
      data.quantity,
    );
  }

  @MessagePattern('remove_cart_item')
  removeItem(@Payload() data: { userId: string; productId: string }) {
    return this.cartService.removeItem(data.userId, data.productId);
  }

  @MessagePattern('clear_cart')
  clearCart(@Payload() userId: string) {
    return this.cartService.clearCart(userId);
  }
}
