//React and DragHandle

import { useState } from "react"
import Draggable from "react-draggable"

//Images Bar

import Astra from "../../assets/agents/astra.svg"
import Breach from "../../assets/agents/breach.svg"
import Brimstone from "../../assets/agents/brimstone.svg"
import chamber from "../../assets/agents/chamber.svg"
import cypher from "../../assets/agents/cypher.svg"
import fade from "../../assets/agents/fade.svg"
import harbor from "../../assets/agents/harbor.svg"
import jett from "../../assets/agents/jett.svg"
import kayo from "../../assets/agents/kayo.svg"
import killjoy from "../../assets/agents/killjoy.svg"
import neon from "../../assets/agents/neon.svg"
import omen from "../../assets/agents/omen.svg"
import phoenix from "../../assets/agents/phoenix.svg"
import raze from "../../assets/agents/raze.svg"
import reyna from "../../assets/agents/reyna.svg"
import sage from "../../assets/agents/sage.svg"
import skye from "../../assets/agents/skye.svg"
import sova from "../../assets/agents/sova.svg"
import viper from "../../assets/agents/viper.svg"
import yoru from "../../assets/agents/yoru.svg"
import spike from "../../assets/agents/spike.svg"
import astrault from "../../assets/agents/astrault.svg"
import breachult from "../../assets/agents/breachult.svg"
import fadeult from "../../assets/agents/fadeult.svg"

//Skills Astra

import AstraSmoke from "../../assets/skills/astrasmoke.svg"
import AstraC from "../../assets/skills/astrac.svg"
import Astra0 from "../../assets/skills/astra0.svg"
import AstraUlt90 from "../../assets/skills/astrault90.svg"
import AstraUlt45 from "../../assets/skills/astrault45.svg"
import AstraUlt145 from "../../assets/skills/astrault145.svg"
import AstraQ from "../../assets/skills/astraq.svg"
import IconAstra from "../../assets/skills/iconastra.svg"

import spikeicon from "../../assets/skills/spikeicon.svg"

import BreachUlt0 from "../../assets/skills/breachult0.svg"
import BreachUlt60 from "../../assets/skills/breachult60.svg"
import BreachUlt120 from "../../assets/skills/breachult120.svg"
import BreachUlt90 from "../../assets/skills/breachult90.svg"
import BreachE from "../../assets/skills/breache.svg"
import BreachE90 from "../../assets/skills/breache90.svg"
import BreachE45 from "../../assets/skills/breache45.svg"
import BreachE145 from "../../assets/skills/breache145.svg"
import BreachC from "../../assets/skills/breachc.svg"
import BreachC90 from "../../assets/skills/breachc90.svg"
import BreachC45 from "../../assets/skills/breachc45.svg"
import BreachC145 from "../../assets/skills/breachc145.svg"
import BreachQ from "../../assets/skills/breachq.svg"
import IconBreach from "../../assets/skills/iconbreach.svg"

import BrimSmoke from "../../assets/skills/brimsmoke.svg"
import BrimUlt from "../../assets/skills/brimult.svg"
import BrimQ from "../../assets/skills/brimq.svg"
import BrimC from "../../assets/skills/brimc.svg"
import IconBrim from "../../assets/skills/iconbrim.svg"

import IconChamber from "../../assets/skills/iconchamber.svg"
import ChamberC from "../../assets/skills/chamberc.svg"
import ChamberE from "../../assets/skills/chambere.svg"

import CypherQ from "../../assets/skills/cypherq.svg"
import CypherE from "../../assets/skills/cyphere.svg"
import CypherC from "../../assets/skills/cypherc.svg"
import IconCypher from "../../assets/skills/iconcypher.svg"

import FadeE from "../../assets/skills/fadee.svg"
import IconFade from "../../assets/skills/iconfade.svg"

import HarborUlt from "../../assets/skills/harborult.svg"
import HarborSmoke from "../../assets/skills/harborsmoke.svg"
import IconHarbor from "../../assets/skills/iconharbor.svg"

import JettSmoke from "../../assets/skills/jettsmoke.svg"
import JettE from "../../assets/skills/jette.svg"
import IconJett from "../../assets/skills/iconjett.svg"

import KayoE from "../../assets/skills/kayoe.svg"
import KayoQ from "../../assets/skills/kayoq.svg"
import KayoC from "../../assets/skills/kayoc.svg"
import IconKayo from "../../assets/skills/iconkayo.svg"

import KillJoyE from "../../assets/skills/killjoye.svg"
import KillJoyQ from "../../assets/skills/killjoyq.svg"
import KillJoyC from "../../assets/skills/killjoyc.svg"
import KillJoyUlt from "../../assets/skills/killjoyult.svg"
import IconKillJoy from "../../assets/skills/iconkilljoy.svg"

import IconNeon from "../../assets/skills/iconneon.svg"

import IconOmen from "../../assets/skills/iconomen.svg"
import OmenQ from "../../assets/skills/omenq.svg"
import OmenSmoke from "../../assets/skills/omensmoke.svg"
import OmenUlt from "../../assets/skills/omenult.svg"

import IconPhoenix from "../../assets/skills/iconphoenix.svg"

import IconRaze from "../../assets/skills/iconraze.svg"
import RazeQ from "../../assets/skills/razeq.svg"
import RazeE from "../../assets/skills/razee.svg"

import IconReyna from "../../assets/skills/iconreyna.svg"
import ReynaQ from "../../assets/skills/reynaq.svg"

import IconSage from "../../assets/skills/iconsage.svg"
import SageC90 from "../../assets/skills/sagec90.svg"
import SageC0 from "../../assets/skills/sagec0.svg"
import SageQ from "../../assets/skills/sageq.svg"

import IconSkye from "../../assets/skills/iconskye.svg"
import SkyeE from "../../assets/skills/skyee.svg"
import SkyeQ from "../../assets/skills/skyeq.svg"

import IconSova from "../../assets/skills/iconsova.svg"
import SovaQ from "../../assets/skills/sovaq.svg"
import SovaC from "../../assets/skills/sovac.svg"
import SovaE from "../../assets/skills/sovae.svg"

import IconViper from "../../assets/skills/iconviper.svg"
import ViperC from "../../assets/skills/viperc.svg"
import ViperQ from "../../assets/skills/viperq.svg"
import ViperE0 from "../../assets/skills/vipere0.svg"
import ViperE90 from "../../assets/skills/vipere90.svg"
import ViperE45 from "../../assets/skills/vipere45.svg"
import ViperE145 from "../../assets/skills/vipere145.svg"

import IconYoru from "../../assets/skills/iconyoru.svg"
import YoruE from "../../assets/skills/yorue.svg"
import YoruQ from "../../assets/skills/yoruq.svg" 
import YoruC from "../../assets/skills/yoruc.svg"





import { MainBar } from "../main/main"

const agents = {
    Astra: [IconAstra, AstraSmoke, AstraSmoke, AstraSmoke, AstraC, AstraQ ],
    Breach: [IconBreach,BreachE90, BreachE45, BreachE145, BreachE, BreachC, BreachC145, BreachC45, BreachC90, BreachQ, BreachQ],
    Brimstone: [IconBrim, BrimSmoke, BrimSmoke, BrimSmoke, BrimUlt, BrimQ, BrimC],
    chamber: [IconChamber, ChamberE, ChamberC],
    cypher: [IconCypher,CypherQ, CypherQ, CypherC, CypherC, CypherE],
    fade: [IconFade,FadeE],
    harbor: [IconHarbor,HarborUlt,HarborSmoke,],
    jett: [IconJett ,JettSmoke,JettSmoke, JettE, JettE,],
    kayo: [IconKayo,KayoE, KayoQ, KayoC],
    killjoy: [IconKillJoy,KillJoyE, KillJoyQ, KillJoyQ,KillJoyC, KillJoyUlt],
    neon: [IconNeon],
    omen: [IconOmen, OmenQ, OmenQ, OmenSmoke, OmenSmoke, OmenUlt],  
    phoenix: [IconPhoenix,],
    raze: [IconRaze, RazeQ, RazeE, RazeE],
    reyna: [IconReyna, ReynaQ],
    sage: [IconSage,SageC90,SageC0,SageQ,SageQ],
    skye: [IconSkye, SkyeQ, SkyeE, SkyeE],
    sova: [IconSova, SovaQ, SovaQ, SovaC, SovaE],
    viper: [IconViper,ViperC, ViperC, ViperQ, ViperE0, ViperE45, ViperE90, ViperE145 ],
    yoru: [IconYoru, YoruE, YoruE, YoruC, YoruQ, YoruQ],
    spike: [spikeicon,],
    astrault: [Astra0, AstraUlt45, AstraUlt90, AstraUlt145],
    breachult: [BreachUlt0, BreachUlt60, BreachUlt120, BreachUlt90],
    fadeult: [BreachUlt0, BreachUlt60, BreachUlt120, BreachUlt90],


};


import { FooterBar, ImgBar } from "./footer.js"
export function Footer() {

  
   
    
    const [images, setImages] = useState({});
    const [positions, setPositions] = useState({});

    const handleClick = (name) => {
        setImages({...images, [name]: agents[name]});

        setPositions({...positions, [name]: {x: 0, y: 0}});
    }

    const handleRemove = (name) => {
        if (images[name]) {
            const newImages = {...images};
            delete newImages[name];
            setImages(newImages);
        } else {
            handleClick(name);
        }
    }

    const handleStop = (name, e, data) => {
        setPositions({...positions, [name]: {x: data.x, y: data.y}});
    };
    
    return (
        <MainBar> 
            <ImgBar>
                {Object.keys(images).map((agent) =>
                    images[agent].map((img, index) => 
                    <Draggable >
                     
                        <img key={index} src={img} alt={agent} />
                   
                    </Draggable>)
                      )}
                </ImgBar>
        
        
        <FooterBar>
             <a href="#" onClick={() => handleRemove("Astra")}><img src={Astra} alt="Astra" title="Astra" /></a>
            <a href="#" onClick={() => handleRemove("Breach")}><img src={Breach} alt="Breach" title="Breach" /></a>
            <a href="#" onClick={() => handleRemove("Brimstone")}><img src={Brimstone} alt="Brimstone" title="Brimstone" /></a>
            <a href="#" onClick={() => handleRemove("chamber")}><img src={chamber} alt="chamber" title="Chamber"/></a>
            <a href="#" onClick={() => handleRemove("cypher")}><img src={cypher} alt="cypher" title="Cypher" /></a>
            <a href="#" onClick={() => handleRemove("fade")}><img src={fade} alt="fade"  title="Fade"/></a>
            <a href="#" onClick={() => handleRemove("harbor")}><img src={harbor} alt="harbor" title="Harbor" /></a>
            <a href="#" onClick={() => handleRemove("jett")}><img src={jett} alt="jett"  title="Jett"/></a>
            <a href="#" onClick={() => handleRemove("kayo")}><img src={kayo} alt="kayo"  title="Kayo"/></a>
            <a href="#" onClick={() => handleRemove("killjoy")}><img src={killjoy} alt="killjoy" title="KillJoy"/></a>
            <a href="#" onClick={() => handleRemove("neon")}><img src={neon} alt="neon"  title="Neon"/></a>
            <a href="#" onClick={() => handleRemove("omen")}><img src={omen} alt="omen"  title="Omen"/></a>
            <a href="#" onClick={() => handleRemove("phoenix")}><img src={phoenix} alt="phoenix" title="Phoenix" /></a>
            <a href="#" onClick={() => handleRemove("raze")}><img src={raze} alt="raze"  title="Raze"/></a>
            <a href="#" onClick={() => handleRemove("reyna")}><img src={reyna} alt="reyna" title="Reyna" /></a>
            <a href="#" onClick={() => handleRemove("sage")}><img src={sage} alt="sage"  title="Sage"/></a>
            <a href="#" onClick={() => handleRemove("skye")}><img src={skye} alt="skye"  title="Skye"/></a>
            <a href="#" onClick={() => handleRemove("sova")}><img src={sova} alt="sova"  title="Sova"/></a>
            <a href="#" onClick={() => handleRemove("viper")}><img src={viper} alt="viper" title="Viper" /></a>
            <a href="#" onClick={() => handleRemove("yoru")}><img src={yoru} alt="yoru"  title="Yoru"/></a>
            <a href="#" onClick={() => handleRemove("spike")}><img src={spike} alt="spike" title="Spike" /></a>
            <a href="#" onClick={() => handleRemove("astrault")}><img src={astrault} alt="ult astra" title="Ult Astra" /></a>
            <a href="#" onClick={() => handleRemove("breachult")}><img src={breachult} alt="ult astra" title="Ult Breach" /></a>
            <a href="#" onClick={() => handleRemove("fadeult")}><img src={fadeult} alt="ult astra" title="Ult Fade" /></a>
        
        </FooterBar>

    </MainBar>
)}

