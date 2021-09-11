const express = require("express");
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

var items=[];

app.get("/", (req, res) => {
     var options = {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
     };
     var today = new Date();
     var day = today.toLocaleDateString("en-US", options);

     res.render("list", {today: day, newItems: items});
})

app.post("/", (req, res) => {
     item = req.body.text; 
     items.push(item);
     res.redirect("/");
})

app.listen(3000, () =>{
     console.log("Server started on port 3000.")
})
