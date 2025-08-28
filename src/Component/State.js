import { useState } from "react";

function State(){

    const [count,setCount]=useState(0);

    return (

        <div>
            <button onClick={()=>setCount(count+1)}>click me </button>

             <p>count is {count}</p>

        </div>

        
    )

}

export default State;