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
        .addStringOption(option =>
            option.setName('requirements')
                .setDescription('The requirements of the card to search for...'))

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<any> {
        let talents = await getAllTalents()

        const name = interaction.options.getString('name')
        const category = interaction.options.getString('category')
        const description = interaction.options.getString('description')
        const rarity = interaction.options.getString('rarity')
        const requirements = interaction.options.getString('requirements')

        talents = talents.filter(talent => {
            if (name)
                if (talent.name.toLowerCase().includes(name.toLowerCase())) return true;
            if (category)
                if (talent.category.toLowerCase().includes(category.toLowerCase())) return true;
            if (description)
                if (talent.description.toLowerCase().includes(description.toLowerCase())) return true;
            if (rarity)
                if ((talent.rarity == rarity)) return true;



            return true;
        })

        const pages = this.buildTalentsPages(talents)
        const pagination = new Pagination(interaction)
        pagination.addEmbeds(pages)
        pagination.setOptions({ limit: 1 })
        return pagination.render()
    }

    buildTalentsPages = (entries: TalentObject[]): EmbedBuilder[] => {
        let pages: EmbedBuilder[] = []

        for (const talent of entries) {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(talent.name)
                .setTimestamp()
                .setFooter({ text: `${entries.length} results` })
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