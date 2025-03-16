// payment-service/src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async processPayment(
    orderId: string,
    userId: string,
    amount: number,
    paymentMethodId: string,
  ): Promise<Payment> {
    try {
      // Create payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
      });

      // Create payment record
      const payment = this.paymentRepository.create({
        orderId,
        userId,
        amount,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Emit event based on payment status
      if (paymentIntent.status === 'succeeded') {
        this.kafkaClient.emit('payment_succeeded', {
          orderId,
          userId,
          paymentId: savedPayment.id,
        });
      } else {
        this.kafkaClient.emit('payment_failed', {
          orderId,
          userId,
          paymentId: savedPayment.id,
          reason: paymentIntent.status,
        });
      }

      return savedPayment;
    } catch (error) {
      // Create failed payment record
      const payment = this.paymentRepository.create({
        orderId,
        userId,
        amount,
        status: 'failed',
        errorMessage: error.message,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Emit payment failed event
      this.kafkaClient.emit('payment_failed', {
        orderId,
        userId,
        paymentId: savedPayment.id,
        reason: error.message,
      });

      return savedPayment;
    }
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { orderId } });
  }
}
