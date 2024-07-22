const express=require("express");
const itemRoutes=require("./router");
const fakeDb=require("./fakeDb");
const {Express404Error, MissingDataError}=require("./customErrors")
const morgan=require("morgan");
const app=express();

app.use(express.json());
app.use("/items", itemRoutes);
app.use(morgan("dev"));



// 404 error handling if all routes are missed
app.use((req,res,next)=>{
    const e=new MissingDataError("Page Not Found", 404)
    next(e)
})
//global err handling
app.use(function(err,req,res,next){
    let status=err.status || 500;
    let message=err.message
    return res.status(status).json({
        error:{message,status}
    })
})

app.listen(3000, function(){
    console.log("app running in port 3000!");
    console.log("Here are your shopping items", fakeDb)
})