var app=require("express")();
var mongoose=require("mongoose");
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/vtds");
 
var dataSchema=mongoose.Schema({
	rfid:String,
});

var data=mongoose.model("data", dataSchema);

// var fs = require('fs');
// var readline = require('readline');
// var stream = require('stream');

// var instream = fs.createReadStream('./datafile.txt');
// var outstream = new stream;
// var rl = readline.createInterface(instream, outstream);



//routes


// app.get("/", function(req, res){
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

  console.log("find  method");
  //all user database
  // data.find({"rfid" : "fourth data"}, function(err, data){
  //   if(err){
  //     console.log("ERR " + err);
  //   }else{
  //     // res.render("index",{userdata:data});
  //     console.log("Data found" + data);
  //   }
  // });
//console.log(buff.toString('utf-8',0,bytecount));
  bytes  += bytecount
  process.nextTick(readfromfile);
}
//})

app.get("/find", function(req, res){
  data.find({"rfid" : "\r\n"+"fourth data"}, function(err, data){
    if(err){
      console.log("ERR " + err);
    }else{
      // res.render("index",{userdata:data});
      res.send("data found =>" + data);
      console.log("Data found" + data);
    }
  });
})
app.listen(5000, 5001, function(){
	console.log("sevrer started on 3000");
})