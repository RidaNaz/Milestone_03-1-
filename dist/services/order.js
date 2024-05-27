export class OrderService {
    orders = [];
    createOrder(userId, eventId, eventName, quantity, totalPrice) {
        const order = {
            userId,
            eventId,
            eventName,
            quantity,
            totalPrice
        };
        this.orders.push(order);
    }
    getOrdersByUserId(userId) {
        return this.orders.filter(order => order.userId === userId);
    }
}
