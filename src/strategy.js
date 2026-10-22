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

// Item format: [type, agentId | skillId, x, y, rotation, weaponId?, side?, ownerIndex?, x2?, y2?]
// side is "a" (attack) or "d" (defense); ownerIndex links a skill to the agent it was
// placed from; x2/y2 is the second end of a tripwire. "o" (map orientation) and every field after rotation were added later
// and are optional, so links created before them still open.
const SIDE_CODES = { attack: "a", defense: "d" }
const SIDES_BY_CODE = { a: "attack", d: "defense" }

function serialize({ mapId, mapRotation, items }) {
    const indexById = new Map(items.map((item, index) => [item.id, index]))
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
            const extra = [
                item.weapon?.id ?? null,
                SIDE_CODES[item.side] ?? null,
                indexById.get(item.ownerId) ?? null,
                item.x2 === undefined ? null : round(item.x2),
                item.y2 === undefined ? null : round(item.y2)
            ]
            // Drop trailing empty fields to keep links short
            while (extra.length && extra[extra.length - 1] === null) extra.pop()
            return [...entry, ...extra]
        })
    }
}

function deserialize(data, agents, weapons) {
    if (!data || data.v !== VERSION || !Array.isArray(data.i)) return null

    const agentById = new Map(agents.map(agent => [agent.id, agent]))
    const skillById = new Map(agents.flatMap(agent => agent.skills.map(skill => [skill.id, { skill, agent }])))
    const weaponById = new Map(weapons.map(weapon => [weapon.id, weapon]))

    // Ids are created up front so skills can point to their owner agent by index
    const ids = data.i.map(() => createId())

    const items = data.i.flatMap(([type, ref, x, y, rotation, weaponId, sideCode, ownerIndex, x2, y2], index) => {
        const base = {
            id: ids[index],
            x: Number(x) || 50,
            y: Number(y) || 50,
            rotation: Number(rotation) || 0,
            side: SIDES_BY_CODE[sideCode]
        }
        if (type === "a" && agentById.has(ref)) {
            const agent = agentById.get(ref)
            // The weapon can also be one of the agent's own abilities (e.g. Jett's knives)
            const weapon = weaponById.get(weaponId)
                ?? agent.skills.find(skill => skill.isWeapon && skill.id === weaponId)
                ?? null
            // Agents saved before sides existed default to attack
            return [{ ...base, side: base.side ?? "attack", type: "agent", img: agent.icon, name: agent.name, agentId: agent.id, weapon }]
        }
        if (type === "s" && skillById.has(ref)) {
            const { skill, agent } = skillById.get(ref)
            const ownerId = Number.isInteger(ownerIndex) ? ids[ownerIndex] : undefined
            const skillItem = { ...base, type: "skill", img: skill.img, name: skill.name, agentId: agent.id, skillId: skill.id, shape: skill.shape, ownerId }
            if (skill.shape?.type === "tripwire") {
                // Saved before tripwires had a second end: start with a short horizontal wire
                skillItem.x2 = typeof x2 === "number" ? x2 : Math.min(100, skillItem.x + 5)
                skillItem.y2 = typeof y2 === "number" ? y2 : skillItem.y
            }
            return [skillItem]
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
