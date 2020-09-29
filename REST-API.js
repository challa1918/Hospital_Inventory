
   var express = require("express");
   var app = express();
   var port = 3000;
   var path=require("path")
   var mongoose = require("mongoose");
   var Hospitals=require("./schema/Hospitals");
   var Ventilator = require("./schema/ventilator");
   mongoose.Promise = global.Promise;
   mongoose.connect("mongodb://localhost:27017/Hospital_Management",{useUnifiedTopology:true,useNewUrlParser:true});
   var bodyParser = require('body-parser');

   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));

   app.set('views', path.join(__dirname, 'views'));
   app.set("view engine", "ejs");
      

   app.get("/", (req, res) => {
   res.sendFile(__dirname + "/html/index.html");   
   });

   app.use("/result", (req, res) => {
      res.sendFile(__dirname + "/html/Taskdone.html");
      });

   app.use("/addvent",(err, res)=>{
      res.sendFile(__dirname + "/html/AddVentilator.html");
   });

   app.use("/addhosp",(err, res)=>{
      res.sendFile(__dirname + "/html/AddHospital.html");
   });
   
   app.use("/searchhosp",(err, res)=>{
      res.sendFile(__dirname + "/html/SearchHospital.html");
   });

   app.use("/searchvent",(err, res)=>{
      res.sendFile(__dirname + "/html/SearchVent.html");
   });

   app.use("/searchventhosp",(err, res)=>{
      res.sendFile(__dirname + "/html/SearchVentHosp.html");
   });
   app.use("/updatevent",(err, res)=>{
      res.sendFile(__dirname + "/html/UpdateVent.html");
   });

   app.use("/deletevent",(err, res)=>{
      res.sendFile(__dirname + "/html/DeleteVent.html");
   });

   app.post("/insertvent", (req, res) => {
      
     
    var myData = new Ventilator(req.body);
    myData.save()
    .then(item => {
      Hospitals.updateOne({HID: req.body.HID},{$inc:{Number_Of_Ventilators:1}},(req, res)=>{
         console.log("Ventilator added!!");
      });
      res.redirect('/result');
   
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

   });

   app.post("/inserthosp", (req, res) => {   
      var myData = new Hospitals(req.body);
      myData.save()
      .then(item => {
         console.log("Hospital added!!");
      res.redirect('/result');
      })
      .catch(err => {
      res.status(400).send("unable to save to database "+err);
      });
  
     });
  
   app.get("/getvent", function (req, res) {   
        console.log("Getting Ventialotor Details!")
      Ventilator.find({},(err,results)=>{
         if (err) return console.log(err)
         res.render("disvent", { details: results })
      });
     
      });

   app.get("/gethosp", function (req, res) {   
         console.log("Getting hospital details")
       Hospitals.find({},(err,results)=>{
          if (err) return console.log(err)
          res.render("dishos", { details: results })
       });
      
       });

   app.use("/searchventvid",(req, res)=>{
         console.log("Search ventilators by status");
            Ventilator.find({STATUS:req.body.status},(err, results)=>{
                  if (err) return console.log(err)
                  console.log(results);
                  res.render("disventsearch", { details: results })

            });
      });

   app.use("/searchventhospname",(req, res)=>{
         console.log("Search ventilators by Hospital name");
            Ventilator.find({HOSPITAL:new RegExp(req.body.hname,'i')},(err, results)=>{
                  if (err) return console.log(err)
                  console.log(results);
                  res.render("disventsearch", { details: results })

            });
      });
       
   app.use("/searchhospname",(req, res)=>{
         console.log("Search hospital using name "+req.body.hospname);
         Hospitals.find({Name:new RegExp( req.body.hospname ,'i')},(err, results)=>{
               if (err) return console.log(err)
               console.log(results);
               console.log(results.length);
               res.render("searchhosp", { details: results })

         });
   });
    
   app.use("/updateventact",(req, res)=>{
      console.log("Updating Ventilator details");
      Ventilator.updateOne({HID: req.body.HID,VID: req.body.VID},req.body,(err, results)=>{
         if (err) return console.log(err);
         res.redirect('/result');
      })
});


app.use("/deleteventact",(req, res)=>{
   console.log(" Deleting Ventilator !!");
   Ventilator.deleteOne({HID: req.body.HID,VID: req.body.VID},(err, results)=>{
      if (err) return console.log(err)
      res.redirect('/result');
   })
   Hospitals.updateOne({HID: req.body.HID},{$inc:{Number_Of_Ventilators:-1}},(req, res)=>{
      
   });
});


   app.listen(port, () => {
    console.log("Server listening on port " + port);
   });