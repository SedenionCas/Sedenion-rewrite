import { ReactNode } from "react";
import PluginManager from "src/lib/PluginManager";
import Plugin from "src/types/Plugin";
import { type DbValue } from "src/types/Db";
import CasPanel from "./CasPanel";

interface CasPluginSaveData {
  calculations: [string, string][];
}

export default class CasPlugin extends Plugin {
  name: string = "cas";

  version: string = "0.0.0";

  dependencies: string[] = [];

  constructor(pluginManager: PluginManager) {
    super(pluginManager);

    this.render = this.render.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
  }

  onStart(): void {
    this.pluginManager.registerFunction(this, "render", this.render);
  }

  onStop(): void {
    this.pluginManager.unregisterFunction(this, "render");
  }

  render(): ReactNode {
    return <CasPanel plugin={this} />;
  }

  async save(input: CasPluginSaveData) {
    await this.pluginManager.callFunction("dbDriver:save", this, "cas", input);
  }

  async load(): Promise<DbValue<CasPluginSaveData>> {
    return (await this.pluginManager.callFunction(
      "dbDriver:load",
      this,
      "cas",
    )) as DbValue<CasPluginSaveData>;
  }
}
