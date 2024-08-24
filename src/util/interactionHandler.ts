import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "./command";
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
}