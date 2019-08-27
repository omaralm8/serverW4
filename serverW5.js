let express = require('express');
let app = express();
let ejs = require('ejs');
let bodyParser = require('body-parser');
let db = [];
let viewPath = __dirname + '/views';

app.use(express.static('public/images'));
app.use(express.static('public/css'));

app.engine("html" , require('ejs').renderFile);
app.use(bodyParser.urlencoded({
    extended: false
}));




app.get("/" , function (req , res){
    let fileName = viewPath + '/index.html';
    res.sendFile(fileName);


});

app.get("/addTask" , function (req , res){
    let fileName = viewPath + '/addTask.html';
    res.sendFile(fileName);




});

app.get("/listTasks" , function (req , res){
    let fileName = viewPath + '/listTask.html';
    res.render(fileName , {
        db : db
    });



});

app.post("/addNewTask" , function(req,res){
    db.push(req.body);
    res.redirect("/listTasks")
});

app.listen(8080);





