const mongoose = require('mongoose');
const mongoPath = "mongodb+srv://andreiB:336529Ab.@cluster0.2nx6d.mongodb.net/betaSuperServer?retryWrites=true&w=majority"

module.exports ={
    init: () =>{
        mongoose.connect(mongoPath,{useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS:10000, family:4, poolSize:5});
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', ()=>{
            console.log("the bot is connected to the database");
        });
        
        mongoose.connection.on('disconnected', ()=>{
            console.log("the bot is disconnected to the database");
        });
        
        mongoose.connection.on('err', ()=>{
            console.log("error database", + err);
        });
          
    }
    
}
