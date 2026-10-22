import { useCallback, useEffect, useState } from "react"
import spike from "../assets/spike.svg"
import { ABILITY_SHAPES } from "../data/abilityShapes.js"

// Public, community-maintained API with the current game data (agents, abilities, maps).
// Fetching at runtime keeps the app up to date when Riot releases new agents or maps.
const API_URL = "https://valorant-api.com/v1"
const LANGUAGE = "pt-BR"

// Keyboard key for each ability slot, in the order they show up in game
const SLOT_KEYS = { Grenade: "C", Ability1: "Q", Ability2: "E", Ultimate: "X" }
const SLOT_ORDER = ["Grenade", "Ability1", "Ability2", "Ultimate"]

const ROLE_ORDER = ["Duelista", "Iniciador", "Controlador", "Sentinela"]

// Abilities that replace the agent's gun, so they can be picked as the agent's weapon.
// The API has no flag for this; ids are `${agentUuid}-${slot}`.
const WEAPON_ABILITIES = new Set([
    "add6443a-41bd-e414-f6ad-e58d267f4e95-Ultimate", // Jett: Blade Storm
    "22697a3d-45bf-8dd7-4fec-84a9e28c69d7-Ability1", // Chamber: Headhunter
    "22697a3d-45bf-8dd7-4fec-84a9e28c69d7-Ultimate", // Chamber: Tour De Force
    "f94c3b30-42be-e959-889c-5aa313dba261-Ultimate", // Raze: Showstopper
    "bb2a4828-46eb-8cd1-e765-15848195d751-Ultimate"  // Neon: Overdrive
])

async function fetchJson(path) {
    const response = await fetch(`${API_URL}${path}`)
    if (!response.ok) throw new Error(`Erro ${response.status} ao buscar ${path}`)
    const json = await response.json()
    return json.data
}

function toAgent(agent) {
    const skills = agent.abilities
        .filter(ability => SLOT_KEYS[ability.slot] && ability.displayIcon)
        .sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot))
        .map(ability => {
            const id = `${agent.uuid}-${ability.slot}`
            return {
                id,
                name: ability.displayName,
                key: SLOT_KEYS[ability.slot],
                img: ability.displayIcon,
                isWeapon: WEAPON_ABILITIES.has(id),
                shape: ABILITY_SHAPES[id] ?? null
            }
        })

    return {
        id: agent.uuid,
        name: agent.displayName,
        role: agent.role?.displayName ?? "",
        icon: agent.displayIcon,
        portrait: agent.displayIcon,
        skills
    }
}

const sortAgents = (a, b) => {
    const roleDiff = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
    return roleDiff !== 0 ? roleDiff : a.name.localeCompare(b.name, LANGUAGE)
}

export const spikeItem = {
    id: "spike",
    name: "Spike",
    role: "",
    icon: spike,
    portrait: spike,
    skills: [{ id: "spike-item", name: "Spike", key: "", img: spike }]
}

export async function fetchAgents() {
    const data = await fetchJson(`/agents?isPlayableCharacter=true&language=${LANGUAGE}`)
    // The API sometimes returns duplicated test agents; keep one entry per name
    const unique = new Map(data.map(agent => [agent.displayName, agent]))
    return [...unique.values()].map(toAgent).sort(sortAgents)
}

// Game world coordinates -> position on the minimap image (0..1), as documented by valorant-api
const toMinimap = (map, location) => ({
    x: location.y * map.xMultiplier + map.xScalarToAdd,
    y: location.x * map.yMultiplier + map.yScalarToAdd
})

const SITES = ["A", "B", "C"]

// Callouts come in English on purpose: it's how most players call positions in comms
function toCallouts(map) {
    return (map.callouts ?? []).map(callout => {
        const { x, y } = toMinimap(map, callout.location)
        const region = callout.superRegionName
        const name = callout.regionName

        if (SITES.includes(region) && name === "Site") return { kind: "site", label: region, x, y }
        if (name === "Spawn" && region === "Attacker Side") return { kind: "spawn", side: "attack", label: "Ataque", x, y }
        if (name === "Spawn" && region === "Defender Side") return { kind: "spawn", side: "defense", label: "Defesa", x, y }

        const prefix = SITES.includes(region) || region === "Mid" ? `${region} ` : ""
        return { kind: "region", label: `${prefix}${name}`, x, y }
    })
}

// Rotation (multiple of 90deg) that puts the attacker spawn at the bottom and defenders at the top
function attackDownRotation(callouts) {
    const attack = callouts.find(c => c.side === "attack")
    const defense = callouts.find(c => c.side === "defense")
    if (!attack || !defense) return 0

    const angle = Math.atan2(attack.y - defense.y, attack.x - defense.x) * 180 / Math.PI
    // The image is rotated clockwise; pointing "down" on screen is 90deg
    return ((Math.round((90 - angle) / 90) * 90) % 360 + 360) % 360
}

export async function fetchMaps() {
    const data = await fetchJson(`/maps`)
    // Only competitive maps have bomb sites (tacticalDescription) and a minimap
    return data
        .filter(map => map.tacticalDescription && map.displayIcon)
        .map(map => {
            const callouts = toCallouts(map)
            return {
                id: map.uuid,
                name: map.displayName,
                img: map.displayIcon,
                callouts,
                defaultRotation: attackDownRotation(callouts),
                // Game units are centimeters; the multiplier converts them to minimap 0..1
                metersToPercent: Math.abs(map.xMultiplier) * 100 * 100
            }
        })
        .sort((a, b) => a.name.localeCompare(b.name, LANGUAGE))
}

// Same order as the in-game buy menu. The API's localized category text is inconsistent
// (e.g. Warden comes as "Fuzis"), so grouping uses the internal category instead.
const WEAPON_CATEGORIES = [
    { key: "Sidearm", label: "Pistolas" },
    { key: "SMG", label: "Submetralhadoras" },
    { key: "Shotgun", label: "Escopetas" },
    { key: "Rifle", label: "Fuzis" },
    { key: "Sniper", label: "Fuzis de Precisão" },
    { key: "Heavy", label: "Armas Pesadas" }
]

export async function fetchWeapons() {
    const data = await fetchJson(`/weapons?language=${LANGUAGE}`)
    // Melee has no shop data, so it is left out
    return data
        .filter(weapon => weapon.shopData && weapon.killStreamIcon)
        .map(weapon => {
            const key = weapon.category.split("::").pop()
            const index = WEAPON_CATEGORIES.findIndex(c => c.key === key)
            return {
                id: weapon.uuid,
                name: weapon.displayName,
                category: WEAPON_CATEGORIES[index]?.label ?? weapon.shopData.categoryText,
                order: index === -1 ? WEAPON_CATEGORIES.length : index,
                cost: weapon.shopData.cost,
                img: weapon.killStreamIcon
            }
        })
        .sort((a, b) => a.order - b.order || a.cost - b.cost)
}

export function useValorantData() {
    const [state, setState] = useState({ agents: [], maps: [], weapons: [], status: "loading", error: null })

    const load = useCallback(() => {
        setState(prev => ({ ...prev, status: "loading", error: null }))
        Promise.all([fetchAgents(), fetchMaps(), fetchWeapons()])
            .then(([agents, maps, weapons]) => setState({ agents: [...agents, spikeItem], maps, weapons, status: "ready", error: null }))
            .catch(error => setState(prev => ({ ...prev, status: "error", error })))
    }, [])

    useEffect(() => { load() }, [load])

    return { ...state, reload: load }
}
