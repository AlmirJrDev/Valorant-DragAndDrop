import { useEffect, useState } from "react";
import { Footer } from "./components/footer/Footer.jsx";
import { Header } from "./components/header/Header.jsx";
import { GlobalStyles, StatusScreen, Toast } from "./global";
import { useValorantData } from "./api/valorant.js";
import { buildShareUrl, useStrategy } from "./strategy.js";

export function App() {
  const { agents, maps, status, reload } = useValorantData();

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

  return <Board agents={agents} maps={maps} />;
}

// Rendered only after the game data is loaded, so saved strategies can be rebuilt from it
function Board({ agents, maps }) {
  const { mapId, setMapId, items, setItems, loadedFromLink } = useStrategy(agents);
  const [resetKey, setResetKey] = useState(0);
  const [toast, setToast] = useState(loadedFromLink ? "Estratégia carregada do link" : null);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const selectedMap = maps.find(map => map.id === mapId)
    ?? maps.find(map => map.name === "Ascent")
    ?? maps[0];

  const handleReset = () => {
    setItems([]);
    setResetKey(prev => prev + 1);
  };

  const handleShare = async () => {
    const url = buildShareUrl({ mapId: selectedMap.id, items });
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copiado! Cole para compartilhar a estratégia");
    } catch {
      // Clipboard can be blocked (permissions, non-https); let the user copy by hand
      window.prompt("Copie o link da estratégia:", url);
    }
  };

  return (
    <div className="App">
      <GlobalStyles />
      <Header
        maps={maps}
        selectedMap={selectedMap}
        onMapChange={(map) => setMapId(map.id)}
        onReset={handleReset}
        onShare={handleShare}
      />
      <Footer
        key={resetKey}
        agents={agents}
        currentMap={selectedMap}
        placedItems={items}
        setPlacedItems={setItems}
      />
      {toast && <Toast role="status">{toast}</Toast>}
    </div>
  );
}
