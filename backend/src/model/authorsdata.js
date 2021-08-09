const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.f46kl.mongodb.net/assignlib?retryWrites=true&w=majority');
const Schema=mongoose.Schema;
const AuthorSchema=new Schema({
    title:String,
    tag:String,
    txt:String,
    img:String
})
var Authorsdata=mongoose.model('authorsdata',AuthorSchema);
module.exports=Authorsdata;