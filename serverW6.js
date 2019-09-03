let express = require('express');
let app = express();
let ejs = require('ejs');
let bodyParser = require('body-parser');
let mongodb = require('mongodb');
let ObjectId = require('mongodb').ObjectID;
let mongoClient = mongodb.MongoClient;
let db = null;
let col = null;
let viewPath = __dirname + '/views';

app.use(express.static('public/images'));
app.use(express.static('public/css'));

const url = 'mongodb://localhost:27017/';

mongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('CustomerDB');
        db.createCollection('Customer');
        col = db.collection('Customer');
    }
});

app.engine("html" , ejs.renderFile);

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
    col.find({}).toArray((err,result) => {
        res.render(fileName , {
            db : result
        });
    })
});

app.post("/addNewTask" , function(req,res){
    col.insertOne(req.body);
    res.redirect("/listTasks");
});

app.get("/deleteCustID/:id" , function(req,res){
    let id = ObjectId(req.params.id)
    let query = { _id: id};
    col.deleteOne(query, function (err,obj){
        res.redirect("/listTasks");
    });
});

app.get("/deleteCompleted" , function(req,res){
    let query = { status: "Completed"};
    col.deleteMany(query, function (err,obj){
        res.redirect("/listTasks");
    });
});

app.get("/updateStatus/:id/:newStatus" , function(req,res){
    let id = ObjectId(req.params.id);
    let status = req.params.newStatus;
    let query = { _id: id};

    if( status.toLowerCase() == "inprogress" || status.toLowerCase() == "completed"){
        col.updateOne(query,{$set: {status: status}},{upsert: false}  ,function (err,obj){
           res.redirect("/listTasks");
        });
    }
    else{
        res.redirect("/listTasks");
    }
});



app.listen(8080);






