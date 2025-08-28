function Error(){

    var num;

    try{

        if(num>0){
            console.log("It's a number");
        }

        else{
            throw new Error("it's is undefined");
        }

    }
    catch(error){
        console.log("its something fishy :i think its undefined")
    }
}

export default Error;