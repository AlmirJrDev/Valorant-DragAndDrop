import styled from "styled-components";

export const FooterBar = styled.footer`
    background: #232323;
    margin-top: 750px;
    height: 450px;

    display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: -10px;
  grid-row-gap: 14px;
  justify-content: start;
  align-content: start;
  justify-items: center;
  align-items: center;


`

export const ImgBar = styled.div`

display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
`