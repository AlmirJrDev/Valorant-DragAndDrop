import styled from "styled-components";

export const SIDE_COLORS = { attack: '#ff4655', defense: '#17a29a' }
const sideColor = (side, fallback = SIDE_COLORS.attack) => SIDE_COLORS[side] ?? fallback

export const FooterBar = styled.footer`
    background: #232323;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 45vh;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 0.75rem;
        max-height: 50vh;
    }
`

export const TabsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #3a3a3a;
`

export const Tab = styled.button`
    background: ${props => props.$isActive ? '#ff4655' : 'transparent'};
    border: 2px solid ${props => props.$isActive ? '#ff4655' : '#3a3a3a'};
    color: #fff;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        border-color: #ff4655;
        background: ${props => props.$isActive ? '#ff4655' : 'rgba(255, 70, 85, 0.1)'};
    }
`

export const AgentsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    justify-content: center;
    padding: 0.5rem;

    @media (max-width: 768px) {
        gap: 0.75rem;
    }
`

export const RoleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    > span {
        color: #888;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    > div {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
`

export const AgentButton = styled.button`
    background: ${props => props.$isSelected ? '#ff4655' : '#1a1a1a'};
    border: 2px solid ${props => props.$isSelected ? '#ff4655' : '#3a3a3a'};
    border-radius: 8px;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border-color: #ff4655;
        transform: scale(1.08);
    }

    &:active {
        transform: scale(0.95);
    }

    img {
        width: 40px;
        height: 40px;
        object-fit: contain;

        @media (max-width: 768px) {
            width: 36px;
            height: 36px;
        }
    }
`

export const SkillsPanel = styled.div`
    background: #1a1a1a;
    border-radius: 8px;
    padding: 1rem;
    display: ${props => props.$isVisible ? 'block' : 'none'};
    animation: slideIn 0.2s ease;

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`

export const SkillsPanelHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #3a3a3a;

    img {
        width: 36px;
        height: 36px;
    }

    span {
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        text-transform: capitalize;
    }

    button {
        margin-left: auto;
        background: #ff4655;
        border: none;
        color: #fff;
        padding: 0.35rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.75rem;

        &:hover {
            background: #e63e4d;
        }
    }
`

export const SkillsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
`

export const SkillButton = styled.button`
    background: #2a2a2a;
    border: 2px solid #3a3a3a;
    border-radius: 6px;
    padding: 8px 6px 6px;
    width: 84px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    color: #ccc;

    &:hover {
        border-color: #ff4655;
        background: #353535;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    img {
        width: 36px;
        height: 36px;
        object-fit: contain;
    }

    kbd {
        position: absolute;
        top: 4px;
        right: 4px;
        font-family: inherit;
        font-size: 0.65rem;
        font-weight: 700;
        color: #ff4655;
    }

    small {
        font-size: 0.65rem;
        line-height: 1.2;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
    }
`

// Square map that fits the screen: as wide as possible without being taller than the
// space left under the header. Clips the zoomed content, except at 100% so the agent
// menu can overflow the edges.
export const MapContainer = styled.div`
    position: relative;
    width: min(92vw, calc(100vh - 150px), 900px);
    width: min(92vw, calc(100dvh - 150px), 900px);
    min-width: min(92vw, 320px);
    margin: 0 auto;
    aspect-ratio: 1 / 1;
    background: #252525;
    overflow: ${props => props.$isZoomed ? 'hidden' : 'visible'};
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    flex-shrink: 0;
    touch-action: none;

    @media (max-width: 768px) {
        width: 95vw;
        min-width: 0;
    }
`

// Everything that zooms and pans with the map. --inv-zoom lets icons, labels and the
// agent menu cancel the zoom so they keep their size on screen.
export const MapContent = styled.div`
    position: absolute;
    inset: 0;
    transform-origin: 0 0;
    cursor: ${props => props.$isPanning ? 'grabbing' : props.$canPan ? 'grab' : 'default'};
`

export const MapImage = styled.img`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
`

export const DraggableItem = styled.div`
    position: absolute;
    transform: translate(-50%, -50%) scale(var(--inv-zoom, 1)) rotate(var(--rotation, 0deg)) ${props => props.$isDragging ? 'scale(1.15)' : ''};
    cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
    z-index: ${props => props.$isDragging ? 1000 : props.$isAgent ? 20 : 10};
    touch-action: none;
    user-select: none;
    transition: ${props => props.$isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.1s ease'};
    
    &:active {
        cursor: grabbing;
    }

    img {
        pointer-events: none;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }

    /* Skill icons (agents are wrapped in PlacedAgentIcon) */
    > img {
        width: 30px;
        height: 30px;
        padding: 4px;
        border-radius: 50%;
        background: rgba(26, 26, 26, 0.85);
        border: ${props => props.$side ? `2px solid ${sideColor(props.$side)}` : '1px solid rgba(255, 255, 255, 0.25)'};

        @media (max-width: 768px) {
            width: 26px;
            height: 26px;
        }
    }

    &:hover {
        transform: translate(-50%, -50%) scale(var(--inv-zoom, 1)) rotate(var(--rotation, 0deg)) scale(${props => props.$isDragging ? 1.15 : 1.1});
    }

    &:hover img {
        filter: drop-shadow(0 0 8px rgba(255, 70, 85, 0.6));
    }
`

export const PlacedAgentIcon = styled.div`
    background: rgba(26, 26, 26, 0.9);
    border: 2px solid ${props => sideColor(props.$side)};
    box-shadow: ${props => props.$isSelected ? '0 0 0 3px #ece8e1' : 'none'};
    border-radius: 50%;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 32px;
        height: 32px;

        @media (max-width: 768px) {
            width: 28px;
            height: 28px;
        }
    }
`

export const DeleteZone = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%) scale(${props => props.$isActive ? 1.08 : 1});
    white-space: nowrap;
    background: ${props => props.$isActive ? '#ff4655' : 'rgba(255, 70, 85, 0.3)'};
    border: 2px dashed #ff4655;
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
    z-index: 999;
    pointer-events: none;
    opacity: ${props => props.$isVisible ? 1 : 0};
`

export const ClearButton = styled.button`
    margin-left: auto;
    background: #ff4655;
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s ease;

    &:hover {
        background: #e63e4d;
    }
`

export const EmptyMessage = styled.p`
    color: #888;
    font-size: 0.85rem;
`

export const SectionTitle = styled.h3`
    color: #888;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 0.25rem 0;
    padding-left: 0.25rem;
`

// Small badge on the agent's bottom-right corner with the gun or weapon ability
export const WeaponBadge = styled.div`
    position: absolute;
    right: -10px;
    bottom: -6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 2px solid ${props => sideColor(props.$side)};
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    img {
        width: ${props => props.$isAbility ? '14px' : '18px'};
        height: 14px;
        object-fit: contain;
        filter: none;
    }
`

export const ZoomLevel = styled.span`
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    background: rgba(26, 26, 26, 0.85);
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    color: #ccc;
    font-size: 0.75rem;
`

export const MapToolbar = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 6px;
    z-index: 30;

    button {
        background: rgba(26, 26, 26, 0.85);
        border: 1px solid #3a3a3a;
        color: #fff;
        padding: 0.3rem 0.6rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.75rem;

        &:hover:not(:disabled) {
            border-color: #ff4655;
        }

        &:disabled {
            opacity: 0.4;
            cursor: default;
        }
    }
`

export const CalloutLayer = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
`

const calloutBase = `
    position: absolute;
    transform: translate(-50%, -50%) scale(var(--inv-zoom, 1));
    white-space: nowrap;
    user-select: none;
`

export const RegionLabel = styled.span`
    ${calloutBase}
    color: #fff;
    font-size: 0.6rem;
    font-weight: 500;
    text-shadow: 0 0 3px #000, 0 0 2px #000;
    opacity: 0.85;

    @media (max-width: 768px) {
        font-size: 0.5rem;
    }
`

export const SiteLabel = styled.span`
    ${calloutBase}
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 70, 85, 0.9);
    color: #fff;
    font-weight: 800;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`

export const SpawnLabel = styled.span`
    ${calloutBase}
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fff;
    background: ${props => props.$side === 'attack' ? 'rgba(255, 70, 85, 0.9)' : 'rgba(23, 162, 154, 0.9)'};
`

export const WeaponCategory = styled.div`
    margin-top: 0.75rem;

    > span {
        display: block;
        color: #888;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.4rem;
    }
`

export const WeaponGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`

export const WeaponButton = styled.button`
    background: ${props => props.$isSelected ? 'rgba(255, 70, 85, 0.2)' : '#2a2a2a'};
    border: 2px solid ${props => props.$isSelected ? '#ff4655' : '#3a3a3a'};
    border-radius: 6px;
    padding: 6px 8px;
    min-width: 92px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    color: #ccc;
    transition: border-color 0.15s ease;

    &:hover {
        border-color: #ff4655;
    }

    img {
        width: ${props => props.$isAbility ? "26px" : "72px"};
        height: ${props => props.$isAbility ? "26px" : "22px"};
        object-fit: contain;
    }

    span {
        font-size: 0.7rem;
    }

    small {
        font-size: 0.6rem;
        color: #888;
    }
`

export const Popover = styled.div`
    position: absolute;
    z-index: 1100;
    width: 290px;
    max-width: 90vw;
    /* Scaled around the anchor point (the agent), so it keeps its size and gap on screen */
    transform-origin: 0 0;
    transform: scale(var(--inv-zoom, 1)) ${props => props.$openBelow
        ? 'translate(-50%, 34px)'
        : 'translate(-50%, calc(-100% - 34px))'};
    background: #1a1a1a;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    padding: 0.6rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    cursor: default;

    .remove {
        width: 100%;
        background: transparent;
        border: 1px solid #3a3a3a;
        color: #aaa;
        padding: 0.3rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.7rem;

        &:hover {
            border-color: #ff4655;
            color: #ff4655;
        }
    }
`

export const PopoverHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    strong {
        color: #fff;
        font-size: 0.9rem;
    }

    .close {
        margin-left: auto;
        background: none;
        border: none;
        color: #888;
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;

        &:hover {
            color: #fff;
        }
    }
`

export const SideToggle = styled.div`
    display: flex;
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    overflow: hidden;

    button {
        background: transparent;
        border: none;
        color: #aaa;
        padding: 0.25rem 0.6rem;
        font-size: 0.7rem;
        font-weight: 600;
        cursor: pointer;
    }

    .attack.active {
        background: ${SIDE_COLORS.attack};
        color: #fff;
    }

    .defense.active {
        background: ${SIDE_COLORS.defense};
        color: #fff;
    }
`

export const PopoverSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    > span {
        color: #888;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
`

export const PopoverRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
`

export const PopoverIconButton = styled.button`
    position: relative;
    height: 36px;
    min-width: ${props => props.$isWide ? '52px' : '36px'};
    padding: 4px;
    background: ${props => props.$isSelected ? 'rgba(255, 70, 85, 0.2)' : '#2a2a2a'};
    border: 1px solid ${props => props.$isSelected ? '#ff4655' : '#3a3a3a'};
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;

    &:hover {
        border-color: #ff4655;
    }

    img {
        width: ${props => props.$isWide ? '44px' : '24px'};
        height: 24px;
        object-fit: contain;
    }

    kbd {
        position: absolute;
        bottom: 1px;
        right: 3px;
        font-family: inherit;
        font-size: 0.55rem;
        font-weight: 700;
        color: #ff4655;
    }

    small {
        font-size: 0.7rem;
    }
`

export const ShapeLayer = styled.svg`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
    z-index: 6;
`

export const ShapeHandle = styled.div`
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 3px solid ${props => props.$color};
    transform: translate(-50%, -50%) scale(var(--inv-zoom, 1));
    cursor: crosshair;
    touch-action: none;
    z-index: 15;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);

    &:hover {
        background: ${props => props.$color};
    }
`
