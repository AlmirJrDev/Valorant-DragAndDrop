import { useState } from "react";
import { Footer } from "./components/footer/Footer.jsx";
import { Header } from "./components/header/Header.jsx";
import { GlobalStyles } from "./global";
import Ascent from './assets/ascent.svg'

export function App() {
  const [selectedMap, setSelectedMap] = useState(Ascent);
  const [resetKey, setResetKey] = useState(0);

  const handleMapChange = (mapImg) => {
    setSelectedMap(mapImg);
  };

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <GlobalStyles />
      <Header 
        selectedMap={selectedMap} 
        onMapChange={handleMapChange}
        onReset={handleReset}
      />
      <Footer key={resetKey} currentMap={selectedMap} />
    </div>
  );
}
