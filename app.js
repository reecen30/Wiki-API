//jshint esversion:6

// Setup npm modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

// Setup ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connect mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  userNewUrlParser: true
});

// Setup schema and collection
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// // GET all articles
// app.get("/articles", function(req, res){
//   Article.find(function(err, foundArticles){
//     if(!err){
//       console.log(foundArticles);
//
//       res.send(foundArticles);
//     }else{
//       res.send(err);
//     }
//   });
// });
//
// // POST a New Article
// app.post("/articles", function(req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//
//   newArticle.save(function(err){
//     if(!err){
//       res.send("Successfully added a new article.");
//     } else{
//       res.send(err);
//     }
//   });
// });
//
// // DELETE All Articles
// app.delete("/articles", function(req, res){
//   Article.deleteMany(function(err){
//     if(!err){
//       res.send("Successfully deleted all articles.");
//     }else{
//       res.send(err);
//     }
//   });
// });

// Express Route
app.route("/articles").get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      console.log(foundArticles);

      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
}).post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
}).delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found");
      }
    })
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.")
        }
      });
  })

  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Successfully deleted article.");
      } else {
        res.send(err);
      }
    })
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
