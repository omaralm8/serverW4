let mongoose = require("mongoose");

let taskSchema = mongoose.Schema({
    name: String,
    assign:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Developers'
    },
    due: Date,
    status:{
        type: String,
        validate:{
            validator:function (statusValue){
                return statusValue == 'InProgress' || statusValue == 'Completed';1
            },
            message: 'Status should be either InProgress or Completed'
        }

    },
    desc: String
    

});


let TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;