var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
 var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title : "My Dog!",
// 	image : "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=612&q=80",
// 	body : "Yellow Labrador retriever biting yello tulip flower!",
// 	})

//RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
})

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err)
			console.log(err);
		else{
			res.render("index",{blogs : blogs});
		}
	});
});



app.get("/blogs/new", function(req, res){
	res.render("new");
})
//CREATE ROUTES

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog : foundBlog});
		}
	})
})
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err)
			res.redirect("/blogs");
		else{
			res.render("edit",{blog: foundBlog});
		}
	});
})
//UPDATE ROUTE
app.put("/blogs/:id",function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.updateOne({_id:req.params.id},req.body.blog, function(err, updatedBlog ){
		if(err)
			res.redirect("/blogs");
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
	// res.send("UPDATE ROUTE!");
})
//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	//DESTROY BLOG
	//REDIRECT
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
})

app.listen(process.env.PORT || 4000, process.env.IP, function(){
    console.log("Server is running!!");
});

