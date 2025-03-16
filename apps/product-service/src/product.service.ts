// product-service/src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product/entities/product.entity';
import { CreateProductDto } from '@app/shared/dto/create-product.dto';
import { UpdateProductDto } from '@app/shared/dto/update-product.dto';
import { SearchService } from './search/search.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly searchService: SearchService,
  ) {
    this.searchService
      .createIndex()
      .catch((err) => console.error('Error creating index', err));
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    await this.searchService.indexProduct(savedProduct);
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.findOne(id);
    await this.searchService.indexProduct(updatedProduct);
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
    await this.searchService.removeIndex(id);
  }

  async search(query: string): Promise<any> {
    return this.searchService.search(query);
  }
}
