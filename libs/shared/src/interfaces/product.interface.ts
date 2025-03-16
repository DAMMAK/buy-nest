export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  isActive: boolean;
  imageUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
}
