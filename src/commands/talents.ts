import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
    Embed,
    EmbedBuilder,
} from "discord.js";
import { Command } from "../client/command";
import { getAllTalents, TalentObject } from "dwapi-wrapper";
import { QueryParser } from "../util/query";
import { Pagination } from "pagination.djs";

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

        const name = parser.getOption('name')
        const category = parser.getOption('category')
        const description = parser.getOption('description')
        const rarity = parser.getOption('rarity')

        const pages = this.buildTalentsPages(talents)
        const pagination = new Pagination(interaction)
        pagination.addEmbeds(pages)
        pagination.paginateFields(true)
        return pagination.render()
    }

    buildTalentsPages = (entries: TalentObject[]): EmbedBuilder[] => {
        let pages: EmbedBuilder[] = []

        for (const talent of entries) {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(talent.name)
                .setTimestamp()
                .addFields(
                    { name: 'Description:', value: '```' + `${talent.description}` + '```' },
                    { name: 'Category:', value: '```' + `${talent.category}` + '```', inline: true },
                    { name: 'Rarity:', value: '```' + `${talent.rarity}` + '```', inline: true }
                )

            pages.push(embed)
        }

        return pages
    }
}