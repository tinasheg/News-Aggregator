const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const request = require("request");
const cheerio = require("cheerio");


const db = require("./models");
const PORT = process.env.PORT || 3000;

const app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
const results = [];



app.get("/", function (req, res) {
    res.render("index");
});

app.get("/scrape", function (req, res) {
    const found;
    const titleArr = [];
    db.Article.find({})
        .then(function (dbArticle) {
            for (const j = 0; j < dbArticle.length; j++) {
                titleArr.push(dbArticle[j].title)
            }
            console.log(titleArr);
            request("https://www.who.int/emergencies/diseases/novel-coronavirus-2019/media-resources/news", function (error, response, html) {
                if (!error && response.statusCode == 200) {
                }
                const $ = cheerio.load(html, {
                    xml: {
                        normalizeWhitespace: true,
                    }
                })
                $("body div.list-view--item").each(function (i, element) {
                    const result = {};
                    result.title = $(element).children("aria-label").text();
                    found = titleArr.includes(result.title);
                    result.link = $(element).children("a").attr("href");
                    result.excerpt = $(element).parent().children(".sub-title").text().trim();
                    if (!found && result.title && result.link) {
                        results.push(result);
                    }
                });
                res.render("scrape", {
                    articles: results
                });
            })
        });
});

app.get("/saved", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.render("saved", {
                saved: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/api/saved", function (req, res) {
    db.Article.create(req.body)
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    console.log(req.params.id);
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            console.log(dbArticle);
            if (dbArticle) {
                res.render("articles", {
                    data: dbArticle
                });
            }
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/saved/:id", function (req, res) {
    db.Article.deleteOne({ _id: req.params.id })
        .then(function (removed) {
            res.json(removed);
        }).catch(function (err, removed) {
            res.json(err);
        });
});

app.delete("/articles/:id", function (req, res) {
    db.Note.deleteOne({ _id: req.params.id })
        .then(function (removed) {
            res.json(removed);
        }).catch(function (err, removed) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
                .then(function (dbArticle) {
                    console.log(dbArticle);
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    res.json(err);
                });
        })
        .catch(function (err) {
            res.json(err);
        })
});

app.listen(PORT, function () {
    console.log(`"App running on port: ${PORT}`);
});