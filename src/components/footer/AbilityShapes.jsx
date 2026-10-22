import { ShapeLayer, ShapeHandle, SIDE_COLORS } from "./footer.js"
import { pointAt } from "../../data/abilityShapes.js"

const NEUTRAL_COLOR = "#ece8e1"

// Where the aim/length handle of a shaped ability sits (null when it has none)
export function handlePosition(item, metersToPercent) {
    const { shape } = item
    if (!shape) return null
    if (shape.type === "direction") return pointAt(item, item.rotation, shape.length * metersToPercent)
    if (shape.type === "wall") return pointAt(item, item.rotation, Math.min(shape.length, 30) * metersToPercent / 2)
    if (shape.type === "tripwire") return { x: item.x2, y: item.y2 }
    return null
}

function Shape({ item, metersToPercent }) {
    const { shape, x, y, rotation } = item
    const color = SIDE_COLORS[item.side] ?? NEUTRAL_COLOR
    // Strokes keep the same thickness on screen at any zoom
    const stroke = { stroke: color, vectorEffect: "non-scaling-stroke" }

    if (shape.type === "area") {
        return (
            <circle cx={x} cy={y} r={shape.radius * metersToPercent}
                fill={color} fillOpacity={0.22} strokeWidth={2} strokeOpacity={0.9} {...stroke} />
        )
    }

    if (shape.type === "wall") {
        const half = shape.length * metersToPercent / 2
        const a = pointAt(item, rotation, half)
        const b = pointAt(item, rotation + 180, half)
        return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={5} strokeLinecap="round" strokeOpacity={0.85} {...stroke} />
    }

    if (shape.type === "tripwire") {
        return (
            <g>
                <line x1={x} y1={y} x2={item.x2} y2={item.y2} strokeWidth={2.5} strokeDasharray="6 4" {...stroke} />
                <circle cx={item.x2} cy={item.y2} r={0.5} fill={color} />
            </g>
        )
    }

    // direction: drawn pointing up from the icon, then rotated around it
    const length = shape.length * metersToPercent
    const width = shape.width * metersToPercent
    // vector-effect isn't inherited, so the stroke props go on the shape itself
    const style = {
        fill: shape.outline ? "none" : color,
        fillOpacity: 0.25,
        strokeWidth: shape.width < 1.5 ? 4 : 2,
        strokeOpacity: 0.9,
        strokeDasharray: shape.outline ? "8 5" : undefined,
        ...stroke
    }

    return (
        <g transform={`rotate(${rotation} ${x} ${y})`}>
            {shape.cone
                ? <polygon points={`${x},${y} ${x - width / 2},${y - length} ${x + width / 2},${y - length}`} {...style} />
                : <rect x={x - width / 2} y={y - length} width={width} height={length} {...style} />}
        </g>
    )
}

// Shapes are drawn in map space (they grow with zoom, like the map); the handles are
// HTML so they stay the same size on screen and can be grabbed easily.
export function AbilityShapes({ items, metersToPercent, onHandlePointerDown }) {
    const shaped = items.filter(item => item.type === "skill" && item.shape)

    return (
        <>
            <ShapeLayer viewBox="0 0 100 100" preserveAspectRatio="none">
                {shaped.map(item => <Shape key={item.id} item={item} metersToPercent={metersToPercent} />)}
            </ShapeLayer>

            {shaped.map(item => {
                const handle = handlePosition(item, metersToPercent)
                if (!handle) return null
                return (
                    <ShapeHandle
                        key={`${item.id}-handle`}
                        $color={SIDE_COLORS[item.side] ?? NEUTRAL_COLOR}
                        style={{ left: `${handle.x}%`, top: `${handle.y}%` }}
                        onPointerDown={(e) => onHandlePointerDown(e, item)}
                        title={item.shape.type === "tripwire" ? "Arraste para esticar o fio" : "Arraste para mirar"}
                    />
                )
            })}
        </>
    )
}
