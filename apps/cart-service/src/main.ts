import { NestFactory } from '@nestjs/core';
import { CartServiceModule } from './cart-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CartServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
