import { DockviewReact, DockviewReadyEvent } from "dockview";
import {
  PluginProvider,
  RendererPlugin,
  createPluginStore,
} from "react-pluggable";
import { CasPlugin } from "./plugins/cas/CasPlugin";

const pluginStore = createPluginStore();
pluginStore.install(new RendererPlugin());
pluginStore.install(new CasPlugin(pluginStore));

function App() {
  const Renderer = pluginStore.executeFunction("Renderer.getRendererComponent");
  const components = {
    cas: () => <Renderer placement="cas.display" />,
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
    <PluginProvider pluginStore={pluginStore}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <DockviewReact
          className="dockview"
          components={components}
          onReady={OnDockviewReady}
        />
      </div>
    </PluginProvider>
  );
}

export default App;
