const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@cluster0.f46kl.mongodb.net/assignlib?retryWrites=true&w=majority');
const Schema=mongoose.Schema;
const BookSchema= new Schema(
    {
        title:String,
        author:String,
        genre:String,
        img:String

    }
)
var Bookdata=mongoose.model('bookdata',BookSchema);
module.exports=Bookdata;