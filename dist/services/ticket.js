import inquirer from 'inquirer';
import validator from 'validator';
import chalk from 'chalk';
export class TicketService {
    eventService;
    orderService;
    constructor(eventService, orderService) {
        this.eventService = eventService;
        this.orderService = orderService;
    }
    async purchaseTickets(userId) {
        if (this.eventService.hasEvents()) {
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
            while (true) {
                const { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Enter your name:' });
                if (!name || name.trim().length === 0) {
                    console.log(chalk.redBright.bold('\nProvide a valid name\n'));
                }
                else {
                    break;
                }
            }
            while (true) {
                const { email } = await inquirer.prompt({ type: 'input', name: 'email', message: 'Enter your email:' });
                if (!validator.isEmail(email)) {
                    console.log(chalk.redBright.bold('\nProvide a valid email address.\n'));
                }
                else {
                    break;
                }
            }
            while (true) {
                const { cardNumber } = await inquirer.prompt({ type: 'input', name: 'cardNumber', message: 'Enter your credit card number:' });
                if (!/^\d+$/.test(cardNumber)) {
                    console.log(chalk.redBright.bold('\nCredit card number must be numeric\n'));
                }
                else {
                    break;
                }
            }
            while (true) {
                const { expiration } = await inquirer.prompt({ type: 'input', name: 'expiration', message: 'Enter card expiration date (MM/YY):' });
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) {
                    console.log(chalk.redBright.bold('\nExpiration date must be in the format MM/YY\n'));
                    const date = new Date(expiration);
                    if (date <= new Date()) {
                        console.log(chalk.redBright.bold('\nYour card is Expired!\n'));
                        return expiration;
                    }
                }
                else {
                    break;
                }
            }
            while (true) {
                const { cvv } = await inquirer.prompt({ type: 'input', name: 'cvv', message: 'Enter card CVV:' });
                if (!/^\d{3,4}$/.test(cvv)) {
                    console.log(chalk.redBright.bold('\nCVV must be a 3 or 4 digit number\n'));
                }
                else {
                    break;
                }
            }
            console.log(chalk.blueBright.bold('\nProcessing payment...\n'));
            setTimeout(() => {
                console.log(chalk.greenBright.bold('\nYour payment has been successfully processed!\n'));
                console.log(chalk.greenBright.bold('\n Here is your ticket:'));
                console.log(chalk.blueBright.bold('|==============================================|'));
                console.log(chalk.greenBright.bold(`           ${event.title}  Ticket             `));
                console.log(chalk.blueBright.bold('|==============================================|\n'));
                console.log(chalk.greenBright.bold(`       Name :    ${name}  `));
                console.log(chalk.greenBright.bold(`       Date :    ${event.date}  `));
                console.log(chalk.greenBright.bold(`       Time :    ${event.time}  `));
                console.log(chalk.greenBright.bold(`       City :    ${event.city}  `));
                console.log(chalk.greenBright.bold(`      Tickets :   ${quantity}    `));
                console.log(chalk.blueBright.bold('\n|==============================================|\n'));
                console.log(chalk.blueBright.bold(`\nPurchased ${quantity} tickets for ${event.title}\n`));
                this.eventService.updateTicketStock(eventId, quantity);
                this.orderService.createOrder(userId, eventId, event.title, quantity, quantity * event.price);
                return;
            }, 2000);
        }
        else {
            console.log(chalk.redBright.bold("\nThere is no events available to sale\n"));
        }
    }
    ;
}
