var express =require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose");
    
    mongoose.Promise=require("bluebird");
    mongoose.connect("mongodb://127.0.0.1:27017/vtds");
    
    
    app.use(bodyParser.urlencoded({extended:true}));
    app.set("view engine","ejs");
    app.use(express.static(__dirname+"/public"));
    
//============================================== 

//MODEL


// USER MODEL CLIENT SIDE
var userSchema=mongoose.Schema({
    name:String,
    vehm:String,
    veh:String,
    vehn:String,
    vehl:String,
    date:String,
    cuid:String,
})

var user=mongoose.model("User", userSchema);

    //=============



// SERVER DATA MDOEL
var dataSchema=mongoose.Schema({
    rfid:String,
});

var data=mongoose.model("data", dataSchema);


//=========================================================


//FUNCTION LINE READER
 

 var fs = require('fs'), size = 256, bytes = 0, file;
  fs.open('datafile.txt', 'r', function(err,f){ file = f; readfromfile(); });

    function readfromfile() {
     var fileStats = fs.fstatSync(file);
         if(fileStats.size < bytes + 1) {
            setTimeout(readfromfile,3000);
         }
         else {
            fs.read(file, new Buffer(size), 0, size, bytes, capturefilecontents);
         }
    } 

    function capturefilecontents(err, bytecount, buff) {
      //console.log('Read', bytecount, 'bytes');
     
        var string=buff.toString('utf-8',0,bytecount);
        string.replace(/^\s+|\s+$|\r|\n/gm,'');

        console.log("String=>" + string);   

          data.create({rfid:string}, function(err, data){
            if(err){console.log("Err" + err);}
            else{console.log("Data =>" + data);}
            });
        bytes  += bytecount
        process.nextTick(readfromfile);
    }









//ROUTES
app.get("/", function(req, res){
    res.render("index");

});

app.post("/", function(req, res){
   console.log(req.body.veh);
    user.create(req.body.veh, function(err, user){
        if(err){
         console.log(err);
         }
        else{
            console.log("user details=>" + user);
            res.redirect("/user");
        }
    })

});

app.get("/user", function(req, res){
    user.find({}, function(err, founduser){
        if(err){
            console.log(err);
        }else{
            res.render("user", {user:founduser});
        }
    });
});

app.get("/user/:id", function(req, res){
    
    user.findById(req.params.id, function(err, profile){
        if(err){
            res.redirect("/user");
        }else{          
         res.render("profile",{profile:profile});
         }


    })
});

app.get("/find", function(req, res){
    res.render("pannel");
});

// app.get("/find/:id", function(req, res){
//     user.findById(req.params.id, function(err, profile){
//         if(err){
//             res.redirect("/user/:id");
//         }else{
//             res.render("pannel", {userdata: profile});
//         }
//     })
// })

app.post("/find", function(req, res){
    var cuid=req.body.cuid;
    console.log("data entered in find method =>" + cuid);
    data.find({rfid :cuid}, function(err, data){
        if(err){
            console.log("user not found")
        // }else if (cuid==data){
        //         console.log("Vehcle found " + data);
        //          res.send("Vehicle FOund");
        //      }else{
        //         console.log("Vehicle not found");
            }
            else {console.log("vehicle found => "  + data);}
        
    });
});





//==============================================
app.listen(3000, 3001, function(){
    console.log("Server Started on 3000..");
})