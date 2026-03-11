import Logo from '../../assets/valorantlogodrag.svg'
import Ascent from '../../assets/ascent.svg'
import Bind from '../../assets/bind.svg'
import Breeze from '../../assets/breeze.svg'
import Fracture from '../../assets/fracture.svg'
import Haven from '../../assets/haven.svg'
import Icebox from '../../assets/icebox.svg'
import Lotus from '../../assets/lotus.svg'
import Pearl from '../../assets/pearl.svg'
import Split from '../../assets/split.svg'

import { HeaderBar, NavBar, MapButton, ResetButton } from './header.js'

const maps = [
    { name: 'Ascent', img: Ascent },
    { name: 'Bind', img: Bind },
    { name: 'Breeze', img: Breeze },
    { name: 'Fracture', img: Fracture },
    { name: 'Haven', img: Haven },
    { name: 'Icebox', img: Icebox },
    { name: 'Lotus', img: Lotus },
    { name: 'Pearl', img: Pearl },
    { name: 'Split', img: Split },
]

export function Header({ selectedMap, onMapChange, onReset }) {
    return (
        <HeaderBar>
            <img src={Logo} alt="Valorant Drag and Drop" />
            <NavBar>
                {maps.map((map) => (
                    <MapButton
                        key={map.name}
                        $isSelected={selectedMap === map.img}
                        onClick={() => onMapChange(map.img)}
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
