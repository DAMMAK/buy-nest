// cart-service/src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { CartItem } from '@app/shared/interfaces/cart-item.interface';
import Redis from 'ioredis';

@Injectable()
export class CartService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }

  async addItem(userId: string, item: CartItem): Promise<void> {
    const cartKey = this.getCartKey(userId);
    const existingItem = await this.redis.hget(cartKey, item.productId);

    if (existingItem) {
      const parsedItem = JSON.parse(existingItem);
      parsedItem.quantity += item.quantity;
      await this.redis.hset(
        cartKey,
        item.productId,
        JSON.stringify(parsedItem),
      );
    } else {
      await this.redis.hset(cartKey, item.productId, JSON.stringify(item));
    }
  }

  async getCart(userId: string): Promise<CartItem[]> {
    const cartKey = this.getCartKey(userId);
    const cartItems = await this.redis.hgetall(cartKey);

    return Object.values(cartItems).map((item) => JSON.parse(item));
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    const cartKey = this.getCartKey(userId);
    const existingItem = await this.redis.hget(cartKey, productId);

    if (existingItem) {
      const parsedItem = JSON.parse(existingItem);
      parsedItem.quantity = quantity;
      await this.redis.hset(cartKey, productId, JSON.stringify(parsedItem));
    }
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    await this.redis.hdel(cartKey, productId);
  }

  async clearCart(userId: string): Promise<void> {
    const cartKey = this.getCartKey(userId);
    await this.redis.del(cartKey);
  }
}
function InjectRedis(): (
  target: typeof CartService,
  propertyKey: undefined,
  parameterIndex: 0,
) => void {
  throw new Error('Function not implemented.');
}
