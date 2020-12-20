var express     = require("express");
    app         = express();
    bodyParser  = require("body-parser");
    mongoose    = require("mongoose");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true  } );
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description:String
});
 var Campground = mongoose.model("Campground", campgroundSchema);

//  Campground.create(
//     {
//         name: "Salmon Creek", 
//         image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//         description: "This is a huge granite hill. Beautiful Place!!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly added campground:");
//             console.log(campground);
//         }
//     });


    
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
       Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index",{campgrounds:allcampgrounds});
        }
       });
    
});

// CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image,description: desc}
    // create a new campground and save to DB
    Campground.create(newCampground, function(err , newlyCreated){
        if(err){
            console.log(err);
        } else{
           //redirect back to campgrounds page
           res.redirect("/campgrounds");
        }
    });
   
});
 //NWE - Short form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});

//SHOW - shows more info about one campgrounds
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
   
 });


app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});