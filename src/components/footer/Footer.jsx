import { useState, useRef, useEffect } from "react"

import {
    FooterBar,
    AgentsGrid,
    AgentButton,
    SkillsPanel,
    SkillsPanelHeader,
    SkillsGrid,
    SkillButton,
    MapContainer,
    MapImage,
    DraggableItem,
    DeleteZone,
    SectionTitle,
    TabsContainer,
    Tab,
    PlacedAgentIcon,
    ClearButton,
    EmptyMessage,
    RoleGroup
} from "./footer.js"

const clamp = (value) => Math.max(0, Math.min(100, value))

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const ROTATION_STEP = 15

const groupByRole = (agents) => agents.reduce((groups, agent) => {
    const role = agent.role || "Outros"
    const group = groups.find(g => g.role === role)
    if (group) group.agents.push(agent)
    else groups.push({ role, agents: [agent] })
    return groups
}, [])

export function Footer({ agents, currentMap }) {
    const [selectedAgentId, setSelectedAgentId] = useState(null)
    const [activeTab, setActiveTab] = useState('agents') // 'agents' or 'skills'
    const [placedItems, setPlacedItems] = useState([]) // items can be agents or skills
    const [draggingId, setDraggingId] = useState(null)
    const [isOverDelete, setIsOverDelete] = useState(false)
    const mapRef = useRef(null)
    const deleteZoneRef = useRef(null)
    const stopDragRef = useRef(null)

    const selectedAgent = agents.find(agent => agent.id === selectedAgentId)
    const roleGroups = groupByRole(agents)

    // New items spawn in a small spiral around the center so they don't stack on top of each other
    const addItem = (item) => {
        setPlacedItems(prev => {
            const angle = prev.length * 1.2
            const radius = prev.length === 0 ? 0 : Math.min(6 + prev.length * 1.5, 25)
            return [...prev, {
                id: createId(),
                x: 50 + Math.cos(angle) * radius,
                y: 50 + Math.sin(angle) * radius,
                rotation: 0,
                ...item
            }]
        })
    }

    const handleAgentClick = (agent) => {
        if (activeTab === 'agents') {
            addItem({ img: agent.icon, type: 'agent', name: agent.name, agentId: agent.id })
        } else {
            // Show skills panel
            setSelectedAgentId(selectedAgentId === agent.id ? null : agent.id)
        }
    }

    const handleSkillAdd = (skill, agent) => {
        addItem({ img: skill.img, type: 'skill', name: skill.name, agentId: agent.id })
    }

    const handleRemoveAgentItems = (agentId) => {
        setPlacedItems(prev => prev.filter(s => s.agentId !== agentId))
        setSelectedAgentId(null)
    }

    const handleClearAll = () => {
        setPlacedItems([])
        setSelectedAgentId(null)
    }

    const handleRemoveItem = (itemId) => {
        setPlacedItems(prev => prev.filter(s => s.id !== itemId))
    }

    const getMapPosition = (clientX, clientY) => {
        const rect = mapRef.current.getBoundingClientRect()
        return {
            x: ((clientX - rect.left) / rect.width) * 100,
            y: ((clientY - rect.top) / rect.height) * 100
        }
    }

    const isOverDeleteZone = (clientX, clientY) => {
        const zone = deleteZoneRef.current?.getBoundingClientRect()
        if (!zone) return false
        const margin = 16
        return clientX >= zone.left - margin && clientX <= zone.right + margin &&
            clientY >= zone.top - margin && clientY <= zone.bottom + margin
    }

    // Listeners go on window (attached right here, not in an effect) so the item keeps
    // following the pointer outside the map and a fast release is never missed.
    const handlePointerDown = (e, item) => {
        if (e.button !== 0 || !mapRef.current) return
        e.preventDefault()
        stopDragRef.current?.()

        const start = getMapPosition(e.clientX, e.clientY)
        const offset = { x: start.x - item.x, y: start.y - item.y }
        let overDelete = false

        const handleMove = (ev) => {
            if (!mapRef.current) return
            const pos = getMapPosition(ev.clientX, ev.clientY)
            const x = clamp(pos.x - offset.x)
            const y = clamp(pos.y - offset.y)

            overDelete = isOverDeleteZone(ev.clientX, ev.clientY)
            setIsOverDelete(overDelete)
            setPlacedItems(prev => prev.map(s => s.id === item.id ? { ...s, x, y } : s))
        }

        const stopDrag = () => {
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerup', handleUp)
            window.removeEventListener('pointercancel', handleUp)
            stopDragRef.current = null
            setIsOverDelete(false)
            setDraggingId(null)
        }

        const handleUp = () => {
            if (overDelete) {
                setPlacedItems(prev => prev.filter(s => s.id !== item.id))
            }
            stopDrag()
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        window.addEventListener('pointercancel', handleUp)
        stopDragRef.current = stopDrag
        setDraggingId(item.id)
    }

    // Remove any pending window listeners if the component unmounts mid-drag (e.g. reset)
    useEffect(() => () => stopDragRef.current?.(), [])

    // Mouse wheel over a skill rotates it. React's onWheel is passive, so a native
    // listener is needed to stop the page from scrolling at the same time.
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const handleWheel = (e) => {
            const target = e.target.closest('[data-rotatable="true"]')
            if (!target) return
            e.preventDefault()
            const step = e.deltaY > 0 ? ROTATION_STEP : -ROTATION_STEP
            const id = target.dataset.id
            setPlacedItems(prev => prev.map(s => s.id === id ? { ...s, rotation: (s.rotation + step + 360) % 360 } : s))
        }

        map.addEventListener('wheel', handleWheel, { passive: false })
        return () => map.removeEventListener('wheel', handleWheel)
    }, [])

    return (
        <>
            <MapContainer ref={mapRef}>
                {currentMap && <MapImage src={currentMap.img} alt={`Mapa ${currentMap.name}`} draggable={false} />}

                {placedItems.map((item) => (
                    <DraggableItem
                        key={item.id}
                        data-id={item.id}
                        data-rotatable={item.type === 'skill'}
                        $isDragging={draggingId === item.id}
                        $isAgent={item.type === 'agent'}
                        style={{ left: `${item.x}%`, top: `${item.y}%`, '--rotation': `${item.rotation}deg` }}
                        onPointerDown={(e) => handlePointerDown(e, item)}
                        onDoubleClick={() => handleRemoveItem(item.id)}
                        onContextMenu={(e) => { e.preventDefault(); handleRemoveItem(item.id) }}
                        title={item.type === 'skill'
                            ? `${item.name} · arraste para mover · rodinha do mouse para girar · duplo clique para remover`
                            : `${item.name} · arraste para mover · duplo clique para remover`}
                    >
                        {item.type === 'agent' ? (
                            <PlacedAgentIcon>
                                <img src={item.img} alt={item.name} draggable={false} />
                            </PlacedAgentIcon>
                        ) : (
                            <img src={item.img} alt={item.name} draggable={false} />
                        )}
                    </DraggableItem>
                ))}

                <DeleteZone ref={deleteZoneRef} $isVisible={draggingId !== null} $isActive={isOverDelete}>
                    Solte aqui para remover
                </DeleteZone>
            </MapContainer>

            <FooterBar>
                <TabsContainer>
                    <Tab
                        $isActive={activeTab === 'agents'}
                        onClick={() => { setActiveTab('agents'); setSelectedAgentId(null); }}
                    >
                        Agentes
                    </Tab>
                    <Tab
                        $isActive={activeTab === 'skills'}
                        onClick={() => setActiveTab('skills')}
                    >
                        Habilidades
                    </Tab>
                    {placedItems.length > 0 && (
                        <ClearButton onClick={handleClearAll}>
                            Limpar Tudo ({placedItems.length})
                        </ClearButton>
                    )}
                </TabsContainer>

                <SectionTitle>
                    {activeTab === 'agents' ? 'Clique para adicionar ao mapa' : 'Selecione um agente para ver habilidades'}
                </SectionTitle>
                <AgentsGrid>
                    {roleGroups.map(({ role, agents: roleAgents }) => (
                        <RoleGroup key={role}>
                            <span>{role}</span>
                            <div>
                                {roleAgents.map((agent) => (
                                    <AgentButton
                                        key={agent.id}
                                        $isSelected={activeTab === 'skills' && selectedAgentId === agent.id}
                                        onClick={() => handleAgentClick(agent)}
                                        title={activeTab === 'agents' ? `Adicionar ${agent.name}` : agent.name}
                                    >
                                        <img src={agent.icon} alt={agent.name} />
                                    </AgentButton>
                                ))}
                            </div>
                        </RoleGroup>
                    ))}
                </AgentsGrid>

                {activeTab === 'skills' && selectedAgent && (
                    <SkillsPanel $isVisible>
                        <SkillsPanelHeader>
                            <img src={selectedAgent.portrait} alt={selectedAgent.name} />
                            <span>{selectedAgent.name}</span>
                            <button onClick={() => handleRemoveAgentItems(selectedAgent.id)}>
                                Remover do {selectedAgent.name}
                            </button>
                        </SkillsPanelHeader>
                        {selectedAgent.skills.length > 0 ? (
                            <SkillsGrid>
                                {selectedAgent.skills.map((skill) => (
                                    <SkillButton
                                        key={skill.id}
                                        onClick={() => handleSkillAdd(skill, selectedAgent)}
                                        title={`Adicionar ${skill.name}`}
                                    >
                                        <img src={skill.img} alt={skill.name} />
                                        {skill.key && <kbd>{skill.key}</kbd>}
                                        <small>{skill.name}</small>
                                    </SkillButton>
                                ))}
                            </SkillsGrid>
                        ) : (
                            <EmptyMessage>Nenhuma habilidade disponível para {selectedAgent.name}.</EmptyMessage>
                        )}
                    </SkillsPanel>
                )}
            </FooterBar>
        </>
    )
}
