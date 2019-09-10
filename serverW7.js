let express = require('express');
let app = express();
let ejs = require('ejs');
let bodyParser = require('body-parser');
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let viewPath = __dirname + '/views';
let mongoose = require("mongoose");
let id= "";
let flag = false;
let ObjectId = require('mongodb').ObjectID;


app.use(express.static('public/images'));
app.use(express.static('public/css'));

const url = 'mongodb://localhost:27017/Week7';
let Developers= require('./models/Developers.js');
let Task= require('./models/Task.js');

mongoose.connect(url,function(err){

    if(err){
        throw err;
    }
    else{
        console.log('Connected');
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

app.get("/addDev" , function (req , res){
    let fileName = viewPath + '/addDev.html';
    res.sendFile(fileName);
});

app.get("/getDev" , function (req , res){
    let fileName = viewPath + '/getDev.html';
    Developers.find({}).exec(function(err,result){
        res.render(fileName , {
            db : result
            
        });

        if(flag ==true){
            id = result[0]._id;
        }
    })

});

app.get("/listTasks" , function (req , res){
    let fileName = viewPath + '/listTask.html';
    Task.find({}).exec(function(err,result){
        res.render(fileName , {
            db : result
        });
    })
});


app.get("/deleteTaskID" , function (req , res){
    let fileName = viewPath + '/deleteTaskID.html';
    res.sendFile(fileName);
});

app.get("/updateStatus" , function (req , res){
    let fileName = viewPath + '/updateStatus.html';
    res.sendFile(fileName);
});

app.get("/deleteCompleted" , function (req , res){
    let fileName = viewPath + '/deleteCompleted.html';
    res.sendFile(fileName);
});



app.post('/addNewDev', function(req,res){
    let developers = Developers({
        firstname: req.body.fname,
        lastname: req.body.lname,
        level: req.body.level,
        state: req.body.state,
        suburb: req.body.suburb,
        street: req.body.street,
        unit: req.body.unit
     })
 
    flag = true;
     developers.save(function(err){
 
         if(err){
             throw err;
         }
         else{
            res.redirect("/getDev");
         }
     })


});

app.post('/addNewTask', function(req,res){
    let task = Task({
       name: req.body.name,
       assign: mongoose.Types.ObjectId(id),
       due: new Date(req.body.due),
       status: req.body.status,
       desc: req.body.desc
    })

    task.save(function(err){

        if(err){
            throw err;
        }
        else{
            res.redirect("/listTasks");
        }
    })

});

app.post("/deleteTaskID" , function(req,res){
    let id = ObjectId(req.body.id)
    let query = { _id: id};
    Task.deleteOne(query, function (err,obj){
        res.redirect("/listTasks");
    });

});

app.post("/deleteCompleted" , function(req,res){
    let query = { status: "Completed"};
    Task.deleteMany(query, function (err,obj){
        res.redirect("/listTasks");
    });
});

app.post("/updateStatus" , function(req,res){
    let id = ObjectId(req.body.id);
    let status = req.body.newStatus;
    let query = { _id: id};

        Task.updateOne(query,{$set: {status: status}} ,function (err,obj){
           res.redirect("/listTasks");
        });
});


app.listen(8080);



