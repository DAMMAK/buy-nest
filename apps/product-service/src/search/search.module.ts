// product-service/src/search/search.module.ts
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get(
          'ELASTICSEARCH_NODE',
          'http://elasticsearch:9200',
        ),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME', 'elastic'),
          password: configService.get('ELASTICSEARCH_PASSWORD', 'changeme'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService, SearchService],
  exports: [SearchService],
})
export class SearchModule {}
