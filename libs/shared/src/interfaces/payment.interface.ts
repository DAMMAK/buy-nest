// shared-lib/src/interfaces/payment.interface.ts
export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentIntentId?: string;
  status: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
