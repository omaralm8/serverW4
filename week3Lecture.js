let express = require('express');
let app = express();
var output = 0;

app.get("/math/:operator/:operand1/:operand2",function(req,res) {

 console.log(req.params.operator);
 let o1 = parseInt(req.params.operand1);
 let o2 = parseInt(req.params.operand2);

if(req.params.operator === 'add'){
    output = o1  + o2 ;
	res.send("Output: " + output );  
}

else if(req.params.operator == 'sub'){
    output = o1  - o2 ;
	res.send("Output: " + output );
}
else{	
	res.send("Unknown Operation");  
}
 

});

app.listen(8080); 
