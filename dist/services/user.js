import chalk from 'chalk';
import inquirer from 'inquirer';
import * as uuid from 'uuid';
import validator from 'validator';
export class UserService {
    users = [];
    async signup() {
        // validating input data
        while (true) {
            var { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Enter your name:' });
            if (!name || name.trim().length === 0) {
                console.log(chalk.redBright.bold('\nName cannot be empty.\n'));
            }
            else {
                break;
            }
        }
        while (true) {
            var { email } = await inquirer.prompt({ type: 'input', name: 'email', message: 'Enter your email:' });
            if (!validator.isEmail(email)) {
                console.log(chalk.redBright.bold('\nPlease enter a valid email address.\n'));
            }
            else {
                break;
            }
        }
        while (true) {
            var { password } = await inquirer.prompt({ type: 'password', name: 'password', message: 'Enter your password:' });
            if (password.length < 6) {
                console.log(chalk.redBright.bold('\nPassword must be at least 6 characters long.\n'));
            }
            else {
                break;
            }
        }
        if (this.users.some(u => u.email === email && u.password === password)) {
            console.log(chalk.redBright.bold('\nUser already exists, Signup again!\n'));
            return this.signup();
        }
        const user = {
            id: uuid.v4(),
            name: name,
            email: email,
            password: password,
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
