const http = require("http")
const fs = require("fs");
const {parse} = require('querystring');

let fileName="";
http.createServer(function(req ,res){


    if(req.url === "/login" && req.method === "POST"){
            
        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });
    
        req.on('end', () => {
            let data = parse(body);
            let username= data.username;
            let password= data.password;
            
            if(username === 'admin' && password === 'pass'){
                console.log("The password is correct");
                fileName="";
                // sendFile(res,"mainpage.html");
             }
             else {
                 fileName="";
                 console.log("The password is wrong");
             }
             sendFile(res,"accessdenied.html");

        });
    }

    else{
        fileName="./index.html";
        sendFile(res,fileName);
        fs.readFile('index.html' , function (error,content){
            res.writeHead(200,{
                'Content-Type': 'text/html'
            });
            res.end(content , "utf-8");
        });
    }

    
}).listen(8080);

function sendFile(res, fileName){
    console.log(fileName)

    fs.readFile(fileName , function (error,content){
        
        res.writeHead(200,{
            'Content-Type': 'text/html'
        });
        res.end(content , "utf-8");
    })
}










