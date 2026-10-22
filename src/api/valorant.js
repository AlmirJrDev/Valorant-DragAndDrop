import { useCallback, useEffect, useState } from "react"
import spike from "../assets/spike.svg"

// Public, community-maintained API with the current game data (agents, abilities, maps).
// Fetching at runtime keeps the app up to date when Riot releases new agents or maps.
const API_URL = "https://valorant-api.com/v1"
const LANGUAGE = "pt-BR"

// Keyboard key for each ability slot, in the order they show up in game
const SLOT_KEYS = { Grenade: "C", Ability1: "Q", Ability2: "E", Ultimate: "X" }
const SLOT_ORDER = ["Grenade", "Ability1", "Ability2", "Ultimate"]

const ROLE_ORDER = ["Duelista", "Iniciador", "Controlador", "Sentinela"]

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
        .map(ability => ({
            id: `${agent.uuid}-${ability.slot}`,
            name: ability.displayName,
            key: SLOT_KEYS[ability.slot],
            img: ability.displayIcon
        }))

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

export async function fetchMaps() {
    const data = await fetchJson(`/maps?language=${LANGUAGE}`)
    // Only competitive maps have bomb sites (tacticalDescription) and a minimap
    return data
        .filter(map => map.tacticalDescription && map.displayIcon)
        .map(map => ({ id: map.uuid, name: map.displayName, img: map.displayIcon }))
        .sort((a, b) => a.name.localeCompare(b.name, LANGUAGE))
}

export function useValorantData() {
    const [state, setState] = useState({ agents: [], maps: [], status: "loading", error: null })

    const load = useCallback(() => {
        setState(prev => ({ ...prev, status: "loading", error: null }))
        Promise.all([fetchAgents(), fetchMaps()])
            .then(([agents, maps]) => setState({ agents: [...agents, spikeItem], maps, status: "ready", error: null }))
            .catch(error => setState(prev => ({ ...prev, status: "error", error })))
    }, [])

    useEffect(() => { load() }, [load])

    return { ...state, reload: load }
}
