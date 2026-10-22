import { CalloutLayer, RegionLabel, SiteLabel, SpawnLabel } from "./footer.js"

// Callout positions come in minimap coordinates (0..1); the map image is rotated with CSS,
// so each label is moved to match it but the text itself stays upright.
function rotatePoint({ x, y }, degrees) {
    const radians = degrees * Math.PI / 180
    const dx = x - 0.5
    const dy = y - 0.5
    return {
        x: 0.5 + dx * Math.cos(radians) - dy * Math.sin(radians),
        y: 0.5 + dx * Math.sin(radians) + dy * Math.cos(radians)
    }
}

const LABELS = { region: RegionLabel, site: SiteLabel, spawn: SpawnLabel }

export function MapCallouts({ callouts, rotation, showRegions }) {
    return (
        <CalloutLayer>
            {callouts
                .filter(callout => showRegions || callout.kind !== "region")
                .map((callout, index) => {
                    const { x, y } = rotatePoint(callout, rotation)
                    const Label = LABELS[callout.kind]
                    return (
                        <Label
                            key={`${callout.label}-${index}`}
                            $side={callout.side}
                            style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                        >
                            {callout.label}
                        </Label>
                    )
                })}
        </CalloutLayer>
    )
}
