$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('.fixed-action-btn').floatingActionButton();
    $("#scrapeResults").empty();
    initArticles();
});

const API = {
    getScrape: function () {
        return $.ajax({
            url: "api/scrape",
            type: "GET"
        });
    },
    init: function () {
        return $.ajax({
            url: "api/articles",
            type: "GET"
        });
    },
    getArticle: function (id) {
        return $.ajax({
            url: "api/articles/" + id,
            type: "GET"
        });
    },
    save: function (article) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/saved",
            data: JSON.stringify(article)
        });
    },
    deleteArticle: function (id) {
        return $.ajax({
            url: "api/articles/" + id,
            type: "DELETE"
        });
    },
    deleteAllScrapedArt: function () {
        return $.ajax({
            url: "api/articles/",
            type: "DELETE"
        });
    }
};

const initArticles = function () {
    $("#scrapeResults").empty();
    API.init().then(function (data) {
        if (data.length > 0) {
            const $arts = data.map(function (artic) {
                const $li = $("<li>");

                const saveButton = $("<button>").addClass("btn-small waves-effect waves-light blue right saveIt").attr("type", "submit").attr("name", "action").text("Save Article");
                const title = $("<div>").text(artic.title).addClass("collapsible-header");

                const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                const body = $("<div>").attr("data-id", artic._id).addClass("collapsible-body").append(span).append(saveButton);

                $li.append(title).append(body);

                return $li;
            });
            $("#scrapeResults").append($arts);
        }
        else {
            const $li = $("<li>");

            const title = $("<h5>").text("No More Articles. Get Scraping By Clicking The Button Above!").addClass("center-align");

            $li.append(title);
            $("#scrapeResults").append($li);
        }
    });

};

const newScrape = function () {
    $("#scrapeResults").empty();
    API.getScrape().then(function (data) {
        API.init().then(function (data) {
            if (data.length > 0) {
                const $arts = data.map(function (artic) {
                    const $li = $("<li>");

                    const saveButton = $("<button>").addClass("btn-small waves-effect waves-light indigo right saveIt").attr("type", "submit").attr("name", "action").text("Save Article");
                    const title = $("<div>").text(artic.title).addClass("collapsible-header");

                    const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                    const body = $("<div>").attr("data-id", artic._id).addClass("collapsible-body").append(span).append(saveButton);

                    $li.append(title).append(body);

                    return $li;
                });
                $("#scrapeResults").append($arts);
            }
            else {
                const $li = $("<li>");

                const title = $("<h5>").text("No More Articles. Get Scraping By Clicking The Button Above!").addClass("center-align");

                $li.append(title);
                $("#scrapeResults").append($li);
            }
        });
    });
};

const deleteAllScraped = function () {
    API.deleteAllScrapedArt().then(function () {
        $("#scrapeResults").empty();
        API.init().then(function (data) {
            if (data.length > 0) {
                const $arts = data.map(function (artic) {
                    const $li = $("<li>");

                    const saveButton = $("<button>").addClass("btn-small waves-effect waves-light indigo right saveIt").attr("type", "submit").attr("name", "action").text("Save Article");
                    const title = $("<div>").text(artic.title).addClass("collapsible-header");

                    const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                    const body = $("<div>").attr("data-id", artic._id).addClass("collapsible-body").append(span).append(saveButton);

                    $li.append(title).append(body);

                    return $li;
                });
                $("#scrapeResults").append($arts);
            }
            else {
                const $li = $("<li>");

                const title = $("<h5>").text("No More Articles. Get Scraping By Clicking The Button Above!").addClass("center-align");

                $li.append(title);
                $("#scrapeResults").append($li);
            }
        });
    })
};

const saveArticle = function () {
    const id = $(this).parent().attr("data-id");

    API.getArticle(id).then(function (data) {
        console.log(data);
        API.save(data).then(function (dataTwo) {
        });
        API.deleteArticle(id).then(function (dataThree) {
            $("#scrapeResults").empty();
            API.init().then(function (data) {
                if (data.length > 0) {
                    const $arts = data.map(function (artic) {
                        const $li = $("<li>");

                        const saveButton = $("<button>").addClass("btn-small waves-effect waves-light indigo right saveIt").attr("type", "submit").attr("name", "action").text("Save Article");
                        const title = $("<div>").text(artic.title).addClass("collapsible-header");

                        const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                        const body = $("<div>").attr("data-id", artic._id).addClass("collapsible-body").append(span).append(saveButton);

                        $li.append(title).append(body);

                        return $li;
                    });
                    $("#scrapeResults").append($arts);
                }
                else {
                    const $li = $("<li>");

                    const title = $("<h5>").text("No More Articles. Get Scraping By Clicking The Button Above!").addClass("center-align");

                    $li.append(title);
                    $("#scrapeResults").append($li);
                }
            });
        });
    });
};

$.getJSON("/articles", function (data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

$(document).on("click", "p", function () {
    $("#notes").empty();
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    const thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$("#newScrape").on("click", newScrape);
$("#scrapeResults").on("click", ".saveIt", saveArticle);
$("#clearScrapedArticles").on("click", deleteAllScraped);
