import { createGlobalStyle } from "styled-components";

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
