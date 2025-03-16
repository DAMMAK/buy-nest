// api-gateway/src/controllers/payment.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProcessPaymentDto } from '../../../../libs/shared/src/dto/process-payment.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientKafka,
  ) {}

  @Post('process')
  async processPayment(
    @Request() req,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    const paymentData = {
      ...processPaymentDto,
      userId: req.user.id,
    };

    return firstValueFrom(
      this.paymentClient.send('process_payment', paymentData),
    );
  }

  @Get('order/:orderId')
  async getPaymentByOrderId(@Param('orderId') orderId: string) {
    return firstValueFrom(
      this.paymentClient.send('get_payment_by_order_id', orderId),
    );
  }
}
