import styled from "styled-components";

export const HeaderBar = styled.header`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background: #232323;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 0.5rem;
    }

    > img {
        width: 140px;
        height: auto;

        @media (max-width: 768px) {
            width: 100px;
        }
    }
`

export const NavBar = styled.nav`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
`

export const MapButton = styled.button`
    background: ${props => props.$isSelected ? '#ff4655' : '#1a1a1a'};
    border: 2px solid ${props => props.$isSelected ? '#ff4655' : '#3a3a3a'};
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        border-color: #ff4655;
        background: ${props => props.$isSelected ? '#ff4655' : '#2a2a2a'};
    }

    @media (max-width: 768px) {
        padding: 0.4rem 0.75rem;
        font-size: 0.75rem;
    }
`

export const ResetButton = styled.button`
    background: transparent;
    border: 2px solid #ff4655;
    color: #ff4655;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    margin-left: 0.5rem;

    &:hover {
        background: #ff4655;
        color: #fff;
    }

    @media (max-width: 768px) {
        padding: 0.4rem 0.75rem;
        font-size: 0.75rem;
    }
`
