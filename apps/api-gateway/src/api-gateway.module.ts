import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { ProductController } from './controllers/product.controller';
import { CartController } from './controllers/cart.controller';
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { CircuitBreakerService } from './common/circuit-breaker.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'user-service',
              brokers: [configService.get('KAFKA_BROKER', 'localhost:9092')],
            },
            consumer: {
              groupId: 'user-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'product-service',
              brokers: [configService.get('KAFKA_BROKER', 'localhost:9092')],
            },
            consumer: {
              groupId: 'product-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CART_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'cart-service',
              brokers: [configService.get('KAFKA_BROKER', 'localhost:9092')],
            },
            consumer: {
              groupId: 'cart-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'ORDER_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'order-service',
              brokers: [configService.get('KAFKA_BROKER', 'localhost:9092')],
            },
            consumer: {
              groupId: 'order-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'payment-service',
              brokers: [configService.get('KAFKA_BROKER', 'localhost:9092')],
            },
            consumer: {
              groupId: 'payment-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        ttl: 60 * 60, // 1 hour
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    UserController,
    ProductController,
    CartController,
    OrderController,
    PaymentController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CircuitBreakerService,
  ],
  exports: [CircuitBreakerService],
})
export class AppModule {}
