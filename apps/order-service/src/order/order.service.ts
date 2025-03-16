// order-service/src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from '@app/shared/dto/create-order.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    // Publish event for payment processing
    this.kafkaClient.emit('order_created', {
      orderId: savedOrder.id,
      userId: savedOrder.userId,
      amount: savedOrder.totalAmount,
    });

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items'] });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
    });
  }

  async findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.orderRepository.update(id, { status });

    const updatedOrder = await this.findOne(id);

    // Publish event for order status change
    this.kafkaClient.emit('order_status_changed', {
      orderId: id,
      userId: updatedOrder.userId,
      status,
    });

    return updatedOrder;
  }
}
