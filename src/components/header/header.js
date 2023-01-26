import styled from "styled-components";

export const HeaderBar = styled.header`
    width: 100%;
    height: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #232323;

    img {
        margin-top: 1rem;
        width: 200px;    
    }

    
    
`
export const NavBar = styled.nav`
    li{
        display: inline-block;
        margin: 1rem;
        color: #fff;
    }

    img {
        position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin-top: 22vh;
            width: 600px;
    }
    
`