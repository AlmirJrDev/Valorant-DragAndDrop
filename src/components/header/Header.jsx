import { useState } from 'react';
import Logo from '../../assets/Valorant_pink_version_logo.svg.png'
import Ascent from '../../assets/ascent.svg'
import Bind from '../../assets/bind.svg'
import Breeze from '../../assets/breeze.svg'
import Fracture from '../../assets/fracture.svg'
import Haven from '../../assets/haven.svg'
import Icebox from '../../assets/icebox.svg'
import Lotus from '../../assets/lotus.svg'
import Pearl from '../../assets/pearl.svg'
import Split from '../../assets/split.svg'


import { HeaderBar, NavBar } from './header.js'

export function Header() {
    const [showImageAscent, setShowImageAscent] = useState(false);
    const [showImageBind, setShowImageBind] = useState(false);
    const [showImageBreeze, setShowImageBreeze] = useState(false);
    const [showImageFracture, setShowImageFracture] = useState(false);
    const [showImageHaven, setShowImageHaven] = useState(false);    
    const [showImageIcebox, setShowImageIcebox] = useState(false);
    const [showImageLotus, setShowImageLotus] = useState(false);
    const [showImagePearl, setShowImagePearl] = useState(false);
    const [showImageSplit, setShowImageSplit] = useState(false);

    function handleImageChange(image) {
        setShowImageAscent(false);
        setShowImageBind(false);
        setShowImageBreeze(false);
        setShowImageFracture(false);
        setShowImageHaven(false);
        setShowImageIcebox(false);
        setShowImageLotus(false);
        setShowImagePearl(false);
        setShowImageSplit(false);
        switch(image) {
          case 'Ascent':
              setShowImageAscent(true);
              break;
          case 'Bind':
              setShowImageBind(true);
              break;
          case 'Breeze':
              setShowImageBreeze(true);
              break;
          case 'Fracture':
              setShowImageFracture(true);
              break;
          case 'Haven':
              setShowImageHaven(true);
              break;
          case 'Icebox':
              setShowImageIcebox(true);
              break;
          case 'Lotus':
              setShowImageLotus(true);
              break;
          case 'Pearl':
              setShowImagePearl(true);
              break;
          case 'Split':
              setShowImageSplit(true);
              break;
        }
      }
      

    return (
        <HeaderBar>
            <img src={Logo} alt="" />
            <NavBar>
                <ul>
                    <li>     <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Ascent") }}>Ascent</a>
                        {showImageAscent && (
                            <img src={Ascent} alt="Example Image" />
                        )}</li>
                    <li>     <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Bind") }}>Bind</a>
                        {showImageBind && (
                            <img src={Bind} alt="Example Image" />
                        )}</li>
                    <li>      <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Breeze") }}>Breeze</a>
                        {showImageBreeze && (
                            <img src={Breeze} alt="Example Image" />
                        )}</li>
                    <li>       <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Fracture") }}>Fracture</a>
                        {showImageFracture && (
                            <img src={Fracture} alt="Example Image" />
                        )}</li>
                    <li>       <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Haven") }}>Haven</a>
                        {showImageHaven && (
                            <img src={Haven} alt="Example Image" />
                        )}</li>
                    <li>      <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Icebox") }}>Icebox</a>
                        {showImageIcebox && (
                            <img src={Icebox} alt="Example Image" />
                        )}</li>
                    <li>       <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Lotus") }}>Lotus</a>
                        {showImageLotus && (
                            <img src={Lotus} alt="Example Image" />
                        )}</li>
                    <li>       <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Pearl") }}>Pearl</a>
                        {showImagePearl && (
                            <img src={Pearl} alt="Example Image" />
                        )}</li>
                    <li>     <a href="#" onClick={(e) => { e.preventDefault(); handleImageChange("Split") }}>Split</a>  
                        {showImageSplit && (
                            <img src={Split} alt="Example Image" />
                        )}    </li>
                </ul>
            </NavBar>
        </HeaderBar>
    )
}