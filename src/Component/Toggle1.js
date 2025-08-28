import { useState } from "react"
import "./toggle.css";

function Toglle1(){

    const [mode,setmode]=useState(true);

    const click=()=>setmode(!mode);

    if(mode){

        console.log("dark mode");

    }

    else{
        console.log("white mode is on ");
    }

    const mode1=<div id="mode1"></div>
    const mode2=<div style={{backgroundColor: "white",
      height: "200px",
      width: "300px"}}></div>


    return (
        <div>
        {mode?mode1:mode2}
        <button onClick={click}>click me</button>
        </div>
    )
}

export default Toglle1;