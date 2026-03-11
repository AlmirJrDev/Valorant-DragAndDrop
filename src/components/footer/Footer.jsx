import { useState, useRef, useCallback } from "react"

// Agent Images
import Astra from "../../assets/agents/astra.svg"
import Breach from "../../assets/agents/breach.svg"
import Brimstone from "../../assets/agents/brimstone.svg"
import chamber from "../../assets/agents/chamber.svg"
import cypher from "../../assets/agents/cypher.svg"
import fade from "../../assets/agents/fade.svg"
import harbor from "../../assets/agents/harbor.svg"
import jett from "../../assets/agents/jett.svg"
import kayo from "../../assets/agents/kayo.svg"
import killjoy from "../../assets/agents/killjoy.svg"
import neon from "../../assets/agents/neon.svg"
import omen from "../../assets/agents/omen.svg"
import phoenix from "../../assets/agents/phoenix.svg"
import raze from "../../assets/agents/raze.svg"
import reyna from "../../assets/agents/reyna.svg"
import sage from "../../assets/agents/sage.svg"
import skye from "../../assets/agents/skye.svg"
import sova from "../../assets/agents/sova.svg"
import viper from "../../assets/agents/viper.svg"
import yoru from "../../assets/agents/yoru.svg"
import spike from "../../assets/agents/spike.svg"
import astrault from "../../assets/agents/astrault.svg"
import breachult from "../../assets/agents/breachult.svg"
import fadeult from "../../assets/agents/fadeult.svg"

// Skills Astra
import AstraSmoke from "../../assets/skills/astrasmoke.svg"
import AstraC from "../../assets/skills/astrac.svg"
import Astra0 from "../../assets/skills/astra0.svg"
import AstraUlt90 from "../../assets/skills/astrault90.svg"
import AstraUlt45 from "../../assets/skills/astrault45.svg"
import AstraUlt145 from "../../assets/skills/astrault145.svg"
import AstraQ from "../../assets/skills/astraq.svg"
import IconAstra from "../../assets/skills/iconastra.svg"

import spikeicon from "../../assets/skills/spikeicon.svg"

import BreachUlt0 from "../../assets/skills/breachult0.svg"
import BreachUlt60 from "../../assets/skills/breachult60.svg"
import BreachUlt120 from "../../assets/skills/breachult120.svg"
import BreachUlt90 from "../../assets/skills/breachult90.svg"
import BreachE from "../../assets/skills/breache.svg"
import BreachE90 from "../../assets/skills/breache90.svg"
import BreachE45 from "../../assets/skills/breache45.svg"
import BreachE145 from "../../assets/skills/breache145.svg"
import BreachC from "../../assets/skills/breachc.svg"
import BreachC90 from "../../assets/skills/breachc90.svg"
import BreachC45 from "../../assets/skills/breachc45.svg"
import BreachC145 from "../../assets/skills/breachc145.svg"
import BreachQ from "../../assets/skills/breachq.svg"
import IconBreach from "../../assets/skills/iconbreach.svg"

import BrimSmoke from "../../assets/skills/brimsmoke.svg"
import BrimUlt from "../../assets/skills/brimult.svg"
import BrimQ from "../../assets/skills/brimq.svg"
import BrimC from "../../assets/skills/brimc.svg"
import IconBrim from "../../assets/skills/iconbrim.svg"

import IconChamber from "../../assets/skills/iconchamber.svg"
import ChamberC from "../../assets/skills/chamberc.svg"
import ChamberE from "../../assets/skills/chambere.svg"

import CypherQ from "../../assets/skills/cypherq.svg"
import CypherE from "../../assets/skills/cyphere.svg"
import CypherC from "../../assets/skills/cypherc.svg"
import IconCypher from "../../assets/skills/iconcypher.svg"

import FadeE from "../../assets/skills/fadee.svg"
import IconFade from "../../assets/skills/iconfade.svg"

import HarborUlt from "../../assets/skills/harborult.svg"
import HarborSmoke from "../../assets/skills/harborsmoke.svg"
import IconHarbor from "../../assets/skills/iconharbor.svg"

import JettSmoke from "../../assets/skills/jettsmoke.svg"
import JettE from "../../assets/skills/jette.svg"
import IconJett from "../../assets/skills/iconjett.svg"

import KayoE from "../../assets/skills/kayoe.svg"
import KayoQ from "../../assets/skills/kayoq.svg"
import KayoC from "../../assets/skills/kayoc.svg"
import IconKayo from "../../assets/skills/iconkayo.svg"

import KillJoyE from "../../assets/skills/killjoye.svg"
import KillJoyQ from "../../assets/skills/killjoyq.svg"
import KillJoyC from "../../assets/skills/killjoyc.svg"
import KillJoyUlt from "../../assets/skills/killjoyult.svg"
import IconKillJoy from "../../assets/skills/iconkilljoy.svg"

import IconNeon from "../../assets/skills/iconneon.svg"

import IconOmen from "../../assets/skills/iconomen.svg"
import OmenQ from "../../assets/skills/omenq.svg"
import OmenSmoke from "../../assets/skills/omensmoke.svg"
import OmenUlt from "../../assets/skills/omenult.svg"

import IconPhoenix from "../../assets/skills/iconphoenix.svg"

import IconRaze from "../../assets/skills/iconraze.svg"
import RazeQ from "../../assets/skills/razeq.svg"
import RazeE from "../../assets/skills/razee.svg"

import IconReyna from "../../assets/skills/iconreyna.svg"
import ReynaQ from "../../assets/skills/reynaq.svg"

import IconSage from "../../assets/skills/iconsage.svg"
import SageC90 from "../../assets/skills/sagec90.svg"
import SageC0 from "../../assets/skills/sagec0.svg"
import SageQ from "../../assets/skills/sageq.svg"

import IconSkye from "../../assets/skills/iconskye.svg"
import SkyeE from "../../assets/skills/skyee.svg"
import SkyeQ from "../../assets/skills/skyeq.svg"

import IconSova from "../../assets/skills/iconsova.svg"
import SovaQ from "../../assets/skills/sovaq.svg"
import SovaC from "../../assets/skills/sovac.svg"
import SovaE from "../../assets/skills/sovae.svg"

import IconViper from "../../assets/skills/iconviper.svg"
import ViperC from "../../assets/skills/viperc.svg"
import ViperQ from "../../assets/skills/viperq.svg"
import ViperE0 from "../../assets/skills/vipere0.svg"
import ViperE90 from "../../assets/skills/vipere90.svg"
import ViperE45 from "../../assets/skills/vipere45.svg"
import ViperE145 from "../../assets/skills/vipere145.svg"

import IconYoru from "../../assets/skills/iconyoru.svg"
import YoruE from "../../assets/skills/yorue.svg"
import YoruQ from "../../assets/skills/yoruq.svg" 
import YoruC from "../../assets/skills/yoruc.svg"

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
    DraggableSkill,
    DeleteZone,
    SectionTitle
} from "./footer.js"

// Agent data with skills
const agentsData = {
    Astra: { icon: Astra, portrait: IconAstra, skills: [AstraSmoke, AstraSmoke, AstraSmoke, AstraC, AstraQ] },
    Breach: { icon: Breach, portrait: IconBreach, skills: [BreachE90, BreachE45, BreachE145, BreachE, BreachC, BreachC145, BreachC45, BreachC90, BreachQ] },
    Brimstone: { icon: Brimstone, portrait: IconBrim, skills: [BrimSmoke, BrimSmoke, BrimSmoke, BrimUlt, BrimQ, BrimC] },
    Chamber: { icon: chamber, portrait: IconChamber, skills: [ChamberE, ChamberC] },
    Cypher: { icon: cypher, portrait: IconCypher, skills: [CypherQ, CypherQ, CypherC, CypherC, CypherE] },
    Fade: { icon: fade, portrait: IconFade, skills: [FadeE] },
    Harbor: { icon: harbor, portrait: IconHarbor, skills: [HarborUlt, HarborSmoke] },
    Jett: { icon: jett, portrait: IconJett, skills: [JettSmoke, JettSmoke, JettE, JettE] },
    Kayo: { icon: kayo, portrait: IconKayo, skills: [KayoE, KayoQ, KayoC] },
    Killjoy: { icon: killjoy, portrait: IconKillJoy, skills: [KillJoyE, KillJoyQ, KillJoyQ, KillJoyC, KillJoyUlt] },
    Neon: { icon: neon, portrait: IconNeon, skills: [] },
    Omen: { icon: omen, portrait: IconOmen, skills: [OmenQ, OmenQ, OmenSmoke, OmenSmoke, OmenUlt] },
    Phoenix: { icon: phoenix, portrait: IconPhoenix, skills: [] },
    Raze: { icon: raze, portrait: IconRaze, skills: [RazeQ, RazeE, RazeE] },
    Reyna: { icon: reyna, portrait: IconReyna, skills: [ReynaQ] },
    Sage: { icon: sage, portrait: IconSage, skills: [SageC90, SageC0, SageQ, SageQ] },
    Skye: { icon: skye, portrait: IconSkye, skills: [SkyeQ, SkyeE, SkyeE] },
    Sova: { icon: sova, portrait: IconSova, skills: [SovaQ, SovaQ, SovaC, SovaE] },
    Viper: { icon: viper, portrait: IconViper, skills: [ViperC, ViperC, ViperQ, ViperE0, ViperE45, ViperE90, ViperE145] },
    Yoru: { icon: yoru, portrait: IconYoru, skills: [YoruE, YoruE, YoruC, YoruQ, YoruQ] },
    Spike: { icon: spike, portrait: spikeicon, skills: [spikeicon] },
    AstraUlt: { icon: astrault, portrait: Astra0, skills: [Astra0, AstraUlt45, AstraUlt90, AstraUlt145] },
    BreachUlt: { icon: breachult, portrait: BreachUlt0, skills: [BreachUlt0, BreachUlt60, BreachUlt120, BreachUlt90] },
    FadeUlt: { icon: fadeult, portrait: BreachUlt0, skills: [BreachUlt0, BreachUlt60, BreachUlt120, BreachUlt90] },
}

export function Footer({ currentMap }) {
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [placedSkills, setPlacedSkills] = useState([])
    const [draggingId, setDraggingId] = useState(null)
    const [showDeleteZone, setShowDeleteZone] = useState(false)
    const [isOverDelete, setIsOverDelete] = useState(false)
    const mapRef = useRef(null)
    const dragOffset = useRef({ x: 0, y: 0 })

    const handleAgentClick = (agentName) => {
        setSelectedAgent(selectedAgent === agentName ? null : agentName)
    }

    const handleSkillAdd = (skillImg, agentName) => {
        const newSkill = {
            id: Date.now() + Math.random(),
            img: skillImg,
            agent: agentName,
            x: 50,
            y: 50
        }
        setPlacedSkills([...placedSkills, newSkill])
    }

    const handleRemoveAgentSkills = (agentName) => {
        setPlacedSkills(placedSkills.filter(s => s.agent !== agentName))
        setSelectedAgent(null)
    }

    const getPointerPosition = useCallback((e, element) => {
        const rect = element.getBoundingClientRect()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        return {
            x: ((clientX - rect.left) / rect.width) * 100,
            y: ((clientY - rect.top) / rect.height) * 100
        }
    }, [])

    const handleDragStart = useCallback((e, skillId) => {
        e.preventDefault()
        const skill = placedSkills.find(s => s.id === skillId)
        if (!skill || !mapRef.current) return

        const pos = getPointerPosition(e, mapRef.current)
        dragOffset.current = {
            x: pos.x - skill.x,
            y: pos.y - skill.y
        }
        
        setDraggingId(skillId)
        setShowDeleteZone(true)
    }, [placedSkills, getPointerPosition])

    const handleDragMove = useCallback((e) => {
        if (!draggingId || !mapRef.current) return
        e.preventDefault()

        const pos = getPointerPosition(e, mapRef.current)
        const newX = Math.max(0, Math.min(100, pos.x - dragOffset.current.x))
        const newY = Math.max(0, Math.min(100, pos.y - dragOffset.current.y))

        // Check if over delete zone
        const rect = mapRef.current.getBoundingClientRect()
        const clientY = e.touches ? e.touches[0].clientY : e.clientY
        const isNearBottom = clientY > rect.bottom - 60

        setIsOverDelete(isNearBottom)

        setPlacedSkills(prev => prev.map(s => 
            s.id === draggingId ? { ...s, x: newX, y: newY } : s
        ))
    }, [draggingId, getPointerPosition])

    const handleDragEnd = useCallback(() => {
        if (isOverDelete && draggingId) {
            setPlacedSkills(prev => prev.filter(s => s.id !== draggingId))
        }
        setDraggingId(null)
        setShowDeleteZone(false)
        setIsOverDelete(false)
    }, [draggingId, isOverDelete])

    return (
        <>
            <MapContainer 
                ref={mapRef}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                {currentMap && <MapImage src={currentMap} alt="Mapa selecionado" />}
                
                {placedSkills.map((skill) => (
                    <DraggableSkill
                        key={skill.id}
                        $isDragging={draggingId === skill.id}
                        style={{
                            left: `${skill.x}%`,
                            top: `${skill.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => handleDragStart(e, skill.id)}
                        onTouchStart={(e) => handleDragStart(e, skill.id)}
                    >
                        <img src={skill.img} alt="Skill" draggable={false} />
                    </DraggableSkill>
                ))}

                <DeleteZone $isVisible={showDeleteZone} $isActive={isOverDelete}>
                    Arraste aqui para remover
                </DeleteZone>
            </MapContainer>

            <FooterBar>
                <SectionTitle>Agentes</SectionTitle>
                <AgentsGrid>
                    {Object.entries(agentsData).map(([name, data]) => (
                        <AgentButton 
                            key={name}
                            $isSelected={selectedAgent === name}
                            onClick={() => handleAgentClick(name)}
                            title={name}
                        >
                            <img src={data.icon} alt={name} />
                        </AgentButton>
                    ))}
                </AgentsGrid>

                <SkillsPanel $isVisible={selectedAgent && agentsData[selectedAgent]?.skills.length > 0}>
                    {selectedAgent && agentsData[selectedAgent] && (
                        <>
                            <SkillsPanelHeader>
                                <img src={agentsData[selectedAgent].portrait} alt={selectedAgent} />
                                <span>{selectedAgent}</span>
                                <button onClick={() => handleRemoveAgentSkills(selectedAgent)}>
                                    Remover Todas
                                </button>
                            </SkillsPanelHeader>
                            <SkillsGrid>
                                {agentsData[selectedAgent].skills.map((skill, index) => (
                                    <SkillButton 
                                        key={index}
                                        onClick={() => handleSkillAdd(skill, selectedAgent)}
                                        title={`Adicionar habilidade ${index + 1}`}
                                    >
                                        <img src={skill} alt={`Skill ${index + 1}`} />
                                    </SkillButton>
                                ))}
                            </SkillsGrid>
                        </>
                    )}
                </SkillsPanel>
            </FooterBar>
        </>
    )
}
