import chalk from 'chalk';
import inquirer from 'inquirer';
import * as uuid from 'uuid';
import validator from 'validator';
export class UserService {
    users = [];
    async signup() {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Enter your name:' },
            { type: 'input', name: 'email', message: 'Enter your email:' },
            { type: 'password', name: 'password', message: 'Enter your password:' }
        ]);
        // validating input data
        if (!answers.name || answers.name.trim().length === 0) {
            console.log(chalk.redBright.bold('\nName cannot be empty.\n'));
            return this.signup();
        }
        if (!validator.isEmail(answers.email)) {
            console.log(chalk.redBright.bold('\nPlease enter a valid email address.\n'));
            return this.signup();
        }
        if (answers.password.length < 6) {
            console.log(chalk.redBright.bold('\nPassword must be at least 6 characters long.\n'));
            return this.signup();
        }
        if (this.users.some(u => u.email === answers.email && u.password === answers.password)) {
            console.log(chalk.redBright.bold('\nUser already exists, Signup again!\n'));
            return this.signup();
        }
        const user = {
            id: uuid.v4(),
            name: answers.name,
            email: answers.email,
            password: answers.password,
            isAdmin: false
        };
        this.users.push(user);
        console.log(chalk.greenBright.bold('\nUser registered successfully!\n'));
        return user;
    }
    async login() {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'email', message: 'Enter your email:' },
            { type: 'password', name: 'password', message: 'Enter your password:' }
        ]);
        const user = this.users.find(u => u.email === answers.email && u.password === answers.password);
        if (user) {
            console.log(chalk.greenBright.bold('\nLogin successful!\n'));
            return user;
        }
        else {
            console.log(chalk.redBright.bold('\nInvalid credentials!\n'));
            return null;
        }
    }
    async adminLogin() {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'email', message: 'Enter admin email:' },
            { type: 'password', name: 'password', message: 'Enter admin password:' }
        ]);
        const user = this.users.find(u => u.email === answers.email && u.password === answers.password && u.isAdmin);
        if (user) {
            console.log(chalk.greenBright.bold('\nAdmin login successful!\n'));
            return user;
        }
        else {
            console.log(chalk.redBright.bold('\nInvalid admin credentials!\n'));
            return null;
        }
    }
    constructor() {
        this.users.push({
            id: uuid.v4(),
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin',
            isAdmin: true
        });
    }
}
