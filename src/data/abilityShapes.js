// How each ability is drawn on the map, in game meters (scaled to each map by the API's
// coordinate multipliers). valorant-api has no ability dimensions, so these values are
// APPROXIMATE and can be tuned here. Abilities not listed are shown as just their icon.
//
// Keys are `${agentUuid}-${slot}`. Shape types:
//   area      circle around the icon                           { radius }
//   wall      fixed-length line centered on the icon           { length }
//   direction strip (or cone) going out from the icon, aimable { length, width, cone?, outline? }
//   tripwire  line between the icon and a second, movable end  { maxLength }

const OMEN = "8e253930-4c05-31dd-1b6c-968525494517"
const BRIMSTONE = "9f0d8ba9-4140-b941-57d3-a7ad57c6b417"
const ASTRA = "41fb69c1-4189-7b37-f117-bcaf1e96f1bf"
const CLOVE = "1dbf2edd-4729-0984-3115-daa5eed44993"
const VIPER = "707eab51-4836-f488-046a-cda6bf494859"
const HARBOR = "95b78ed7-4637-86d9-7e41-71ba8c293152"
const JETT = "add6443a-41bd-e414-f6ad-e58d267f4e95"
const PHOENIX = "eb93336a-449b-9c1b-0a54-a891f7921d69"
const KILLJOY = "1e58de9c-4950-5125-93e9-a0aee9f98746"
const CYPHER = "117ed9e3-49f3-6512-3ccf-0cada7e3823b"
const SAGE = "569fdd95-4d10-43ab-ca70-79becc718b46"
const KAYO = "601dbbe7-43ce-be57-2a40-4abd24953621"
const NEON = "bb2a4828-46eb-8cd1-e765-15848195d751"
const BREACH = "5f8d3a7f-467b-97f3-062c-13acf203c006"
const SOVA = "320b2a48-4d9b-a075-30f1-1f93a9b638fa"
const FADE = "dade69b4-4f5a-8528-247b-219e5a1facd6"
const RAZE = "f94c3b30-42be-e959-889c-5aa313dba261"

export const ABILITY_SHAPES = {
    // Smokes
    [`${OMEN}-Ability2`]: { type: "area", radius: 4.1 },        // Dark Cover
    [`${BRIMSTONE}-Ability2`]: { type: "area", radius: 4.15 },  // Sky Smoke
    [`${ASTRA}-Ability2`]: { type: "area", radius: 4.75 },      // Nebula
    [`${CLOVE}-Ability2`]: { type: "area", radius: 4.1 },       // Ruse
    [`${VIPER}-Ability1`]: { type: "area", radius: 4.5 },       // Poison Cloud
    [`${HARBOR}-Ability2`]: { type: "area", radius: 4.5 },      // Cove
    [`${JETT}-Grenade`]: { type: "area", radius: 3.35 },        // Cloudburst

    // Other areas (mollies, slows, cages, ultimates)
    [`${BRIMSTONE}-Ability1`]: { type: "area", radius: 4.5 },   // Incendiary
    [`${BRIMSTONE}-Ultimate`]: { type: "area", radius: 9 },     // Orbital Strike
    [`${ASTRA}-Grenade`]: { type: "area", radius: 4.75 },       // Gravity Well
    [`${ASTRA}-Ability1`]: { type: "area", radius: 4.75 },      // Nova Pulse
    [`${VIPER}-Grenade`]: { type: "area", radius: 4.5 },        // Snake Bite
    [`${VIPER}-Ultimate`]: { type: "area", radius: 17.5 },      // Viper's Pit
    [`${PHOENIX}-Ability1`]: { type: "area", radius: 4.5 },     // Hot Hands
    [`${KILLJOY}-Grenade`]: { type: "area", radius: 3.5 },      // Nanoswarm
    [`${KILLJOY}-Ultimate`]: { type: "area", radius: 32.5 },    // Lockdown
    [`${CYPHER}-Ability1`]: { type: "area", radius: 3.75 },     // Cyber Cage
    [`${SAGE}-Ability1`]: { type: "area", radius: 6 },          // Slow Orb
    [`${KAYO}-Grenade`]: { type: "area", radius: 5 },           // FRAG/ment

    // Walls
    [`${SAGE}-Grenade`]: { type: "wall", length: 9 },           // Barrier Orb
    [`${ASTRA}-Ultimate`]: { type: "wall", length: 300 },       // Cosmic Divide (crosses the whole map)
    [`${VIPER}-Ability2`]: { type: "direction", length: 50, width: 0.8 },   // Toxic Screen
    [`${HARBOR}-Ability1`]: { type: "direction", length: 40, width: 0.8 },  // High Tide
    [`${PHOENIX}-Grenade`]: { type: "direction", length: 18, width: 0.8 },  // Blaze
    [`${NEON}-Grenade`]: { type: "direction", length: 40, width: 4, outline: true }, // Fast Lane

    // Tripwires
    [`${CYPHER}-Grenade`]: { type: "tripwire", maxLength: 15 },  // Trapwire

    // Directional abilities
    [`${OMEN}-Ability1`]: { type: "direction", length: 20, width: 4 },      // Paranoia
    [`${BREACH}-Ability2`]: { type: "direction", length: 46, width: 4.5 },  // Fault Line
    [`${BREACH}-Ultimate`]: { type: "direction", length: 32, width: 18, cone: true }, // Rolling Thunder
    [`${SOVA}-Ultimate`]: { type: "direction", length: 66, width: 2.4 },    // Hunter's Fury
    [`${FADE}-Grenade`]: { type: "direction", length: 25, width: 2 },       // Prowler
    [`${RAZE}-Grenade`]: { type: "direction", length: 30, width: 2 },       // Boom Bot
}

// Rotation 0 points up on the screen; angles grow clockwise (same as CSS rotate)
export const DEFAULT_WALL_ROTATION = 90

// Point at `distance` (map %) from (x, y) in the direction of `rotation` degrees
export function pointAt({ x, y }, rotation, distance) {
    const radians = rotation * Math.PI / 180
    return { x: x + Math.sin(radians) * distance, y: y - Math.cos(radians) * distance }
}

// Angle (degrees) from `origin` to `target`, using the same convention as pointAt
export function angleTo(origin, target) {
    return Math.atan2(target.x - origin.x, origin.y - target.y) * 180 / Math.PI
}
