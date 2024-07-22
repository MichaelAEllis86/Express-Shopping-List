// this js file should probably just be called middleware.js! 
// it contains middleware except for function searchFakeDb() which is middleware like, but I didn't have additional time to refactor the code to include req,res,next + err handling
const fakeDb=require("./fakeDb");
const {Express404Error, MissingDataError}=require("./customErrors")


// middleware func serving as validation for json sent in req.body in our post route! 
// determines if any additional keys other than the relevant keys "name" and "price" are present in request body json data!
// if there is an invalid key we throw a custom data error we defined in custom errors
function isValidKey(req,res,next) {
    try{
        const allowedKeys = ['name', 'price'];
        for (let key in req.body) {
            if (!allowedKeys.includes(key)) {
                throw new MissingDataError(("Bad Request! Invalid JSON data present! Please include json in the request body in the following format including name and price! ---> {'name': 'juice', 'price':8.00 }",400))  // Found an unwanted key
            }
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();
    }
    catch(err){
        return next(err)
    }
    
}

// middleware func serving as validation for json sent in req.body in our post route! 
// Detects if information is missing! namely info with the keys of name and price which conforms to FakeDb.
// if there is an invalid key we throw a custom data error we defined in custom errors

function isValidRequestBody(req,res,next){
    try{
        if(!req.body.name || !req.body.price){
            throw new MissingDataError("Bad Request! Missing JSON data! Please include json in the request body in the following format including name and price! ---> {'name': 'juice', 'price':8.00 }",400)
        }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
        next();
    }
    catch(err){
        return next(err)
    }
}

// fetchItem searches fakeDb for a matching entry based on the url parameter string. If it finds a match in the db it we respond with the object in json and send to user
//  if no match it found throw custom 404.
function fetchItem(req,res,next){
    try{
        let foundItem;
        for(let obj of fakeDb){
            if(obj.name===req.params.name){
                console.log(`match found for urlParam ${req.params.name} at obj---->`, obj)
                foundItem=obj  
            }       
        }
        if(!foundItem){
            throw new Express404Error("Shopping item was not found",404)
        }
        return res.json(foundItem)
    }
    catch(err){
        return next(err)
    } 
    
}

// similar to fetchItem. Rather than responding in json, returns the found object instead. Vigorously console logs.
function fetchAndReturnItem(urlParam,fakeDb){
    let foundItem;
    console.log("init value of foundItem" ,foundItem)
    console.log("logging the urlParam", urlParam);
    console.log("this is fake db inside fetchAndReturnItem", fakeDb);
    for(let obj of fakeDb){
        console.log("logging the current array index",obj)
        console.log("logging array[idx].name",obj.name)
        if (obj.name===urlParam){
            console.log(`match found for urlParam ${urlParam} at obj`, obj)
            foundItem=obj
            return foundItem
        }
    }
}

// Fetches an item based on url param string, determines it's index within the fakeDb array, then deletes it via array.splice(). If item's index is not found, throw 404. Otherwise responds in json with the deleted item.
function deleteItem(req,res,next){
    try{
        const urlParam=req.params.name;
        console.log("logging the urlParam", urlParam);
        let targetItem=fetchAndReturnItem(urlParam,fakeDb)
        let targetIdx=fakeDb.indexOf(targetItem)
        console.log("this is targetIdx",targetIdx)
        if(targetIdx===-1){
            throw new Express404Error("The Shopping item targeted for deletion was not found",404)
        }
        fakeDb.splice(targetIdx,1)
        console.log("this is fakeDb after a deletion", fakeDb)
        return res.json({deleted:targetItem})

    }
    catch(err){
        return next(err)
    }
        
}

function modifyItem(req,res,next){
    try{
        const urlParam=req.params.name;
        console.log("logging the urlParam", urlParam);
        let targetItem=fetchAndReturnItem(urlParam,fakeDb)
        let targetIdx=fakeDb.indexOf(targetItem)
        console.log("this is targetIdx",targetIdx)
        if(targetIdx===-1){
            throw new Express404Error("The Shopping item targeted for patch modification was not found",404)
        }
        fakeDb.splice(targetIdx,1,req.body)
        console.log("this is fakeDb after a patch", fakeDb)
        return res.json({updated:fakeDb[targetIdx]})

    }
    catch(err){
        return next(err)
    }
        
}

module.exports={isValidKey:isValidKey,
                fetchAndReturnItem:fetchAndReturnItem,
                isValidRequestBody:isValidRequestBody,
                fetchItem:fetchItem,
                deleteItem:deleteItem,
                modifyItem:modifyItem}