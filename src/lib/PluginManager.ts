import Plugin from "src/types/Plugin";
import semver from "semver";

export default class PluginManager {
  private plugins: Set<Plugin> = new Set();

  private functions: Map<string, Function> = new Map();

  private events: Map<string, [string, Function][]> = new Map();

  load(plugin: Plugin) {
    if (this.plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.getID()} already loaded`);
    }

    for (const dependency of plugin.dependencies) {
      const [name, versionQuery] = dependency.split("@");

      const found = Array.from(this.plugins).find((p) => p.name === name);

      if (!found) {
        throw new Error(
          `Plugin ${plugin.getID()} depends on ${name} but it is not loaded`,
        );
      }

      if (versionQuery && !semver.satisfies(found.version, versionQuery)) {
        throw new Error(
          `Plugin ${plugin.getID()} depends on ${name} with version ${versionQuery} but found ${found.version}`,
        );
      }
    }

    this.plugins.add(plugin);
    plugin.onStart();
  }

  unload(plugin: Plugin) {
    if (!this.plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.getID()} not loaded`);
    }

    for (const otherPlugin of this.plugins) {
      if (otherPlugin.dependencies.includes(plugin.getID())) {
        throw new Error(
          `Plugin ${otherPlugin.getID()} depends on ${plugin.getID()} cannot unload`,
        );
      }
    }

    plugin.onStop();
    this.plugins.delete(plugin);
  }

  registerFunction(plugin: Plugin, name: string, func: Function) {
    if (!this.plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (this.functions.has(`${plugin.name}:${name}`)) {
      throw new Error(
        `Function ${name} already registered by plugin ${plugin.getID()}`,
      );
    }

    this.functions.set(`${plugin.name}:${name}`, func);
  }

  unregisterFunction(plugin: Plugin, name: string) {
    if (!this.plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (!this.functions.has(`${plugin.name}:${name}`)) {
      throw new Error(
        `Function ${name} not registered by plugin ${plugin.getID()}`,
      );
    }

    this.functions.delete(`${plugin.name}:${name}`);
  }

  callFunction(name: string, ...args: any[]): any {
    if (!this.functions.has(name)) {
      throw new Error(`Function ${name} not found`);
    }

    const value = this.functions.get(name)!(...args);

    return value;
  }

  getFunction(name: string): (...args: any[]) => any {
    if (!this.functions.has(name)) {
      throw new Error(`Function ${name} not found`);
    }

    // @ts-ignore ts(2322)
    return this.functions.get(name)!;
  }

  registerEvent(plugin: Plugin, name: string) {
    if (!this.plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (this.events.has(`${plugin.name}:${name}`)) {
      throw new Error(`Event ${name} already registered`);
    }

    this.events.set(`${plugin.name}:${name}`, []);
  }

  unregisterEvent(plugin: Plugin, name: string) {
    if (!this.plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (!this.events.has(`${plugin.name}:${name}`)) {
      throw new Error(`Event ${name} not registered`);
    }

    if (this.events.get(`${plugin.name}:${name}`)!.length > 0) {
      throw new Error(`Event ${name} still has listeners cannot unregister`);
    }

    this.events.delete(`${plugin.name}:${name}`);
  }

  addEventListener(name: string, listener: Function) {
    if (!this.events.has(name)) {
      throw new Error(`Event ${name} not found`);
    }

    if (this.events.get(name)!.some(([_, l]) => l === listener)) {
      throw new Error(`Already added listener for event ${name}`);
    }

    this.events.get(name)!.push([name, listener]);
  }

  removeEventListener(name: string, listener: Function) {
    if (!this.events.has(name)) {
      throw new Error(`Event ${name} not found`);
    }

    const index = this.events.get(name)!.findIndex(([_, l]) => l === listener);
    if (index === -1) {
      throw new Error(`Listener not found for event ${name}`);
    }

    this.events.get(name)!.splice(index, 1);
  }

  triggerEvent(name: string, ...args: any[]) {
    if (!this.events.has(name)) {
      throw new Error(`Event ${name} not found`);
    }

    for (const [_, listener] of this.events.get(name)!) {
      listener(...args);
    }
  }
}
