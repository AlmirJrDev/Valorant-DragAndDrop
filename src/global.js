import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        font-size: 16px;
        
        @media (max-width: 768px) {
            font-size: 14px;
        }
    }

    body {
        background: #1a1a1a;
        min-height: 100vh;
        overflow-x: hidden;
    }

    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    a {
        text-decoration: none;
        color: #fff;
    }

    button {
        font-family: inherit;
    }

    .App {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 1rem;
        padding-bottom: 1rem;
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #1a1a1a;
    }

    ::-webkit-scrollbar-thumb {
        background: #3a3a3a;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #4a4a4a;
    }
`

export const StatusScreen = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: #ccc;
    min-height: 100vh;

    button {
        background: #ff4655;
        border: none;
        color: #fff;
        padding: 0.5rem 1.25rem;
        border-radius: 6px;
        cursor: pointer;
    }
`

export const Toast = styled.div`
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: #ff4655;
    color: #fff;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-size: 0.9rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    z-index: 2000;
    max-width: calc(100vw - 2rem);
    text-align: center;
`
