import inquirer from 'inquirer';
import { EventService } from './event.js';
import chalk from 'chalk';
import { OrderService } from './order.js';

export class TicketService {
  private eventService: EventService;
  private orderService: OrderService;

  constructor(eventService: EventService, orderService : OrderService) {
    this.eventService = eventService;
    this.orderService = orderService;
  }

  async purchaseTickets(userId: string): Promise<void> {
    this.eventService.listEvents();
    const { eventId } = await inquirer.prompt([
      { type: 'input', name: 'eventId', message: 'Enter the event ID to purchase tickets:' }
    ]);
    const event = this.eventService.getEventById(eventId);

    if (!event) {
      console.log(chalk.redBright.bold('\nInvalid event ID.\n'));
      return;
    }

    const { quantity } = await inquirer.prompt([
      { type: 'number', name: 'quantity', message: 'Enter the number of tickets:' }
    ]);

    if (quantity > event.ticketStock) {
      console.log(chalk.redBright.bold('\nNot enough tickets available.\n'));
      return;
    }

    const paymentDetails = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Enter your name:' },
      { type: 'input', name: 'email', message: 'Enter your email:' },
      { type: 'input', name: 'cardNumber', message: 'Enter your credit card number:' },
      { type: 'input', name: 'expiration', message: 'Enter card expiration date (MM/YY):' },
      { type: 'input', name: 'cvv', message: 'Enter card CVV:' }
    ]);

    console.log(chalk.blueBright.bold('\nProcessing payment...\n'));
    setTimeout(() => {

      console.log(chalk.greenBright.bold('\nYour payment has been successfully processed!\n'));
      console.log(chalk.greenBright.bold('\n Here is your ticket:'));
      console.log(chalk.blueBright.bold('|==============================================|'));
      console.log(chalk.greenBright.bold(`           ${event.title}  Ticket             `));
      console.log(chalk.blueBright.bold('|==============================================|\n'));
      console.log(chalk.greenBright.bold(`       Name :    ${paymentDetails.name}  `));
      console.log(chalk.greenBright.bold(`       Date :    ${event.date}  `));
      console.log(chalk.greenBright.bold(`       Time :    ${event.time}  `));
      console.log(chalk.greenBright.bold(`       City :    ${event.city}  `));
      console.log(chalk.greenBright.bold(`      Tickets :   ${quantity}    `));
      console.log(chalk.blueBright.bold('\n|==============================================|\n'));
      console.log(chalk.blueBright.bold(`\nPurchased ${quantity} tickets for ${event.title}\n`));
      this.eventService.updateTicketStock(eventId, quantity);
      this.orderService.createOrder(userId, eventId, event.title, quantity, quantity * event.price);
      return
    }, 2000)
  }
}