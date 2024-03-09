import { PluginManager } from "src/lib/PluginManager";

export default abstract class Plugin {
  pluginManager: PluginManager;

  abstract name: string;

  abstract version: string;

  abstract dependencies: string[];

  constructor(pluginManager: PluginManager) {
    this.pluginManager = pluginManager;
  }

  getID(): string {
    return `${this.name}@${this.version}`;
  }

  abstract onStart(): void;
  abstract onStop(): void;
}
