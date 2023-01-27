import { Fragment } from "react";
import { Footer } from "./components/footer/Footer.jsx";
import { Header } from "./components/header/Header.jsx";

import { GlobalStyles } from "./global";


export function App() {


  return (
    <div className="App">
      <Fragment>
        <Header />
      
        <Footer />
        <GlobalStyles />
     
      </Fragment>
    </div>
  )
}

