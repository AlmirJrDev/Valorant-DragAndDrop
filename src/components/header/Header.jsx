import Logo from '../../assets/valorantlogodrag.svg'

import { HeaderBar, NavBar, MapButton, ResetButton } from './header.js'

export function Header({ maps, selectedMap, onMapChange, onReset }) {
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
                <ResetButton onClick={onReset}>
                    Limpar Tudo
                </ResetButton>
            </NavBar>
        </HeaderBar>
    )
}
