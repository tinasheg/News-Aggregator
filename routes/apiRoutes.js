const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
    app.get("/api/scrape", function (req, res) {
        axios.get("https://www.npr.org/").then(function (response) {
            const $ = cheerio.load(response.data);
            const result = {};
            $(".story-text").each(function (i, element) {
                result.title = $(this).find(".title").text();
                result.link = $(this).find(".title").parent().attr("href");
                result.summary = $(this).find(".teaser").text();
                db.Article.remove({}, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.end('success')
                    }
                });
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
        });

    });

    app.get("/api/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/articles", function (req, res) {
        db.Article.remove({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/saved", function (req, res) {
        db.Save.remove({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/notes", function (req, res) {
        db.Note.remove({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/api/saved", function (req, res) {
        db.Save.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/api/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .then(function (dbArticle) {
                res.json(dbArticle);

            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/api/saved/:id", function (req, res) {
        db.Save.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);

            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/articles/:id", function (req, res) {
        db.Article.remove({ _id: req.params.id })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/notes/:id", function (req, res) {
        db.Note.remove({ _id: req.params.id })
            .then(function (dbNote) {
                res.json(dbNote);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/saved/:id", function (req, res) {
        db.Save.remove({ _id: req.params.id })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });


    app.post("/api/saved", function (req, res) {
        console.log(req.body);

        const result = {};

        result.title = req.body.title;
        result.link = req.body.link;
        result.summary = req.body.summary;

        db.Save.create(result)
            .then(function (dbSaved) {
                console.log(dbSaved);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post("/api/notes/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Save.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

}