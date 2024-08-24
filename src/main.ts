// src/main.ts

import { Client, Events, GatewayIntentBits, Message, REST as DiscordRestClient, Routes } from "discord.js";
import dotenv from "dotenv";
import { InteractionHandler } from "./client/interactionHandler";
import { test } from "./util/data";
dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";
const DISCORD_APP_ID = process.env.DISCORD_APP_ID || "";

class Application {
    private client: Client;
    private discordRestClient: DiscordRestClient;
    private interactionHandler: InteractionHandler;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
            ],
            shards: "auto",
            failIfNotExists: false,
        });
        this.discordRestClient = new DiscordRestClient().setToken(DISCORD_TOKEN);
        this.interactionHandler = new InteractionHandler();
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
        test()
    }

    registerSlashCommands() {
        const commands = this.interactionHandler.getSlashCommands();
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
    }
}

const app = new Application();
app.start();
