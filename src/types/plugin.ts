import { IPlugin, PluginStore } from "react-pluggable";
import { IDockviewPanelProps } from "dockview";

export abstract class SedenionPlugin implements IPlugin {
  abstract name: string;
  abstract version: string;
  abstract displayname: string;
  abstract dependencies: string[];

  pluginStore: PluginStore;

  constructor(pluginStore: PluginStore) {
    this.pluginStore = pluginStore;
    this.init();
  }

  getPluginName(): string {
    return `${this.name}@${this.version}`;
  }

  getDependencies(): string[] {
    return this.dependencies;
  }

  init(): void {}

  activate(): void {
    this.pluginStore.executeFunction(
      "Renderer.add",
      `${this.name}.display`,
      this.display
    );
  }

  deactivate(): void {}

  abstract display(props: IDockviewPanelProps): React.ReactNode;
}
