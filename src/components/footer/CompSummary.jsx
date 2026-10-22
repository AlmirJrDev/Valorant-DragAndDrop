import { CompPanel, CompSide, RoleChip, CompWarning } from "./footer.js"

// Roles in the order the game shows them, with what a team misses without each one
const ROLES = [
    { name: "Duelista", missing: "ninguém para abrir o bomb" },
    { name: "Iniciador", missing: "sem info nem flash para entrar" },
    { name: "Controlador", missing: "sem smokes para cortar visão" },
    { name: "Sentinela", missing: "ninguém segurando o flanco" }
]

const SIDES = [
    { key: "attack", label: "Ataque" },
    { key: "defense", label: "Defesa" }
]

// Role count per team, plus a warning for each role the comp doesn't have
export function CompSummary({ placedItems, agents }) {
    const roleById = new Map(agents.map(agent => [agent.id, agent.role]))

    const teams = SIDES.map(side => {
        const roles = placedItems
            .filter(item => item.type === "agent" && item.side === side.key)
            .map(item => roleById.get(item.agentId))
            .filter(Boolean) // the spike has no role
        const counts = Object.fromEntries(ROLES.map(role => [role.name, roles.filter(r => r === role.name).length]))
        return { ...side, size: roles.length, counts }
    }).filter(team => team.size > 0)

    if (teams.length === 0) return null

    return (
        <CompPanel>
            {teams.map(team => {
                const missing = ROLES.filter(role => team.counts[role.name] === 0)
                return (
                    <CompSide key={team.key} $side={team.key}>
                        <strong>{team.label}</strong>
                        <div>
                            {ROLES.map(role => (
                                <RoleChip
                                    key={role.name}
                                    $isMissing={team.counts[role.name] === 0}
                                    title={team.counts[role.name] === 0 ? `Sem ${role.name}: ${role.missing}` : undefined}
                                >
                                    {role.name} {team.counts[role.name]}
                                </RoleChip>
                            ))}
                        </div>
                        {missing.map(role => (
                            <CompWarning key={role.name}>
                                ⚠ Sem {role.name}: {role.missing}
                            </CompWarning>
                        ))}
                    </CompSide>
                )
            })}
        </CompPanel>
    )
}
