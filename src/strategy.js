import { useEffect, useMemo, useState } from "react"

// A strategy is the selected map plus every item placed on it. It is saved in the
// browser automatically and can be shared as a link (#s=... in the URL).
// Only ids and positions are stored; images are rebuilt from the API data on load,
// which keeps links short and survives image URL changes.

const STORAGE_KEY = "valorant-dnd:strategy"
const HASH_KEY = "s"
const VERSION = 1

export const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const round = (value) => Math.round(value * 10) / 10

// Item format: [type, agentId | skillId, x, y, rotation, weaponId?]
// "o" (map orientation) and the weapon id were added later and are optional,
// so links created before them still open.
function serialize({ mapId, mapRotation, items }) {
    return {
        v: VERSION,
        m: mapId,
        o: mapRotation,
        i: items.map(item => {
            const entry = [
                item.type === "agent" ? "a" : "s",
                item.type === "agent" ? item.agentId : item.skillId,
                round(item.x),
                round(item.y),
                item.rotation || 0
            ]
            if (item.weapon) entry.push(item.weapon.id)
            return entry
        })
    }
}

function deserialize(data, agents, weapons) {
    if (!data || data.v !== VERSION || !Array.isArray(data.i)) return null

    const agentById = new Map(agents.map(agent => [agent.id, agent]))
    const skillById = new Map(agents.flatMap(agent => agent.skills.map(skill => [skill.id, { skill, agent }])))
    const weaponById = new Map(weapons.map(weapon => [weapon.id, weapon]))

    const items = data.i.flatMap(([type, ref, x, y, rotation, weaponId]) => {
        const base = { id: createId(), x: Number(x) || 50, y: Number(y) || 50, rotation: Number(rotation) || 0 }
        if (type === "a" && agentById.has(ref)) {
            const agent = agentById.get(ref)
            const weapon = weaponById.get(weaponId) ?? null
            return [{ ...base, type: "agent", img: agent.icon, name: agent.name, agentId: agent.id, weapon }]
        }
        if (type === "s" && skillById.has(ref)) {
            const { skill, agent } = skillById.get(ref)
            return [{ ...base, type: "skill", img: skill.img, name: skill.name, agentId: agent.id, skillId: skill.id }]
        }
        // Agent or ability no longer exists in the game data: skip it
        return []
    })

    const mapRotation = [0, 90, 180, 270].includes(data.o) ? data.o : null
    return { mapId: data.m ?? null, mapRotation, items }
}

const toBase64Url = (text) => btoa(unescape(encodeURIComponent(text)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

const fromBase64Url = (text) => decodeURIComponent(escape(atob(text.replace(/-/g, "+").replace(/_/g, "/"))))

export function buildShareUrl(strategy) {
    const encoded = toBase64Url(JSON.stringify(serialize(strategy)))
    return `${location.origin}${location.pathname}#${HASH_KEY}=${encoded}`
}

function readFromHash() {
    const params = new URLSearchParams(location.hash.slice(1))
    const encoded = params.get(HASH_KEY)
    if (!encoded) return null
    try {
        return JSON.parse(fromBase64Url(encoded))
    } catch {
        return null
    }
}

function readFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch {
        return null
    }
}

function clearHash() {
    history.replaceState(null, "", location.pathname + location.search)
}

// Loads the strategy from a shared link first, then from the last autosave.
// Must only be called once the game data is loaded, so ids can be resolved.
// mapRotation null means "automatic" (attackers at the bottom).
export function useStrategy(agents, weapons) {
    const initial = useMemo(() => {
        const fromLink = deserialize(readFromHash(), agents, weapons)
        if (fromLink) return { ...fromLink, fromLink: true }
        return deserialize(readFromStorage(), agents, weapons) ?? { mapId: null, mapRotation: null, items: [] }
    }, [agents, weapons])

    const [mapId, setMapId] = useState(initial.mapId)
    const [mapRotation, setMapRotation] = useState(initial.mapRotation)
    const [items, setItems] = useState(initial.items)
    const [loadedFromLink, setLoadedFromLink] = useState(Boolean(initial.fromLink))

    // The link has been read; from now on edits are autosaved like any other strategy
    useEffect(() => {
        if (initial.fromLink) clearHash()
    }, [initial])

    // Debounced so dragging doesn't write to storage on every pointer move
    useEffect(() => {
        const timeout = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize({ mapId, mapRotation, items })))
            } catch {
                // Storage can be full or blocked (private mode); the app keeps working without it
            }
        }, 300)
        return () => clearTimeout(timeout)
    }, [mapId, mapRotation, items])

    return {
        mapId,
        setMapId,
        mapRotation,
        setMapRotation,
        items,
        setItems,
        loadedFromLink,
        dismissLinkNotice: () => setLoadedFromLink(false)
    }
}
