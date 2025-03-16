// notification-service/src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as Twilio from 'twilio';

@Injectable()
export class NotificationService {
  private twilioClient: Twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    this.twilioClient = Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const msg = {
      to,
      from: 'noreply@ecommerce.com',
      subject,
      text: content,
      html: content,
    };

    try {
      await SendGrid.send(msg);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendSMS(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to,
      });
      console.log(`SMS sent to ${to}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(
    userId: string,
    email: string,
    orderId: string,
  ): Promise<void> {
    const subject = 'Order Confirmation';
    const content = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order. Your order ID is ${orderId}.</p>
      <p>We will process your order as soon as possible.</p>
    `;

    await this.sendEmail(email, subject, content);
  }

  async sendOrderStatusUpdate(
    userId: string,
    email: string,
    orderId: string,
    status: string,
  ): Promise<void> {
    const subject = 'Order Status Update';
    const content = `
      <h1>Order Status Update</h1>
      <p>Your order with ID ${orderId} has been updated to ${status}.</p>
    `;

    await this.sendEmail(email, subject, content);
  }

  async sendPaymentConfirmation(
    userId: string,
    email: string,
    orderId: string,
  ): Promise<void> {
    const subject = 'Payment Confirmation';
    const content = `
      <h1>Payment Confirmation</h1>
      <p>Your payment for order ID ${orderId} has been successfully processed.</p>
    `;

    await this.sendEmail(email, subject, content);
  }
}
