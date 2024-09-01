import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../client/command";
import { TalentsCommand } from "../commands/talents";

export class InteractionHandler {
  private commands: Command[];

  constructor() {
    this.commands = [new TalentsCommand()];
  }

  getSlashCommands() {
    return this.commands.map((command: Command) =>
      command.slashCommandConfig.toJSON()
    );
  }

  async handleInteraction(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const commandName = interaction.commandName;

    const matchedCommand = this.commands.find(
      (command) => command.name === commandName
    );

    if (!matchedCommand) {
      return Promise.reject("Command not matched");
    }

    matchedCommand
      .execute(interaction)
      .then(() => {
        console.log(
          `Sucesfully executed command [/${interaction.commandName}]`,
          {
            guild: { id: interaction.guildId, name: interaction.guild?.name },
            user: { name: interaction.user.globalName },
          }
        );
      })
      .catch((err) =>
        console.log(
          `Error executing command [/${interaction.commandName}]: ${err}`,
          {
            guild: { id: interaction.guildId, name: interaction.guild?.name },
            user: { name: interaction.user.globalName },
          }
        )
      );
  }
}