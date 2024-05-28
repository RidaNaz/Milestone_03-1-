import inquirer from 'inquirer';
import * as uuid from 'uuid';
import chalk from 'chalk';
export class EventService {
    events = [{
            id: uuid.v4(),
            title: "Dev Fest",
            category: "Festival",
            date: "2024-10-05",
            time: "12:30",
            city: "Karachi",
            ticketStock: 200,
            price: 1000
        }];
    hasEvents() {
        return this.events.length > 0;
    }
    async createEvent() {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'title', message: 'Enter event title:' },
            { type: 'list', name: 'category', choices: ['Music', 'Festival', 'Theater', 'Sports', 'Conference'], message: 'Choose Event category:' },
            { type: 'input', name: 'date', message: 'Enter event date (YYYY-MM-DD):' },
            { type: 'input', name: 'time', message: 'Enter event time (HH:MM):' },
            { type: 'input', name: 'city', message: 'Enter event city:' },
            { type: 'number', name: 'ticketStock', message: 'Enter ticket stock:' },
            { type: 'number', name: 'price', message: 'Enter ticket price:' }
        ]);
        const date = new Date(answers.date);
        if (date <= new Date()) {
            console.log(chalk.redBright.bold('\nEvent date must be in the future.\n'));
            return;
        }
        const event = {
            id: uuid.v4(),
            title: answers.title,
            category: answers.category,
            date,
            time: answers.time,
            city: answers.city,
            ticketStock: answers.ticketStock,
            price: answers.price
        };
        this.events.push(event);
        console.log(chalk.greenBright.bold('\nEvent created successfully!\n'));
    }
    async editEvent(eventId) {
        const event = this.getEventById(eventId);
        if (!event) {
            console.log(chalk.redBright.bold('\nEvent not found.\n'));
            return;
        }
        const answers = await inquirer.prompt([
            { type: 'input', name: 'title', message: 'Enter new event title:', default: event.title },
            { type: 'list', name: 'category', message: 'Choose event category', choices: ['Music', 'Theater', 'Sports', 'Conference', 'Festival'], default: event.category },
            { type: 'input', name: 'date', message: 'Enter new event date (YYYY-MM-DD):', default: event.date.toString() },
            { type: 'input', name: 'time', message: 'Enter new event time (HH:MM):', default: event.time },
            { type: 'input', name: 'city', message: 'Enter new event city:', default: event.city },
            { type: 'number', name: 'ticketStock', message: 'Enter new ticket stock:', default: event.ticketStock },
            { type: 'number', name: 'price', message: 'Enter new ticket price:', default: event.price }
        ]);
        const date = new Date(answers.date);
        if (date <= new Date()) {
            console.log(chalk.redBright.bold('\nEvent date must be in the future.\n'));
            return;
        }
        event.title = answers.title;
        event.date = date;
        event.time = answers.time;
        event.city = answers.city;
        event.ticketStock = answers.ticketStock;
        event.price = answers.price;
        console.log(chalk.greenBright.bold('\nEvent updated successfully!\n'));
    }
    deleteEvent(eventId) {
        const index = this.events.findIndex(event => event.id === eventId);
        if (index !== -1) {
            this.events.splice(index, 1);
            console.log(chalk.greenBright.bold('\nEvent deleted successfully!\n'));
        }
        else {
            console.log(chalk.redBright.bold('\nEvent not found.\n'));
        }
    }
    listEvents() {
        console.log(chalk.blueBright.bold('\nAvailable Events:\n'));
        this.events
            .filter(event => event.ticketStock > 0)
            .forEach(event => {
            console.log(chalk.greenBright.bold(`* Title: ${event.title}\n`));
            console.log(chalk.yellowBright.italic(`- ID: ${event.id}\n- Date: ${event.date.toString()}\n- Time: ${event.time}\n- City: ${event.city}\n- Tickets: ${event.ticketStock}\n- Price: ${event.price}\n`));
            console.log(chalk.blueBright.bold('|==============================================|\n'));
        });
        const soldOutEvents = this.events.filter(event => event.ticketStock === 0);
        if (soldOutEvents.length > 0) {
            soldOutEvents.forEach(event => {
                console.log(chalk.redBright.bold(`* Title: ${event.title}\n`));
                console.log(chalk.redBright.italic("All Tickets are purchased for this events:\n"));
            });
        }
    }
    getEventById(eventId) {
        return this.events.find(event => event.id === eventId);
    }
    updateTicketStock(eventId, quantity) {
        const event = this.getEventById(eventId);
        if (event) {
            event.ticketStock -= quantity;
        }
    }
    async browseEvents() {
        if (this.events.length !== 0) {
            const { option } = await inquirer.prompt({
                type: "list", name: "option", message: "Browse events by:", choices: ['category', "city"]
            });
            if (option === 'category') {
                await this.eventsCategory();
            }
            else if (option === 'city') {
                await this.eventsCity();
            }
        }
        else {
            console.log(chalk.redBright.bold('\nEvents not found!\n'));
        }
    }
    async eventsCategory() {
        const categories = Array.from(new Set(this.events.map(event => event.category)));
        const { chosenCategory } = await inquirer.prompt({
            type: 'list',
            name: 'chosenCategory',
            message: 'Choose a category to browse events:',
            choices: categories,
        });
        this.filterAndDisplayEvents('category', chosenCategory);
    }
    async eventsCity() {
        const cities = Array.from(new Set(this.events.map(event => event.city)));
        const { chosenCity } = await inquirer.prompt({
            type: 'list',
            name: 'chosenCity',
            message: 'Choose a city to browse events:',
            choices: cities,
        });
        this.filterAndDisplayEvents('city', chosenCity);
    }
    filterAndDisplayEvents(option, chosenValue) {
        console.log(chalk.blueBright.bold(`\nEvents in ${option === 'category' ? 'category' : 'city'} "${chosenValue}":\n`));
        const filteredEvents = this.events.filter(event => option === 'category' ? event.category === chosenValue : event.city === chosenValue);
        if (filteredEvents.length === 0) {
            console.log(chalk.yellowBright.bold(`No events found in ${option === 'category' ? 'category' : 'city'} "${chosenValue}".\n`));
        }
        else {
            filteredEvents.forEach(event => {
                console.log(chalk.greenBright.bold(`* Title: ${event.title}\n`));
                console.log(chalk.yellowBright.italic(`- ID: ${event.id}\n- Date: ${event.date.toString()}\n- Time: ${event.time}\n- City: ${event.city}\n- Tickets: ${event.ticketStock}\n- Price: ${event.price}\n`));
                console.log(chalk.blueBright.bold('|==============================================|\n'));
            });
        }
    }
}
