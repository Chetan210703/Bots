# WhatsApp Registration Bot

A smart WhatsApp bot that handles user registration with data validation and Excel export functionality.

## 🚀 Features

- 🤖 **WhatsApp Web Integration** - Connect via QR code
- 📝 **Interactive Registration** - Step-by-step data collection
- ✅ **Data Validation** - Validates names, phone numbers, and emails
- 📊 **Excel Export** - Automatically saves data to Excel file
- 🌐 **Web API** - REST endpoints for data management
- 🔄 **Auto-restart** - Nodemon for development
- 🛡️ **Error Handling** - Graceful error management

## 📋 Registration Process

The bot guides users through collecting:
1. **Full Name** - Letters only, minimum 2 characters
2. **Contact Number** - Numbers only, minimum 10 digits
3. **Email Address** - Valid email format
4. **Course of Interest** - Free text input
5. **Country** - Free text input
6. **University** - Free text input

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- WhatsApp account
- Stable internet connection

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Bot
```bash
# Development mode (auto-restart)
npm run dev
```

### 3. Connect WhatsApp
1. A QR code will appear in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings** → **Linked Devices** → **Link a Device**
4. Scan the QR code displayed in the terminal
5. Wait for "WhatsApp Bot is ready!" message

## 📱 Available Commands

Once connected, users can interact with these commands:

| Command | Description |
|---------|-------------|
| `hello` / `hi` | Get a greeting message |
| `register` | Start the registration process |
| `help` | Show available commands |

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/save-user` | POST | Save user data via API |
| `/api/bot-status` | GET | Check bot status |

### Example API Usage
```bash
# Check bot status
curl http://localhost:5000/api/bot-status

# Save user via API
curl -X POST http://localhost:5000/api/save-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "contact": "+1234567890",
    "email": "john@example.com",
    "course": "Computer Science",
    "country": "USA",
    "university": "MIT"
  }'
```

## 📁 Project Structure

```
whasapp_bot/
├── server.js              # Main server (Express + WhatsApp)
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── user_data.xlsx        # Data storage (auto-generated)
├── utils/
│   ├── whatsappBot.js    # WhatsApp bot logic
│   ├── writeToExcel.js   # Excel operations
│   ├── ApiError.js       # Error handling
│   ├── ApiResponse.js    # Response handling
│   └── asyncHandler.js   # Async error handler
└── node_modules/         # Dependencies
```

## 🔍 Data Validation

### Name Validation
- ✅ Letters, spaces, hyphens, apostrophes, dots allowed
- ✅ Minimum 2 characters
- ❌ Numbers or special characters not allowed

### Phone Validation
- ✅ Numbers, spaces, dashes, parentheses, plus sign allowed
- ✅ Minimum 10 digits required
- ✅ Accepts: `+91 98765 43210`, `9876543210`, `(987) 654-3210`

### Email Validation
- ✅ Standard email format validation
- ✅ Automatically converted to lowercase
- ❌ Invalid formats rejected

## 📊 Data Storage

- **Format**: Excel (.xlsx) file
- **Location**: `user_data.xlsx` in project root
- **Columns**: Name, Contact, Email, Course, Country, University, Date
- **Auto-creation**: File created automatically on first registration

## 🚨 Troubleshooting

### Common Issues

1. **QR Code not appearing**
   - Check internet connection
   - Restart the server

2. **Excel file locked error**
   - Close `user_data.xlsx` if open
   - Try registration again

3. **Authentication failed**
   - Delete `.wwebjs_auth` folder
   - Restart and scan QR code again

4. **Bot not responding**
   - Check if server is running
   - Verify WhatsApp connection

### Logout and Re-login
```bash
# Stop server (Ctrl+C)
# Delete auth folder
rm -rf .wwebjs_auth

# Restart server
npm run dev
# Scan new QR code
```

## 🔒 Security Notes

- **Authentication data** is stored locally in `.wwebjs_auth/`
- **Never share** authentication files
- **Excel file** contains user data - keep secure
- **Use for development/testing** purposes only

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `whatsapp-web.js` | WhatsApp Web API |
| `express` | Web server framework |
| `exceljs` | Excel file handling |
| `qrcode-terminal` | QR code display |
| `nodemon` | Auto-restart (dev) |

## 🎯 Development

### Scripts
```bash
npm run dev  # Development mode (auto-restart)
```

### File Watching
- Nodemon automatically restarts server on file changes
- No manual restart needed during development

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure WhatsApp is properly connected
4. Check console logs for error messages

---

**Built with ❤️ using Node.js and WhatsApp Web API**

