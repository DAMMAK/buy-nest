import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from '@app/shared/dto/create-product.dto';
import { UpdateProductDto } from '@app/shared/dto/update-product.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CircuitBreakerService } from '@api-gateway/common/circuit-breaker.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createProductDto: CreateProductDto) {
    return firstValueFrom(
      this.productClient.send('create_product', createProductDto),
    );
  }

  @Get()
  async findAll() {
    // Try to get from cache first
    const cachedProducts = await this.cacheManager.get('all_products');
    if (cachedProducts) {
      return cachedProducts;
    }
    // If not in cache, get from service
    const products = firstValueFrom(
      this.productClient.send('find_all_products', {}),
    );

    // Store in cache for future requests
    await this.cacheManager.set('all_products', products);

    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Try to get from cache first
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }
    // If not in cache, get from service
    var product = firstValueFrom(
      this.productClient.send('find_product_by_id', id),
    );
    // Store in cache for future requests
    await this.cacheManager.set(cacheKey, product);
    return product;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return firstValueFrom(
      this.productClient.send('update_product', { id, updateProductDto }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    //Implement circuit breaker for this function
    return this.circuitBreaker.execute(
      'delete_product',
      () => firstValueFrom(this.productClient.send('delete_product', id)),
      async () => {
        console.log('Fallback for findAll products');
        return []; // Return empty array as fallback
      },
    );
  }
}
