import { useEffect, useRef } from "react"

import { SkillsPanel, SkillsPanelHeader, WeaponCategory, WeaponGrid, WeaponButton } from "./footer.js"

const groupByCategory = (weapons) => weapons.reduce((groups, weapon) => {
    const group = groups.find(g => g.category === weapon.category)
    if (group) group.weapons.push(weapon)
    else groups.push({ category: weapon.category, weapons: [weapon] })
    return groups
}, [])

export function WeaponPicker({ item, agent, weapons, onSelect, onClose }) {
    const panelRef = useRef(null)

    // The footer can be scrolled away; bring the picker into view when an agent is clicked
    useEffect(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [item.id])

    return (
        <SkillsPanel $isVisible ref={panelRef}>
            <SkillsPanelHeader>
                <img src={agent?.icon ?? item.img} alt={item.name} />
                <span style={{ textTransform: "none" }}>Arma de {item.name}</span>
                <button onClick={onClose}>Fechar</button>
            </SkillsPanelHeader>

            <WeaponGrid>
                <WeaponButton $isSelected={!item.weapon} onClick={() => onSelect(null)}>
                    <span>Sem arma</span>
                </WeaponButton>
            </WeaponGrid>

            {groupByCategory(weapons).map(({ category, weapons: categoryWeapons }) => (
                <WeaponCategory key={category}>
                    <span>{category}</span>
                    <WeaponGrid>
                        {categoryWeapons.map(weapon => (
                            <WeaponButton
                                key={weapon.id}
                                $isSelected={item.weapon?.id === weapon.id}
                                onClick={() => onSelect(weapon)}
                                title={`${weapon.name} · ${weapon.cost} créditos`}
                            >
                                <img src={weapon.img} alt={weapon.name} />
                                <span>{weapon.name}</span>
                                <small>{weapon.cost}</small>
                            </WeaponButton>
                        ))}
                    </WeaponGrid>
                </WeaponCategory>
            ))}
        </SkillsPanel>
    )
}
