import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
} from "discord.js";
import { Command } from "../client/command";

export class TalentsCommand implements Command {
    name = "talents";
    description = "Query for talents";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<any> {
        return interaction.reply("...");
    }
}