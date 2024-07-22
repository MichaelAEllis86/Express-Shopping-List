const express=require("express");
const router=new express.Router();
const fakeDb=require("./fakeDb");
const morgan=require("morgan");
const {Express404Error, MissingDataError}=require("./customErrors")
const {isValidKey,isValidRequestBody,fetchItem,deleteItem,fetchAndReturnItem,modifyItem}=require("./helpers")
router.use(morgan("dev"));

// send a json response of the whole fake db array
router.get("/", function getAllItems(req,res,next){
    try{
        return res.json(fakeDb)
    }
    catch(err){
        return next(err)
    }
    
})

// POST to add new item to shopping list AKA fakeDb. Includes middleware validation to instruct the user of proper formatting/handle improper formats. 
// See helpers.js isValidRequestBody, isValidKey.
router.post("/",isValidRequestBody, isValidKey, function postNewItem(req,res,next){
    try{
        console.log("here is the request body",req.body)
        console.log("here is the request.body.name",req.body.name)
        console.log("here is the request.body.price",req.body.price)
        const newItem=req.body
        fakeDb.push(newItem)
        console.log("here is the new item pushed into our fakedb",fakeDb)
        return res.status(201).json({added:newItem})
    }
    catch(err){
        return next(err)
    }
    
})

// Version 3 GET /:name just did all the work in fetchItem middleware! Refactored this too much probably but it's one line which is fun! Fetches shopping item based on url parameter. 
// See helpers.js fetchitem()
router.get("/:name", fetchItem)

// route to delete an item specified via url parameter See helpers.js deleteItem()
router.delete("/:name", deleteItem)

// route to patch/modify an item. The target item is specified via url parameter. The modification data is sent via req.body. See helpers.js modifyItem()
router.patch("/:name",isValidRequestBody,isValidKey,modifyItem)

module.exports=router;

// <-------------------Retired routes after refactoring with middleware-------------------->

// keep this comment! Original GET route I made for /:name
// router.get("/:name", function fetchItem(req,res,next){
//     const urlParam=req.params.name;
//     let foundItem;
//     console.log("logging the urlParam", urlParam);
//     for(let obj of fakeDb){
//         console.log("logging the full array index",obj)
//         console.log("logging the array value for key of name",obj.name)
//         if (obj.name===urlParam){
//             console.log(`match found for urlParam ${urlParam} at obj`, obj)
//             foundItem=obj
//             return res.json(foundItem)

//         }
        
//     }

// })


// Version 2 GET /:name
// router.get("/:name", function fetchItem(req,res,next){
//     try{
//         //use url params to look up item to edit and it's location in the fakeDb array
//         const urlParam=req.params.name;
//         console.log("logging the urlParam", urlParam);
//         let foundItem=searchFakeDb(urlParam,fakeDb)
//         if(!foundItem){
//             throw new Express404Error("Shopping item was not found",404)
//         }
//         return res.json(foundItem)
        
//     }
//     catch(err){
//         return next(err)
//     }
    
// })







