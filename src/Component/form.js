import { useState } from "react";

function Form(){

    const[name,setname]=useState("")

    return (

        <di>


        <h2> this is a form of my student</h2>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}
        
        placeholder="Enter your name">
        
        </input>

        <p>His {name}</p>

        </di> 

        
        
    )
}

export default Form;