// WhatsApp Bot implementation using whatsapp-web.js library
// This bot handles user registration with validation and Excel export functionality
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { appendToExcel } from './writeToExcel.js';

class WhatsAppBot {
    constructor() {
        // Initialize WhatsApp client with local authentication
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        this.setupEventHandlers();
    }

    // Input validation methods for user registration
    isValidName(name) {
        // Allow letters, spaces, and common name characters
        const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
        return nameRegex.test(name) && name.trim().length >= 2;
    }

    isValidPhone(phone) {
        // Allow numbers, spaces, dashes, and plus sign
        const phoneRegex = /^[\+\d\s\-\(\)]+$/;
        const numbersOnly = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(phone) && numbersOnly.length >= 10;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupEventHandlers() {
        // Generate QR code for WhatsApp Web authentication
        this.client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.generate(qr, { small: true });
        });

        // Client is ready and authenticated
        this.client.on('ready', () => {
            console.log('WhatsApp Bot is ready!');
        });

        // Main message handler for incoming WhatsApp messages
        this.client.on('message', async (message) => {
            console.log(`Received message from ${message.from}: "${message.body}"`);
            
            // Check if user is currently in registration mode
            if (this.registrationState && this.registrationState.chatId === message.from) {
                console.log('User is in registration mode, processing registration step');
                await this.startRegistrationProcess(message);
                return;
            }

            // Handle standard bot commands
            if (message.body.toLowerCase() === 'hello' || message.body.toLowerCase() === 'hi') {
                console.log('Handling greeting command');
                await this.handleGreeting(message);
            } else if (message.body.toLowerCase() === 'register') {
                console.log('Handling register command');
                await this.handleRegistration(message);
            } else if (message.body.toLowerCase() === 'help') {
                console.log('Handling help command');
                await this.handleHelp(message);
            } else {
                console.log('Unknown command, sending default response');
                // Default response for unrecognized commands
                await message.reply('I didn\'t understand that. Type "help" to see available commands.');
            }
        });

        // Authentication event handlers
        this.client.on('authenticated', () => {
            console.log('AUTHENTICATED');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('AUTHENTICATION FAILURE', msg);
        });
    }

    // Handle greeting messages from users
    async handleGreeting(message) {
        const response = `Hello! Welcome to our WhatsApp Bot. 
        
Available commands:
- Type "register" to start registration
- Type "help" for more information

How can I help you today?`;
        
        await message.reply(response);
    }

    // Display help information and available commands
    async handleHelp(message) {
        const helpText = `🤖 WhatsApp Bot Help

Available Commands:
• hello/hi - Get a greeting
• register - Start user registration process
• help - Show this help message

Registration Requirements:
• Name: Letters only, minimum 2 characters
• Phone: Numbers only, minimum 10 digits
• Email: Valid email format (e.g., user@domain.com)

Features:
• User registration with data validation
• Excel data export
• Automatic data cleaning

For support, contact the administrator.`;
        
        await message.reply(helpText);
    }

    // Initialize the registration process for a new user
    async handleRegistration(message) {
        // Store the user's chat ID for the registration process
        const chatId = message.from;
        
        const welcomeMsg = `📝 Welcome to Registration!

I'll help you register. Please provide the following information one by one:

1. First, what's your full name?`;
        
        await message.reply(welcomeMsg);
        
        // Store registration state (in a real app, you'd use a database or cache)
        this.registrationState = {
            chatId: chatId,
            step: 'name',
            data: {}
        };
    }

    // Process each step of the registration flow
    async startRegistrationProcess(message) {
        const { step, data } = this.registrationState;
        console.log(`Processing registration step: ${step}`);
        
        switch (step) {
            case 'name':
                if (!this.isValidName(message.body)) {
                    await message.reply('❌ Invalid name! Please enter a valid name (letters only, minimum 2 characters).\n\nExample: John Doe');
                    return;
                }
                data.name = message.body.trim();
                console.log(`Saved name: ${data.name}`);
                this.registrationState.step = 'contact';
                await message.reply('Great! Now please provide your contact number:\n\nExample: +91 98765 43210');
                break;
                
            case 'contact':
                if (!this.isValidPhone(message.body)) {
                    await message.reply('❌ Invalid phone number! Please enter a valid phone number (minimum 10 digits).\n\nExample: +91 98765 43210 or 9876543210');
                    return;
                }
                data.contact = message.body.trim();
                console.log(`Saved contact: ${data.contact}`);
                this.registrationState.step = 'email';
                await message.reply('Perfect! Now please provide your email address:\n\nExample: john.doe@example.com');
                break;
                
            case 'email':
                if (!this.isValidEmail(message.body)) {
                    await message.reply('❌ Invalid email! Please enter a valid email address.\n\nExample: john.doe@example.com');
                    return;
                }
                data.email = message.body.trim().toLowerCase();
                console.log(`Saved email: ${data.email}`);
                this.registrationState.step = 'course';
                await message.reply('Excellent! What course are you interested in?');
                break;
                
            case 'course':
                data.course = message.body.trim();
                console.log(`Saved course: ${data.course}`);
                this.registrationState.step = 'country';
                await message.reply('Good! Which country are you from?');
                break;
                
            case 'country':
                data.country = message.body.trim();
                console.log(`Saved country: ${data.country}`);
                this.registrationState.step = 'university';
                await message.reply('Almost done! What university do you attend or plan to attend?');
                break;
                
            case 'university':
                data.university = message.body.trim();
                console.log(`Saved university: ${data.university}`);
                await this.completeRegistration(message, data);
                break;
            
        }
    }

    // Finalize registration by saving data and providing confirmation
    async completeRegistration(message, userData) {
        try {
            // Save user data to Excel file
            await appendToExcel(userData);

            const successMsg = `✅ Registration Complete!

Thank you for registering! Here's your information:
• Name: ${userData.name}
• Contact: ${userData.contact}
• Email: ${userData.email}
• Course: ${userData.course}
• Country: ${userData.country}
• University: ${userData.university}

Your data has been saved successfully. We'll contact you soon!`;
            
            await message.reply(successMsg);
            
            // Reset registration state after successful completion
            this.registrationState = null;
            
        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = '❌ Sorry, there was an error saving your registration. Please try again later.';
            
            // Handle specific Excel file lock error
            if (error.code === 'EBUSY' || error.message.includes('resource busy or locked')) {
                errorMessage = '❌ Error: Excel file is currently open. Please close the user_data.xlsx file and try again.';
            }
            
            await message.reply(errorMessage);
            
            // Reset registration state even on error
            this.registrationState = null;
        }
    }

    // Initialize the WhatsApp client connection
    async initialize() {
        try {
            await this.client.initialize();
        } catch (error) {
            console.error('Failed to initialize WhatsApp client:', error);
        }
    }

    // Send messages to specific WhatsApp numbers
    async sendMessage(to, message) {
        try {
            await this.client.sendMessage(to, message);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

export default WhatsAppBot; 