function mix(){

    const name="Polash";

    const rname=prompt("Enter your name");

    return (

        <div>
        <h2>So ,a name is {rname}</h2>
        {name===rname? alert("I recognize him"):"who is he ?"}
            
        </div>
    )

    
}