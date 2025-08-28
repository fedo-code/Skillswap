import { useState } from "react";

function Toggle1(){
  const booleanValue=true
  const[darkMode,setMode]=useState(booleanValue);

const click= ()=>setMode(!darkMode);
 

    if(darkMode){
      console.log("Dark mode is on");
    }
    else{
      console.log("light mode is on");
    }

   const dark1=<h1 style={{backgroundColor:"black"}}>DarkMode</h1>
   const light=<h1 style={{backgroundColor:"white"}}>WhiteMode</h1>

    return (
     <div>
        {darkMode?dark1:light}
        <button onClick={click}>ChangeMood</button>
     </div>
    )
};
export default Toggle1;
