interface Order {
    userId: string;
    eventId: string;
    eventName: string;
    quantity: number;
    totalPrice: number;
  }
  
 export class OrderService {
  private orders: Order[] = [];

  createOrder(userId: string, eventId: string, eventName: string, quantity: number, totalPrice: number): void {
    const order: Order = {
      userId,
      eventId,
      eventName,
      quantity,
      totalPrice
    };
    this.orders.push(order);
  }

  getOrdersById(userId: string): Order[] {
    return this.orders.filter(order => order.userId === userId);
  }
}