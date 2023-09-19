let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
 
  next();
});
var port = process.env.PORT || 2410
app.listen(port ,() => console.log(`Node app Listening on port ${port}!`))
let {customersData} = require("./customersData.js");
let fs = require("fs");
let fname = "customers.json"


app.get("/resetData", function(req,res)
{
    let data = JSON.stringify(customersData)
    fs.writeFile(fname, data, function(err){
        if(err) res.status(404).send(err)
        else  res.send("Data in the file is reset")
    })
})

app.get("/customers", function(req,res){
    fs.readFile(fname, "utf-8", function(err, data){
        if(err) res.status(404).send(err)
        else 
        {
            let customersArr = JSON.parse(data)
            res.send(customersArr)
        }
    })
})

app.post("/customers", function(req,res){
    let body = req.body;
    fs.readFile(fname, "utf-8", function(err,data)
    {
        if(err) res.status(404).send(err)
        else
        {
            let customersArr = JSON.parse(data);
            let newCustomer = {...body}
            customersArr.push(newCustomer);
            let data1 = JSON.stringify(customersArr)
            fs.writeFile(fname, data1, function(err)
            {
                if(err) res.status(404).send(err)
                else res.send(newCustomer)
            })
        }
    })
})


app.put("/customers/:id", function(req,res){
    let body = req.body;
    let id = req.params.id
    fs.readFile(fname, "utf-8", function(err,data)
    {
        if(err) res.status(404).send(err)
        else
        {
            let customersArr = JSON.parse(data);
            let index = customersArr.findIndex((c) => c.id === id)
            if(index >=0)
            {
                let updateCustomer = {id : id, ...body}
                customersArr[index] = updateCustomer;
                let data1 = JSON.stringify(customersArr)
                fs.writeFile(fname, data1, function(err)
                {
                    if(err) res.status(404).send(err);
                    else res.send(updateCustomer)
                })
            }
            else
            {
                res.status(404).send("No Customer found")
            }
        }
    })
})


app.delete("/customers/:id", function(req,res){
    let id = req.params.id
    fs.readFile(fname, "utf-8", function(err,data)
    {
        if(err) res.status(404).send(err)
        else
        {
            let customersArr = JSON.parse(data);
            let index = customersArr.findIndex((c) => c.id === id)
            if(index >=0)
            {
                let deleteCustomer = customersArr.splice(index,1)
                let data1 = JSON.stringify(customersArr)
                fs.writeFile(fname, data1, function(err)
                {
                    if(err) res.status(404).send(err);
                    else res.send(deleteCustomer)
                })
            }
            else
            {
                res.status(404).send("No student found")
            }
        }
    })
})