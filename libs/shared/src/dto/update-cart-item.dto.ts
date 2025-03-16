// api-gateway/src/dto/update-cart-item.dto.ts
import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
