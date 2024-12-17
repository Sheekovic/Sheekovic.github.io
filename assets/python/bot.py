import os
from telebot import TeleBot

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Get the API key from environment variables
TELEGRAM_API_KEY = os.getenv('TELEGRAM_API_KEY')

# Create the bot instance
bot = TeleBot(TELEGRAM_API_KEY)

# Example command
@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(message.chat.id, "Hello! I'm your Telegram bot!")

# Start polling
bot.polling()
