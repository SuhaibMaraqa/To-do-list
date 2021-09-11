const express = require("express");
const bodyParser = require('body-parser')
const date = require(__dirname + "/date.js")

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

let items=[];
let workItems=[];


app.get("/", (req, res) => {    
     let day = date.getDate();
     res.render("list", {listTitle: day, newItems: items});

})

app.get("/work", (req, res) =>{
     res.render("list", {listTitle: "Work List", newItems: workItems})
})

app.post("/", (req, res) =>{
     let item = req.body.text;
     if(req.body.button === "Work"){
          workItems.push(item);
     res.redirect("/work");
     }
     else{
          items.push(item);
     res.redirect("/");
     }
});

app.listen(3000, () =>{
     console.log("Server started on port 3000.")
})

