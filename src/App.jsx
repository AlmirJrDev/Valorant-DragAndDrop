import { Fragment } from "react";
import { Footer } from "./components/footer/Footer.jsx";
import { Header } from "./components/header/Header.jsx";
import { Main } from "./components/main/Main.jsx";
import { GlobalStyles } from "./global";


export function App() {


  return (
    <div className="App">
      <Fragment>
        <Header />
        <Main />  
        <Footer />
        <GlobalStyles />
     
      </Fragment>
    </div>
  )
}

