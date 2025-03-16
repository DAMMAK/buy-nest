// payment-service/src/payment/payment.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('process_payment')
  processPayment(
    @Payload()
    data: {
      orderId: string;
      userId: string;
      amount: number;
      paymentMethodId: string;
    },
  ) {
    return this.paymentService.processPayment(
      data.orderId,
      data.userId,
      data.amount,
      data.paymentMethodId,
    );
  }

  @MessagePattern('get_payment_by_order_id')
  getPaymentByOrderId(@Payload() orderId: string) {
    return this.paymentService.getPaymentByOrderId(orderId);
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: {
    orderId: string;
    userId: string;
    amount: number;
  }) {
    // In a real application, you'd wait for the payment method to be provided
    // This is just an example of how to handle the event
    console.log(`Order created event received: ${JSON.stringify(data)}`);
  }
}
