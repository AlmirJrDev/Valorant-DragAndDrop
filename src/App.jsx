import { useEffect, useState } from "react";
import { Footer } from "./components/footer/Footer.jsx";
import { Header } from "./components/header/Header.jsx";
import { GlobalStyles, StatusScreen, Toast } from "./global";
import { useValorantData } from "./api/valorant.js";
import { buildShareUrl, useStrategy } from "./strategy.js";

export function App() {
  const { agents, maps, weapons, status, reload } = useValorantData();

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

  return <Board agents={agents} maps={maps} weapons={weapons} />;
}

// Rotates a position on the map (in %) 90 degrees clockwise around the center
const rotatePosition = ({ x, y }) => ({ x: 100 - y, y: x });

// Rendered only after the game data is loaded, so saved strategies can be rebuilt from it
function Board({ agents, maps, weapons }) {
  const { mapId, setMapId, mapRotation, setMapRotation, items, setItems, loadedFromLink } = useStrategy(agents, weapons);
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

  const rotation = mapRotation ?? selectedMap.defaultRotation;

  const handleMapChange = (map) => {
    setMapId(map.id);
    setMapRotation(null); // each map starts with attackers at the bottom
  };

  // Items rotate together with the map so the strategy keeps making sense
  const handleRotateMap = () => {
    setMapRotation((rotation + 90) % 360);
    setItems(prev => prev.map(item => {
      const rotated = {
        ...item,
        ...rotatePosition(item),
        rotation: item.type === "skill" ? (item.rotation + 90) % 360 : item.rotation
      };
      // Tripwires also have a second end
      if (item.x2 === undefined) return rotated;
      const end = rotatePosition({ x: item.x2, y: item.y2 });
      return { ...rotated, x2: end.x, y2: end.y };
    }));
  };

  const handleReset = () => {
    setItems([]);
    setResetKey(prev => prev + 1);
  };

  const handleShare = async () => {
    const url = buildShareUrl({ mapId: selectedMap.id, mapRotation, items });
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
        onMapChange={handleMapChange}
        onReset={handleReset}
        onShare={handleShare}
      />
      <Footer
        key={resetKey}
        agents={agents}
        weapons={weapons}
        currentMap={selectedMap}
        mapRotation={rotation}
        onRotateMap={handleRotateMap}
        placedItems={items}
        setPlacedItems={setItems}
      />
      {toast && <Toast role="status">{toast}</Toast>}
    </div>
  );
}
