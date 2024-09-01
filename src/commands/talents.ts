import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
} from "discord.js";
import { Command } from "../client/command";
import { getAllTalents } from "dwapi-wrapper";
import { QueryParser } from "../util/query";

export class TalentsCommand implements Command {
    name = "talents";
    description = "Query for talents";
    slashCommandConfig = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name to search for...'))
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category to search in...'))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description to search for...'))
        .addStringOption(option =>
            option.setName('rarity')
                .addChoices({ name: 'common', value: 'common' }, { name: 'rare', value: 'rare' }, { name: 'advanced', value: 'advanced' }, { name: 'oath', value: 'oath' }, { name: 'quest', value: 'quest' })
                .setDescription('The type of card to search for...'))
        .setDescription('Replies with data based on the input.')

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<any> {
        const parser = new QueryParser(interaction)
        const talents = await getAllTalents()


        return interaction.reply("```json\n" + JSON.stringify(talents[0], null, "\t") + "```");
    }
}