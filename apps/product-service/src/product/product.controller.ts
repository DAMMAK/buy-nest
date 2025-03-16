import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '../product.service';
import { CreateProductDto } from '@app/shared/dto/create-product.dto';
import { UpdateProductDto } from '@app/shared/dto/update-product.dto';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('create_product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern('find_all_products')
  findAll() {
    return this.productService.findAll();
  }

  @MessagePattern('find_product_by_id')
  findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern('update_product')
  update(
    @Payload()
    updateProductData: {
      id: string;
      updateProductDto: UpdateProductDto;
    },
  ) {
    return this.productService.update(
      updateProductData.id,
      updateProductData.updateProductDto,
    );
  }

  @MessagePattern('delete_product')
  remove(@Payload() id: string) {
    return this.productService.remove(id);
  }
  @MessagePattern('search_products')
  search(@Payload() query: string) {
    return this.productService.search(query);
  }
}
