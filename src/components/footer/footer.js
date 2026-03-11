import styled from "styled-components";

export const FooterBar = styled.footer`
    background: #232323;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 40vh;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`

export const AgentsGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    padding: 0.5rem;

    @media (max-width: 768px) {
        gap: 4px;
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
        transform: scale(1.05);
    }

    img {
        width: 40px;
        height: 40px;
        object-fit: contain;

        @media (max-width: 768px) {
            width: 32px;
            height: 32px;
        }
    }
`

export const SkillsPanel = styled.div`
    background: #1a1a1a;
    border-radius: 8px;
    padding: 1rem;
    display: ${props => props.$isVisible ? 'block' : 'none'};
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
        padding: 0.25rem 0.75rem;
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
    padding: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border-color: #ff4655;
        background: #353535;
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }

    img {
        width: 32px;
        height: 32px;
        object-fit: contain;
    }
`

export const MapContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    aspect-ratio: 1 / 1;
    background: #303030;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    @media (max-width: 1024px) {
        max-width: 90vw;
        max-height: 60vh;
    }

    @media (max-width: 768px) {
        max-width: 95vw;
        max-height: 50vh;
    }
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

export const DraggableSkill = styled.div`
    position: absolute;
    cursor: grab;
    z-index: ${props => props.$isDragging ? 1000 : 10};
    touch-action: none;
    user-select: none;
    transition: ${props => props.$isDragging ? 'none' : 'box-shadow 0.2s ease'};
    
    &:active {
        cursor: grabbing;
    }

    img {
        width: 28px;
        height: 28px;
        pointer-events: none;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));

        @media (max-width: 768px) {
            width: 24px;
            height: 24px;
        }
    }

    &:hover img {
        filter: drop-shadow(0 0 8px rgba(255, 70, 85, 0.6));
    }
`

export const DeleteZone = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.$isActive ? '#ff4655' : 'rgba(255, 70, 85, 0.3)'};
    border: 2px dashed #ff4655;
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
    z-index: 5;
    pointer-events: none;
    opacity: ${props => props.$isVisible ? 1 : 0};
`

export const SectionTitle = styled.h3`
    color: #888;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 0.5rem 0;
    padding-left: 0.25rem;
`
