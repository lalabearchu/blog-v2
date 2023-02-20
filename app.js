//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// Connect to database
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://lalabearchu:test123@cluster0.g3iw9uc.mongodb.net/blogDB");


// Create blog post schema
const blogPostSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String
});

// Create blog post model 
const blogPost = mongoose.model("blogPost", blogPostSchema);

// let posts = [];

app.get("/", (req, res) => {
  // show the posts from the database
  blogPost.find({}, (err, posts) => {
    if (!err) {
      res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

// Save the post into database, redirect to root route
app.post("/compose", (req, res) => {
  
  // Create new document
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;
  const newPost = new blogPost ({
    postTitle: postTitle,
    postBody: postBody
  });
  // Save it into collection
  newPost.save((err) => {
    if (!err) {
      // If no error, redirect to root route
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", (req, res) => {
  
  const requestedPostId = req.params.postId;

  // Find the post in the database, not using blogPost.find() because it returns an array
  blogPost.findOne({_id: requestedPostId}, (err, post) => {
    if (!err) {
      res.render("post", {postTitle: post.postTitle, postBody: post.postBody})
    }
  })


  // posts.forEach(function(post) {

  //   const storedTitle = post.postTitle.replace(" ", "-").toLowerCase();

  //   if (requestedTitle === storedTitle) {
  //     res.render("post", {postTitle: post.postTitle, postBody: post.postBody})
  //   }

  // });

});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
