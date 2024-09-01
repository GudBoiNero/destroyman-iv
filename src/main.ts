// src/main.ts

import { Client, Events, GatewayIntentBits, Message, REST as DiscordRestClient, Routes, ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import dotenv from "dotenv";
import { CommandHandler } from "./client/commandHandler";
dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";
const DISCORD_APP_ID = process.env.DISCORD_APP_ID || "";

class Application {
    private client: Client;
    private discordRestClient: DiscordRestClient;
    private commandHandler: CommandHandler;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
            ],
            shards: "auto",
            failIfNotExists: false,
        });
        this.discordRestClient = new DiscordRestClient().setToken(DISCORD_TOKEN);
        this.commandHandler = new CommandHandler();
    }

    start() {
        this.client
            .login(DISCORD_TOKEN)
            .then(() => {
                this.addClientEventHandlers();
                this.registerSlashCommands();
            })
            .catch((err) => {
                console.error("Error starting bot", err);
            });
    }

    registerSlashCommands() {
        const commands = this.commandHandler.getSlashCommands();
        this.discordRestClient
            .put(Routes.applicationCommands(DISCORD_APP_ID), {
                body: commands,
            })
            .then((data: any) => {
                console.log(
                    `Successfully registered ${data.length} global application (/) commands`
                );
            })
            .catch((err) => {
                console.error("Error registering application (/) commands", err);
            });
    }

    addClientEventHandlers() {
        this.client.on(Events.MessageCreate, (message: Message) => {
            const { content } = message;
            message.reply(`Bot says: ${content}`);
        });

        this.client.on(Events.ClientReady, () => {
            console.log("Bot client logged in");
        });

        this.client.on(Events.Error, (err: Error) => {
            console.error("Client error", err);
        });

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction instanceof CommandInteraction)
                await this.commandHandler.handleCommandInteraction(
                    interaction as ChatInputCommandInteraction
                );
        });
    }
}

const app = new Application();
app.start();
