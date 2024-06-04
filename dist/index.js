#!/usr/bin/env node
import inquirer from 'inquirer';
import { UserService } from './services/user.js';
import { EventService } from './services/event.js';
import { TicketService } from './services/ticket.js';
import { OrderService } from './services/order.js';
import chalk from 'chalk';
const userService = new UserService();
const eventService = new EventService();
const orderService = new OrderService();
const ticketService = new TicketService(eventService, orderService);
async function main() {
    console.clear();
    console.log(chalk.blueBright.bold('\n=============================================='));
    console.log(chalk.greenBright.bold('\tWelcome to my Ticketing System\t'));
    console.log(chalk.blueBright.bold('==============================================\n'));
    while (true) {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Choose an option:',
                choices: ['Sign Up', 'Login', 'Admin Login', 'Exit\n']
            }
        ]);
        switch (choice) {
            case 'Sign Up':
                await userService.signup();
                break;
            case 'Login':
                const user = await userService.login();
                if (user) {
                    await userMenu(user);
                }
                break;
            case 'Admin Login':
                const admin = await userService.adminLogin();
                if (admin) {
                    await adminMenu();
                }
                break;
            case 'Exit':
                console.log(chalk.redBright.bold('\n================== Goodbye! ==================\n'));
                return;
            default:
                console.log(chalk.redBright.bold('================== Goodbye! ==================\n'));
        }
    }
}
async function userMenu(user) {
    while (true) {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Choose an option:',
                choices: ['Browse Events', 'Purchase Tickets', 'View Order History', 'Logout']
            }
        ]);
        switch (choice) {
            case 'Browse Events':
                await eventService.browseEvents();
                break;
            case 'Purchase Tickets':
                await ticketService.purchaseTickets(user.id);
                break;
            case 'View Order History':
                const orders = orderService.getOrdersById(user.id);
                if (orders.length === 0) {
                    console.log(chalk.redBright.bold("\nYou have'nt order yet!\n"));
                }
                else {
                    console.log(chalk.blueBright.bold('\n|==============================================|'));
                    console.log(chalk.greenBright.bold(`        Order History of ${user.name}:        `));
                    console.log(chalk.blueBright.bold('|==============================================|'));
                    orders.forEach(order => {
                        console.log(chalk.blueBright.bold(`\n\t\tEvent: \t${order.eventName}\n`));
                        console.log(chalk.greenBright.italic(`\tTicket holder:\t${user.name}`));
                        console.log(chalk.greenBright.italic(`\tTicket:\t\t${order.quantity}`));
                        console.log(chalk.greenBright.italic(`\tTotal Price:\t${order.totalPrice}`));
                        console.log(chalk.blueBright.bold('|==============================================|'));
                    });
                }
                break;
            case 'Logout':
                console.log(chalk.redBright.bold(`\n\t${user.name} Logout!\n`));
                console.log(chalk.blueBright.bold('|===================================|\n'));
                return;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}
async function adminMenu() {
    while (true) {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Choose an option:',
                choices: ['View Event', 'Create Event', 'Edit Event', 'Delete Event', 'Logout']
            }
        ]);
        switch (choice) {
            case 'View Event':
                eventService.listEvents();
                break;
            case 'Create Event':
                await eventService.createEvent();
                break;
            case 'Edit Event':
                const { eventId } = await inquirer.prompt([
                    { type: 'input', name: 'eventId', message: 'Enter the ID of the event you want to edit:' }
                ]);
                await eventService.editEvent(eventId);
                break;
            case 'Delete Event':
                const { deleteEventId } = await inquirer.prompt([
                    { type: 'input', name: 'deleteEventId', message: 'Enter the ID of the event you want to delete:' }
                ]);
                eventService.deleteEvent(deleteEventId);
                break;
            case 'Logout':
                console.log(chalk.redBright.bold(`\n\tAdmin Logout!\n`));
                console.log(chalk.blueBright.bold('|===================================|\n'));
                return;
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}
main();
