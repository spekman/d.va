# d.va

Discord AI Virtual Assistant made with Discord.js and Gemini API

## Getting started

* [Set up a Discord bot application with Discord.js](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
  
    * Enable Message Content and Guild Member Intents 
* [Get a Gemini API key](https://ai.google.dev/gemini-api/docs/api-key)

## Requirements

-   Node.js
-   Discord.js
-   Discord
- Gemini API Key

## Configuration

You need to insert your bot Token and Gemini API key on `config.json` for the bot to work. Changing the bot's personality is optional

```json
{
    "token": "INSERT_YOUR_TOKEN",
    "geminiKey": "INSERT_YOUR_GEMINI_KEY",
    "personality": "You're a Discord virtual assistant that's helping people with whatever they need"
}
``` 

## Instalation

Clone the repo then open the folder on the terminal to install the packages with

```
npm install
```

Then to start the bot you just need to run

```
node .
```

## Usage

To use the bot simply mention (@) it anywhere in your prompt message or quote any message it sent with your prompt
