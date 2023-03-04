//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const encrypt=require("mongoose-encryption");
const mongoose=require("mongoose");
const ejs=require("ejs");
const { text } = require('body-parser');
const { config } = require('dotenv');
const app=express();
const router=express.Router();
app.use(express.json());
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://sohan2002biswas:Deep1234@cluster0.5jyx4ue.mongodb.net/mydb");
mongoose.set('strictQuery',true);
const dataSchema=new mongoose.Schema(
{
    id:Number,
    full_name:String,
    email:String,
    password:String,
    desg:String,
    lp:Number
}
);
var i=0;
let Email=' ';
const secret="this is secret";
dataSchema.plugin(encrypt,{secret: secret,encryptedFields:['password']});

data=new mongoose.model("data",dataSchema);
app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/login",function(req,res)
{
    res.render("login");
})
app.get("/register",function(req,res)
{
   res.render("register");
})
app.get("/Admin",function(req,res)
{
    data.findOne({email:Email},function(err,response)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            let con=response.id;
            console.log(con);
            abcd(con);
        }
    })
    function abcd(y)
    {
        let x=y-1;
    data.find({},function(err,noofdata)
    {
        if(err)
        {
            console.log("some error occured");
        }
        else{

        res.render("Admin",{nooflist:noofdata,no:i,emaill:Email});
        }
    }).skip(x)
    }
}
)

app.post("/",function(req,res)
{
    let Full_name=req.body.text1;
    let Email1=req.body.text2;
    let Password=req.body.password;
    let option=req.body.name1;
    let loyalty_point=0;
    a=a+1;
    if(option=='s')
    {
        const app1=new data(
            {
                id:a,
                full_name:Full_name,
                email:Email1,
                password:Password,
                desg:'User',
                lp:loyalty_point
            }            
        )
        app1.save(function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect("/Admin");
            }
        })
    }
})
app.post("/register",function(req,res)
{
    let count1=0;
    let Desg='';
    data.find({}).count(function(err,response)
    {
        if(err)
        {
            console.log(err);
        }   
        else{
            function1(response);
        }
    })
    function function1(count2)
    {
        count1=count2;
        console.log(count1);
        if(count1==0)
        {
            Desg="Admin";
        }
        else{
            Desg="User";
        }
        let loyalty_point;
        let Full_name=req.body.first_name;
        console.log(Full_name);
        Email=req.body.mail;
        console.log(Email);
        let Password=req.body.password;
        console.log(Password);
        if(Desg=="Admin")
        {
             loyalty_point=100;
        }
        else{
            loyalty_point=0;
        }
        a=a+1;
        const app=new data(
            {
                id:a,
                full_name:Full_name,
                email:Email,
                password:Password,
                desg:Desg,
                lp:loyalty_point
            }
        );
        app.save(function(err)
        {
            if(err)
            {
                console.log("some error occured");
            }
            else
            {
                res.redirect("/Admin");
            }
        });
    }
    })
    
   
app.post("/login",function(req,res)
{
    Email=req.body.username;
    let Password=req.body.password;
    console.log(Email);
    console.log(Password);
    data.findOne({email:Email},function(err,details)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            if(details.password===Password)
            {
                res.redirect("/Admin");
            }
            else{
                console.log("wrong password");
            }
        }
    })
})
app.post("/send",function(req,res)
{
    let new_val=0;
    let new_val1=0;
    let reciever_id=req.body.send;
    console.log(reciever_id);
    let value=req.body.value1;
    console.log(value);
    console.log(Email);
    data.findOne({email:Email},function(err,data5)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            let n=data5.lp;
            console.log(n);
            function4(n);
        }
    })
    function function4(val1)
    {
         new_val1=val1-value;
         data.updateOne({email:Email},{lp: new_val1},function(err)
         {
            if(err)
            {

                console.log(err);
            }
            else{
                console.log("updated successfully");
            }
         })
    }
    data.findOne({_id:reciever_id},function(err,data2)
    {
        if(err)
        {
            console.log(err);
        }
        else{
                let m=data2.lp;
                console.log(m);
                function3(m);
            }
    })
    function function3(val)
    {
        new_val=parseInt(val)+parseInt(value);
        data.findByIdAndUpdate(reciever_id,{lp: new_val},function(err)
        {
           if(err)
           {
            console.log(err);
           }   
           else{
            console.log("updated successfully");
           }
      });
     }
   
    res.redirect("/admin");
    })
app.listen(process.env.PORT||3000,function()
{
    console.log("server is running on port 3000");
})
let a=0;