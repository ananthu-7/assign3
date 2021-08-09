const express=require('express');
const loginData=require('./src/model/logindata');
const bookData=require("./src/model/bookdata");
const authorsdata=require('./src/model/authorsdata');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const Bookdata=require('./src/model/bookdata');
const path = require("path");  
  

 var bodyparser=require('body-parser');
//const Bookdata = require('./src/model/bookdata');

const multer=require('multer');
var app=new express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.json());
app.use(express.urlencoded());

function verifyToken(req,res,next){
if(!req.headers.authorization){
    return res.status(401).send('Unauthorised Request!')
}
let token=req.headers.authorization('')[1]
if(token=='null'){
    return res.status(401).send('Unauthorised Request!')
}
let payload=jwt.verify(token,'secretkey')
if(!payload){
    return res.status(401).send('Unauthorised Request!')
    
}
req.userId=payload.subject
    next() 
}
var storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./public/images')
    },
    filename:function(req,file,cb){
      cb(null,file.originalname)
    }
})
var storage2=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/authors')
    },
    filename:function(req,file,cb){
     cb(null,file.originalname)
    }
})
app.get('/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    loginData.find().then((books)=>{
        res.send(books)
    })
})
app.get('/books',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    bookData.find().then((books)=>{
        res.send(books)
    })
})
app.post('/addbooks',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    console.log(req.body);
    // var book={
    //     title:req.body.book.title,
    //     author:req.body.book.author,
    //     genre:req.body.book.genre,
    //     img:req.body.book.img
    // }
    var upload=multer({storage: storage}).single('img');
    upload(req,res,(err)=>{

            if(err){
              console.log(err);
             }
             else{

                 console.log(req.file);
             
                if(req.file){ 
                    var item={
                     title:req.body.title,
                     author:req.body.author,
                     genre:req.body.genre,
                     img:req.file.filename
                 }
                 console.log(item);
                 var book=new Bookdata(item);
                book.save();
                }
                else{
                    var item={
                        title:req.body.title,
                        author:req.body.author,
                        genre:req.body.genre
                    }
                    console.log(item);
                    var book=new Bookdata(item);
                   book.save();   
                }
                }
            })

})
app.post('/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    let user=req.body;
    loginData.findOne({$and:[{email:user.email},{password:user.password}]}).then((user)=>{
    
        if(user){
            console.log(user)
            let payload={subject:user.email+user.password}
            
             let token=jwt.sign(payload,'secrettkey')
            console.log(token);
            res.status(200).send({user:"user"});
        }
        else{
            
            res.status(401).send('Error');
        }
        
        })
    console.log(user);
    let email="admin@gmail.com";
    let password="Admin12345";
     
      if(user.password==password && user.email==email){
        let payload={subject:user.email+user.password}
         
         let token=jwt.sign(payload,'secrettkey')
         res.status(200).send({token:token,user:"admin"})   
       }
     
        
       
     
    }) 

 app.post('/signup',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    user={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        
    }  
    userdata=loginData(user);
    userdata.save();
    res.status(200).send();  
 })
 app.get('/authors',(req,res)=>{
     
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    
    authorsdata.find().then((authors)=>{
        //console.log(authors);
        res.send(authors);
    })
 })
 app.post('/addauthors',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,DELETE,PATCH,OPTIONS");
    console.log(req.body);
    var upload=multer({storage: storage2}).single('img');
    
    upload(req,res,(err)=>{

        if(err){
            console.log(err);
        }
        else{
            if(req.file){
              var item= {
                   title:req.body.title,
                   tag:req.body.tag,
                   txt:req.body.txt,
                   img:req.file.filename
              }
              console.log(item);
                var author=authorsdata(item);
                author.save();
            }
            else{
                var item= {
                    title:req.body.title,
                    tag:req.body.tag,
                    txt:req.body.txt,
                    
               } 
               var author=authorsdata(item);
                author.save();
            }
        }
    })
 })
 app.get('/author/:id',(req,res)=>{
     id=req.params.id;
     
     authorsdata.findOne({_id:id}).then((author)=>{
         res.send(author);
     })
 })
 app.get('/books/:id',(req,res)=>{
     id=req.params.id;
     bookData.findOne({_id:id}).then((book)=>{
         res.send(book);
     })
 })
 app.get('/book/delete/:id',(req,res)=>{
     id=req.params.id;
     bookData.findOneAndDelete({"_id":id}).then((book)=>{
         res.send();
     })
 })
 app.post('/editbook/:id',(req,res)=>{
     id=req.params.id;
     console.log(req.body);
    var upload=multer({storage: storage}).single('img');
    upload(req,res,(err)=>{
    if(err){
        console.log(err);
        
    }
    else{
        if(req.file){
            var item={
                                 title:req.body.title,
                                 author:req.body.author,
                                 genre:req.body.genre,
                                 img:req.file.filename
                             }
        }
        else {
            var item={
                title:req.body.title,
                author:req.body.author,
                genre:req.body.genre
            }
        }
    }
        bookData.updateOne({_id:id},{$set:item},function(err,result){
            if(err){
                 console.log(err);
             }
              else{
                  res.send()
              }
            

 })
    })
})
app.post('/editauthor/:id',(req,res)=>{
    id=req.params.id;
    console.log(req.body);
   var upload=multer({storage: storage2}).single('img');
   upload(req,res,(err)=>{
   if(err){
       console.log(err);
       
   }
   else{
       if(req.file){
           var item={
                                title:req.body.title,
                                tag:req.body.tag,
                                txt:req.body.txt,
                                img:req.file.filename
                            }
       }
       else {
           var item={
               title:req.body.title,
               tag:req.body.tag,
               txt:req.body.txt,
               
           }
       }
   }
      authorsdata.updateOne({_id:id},{$set:item},function(err,result){
           if(err){
                console.log(err);
            }
             else{
                 res.send()
             }
           

})
   })
})
app.get('/author/delete/:id',(req,res)=>{
    id=req.params.id;
    authorsdata.findOneAndDelete({'_id':id}).then((data)=>{
        res.send();
    })
})
app.listen(3000, function(){
    console.log('listening to port 3000');
});
