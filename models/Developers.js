let mongoose = require("mongoose");

let developersSchema = mongoose.Schema({
   
    name: String,
    firstname: {
        type: String,
        required: true
    },
    lastname: String,
    level:{
        type: String,
        require: true,
        validate:{
            validator: function(value){
                return value == "BEGINNER" || value == "EXPERT";
            },
            message: "Not valid"
        }
    },
    state: String,
    suburb: String,
    street: String,
    unit: String,
    address:String
    

});

developersSchema.pre('save' , function(){

    this.name= this.firstname +" "+ this.lastname;
    this.address = this.state +" "+ this.suburb +" "+ this.street +" "+ this.unit
    this.level = (this.level).toUpperCase();
});


let DevelopersModel = mongoose.model('Developers', developersSchema);
module.exports = DevelopersModel;