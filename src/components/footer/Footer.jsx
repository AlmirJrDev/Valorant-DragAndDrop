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
    RoleGroup,
    MapToolbar,
    WeaponBadge,
    MapContent,
    ZoomLevel,
    SectionRow,
    SideCounter,
    Workspace
} from "./footer.js"

import { AbilityShapes } from "./AbilityShapes.jsx"
import { AgentPopover } from "./AgentPopover.jsx"
import { CompSummary } from "./CompSummary.jsx"
import { MapCallouts } from "./MapCallouts.jsx"
import { WeaponPicker } from "./WeaponPicker.jsx"
import { createId } from "../../strategy.js"
import { angleTo, DEFAULT_WALL_ROTATION } from "../../data/abilityShapes.js"

// Starting rotation / second end for abilities drawn with a shape
function shapeDefaults(shape, x, y, metersToPercent) {
    if (shape?.type === "wall") return { rotation: DEFAULT_WALL_ROTATION }
    if (shape?.type === "tripwire") {
        return { x2: clamp(x + shape.maxLength * 0.6 * metersToPercent), y2: y }
    }
    return {}
}

// Abilities with a shape rotate the shape, not the icon; tripwires are aimed by their handle
const rotatesIcon = (item) => item.type === "skill" && !item.shape
const isRotatable = (item) => item.type === "skill" && item.shape?.type !== "tripwire"

// Pointer movement (px) below which a press on an agent counts as a click, not a drag
const CLICK_TOLERANCE = 4

const clamp = (value) => Math.max(0, Math.min(100, value))

const ROTATION_STEP = 15

const MAX_AGENTS_PER_SIDE = 5
const SPIKE_ID = "spike"

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const BUTTON_ZOOM_STEP = 1.5
const WHEEL_ZOOM_SPEED = 0.0015

const INITIAL_VIEW = { zoom: 1, x: 0, y: 0 }

// Keeps the zoomed map covering the whole frame (no empty borders when panning)
function clampView({ zoom, x, y }, size) {
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
    const min = size - size * z
    return { zoom: z, x: Math.min(0, Math.max(min, x)), y: Math.min(0, Math.max(min, y)) }
}

// Zooms keeping the map point under `point` (px inside the frame) in place
function zoomAt(view, point, nextZoom, size) {
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom))
    const contentX = (point.x - view.x) / view.zoom
    const contentY = (point.y - view.y) / view.zoom
    return clampView({ zoom: z, x: point.x - contentX * z, y: point.y - contentY * z }, size)
}

const groupByRole = (agents) => agents.reduce((groups, agent) => {
    const role = agent.role || "Outros"
    const group = groups.find(g => g.role === role)
    if (group) group.agents.push(agent)
    else groups.push({ role, agents: [agent] })
    return groups
}, [])

// placedItems (agents or skills on the map) live in App so they can be saved and shared
export function Footer({ agents, weapons, currentMap, mapRotation, onRotateMap, placedItems, setPlacedItems }) {
    const [selectedAgentId, setSelectedAgentId] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null) // agent on the map with its menu open
    const [showAllWeapons, setShowAllWeapons] = useState(false) // full weapon list in the footer
    const [showRegions, setShowRegions] = useState(true)
    const [activeTab, setActiveTab] = useState('agents') // 'agents' or 'skills'
    const [draggingId, setDraggingId] = useState(null)
    const [isOverDelete, setIsOverDelete] = useState(false)
    const [view, setView] = useState(INITIAL_VIEW) // map zoom and pan (px)
    const [isPanning, setIsPanning] = useState(false)
    const viewportRef = useRef(null) // fixed frame on screen
    const mapRef = useRef(null) // zoomed content; positions in % are relative to it
    const deleteZoneRef = useRef(null)
    const stopDragRef = useRef(null)

    const frameSize = () => viewportRef.current?.getBoundingClientRect().width ?? 0

    // Map % per game meter, used to draw abilities at their real size
    const metersToPercent = currentMap?.metersToPercent ?? 0.7

    // Each team has at most 5 agents, like in the game (the spike isn't an agent)
    const countSide = (side) => placedItems
        .filter(item => item.type === 'agent' && item.agentId !== SPIKE_ID && item.side === side).length
    const isSideFull = (side) => countSide(side) >= MAX_AGENTS_PER_SIDE

    const [notice, setNotice] = useState(null)
    const showNotice = (text) => setNotice({ text, at: Date.now() })
    useEffect(() => {
        if (!notice) return
        const timeout = setTimeout(() => setNotice(null), 3500)
        return () => clearTimeout(timeout)
    }, [notice])

    const zoomBy = (factor) => {
        const size = frameSize()
        setView(v => zoomAt(v, { x: size / 2, y: size / 2 }, v.zoom * factor, size))
    }

    // Each map starts fully visible
    useEffect(() => { setView(INITIAL_VIEW) }, [currentMap?.id])

    // Center of what is visible right now, in map % (new items appear there)
    const visibleCenter = () => {
        const size = frameSize() || 1
        return {
            x: ((size / 2 - view.x) / view.zoom) / size * 100,
            y: ((size / 2 - view.y) / view.zoom) / size * 100
        }
    }

    const handlePanStart = (e) => {
        if (e.button !== 0 || view.zoom === 1) return
        const start = { x: e.clientX, y: e.clientY, view }
        setIsPanning(true)

        const handleMove = (ev) => {
            const size = frameSize()
            setView(clampView({
                zoom: start.view.zoom,
                x: start.view.x + ev.clientX - start.x,
                y: start.view.y + ev.clientY - start.y
            }, size))
        }
        const handleUp = () => {
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerup', handleUp)
            window.removeEventListener('pointercancel', handleUp)
            setIsPanning(false)
        }
        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        window.addEventListener('pointercancel', handleUp)
    }

    const selectedAgent = agents.find(agent => agent.id === selectedAgentId)
    const selectedItem = placedItems.find(item => item.id === selectedItemId && item.type === 'agent')
    const roleGroups = groupByRole(agents)

    const updateSelectedItem = (changes) => {
        setPlacedItems(prev => prev.map(item => item.id === selectedItemId ? { ...item, ...changes } : item))
    }

    const selectItem = (itemId) => {
        setSelectedItemId(itemId)
        setShowAllWeapons(false)
    }

    // Skills added from an agent's menu go around that agent and take its side color
    const handleAddSkillNearAgent = (skill) => {
        const agentItem = selectedItem
        setPlacedItems(prev => {
            const count = prev.filter(s => s.type === 'skill' && s.ownerId === agentItem.id).length
            const angle = (count * 60 - 30) * Math.PI / 180
            const x = clamp(agentItem.x + Math.cos(angle) * 7 / view.zoom)
            const y = clamp(agentItem.y + Math.sin(angle) * 7 / view.zoom)
            return [...prev, {
                id: createId(),
                type: 'skill',
                img: skill.img,
                name: skill.name,
                agentId: agentItem.agentId,
                skillId: skill.id,
                shape: skill.shape,
                ownerId: agentItem.id,
                side: agentItem.side,
                x,
                y,
                rotation: 0,
                ...shapeDefaults(skill.shape, x, y, metersToPercent)
            }]
        })
    }

    // Close the agent menu when clicking anywhere outside it (or the weapon list)
    useEffect(() => {
        if (!selectedItemId) return
        const handleOutside = (e) => {
            if (e.target.closest('[data-keep-selection]') || e.target.closest(`[data-id="${selectedItemId}"]`)) return
            selectItem(null)
        }
        const handleKey = (e) => { if (e.key === 'Escape') selectItem(null) }
        document.addEventListener('pointerdown', handleOutside)
        document.addEventListener('keydown', handleKey)
        return () => {
            document.removeEventListener('pointerdown', handleOutside)
            document.removeEventListener('keydown', handleKey)
        }
    }, [selectedItemId])

    // New items spawn in a small spiral around the center of the visible area
    // so they don't stack on top of each other
    const addItem = (item) => {
        const center = visibleCenter()
        const zoom = view.zoom
        setPlacedItems(prev => {
            const angle = prev.length * 1.2
            const radius = prev.length === 0 ? 0 : Math.min(6 + prev.length * 1.5, 25) / zoom
            const x = clamp(center.x + Math.cos(angle) * radius)
            const y = clamp(center.y + Math.sin(angle) * radius)
            return [...prev, {
                id: createId(),
                x,
                y,
                rotation: 0,
                ...shapeDefaults(item.shape, x, y, metersToPercent),
                ...item
            }]
        })
    }

    const handleAgentClick = (agent) => {
        if (activeTab === 'agents') {
            // New agents join attack; when it's full they go to defense (the spike doesn't count)
            const side = agent.id === SPIKE_ID || !isSideFull('attack') ? 'attack'
                : !isSideFull('defense') ? 'defense'
                : null
            if (!side) {
                showNotice(`Os dois times já têm ${MAX_AGENTS_PER_SIDE} agentes. Remova um para adicionar outro.`)
                return
            }
            if (side === 'defense') showNotice(`Ataque já tem ${MAX_AGENTS_PER_SIDE} agentes: ${agent.name} entrou na defesa.`)
            addItem({ img: agent.icon, type: 'agent', name: agent.name, agentId: agent.id, side })
        } else {
            // Show skills panel
            setSelectedAgentId(selectedAgentId === agent.id ? null : agent.id)
        }
    }

    const handleSkillAdd = (skill, agent) => {
        addItem({ img: skill.img, type: 'skill', name: skill.name, agentId: agent.id, skillId: skill.id, shape: skill.shape })
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
        e.stopPropagation() // dragging an item must not pan the map
        stopDragRef.current?.()

        const start = getMapPosition(e.clientX, e.clientY)
        const offset = { x: start.x - item.x, y: start.y - item.y }
        const startClient = { x: e.clientX, y: e.clientY }
        let overDelete = false
        let moved = false

        const handleMove = (ev) => {
            if (!mapRef.current) return
            if (!moved && Math.hypot(ev.clientX - startClient.x, ev.clientY - startClient.y) < CLICK_TOLERANCE) return
            moved = true
            const pos = getMapPosition(ev.clientX, ev.clientY)
            const x = clamp(pos.x - offset.x)
            const y = clamp(pos.y - offset.y)

            overDelete = isOverDeleteZone(ev.clientX, ev.clientY)
            setIsOverDelete(overDelete)
            // A tripwire moves as a whole: its second end follows the icon
            const end = item.x2 === undefined ? {} : {
                x2: clamp(item.x2 + x - item.x),
                y2: clamp(item.y2 + y - item.y)
            }
            setPlacedItems(prev => prev.map(s => s.id === item.id ? { ...s, x, y, ...end } : s))
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
            } else if (!moved && item.type === 'agent') {
                // A simple click on an agent opens (or closes) its menu
                setSelectedItemId(current => current === item.id ? null : item.id)
                setShowAllWeapons(false)
            }
            stopDrag()
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        window.addEventListener('pointercancel', handleUp)
        stopDragRef.current = stopDrag
        setDraggingId(item.id)
    }

    // Dragging a shape's handle aims it (direction, wall) or stretches it (tripwire,
    // limited to the ability's real maximum length)
    const handleShapeHandleDown = (e, item) => {
        if (e.button !== 0 || !mapRef.current) return
        e.preventDefault()
        e.stopPropagation()
        stopDragRef.current?.()

        const handleMove = (ev) => {
            if (!mapRef.current) return
            const pos = getMapPosition(ev.clientX, ev.clientY)
            let changes
            if (item.shape.type === 'tripwire') {
                const max = item.shape.maxLength * metersToPercent
                const dx = pos.x - item.x
                const dy = pos.y - item.y
                const scale = Math.min(1, max / (Math.hypot(dx, dy) || 1))
                changes = { x2: clamp(item.x + dx * scale), y2: clamp(item.y + dy * scale) }
            } else {
                changes = { rotation: Math.round(angleTo(item, pos)) }
            }
            setPlacedItems(prev => prev.map(s => s.id === item.id ? { ...s, ...changes } : s))
        }

        const stopDrag = () => {
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerup', stopDrag)
            window.removeEventListener('pointercancel', stopDrag)
            stopDragRef.current = null
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', stopDrag)
        window.addEventListener('pointercancel', stopDrag)
        stopDragRef.current = stopDrag
    }

    // Remove any pending window listeners if the component unmounts mid-drag (e.g. reset)
    useEffect(() => () => stopDragRef.current?.(), [])

    // Mouse wheel over a skill rotates it; anywhere else on the map it zooms toward the
    // cursor. React's onWheel is passive, so a native listener is needed to stop the
    // page from scrolling at the same time.
    useEffect(() => {
        const frame = viewportRef.current
        if (!frame) return

        const handleWheel = (e) => {
            if (e.target.closest('[data-keep-selection]')) return // let the agent menu scroll
            e.preventDefault()

            const target = e.target.closest('[data-rotatable="true"]')
            if (target) {
                const step = e.deltaY > 0 ? ROTATION_STEP : -ROTATION_STEP
                const id = target.dataset.id
                setPlacedItems(prev => prev.map(s => s.id === id ? { ...s, rotation: (s.rotation + step + 360) % 360 } : s))
                return
            }

            const rect = frame.getBoundingClientRect()
            const point = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            const factor = Math.exp(-e.deltaY * WHEEL_ZOOM_SPEED)
            setView(v => zoomAt(v, point, v.zoom * factor, rect.width))
        }

        frame.addEventListener('wheel', handleWheel, { passive: false })
        return () => frame.removeEventListener('wheel', handleWheel)
    }, [setPlacedItems])

    // Keep the pan valid when the frame is resized (window or orientation change)
    useEffect(() => {
        const handleResize = () => setView(v => clampView(v, frameSize()))
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <Workspace>
            <MapContainer ref={viewportRef} $isZoomed={view.zoom > 1}>
                <MapContent
                    ref={mapRef}
                    $canPan={view.zoom > 1}
                    $isPanning={isPanning}
                    style={{
                        transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                        '--inv-zoom': 1 / view.zoom
                    }}
                    onPointerDown={handlePanStart}
                >
                    {currentMap && (
                        <>
                            <MapImage
                                src={currentMap.img}
                                alt={`Mapa ${currentMap.name}`}
                                draggable={false}
                                style={{ transform: `translate(-50%, -50%) rotate(${mapRotation}deg)` }}
                            />
                            <MapCallouts callouts={currentMap.callouts} rotation={mapRotation} showRegions={showRegions} />
                        </>
                    )}

                    <AbilityShapes
                        items={placedItems}
                        metersToPercent={metersToPercent}
                        onHandlePointerDown={handleShapeHandleDown}
                    />

                    {placedItems.map((item) => (
                        <DraggableItem
                            key={item.id}
                            data-id={item.id}
                            data-rotatable={isRotatable(item)}
                            $isDragging={draggingId === item.id}
                            $isAgent={item.type === 'agent'}
                            $side={item.side}
                            style={{ left: `${item.x}%`, top: `${item.y}%`, '--rotation': `${rotatesIcon(item) ? item.rotation : 0}deg` }}
                            onPointerDown={(e) => handlePointerDown(e, item)}
                            onDoubleClick={() => handleRemoveItem(item.id)}
                            onContextMenu={(e) => { e.preventDefault(); handleRemoveItem(item.id) }}
                            title={item.type === 'skill'
                                ? `${item.name} · arraste para mover · rodinha do mouse para girar · duplo clique para remover`
                                : `${item.name}${item.weapon ? ` (${item.weapon.name})` : ''} · clique para abrir o menu · arraste para mover`}
                        >
                            {item.type === 'agent' ? (
                                <>
                                    <PlacedAgentIcon $side={item.side} $isSelected={selectedItemId === item.id}>
                                        <img src={item.img} alt={item.name} draggable={false} />
                                    </PlacedAgentIcon>
                                    {item.weapon && (
                                        <WeaponBadge $side={item.side} $isAbility={item.weapon.isWeapon}>
                                            <img src={item.weapon.img} alt={item.weapon.name} draggable={false} />
                                        </WeaponBadge>
                                    )}
                                </>
                            ) : (
                                <img src={item.img} alt={item.name} draggable={false} />
                            )}
                        </DraggableItem>
                    ))}

                    {selectedItem && draggingId !== selectedItem.id && (
                        <AgentPopover
                            item={selectedItem}
                            agent={agents.find(agent => agent.id === selectedItem.agentId)}
                            weapons={weapons}
                            // Can't move into a full team (the spike has no team limit)
                            fullSides={selectedItem.agentId === SPIKE_ID ? [] : ['attack', 'defense']
                                .filter(side => side !== selectedItem.side && isSideFull(side))}
                            onSideChange={(side) => {
                                // The agent's own skills follow its side color
                                setPlacedItems(prev => prev.map(s =>
                                    s.id === selectedItem.id || s.ownerId === selectedItem.id ? { ...s, side } : s))
                            }}
                            onAddSkill={handleAddSkillNearAgent}
                            onWeaponSelect={(weapon) => updateSelectedItem({ weapon })}
                            onShowAllWeapons={() => setShowAllWeapons(true)}
                            onRemove={() => { handleRemoveItem(selectedItem.id); selectItem(null) }}
                            onClose={() => selectItem(null)}
                        />
                    )}

                </MapContent>

                <MapToolbar onPointerDown={(e) => e.stopPropagation()}>
                    <button onClick={onRotateMap} title="Girar o mapa 90° (os itens giram junto)">⟳ Girar</button>
                    <button
                        onClick={() => setShowRegions(show => !show)}
                        aria-pressed={showRegions}
                        title="Mostrar ou esconder os nomes das regiões"
                    >
                        {showRegions ? 'Ocultar nomes' : 'Mostrar nomes'}
                    </button>
                    <button onClick={() => zoomBy(1 / BUTTON_ZOOM_STEP)} disabled={view.zoom <= MIN_ZOOM} title="Diminuir zoom">−</button>
                    <ZoomLevel>{Math.round(view.zoom * 100)}%</ZoomLevel>
                    <button onClick={() => zoomBy(BUTTON_ZOOM_STEP)} disabled={view.zoom >= MAX_ZOOM} title="Aumentar zoom (ou use a rodinha do mouse)">+</button>
                    {view.zoom > 1 && (
                        <button onClick={() => setView(INITIAL_VIEW)} title="Ver o mapa inteiro">Ajustar</button>
                    )}
                </MapToolbar>

                <DeleteZone ref={deleteZoneRef} $isVisible={draggingId !== null} $isActive={isOverDelete}>
                    Solte aqui para remover
                </DeleteZone>
            </MapContainer>

            <FooterBar>
                {selectedItem && showAllWeapons && (
                    <WeaponPicker
                        item={selectedItem}
                        agent={agents.find(agent => agent.id === selectedItem.agentId)}
                        weapons={weapons}
                        onSelect={(weapon) => updateSelectedItem({ weapon })}
                        onClose={() => setShowAllWeapons(false)}
                    />
                )}

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

                <SectionRow>
                    <SectionTitle $isNotice={Boolean(notice)} role={notice ? 'status' : undefined}>
                        {notice?.text ?? (activeTab === 'agents' ? 'Clique para adicionar ao mapa' : 'Selecione um agente para ver habilidades')}
                    </SectionTitle>
                    <SideCounter>
                        {['attack', 'defense'].map(side => (
                            <span key={side} className={side} data-full={isSideFull(side)}>
                                {side === 'attack' ? 'Ataque' : 'Defesa'} {countSide(side)}/{MAX_AGENTS_PER_SIDE}
                            </span>
                        ))}
                    </SideCounter>
                </SectionRow>

                <CompSummary placedItems={placedItems} agents={agents} />
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
        </Workspace>
    )
}
