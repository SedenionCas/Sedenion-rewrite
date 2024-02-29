import { ReactNode } from "react";
import { SedenionPlugin } from "../../types/plugin";

export class CasPlugin extends SedenionPlugin {
  name: string = "cas";
  version: string = "0.0.1";
  displayname: string = "Cas";
  dependencies: string[] = [];

  init(): void {}

  display(): ReactNode {
    return (
      <div>
        <h1>Cas plugin</h1>
      </div>
    );
  }
}
