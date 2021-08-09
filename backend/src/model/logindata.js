const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.f46kl.mongodb.net/assignlib?retryWrites=true&w=majority');
const Schema=mongoose.Schema;
const loginSchema=new Schema({
    username:String,
    email:String,
    password:String
    });
var logindata=mongoose.model('loginData',loginSchema);    
module.exports=logindata;  