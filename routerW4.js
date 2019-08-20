let express = require('express');
let router = express.Router();
let db = [];


router.get("/newItem/:name/:qty/:price", function(req,res){
    let id = getID();
    let name = req.params.name;
    let qty = parseInt(req.params.qty);
    let price = parseInt(req.params.price);
    let obj = {id:id , name:name , qty:qty , price:price};
    let msg = "";

    db.push(obj);  
    msg = retrunResult(id,name,qty,price);
    res.send(msg); 
    
});


router.get(("/listAllItems") , function(req,res){
    let header = listItemMessage();

    res.send( header + generateList(db));

});


router.get(("/deleteItem/:id") , function(req,res){
    let id = parseInt(req.params.id);
    let index = db.indexOf(id);
    let flag = false;
    let msg = "";

    
    for (let i=0 ; i < db.length && !flag; i++){

        if(db[i].id === id){
            db.splice(i,1);
            flag = true;
        }

    }

    if(flag == true){
        msg = "You have deleted the item with the ID = " + id;
    }

    else{
        msg = "Item not found!"
    }

    res.send(msg)
    
});


router.get(("/totalValue") , function(req,res){
    
    let total = 0;
    let msg;

    for( let i = 0 ; i < db.length ; i++){


        total +=  ((db[i].qty) * (db[i].price)) ;

    }    

    msg = "The total value is = " + total;
    res.send(msg);
    
});


function generateList(array){
    
    let string = "";

    for( let i = 0 ; i < db.length ; i++){

        string += "&nbsp; &nbsp; " + (i) + "&nbsp; &nbsp; &nbsp;" +  db[i].id + "&nbsp; &nbsp; " +  db[i].name + "&nbsp; &nbsp; &nbsp;" + db[i].qty + "&nbsp; &nbsp;&nbsp;" + db[i].price + "&nbsp; &nbsp;&nbsp;" + db[i].price*db[i].qty + "<br>";

    }

    return string;
}


function getID (){

    let id;
    id = Math.round(Math.random() * 1000);
    return id;
}

function retrunResult (id , name , qty , price){
    let result = "";
    result = "<center> <h1> Item Added! <h1> <br> <table> <tr> <th> ID </th> <th> Name </th><th> Qty </th><th> Price </th></tr> <tr> <td>" + id + " </td> <td> " + name + " </td> <td>" + qty + "</td> <td> " + price + "</td>  </tr> </table> </center>"
    return result;
}

function listItemMessage(){
    let tableHeader = "";

    tableHeader = "<table> <th> Index </th> <th> ID </th> <th> Name </th> <th> Qty </th> <th> Price </th> <th> Cost </th> </table> <br>"

    return tableHeader;
}


module.exports = router;