import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background: #303030;
    }
    *{
        font-family: 'Inter', sans-serif;
    }

    a{
        text-decoration: none;
        color: #fff;
    }
`