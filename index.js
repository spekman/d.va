const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token, geminiKey, personality } = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,], partials: [Partials.Message, Partials.Channel]
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const MODEL_NAME = "gemini-2.0-flash-lite";
const genAI = new GoogleGenerativeAI(geminiKey);

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.mentions.users.first()?.id !== client.user.id) return;

    let chatLog = [];

    try {
        await message.channel.sendTyping();
        let oldMsg = await message.channel.messages.fetch({ limit: 11 });
        oldMsg.reverse();

        oldMsg.forEach((msg) => {
            if (msg.author.id !== client.user.id && message.author.bot) return;

            if (msg.author.id == client.user.id) {
                chatLog.push({
                    role: "model",
                    parts: [
                        { text: msg.content }
                    ]
                });
            }
            else if (msg.author.id == message.author.id) {
                chatLog.push({
                    role: "user",
                    parts: [
                        { text: msg.content.replace(`<@${client.user.id}>`, "").trim() }]
                });
            }
        });
    } catch (error) {
        console.log(`ERROR: ${error}`);
    };

    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: personality
    });

    const generationConfig = {
        temperature: 1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,

    };

    const result = await model.generateContent({
        contents: chatLog,
        generationConfig,
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
            }
        ]
    });

    const reply = await result.response.text();

    if (reply.length < 2000) return message.reply(reply);

    const replyArray = reply.match(/[\s\S]{1,2000}/g) || [];
    for (const msg of replyArray) {
        await message.reply(msg);
    }

});

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.login(token);