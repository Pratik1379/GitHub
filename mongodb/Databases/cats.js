var mongoose = require("mongoose");
 mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/cat_app", {useNewUrlParser: true, useUnifiedTopology: true, useMongoClient: true});

var catSchema = new mongoose.Schema( {
	name: String,
	age: Number,
	temperament: String
  });

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
// 	name: "Mrs. Norris",
// 	age: 7,
// 	temperament: "Evil"
// });
// george.save(function(err, cat){
// 	if(err)
// 		console.log("Something went wrong!")
// 	else{
// 		console.log("We just saved a cat to the DB: ");
// 		console.log(cat);
// 	}
// });

Cat.create({
	name: "Snow White",
	age: 17,
	temperament: "Bland"
}, function(err, cat){
	if(err)
		{
			console.log(err)
		}
	else{
		console.log(cat);
	}
});


Cat.find({}, function(err, cats){
		 if(err){
	console.log(err);
}
else{
	console.log("All the cats: ");
	console.log(cats);
}
		 });