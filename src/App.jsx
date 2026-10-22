import { useState } from "react";
import { Footer } from "./components/footer/Footer.jsx";
import { Header } from "./components/header/Header.jsx";
import { GlobalStyles, StatusScreen } from "./global";
import { useValorantData } from "./api/valorant.js";

export function App() {
  const { agents, maps, status, reload } = useValorantData();
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  if (status !== "ready") {
    return (
      <div className="App">
        <GlobalStyles />
        <StatusScreen>
          {status === "loading" ? (
            <p>Carregando agentes e mapas...</p>
          ) : (
            <>
              <p>Não foi possível carregar os dados do Valorant.</p>
              <button onClick={reload}>Tentar novamente</button>
            </>
          )}
        </StatusScreen>
      </div>
    );
  }

  const selectedMap = maps.find(map => map.id === selectedMapId)
    ?? maps.find(map => map.name === "Ascent")
    ?? maps[0];

  return (
    <div className="App">
      <GlobalStyles />
      <Header
        maps={maps}
        selectedMap={selectedMap}
        onMapChange={(map) => setSelectedMapId(map.id)}
        onReset={handleReset}
      />
      <Footer key={resetKey} agents={agents} currentMap={selectedMap} />
    </div>
  );
}
