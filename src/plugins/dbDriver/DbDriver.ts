import db from "src/lib/db";
import { Plugin } from "src/types/Plugin";

export default class DbDriver extends Plugin {
  name: string = "dbDriver";
  version: string = "0.0.0";
  dependencies: string[] = [];

  onStart(): void {
    this.pluginManager.registerFunction(this, "save", this.save);
    this.pluginManager.registerFunction(this, "load", this.load);
    this.pluginManager.registerFunction(this, "delete", this.delete);
    this.pluginManager.registerFunction(this, "update", this.update);
  }

  onStop(): void {
    this.pluginManager.unregisterFunction(this, "save");
    this.pluginManager.unregisterFunction(this, "load");
    this.pluginManager.unregisterFunction(this, "delete");
    this.pluginManager.unregisterFunction(this, "update");
  }

  async save(plugin: Plugin, id: string, data: any) {
    const doc = await db.get(`${plugin.name}:${id}`).catch((err) => {
      if (err.name == "not_found") {
        console.log("creating new doc");
        return { _id: `${plugin.name}:${id}`, _rev: undefined };
      }
    });
    const rev = {
      _id: doc?._id,
      _rev: doc?._rev,
      data,
    };

    await db.put(rev);
  }

  async load(plugin: Plugin, id: string): Promise<any> {
    return await db.get(`${plugin.name}:${id}`);
  }

  delete(): void {
    throw new Error("Method not implemented.");
  }

  update(): void {
    throw new Error("Method not implemented.");
  }
}
