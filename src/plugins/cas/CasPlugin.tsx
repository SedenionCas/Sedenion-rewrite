import { ReactNode } from "react";
import { Plugin } from "src/types/Plugin";

export default class CasPlugin extends Plugin {
  name: string = "cas";
  version: string = "0.0.0";
  dependencies: string[] = [];

  onStart(): void {
    this.pluginManager.registerFunction(this, "render", this.render);
    console.log("CasPlugin started");
  }

  onStop(): void {
    console.log("CasPlugin stopped");
    this.pluginManager.unregisterFunction(this, "render");
  }

  render(): ReactNode {
    return (<h1>Helo!</h1>);
  }
}
