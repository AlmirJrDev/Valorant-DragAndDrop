import Logo from '../../assets/valorantlogodrag.svg'

import { HeaderBar, NavBar, MapButton, ResetButton, ShareButton } from './header.js'

export function Header({ maps, selectedMap, onMapChange, onReset, onShare }) {
    return (
        <HeaderBar>
            <img src={Logo} alt="Valorant Drag and Drop" />
            <NavBar>
                {maps.map((map) => (
                    <MapButton
                        key={map.id}
                        $isSelected={selectedMap?.id === map.id}
                        onClick={() => onMapChange(map)}
                    >
                        {map.name}
                    </MapButton>
                ))}
                <ShareButton onClick={onShare} title="Copiar link desta estratégia">
                    Compartilhar
                </ShareButton>
                <ResetButton onClick={onReset}>
                    Limpar Tudo
                </ResetButton>
            </NavBar>
        </HeaderBar>
    )
}
