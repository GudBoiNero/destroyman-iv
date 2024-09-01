import { CacheType, ChatInputCommandInteraction, CommandInteraction, Interaction } from "discord.js"

export class QueryParser {
    interaction: ChatInputCommandInteraction<CacheType>
    constructor(interaction: ChatInputCommandInteraction<CacheType>) {
        this.interaction = interaction
    }

    getOption = (name: string) => {
        for (let index = 0; index < this.interaction.options.data.length; index++) {
            const option = this.interaction.options.data[index];
            if (option.name == name) return option
        }
    }

    testRange = (val: number, min: number, max: number) => val >= min && val <= max;

    testRangeOrEquality = (val: number, min: number, max: number, exact: number) => this.testRange(val, min, max) || val == exact;

    testQueryHeader = (entry: any, optionName: string, valueName: string) => {
        if (this.getOption(optionName) != undefined) {
            const value = (this.getOption(optionName)?.value as string).toLowerCase()
            return (entry[valueName].toLowerCase()).includes(value);
        } else return true
    }

    getRanges = (reqNames: string[]) => {
        let result: any = {}
        for (let index = 0; index < reqNames.length; index++) {
            const reqName = reqNames[index];
            const option = this.getOption(reqName)

            if (!option) continue

            const value = option.value as string
            // Check if the value is a range
            if (value.includes(':')) {
                let reqRange = value.split(':')
                // !isNaN prevents it from thinking 0 == false in this case
                if (!isNaN(parseInt(reqRange[0])) && !isNaN(parseInt(reqRange[1]))) {
                    result[reqName] = {
                        min: Math.min(parseInt(reqRange[0]), parseInt(reqRange[1])),
                        max: Math.max(parseInt(reqRange[0]), parseInt(reqRange[1]))
                    }
                }
            }
            // If not, check if the input is actually a number
            else if (value.includes('-') || value.includes('+')) {
                // Check if there is a + or - after number
                const _value = parseInt(value)
                const opp = value[_value.toString().length]
                if (opp == '+') {
                    result[reqName] = {
                        min: value,
                        max: 10000
                    }
                } else {
                    result[reqName] = {
                        min: 0,
                        max: value
                    }
                }
            } else if (!isNaN(parseInt(value))) {
                result[reqName] = parseInt(value)
            }
        }
        return result
    }
}