import {
    Popover,
    PopoverHeader,
    PopoverSection,
    PopoverRow,
    PopoverIconButton,
    SideToggle
} from "./footer.js"

// Guns most used in strategies; the full list opens in the footer ("Todas")
const QUICK_WEAPONS = ["Classic", "Sheriff", "Spectre", "Vandal", "Phantom", "Operator"]

// Items near the top edge get the menu below them so it isn't pushed off the map
const OPEN_BELOW_THRESHOLD = 30

export function AgentPopover({ item, agent, weapons, onSideChange, onAddSkill, onWeaponSelect, onShowAllWeapons, onRemove, onClose }) {
    const abilityWeapons = agent?.skills.filter(skill => skill.isWeapon) ?? []
    const quickWeapons = QUICK_WEAPONS
        .map(name => weapons.find(weapon => weapon.name === name))
        .filter(Boolean)
    const openBelow = item.y < OPEN_BELOW_THRESHOLD

    return (
        <Popover
            data-keep-selection
            $openBelow={openBelow}
            style={{ left: `${Math.max(12, Math.min(88, item.x))}%`, top: `${item.y}%` }}
            onPointerDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            <PopoverHeader>
                <strong>{item.name}</strong>
                <SideToggle>
                    <button
                        className={item.side === 'attack' ? 'active attack' : 'attack'}
                        onClick={() => onSideChange('attack')}
                    >
                        Ataque
                    </button>
                    <button
                        className={item.side === 'defense' ? 'active defense' : 'defense'}
                        onClick={() => onSideChange('defense')}
                    >
                        Defesa
                    </button>
                </SideToggle>
                <button className="close" onClick={onClose} title="Fechar">×</button>
            </PopoverHeader>

            {agent?.skills.length > 0 && (
                <PopoverSection>
                    <span>Habilidades · clique para colocar no mapa</span>
                    <PopoverRow>
                        {agent.skills.map(skill => (
                            <PopoverIconButton key={skill.id} onClick={() => onAddSkill(skill)} title={skill.name}>
                                <img src={skill.img} alt={skill.name} />
                                {skill.key && <kbd>{skill.key}</kbd>}
                            </PopoverIconButton>
                        ))}
                    </PopoverRow>
                </PopoverSection>
            )}

            <PopoverSection>
                <span>Arma{item.weapon ? ` · ${item.weapon.name}` : ''}</span>
                <PopoverRow>
                    <PopoverIconButton
                        $isSelected={!item.weapon}
                        onClick={() => onWeaponSelect(null)}
                        title="Sem arma"
                    >
                        <small>—</small>
                    </PopoverIconButton>
                    {[...abilityWeapons, ...quickWeapons].map(weapon => (
                        <PopoverIconButton
                            key={weapon.id}
                            $isWide={!weapon.isWeapon}
                            $isSelected={item.weapon?.id === weapon.id}
                            onClick={() => onWeaponSelect(weapon)}
                            title={weapon.name}
                        >
                            <img src={weapon.img} alt={weapon.name} />
                        </PopoverIconButton>
                    ))}
                    <PopoverIconButton $isWide onClick={onShowAllWeapons} title="Ver todas as armas">
                        <small>Todas</small>
                    </PopoverIconButton>
                </PopoverRow>
            </PopoverSection>

            <PopoverSection>
                <button className="remove" onClick={onRemove}>Remover {item.name} do mapa</button>
            </PopoverSection>
        </Popover>
    )
}
