const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const _ = require("lodash");
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

const password = process.env.password;

mongoose.connect("mongodb+srv://admin-suhaib:WiN7RAwtZbt3cnr8@cluster0.uc2sr.mongodb.net/todolistDBB");

const itemSchema = new mongoose.Schema({
     name: String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
     name:"Welcome to your to-do list!"
   });
   
const item2 = new Item({
     name:"Hit the + button to add a new item."
   });
   
const item3 = new Item({
     name:"<-- Hit this to delete an item."
   });

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
     name: String,
     items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {    
     Item.find({}, (err, foundItems)=>{
          if(foundItems.length===0){
               Item.insertMany(defaultItems, (err)=>{
                    if(err)
                         console.log(err);
                    else
                         console.log("Successfully added default items.");
               })
               res.redirect("/");
          }
          else
               res.render("list", {listTitle: "Today", newItems: foundItems});
     });     
});

app.get("/:customListName", (req, res)=>{
     const customListName = _.capitalize(req.params.customListName);
     
     List.findOne({name: customListName}, (err, foundList)=>{
          if(!err){
               if(!foundList){
                    const list = new List({
                         name: customListName,
                         items:defaultItems
                    });
                    list.save();
                    res.redirect("/"+customListName);
               }
               else{
                    res.render("list", {listTitle: customListName, newItems: foundList.items});
               }
          }
     });
});

app.post("/", (req, res) =>{
     let itemName = req.body.text;
     let listName = req.body.button;
     const item = new Item({
          name: itemName
     });
     if (listName === "Today") {

          item.save((err, item)=>{
               if(err)
                    console.log(err);
               else
                    console.log(item.name + " saved successfully to the collection.");
          });

          res.redirect("/");
     } else {
          List.findOne({name: listName}, (err, foundList)=>{
               foundList.items.push(item);
               foundList.save((err, item)=>{
                    if(err)
                         console.log(err);
                    else
                         console.log(itemName + " has been successfully saved to the " + listName + " list.");
               });
               res.redirect("/"+listName);
          })
     }
     
});

app.post("/delete", (req, res)=>{
     let itemId = req.body.checkbox;
     let listName = req.body.listName;

     if (listName === "Today") {
          Item.findByIdAndRemove(itemId, (err)=>{
               if(err)
                    console.log(err);
               else {
                    console.log("Successfully deleted.");
                    res.redirect("/");          
               }
          });
     } else {
          List.findOneAndUpdate({name: listName}, { $pull: {items: {_id: itemId} } }, (err, foundList)=>{
               if(!err)
                    res.redirect("/" + listName);
          })

     }
     
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () =>{
     console.log("Server has started successfully.")
})

