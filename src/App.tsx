import { DockviewReact, DockviewReadyEvent } from "dockview";
import { PluginManager } from "./lib/PluginManager";
import CasPlugin from "./plugins/cas/CasPlugin";
import DbDriver from "./plugins/dbDriver/DbDriver";

const pluginManager = new PluginManager();
pluginManager.load(new DbDriver(pluginManager));
pluginManager.load(new CasPlugin(pluginManager));

function App() {
  const components = {
    cas: pluginManager.getFunction("cas:render"),
  };

  const OnDockviewReady = (event: DockviewReadyEvent) => {
    event.api.addPanel({
      id: "cas",
      component: "cas",
      title: "Cas",
    });
    event.api.addPanel({
      id: "cas2",
      component: "cas",
      title: "Cas2",
    });
    event.api.addPanel({
      id: "cas3",
      component: "cas",
      title: "Cas3",
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DockviewReact
        className="dockview"
        components={components}
        onReady={OnDockviewReady}
      />
    </div>
  );
}

export default App;
