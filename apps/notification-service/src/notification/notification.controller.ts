// notification-service/src/notification/notification.controller.ts
import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}
  @EventPattern('order_created')
  async handleOrderCreated(data: {
    orderId: string;
    userId: string;
    amount: number;
  }) {
    // In a real implementation, you would fetch the user's email from the user service
    // For simplicity, we'll emit another event to get user details
    this.kafkaClient.emit('get_user_details', {
      userId: data.userId,
      context: 'order_created',
      data,
    });
  }

  @EventPattern('payment_succeeded')
  async handlePaymentSucceeded(data: {
    orderId: string;
    userId: string;
    paymentId: string;
  }) {
    this.kafkaClient.emit('get_user_details', {
      userId: data.userId,
      context: 'payment_succeeded',
      data,
    });
  }

  @EventPattern('order_status_changed')
  async handleOrderStatusChanged(data: {
    orderId: string;
    userId: string;
    status: string;
  }) {
    this.kafkaClient.emit('get_user_details', {
      userId: data.userId,
      context: 'order_status_changed',
      data,
    });
  }

  @EventPattern('user_details_response')
  async handleUserDetailsResponse(data: {
    context: string;
    user: any;
    originalData: any;
  }) {
    const { context, user, originalData } = data;

    switch (context) {
      case 'order_created':
        await this.notificationService.sendOrderConfirmation(
          user.id,
          user.email,
          originalData.orderId,
        );
        break;
      case 'payment_succeeded':
        await this.notificationService.sendPaymentConfirmation(
          user.id,
          user.email,
          originalData.orderId,
        );
        break;
      case 'order_status_changed':
        await this.notificationService.sendOrderStatusUpdate(
          user.id,
          user.email,
          originalData.orderId,
          originalData.status,
        );
        break;
    }
  }
}
