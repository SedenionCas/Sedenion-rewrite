import { Plugin } from "src/types/Plugin";
import semver from "semver";
import { ReactNode } from "react";

export class PluginManager {
  private _plugins: Set<Plugin> = new Set();
  private _functions: Map<string, Function> = new Map();
  private _events: Map<string, [string, Function][]> = new Map();

  load(plugin: Plugin) {
    if (this._plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.getID()} already loaded`);
    }

    for (const dependency of plugin.dependencies) {
      const [name, versionQuery] = dependency.split("@");

      let found = false;
      for (plugin of this._plugins) {
        if (plugin.name === name) {
          if (semver.satisfies(plugin.version, versionQuery)) {
            found = true;
            break;
          } else {
            throw new Error(
              `Plugin ${plugin.getID()} does not satisfy version query ${versionQuery}`
            );
          }
        }
      }
      if (!found) {
        throw new Error(
          `Plugin ${name} not found but is required by ${plugin.getID()}`
        );
      }
    }

    this._plugins.add(plugin);
    plugin.onStart();
  }

  unload(plugin: Plugin) {
    if (!this._plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.getID()} not loaded`);
    }

    for (const otherPlugin of this._plugins) {
      if (otherPlugin.dependencies.includes(plugin.getID())) {
        throw new Error(
          `Plugin ${otherPlugin.getID()} depends on ${plugin.getID()} cannot unload`
        );
      }
    }

    plugin.onStop();
    this._plugins.delete(plugin);
  }

  registerFunction(plugin: Plugin, name: string, func: Function) {
    if (!this._plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (this._functions.has(`${plugin.name}:${name}`)) {
      throw new Error(
        `Function ${name} already registered by plugin ${plugin.getID()}`
      );
    }

    console.log(`Registering function ${plugin.name}:${name}`);

    this._functions.set(`${plugin.name}:${name}`, func);
  }

  unregisterFunction(plugin: Plugin, name: string) {
    if (!this._plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (!this._functions.has(`${plugin.name}:${name}`)) {
      throw new Error(
        `Function ${name} not registered by plugin ${plugin.getID()}`
      );
    }

    this._functions.delete(`${plugin.name}:${name}`);
  }

  callFunction(name: string, ...args: any[]): any {
    if (!this._functions.has(name)) {
      throw new Error(`Function ${name} not found`);
    }

    const value = this._functions.get(name)!(...args);

    console.log(`Called function ${name} with args ${args} and got`, value);

    return value;
  }

  getFunction(name: string): (...args: any[]) => any {
    if (!this._functions.has(name)) {
      throw new Error(`Function ${name} not found`);
    }

    // @ts-ignore ts(2322)
    return this._functions.get(name)!;
  }

  registerEvent(plugin: Plugin, name: string) {
    if (!this._plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (this._events.has(`${plugin.name}:${name}`)) {
      throw new Error(`Event ${name} already registered`);
    }

    this._events.set(`${plugin.name}:${name}`, []);
  }

  unregisterEvent(plugin: Plugin, name: string) {
    if (!this._plugins.has(plugin)) {
      throw new Error(`Plugin ${plugin.name} not loaded`);
    }

    if (!this._events.has(`${plugin.name}:${name}`)) {
      throw new Error(`Event ${name} not registered`);
    }

    if (this._events.get(`${plugin.name}:${name}`)!.length > 0) {
      throw new Error(`Event ${name} still has listeners cannot unregister`);
    }

    this._events.delete(`${plugin.name}:${name}`);
  }

  addEventListener(name: string, listener: Function) {
    if (!this._events.has(name)) {
      throw new Error(`Event ${name} not found`);
    }

    if (this._events.get(name)!.some(([_, l]) => l === listener)) {
      throw new Error(`Already added listener for event ${name}`);
    }

    this._events.get(name)!.push([name, listener]);
  }

  removeEventListener(name: string, listener: Function) {
    if (!this._events.has(name)) {
      throw new Error(`Event ${name} not found`);
    }

    const index = this._events.get(name)!.findIndex(([_, l]) => l === listener);
    if (index === -1) {
      throw new Error(`Listener not found for event ${name}`);
    }

    this._events.get(name)!.splice(index, 1);
  }

  triggerEvent(name: string, ...args: any[]) {
    if (!this._events.has(name)) {
      throw new Error(`Event ${name} not found`);
    }

    for (const [_, listener] of this._events.get(name)!) {
      listener(...args);
    }
  }
}
