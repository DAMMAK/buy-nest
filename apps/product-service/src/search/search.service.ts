// product-service/src/search/search.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class SearchService {
  private readonly index = 'products';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexProduct(product: Product): Promise<void> {
    await this.elasticsearchService.index({
      index: this.index,
      id: product.id,
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        isActive: product.isActive,
        createdAt: product.createdAt,
      },
    });
  }

  async search(text: string, from = 0, size = 10): Promise<any> {
    const { hits } = await this.elasticsearchService.search({
      index: this.index,
      from,
      size,
      query: {
        multi_match: {
          query: text,
          fields: ['name^3', 'description'],
          fuzziness: 'AUTO',
        },
      },
    });

    return hits.hits.map((item) => ({
      id: item._id,
      score: item._score,
      ...item,
      //   ...item._source,
    }));
  }

  async removeIndex(productId: string): Promise<void> {
    await this.elasticsearchService.delete({
      index: this.index,
      id: productId,
    });
  }

  async createIndex(): Promise<void> {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              categoryId: { type: 'keyword' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
    }
  }
}
