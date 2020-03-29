$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.collapsible').collapsible();
    $('.fixed-action-btn').floatingActionButton();
    $('.modal').modal();

    initSaved();
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
    getSaves: function () {
        return $.ajax({
            url: "api/saved",
            type: "GET"
        });
    },
    getArticle: function (id) {
        return $.ajax({
            url: "api/articles/" + id,
            type: "GET"
        });
    },
    getSavedArticle: function (id) {
        return $.ajax({
            url: "api/saved/" + id,
            type: "GET",
        });
    },
    getNote: function (id) {
        return $.ajax({
            url: "api/notes/" + id,
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
    deleteSaved: function (id) {
        return $.ajax({
            url: "api/saved/" + id,
            type: "DELETE"
        });
    },
    deleteNote: function (id) {
        return $.ajax({
            url: "api/notes/" + id,
            type: "DELETE"
        });
    },
    deleteAllSavedArt: function () {
        return $.ajax({
            url: "api/saved/",
            type: "DELETE"
        });
    },
    deleteAllNotes: function () {
        return $.ajax({
            url: "api/notes/",
            type: "DELETE"
        });
    },
    saveNote: function (id, note) {
        return $.ajax({
            url: "api/notes/" + id,
            type: "POST",
            data: {
                body: note
            }
        });
    }
};

const initSaved = function () {
    $("#savedResults").empty();
    API.getSaves().then(function (data) {
        console.log(data);
        if (data.length > 0) {
            const $saves = data.map(function (artic) {
                const $li = $("<li>");

                const deleteButton = $("<button>").addClass("buttonMargin btn-small waves-effect waves-light right deleteIt").attr("type", "submit").attr("name", "action").text("Delete From Saved");
                const noteButton = $("<button>").addClass("buttonMargin btn-small waves-effect waves-light modal-trigger right indigo addNote").attr("type", "submit").attr("name", "action").text("Add Note").attr("data-target", "modal1");

                const title = $("<div>").text(artic.title).addClass("collapsible-header");

                const buttonDiv = $("<div>").attr("data-id", artic._id).append(deleteButton).append(noteButton)

                const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                const body = $("<div>").addClass("collapsible-body").append(span).append(buttonDiv);

                $li.append(title).append(body);

                return $li;
            });
            $("#savedResults").append($saves);
        }

        else {
            const $li = $("<li>");

            const title = $("<h5>").text("No Saved Articles. Go To The Home Page and Get Scraping!").addClass("center-align");

            $li.append(title);
            $("#savedResults").append($li);
        }

    });
};

const deleteAllSaved = function () {
    API.deleteAllSavedArt().then(function () {
        $("#savedResults").empty();
        API.getSaves().then(function (data) {
            if (data.length > 0) {
                const $saves = data.map(function (artic) {
                    const $li = $("<li>");

                    const deleteButton = $("<button>").addClass("buttonMargin btn-small waves-effect waves-light right deleteIt").attr("type", "submit").attr("name", "action").text("Delete From Saved");
                    const noteButton = $("<button>").addClass("buttonMargin btn-small waves-effect waves-light modal-trigger right indigo addNote").attr("type", "submit").attr("name", "action").text("Add Note").attr("data-target", "modal1");

                    const title = $("<div>").text(artic.title).addClass("collapsible-header");

                    const buttonDiv = $("<div>").attr("data-id", artic._id).append(deleteButton).append(noteButton)

                    const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                    const body = $("<div>").addClass("collapsible-body").append(span).append(buttonDiv);

                    $li.append(title).append(body);

                    return $li;
                });
                $("#savedResults").append($saves);
            }

            else {
                const $li = $("<li>");

                const title = $("<h5>").text("No Saved Articles. Go To The Home Page and Get Scraping!").addClass("center-align");

                $li.append(title);
                $("#savedResults").append($li);
            }
        });
    });
    API.deleteAllNotes().then(function () {
    });

};

const deleteSavedArt = function () {
    const id = $(this).parent().attr("data-id");

    console.log(id);
    API.deleteSaved(id).then(function (dataTwo) {
        $("#savedResults").empty();
        API.getSaves().then(function (data) {
            if (data.length > 0) {
                const $saves = data.map(function (artic) {
                    const $li = $("<li>");

                    const deleteButton = $("<button>").addClass("buttonMargin btn-small waves-effect waves-light right deleteIt").attr("type", "submit").attr("name", "action").text("Delete From Saved");
                    const noteButton = $("<button>").addClass("buttonMargin btn-small waves-effect waves-light modal-trigger right indigo addNote").attr("type", "submit").attr("name", "action").text("Add Note").attr("data-target", "modal1");

                    const title = $("<div>").text(artic.title).addClass("collapsible-header");

                    const buttonDiv = $("<div>").attr("data-id", artic._id).append(deleteButton).append(noteButton)

                    const span = $("<a>").attr("href", artic.link).attr("target", "_blank").append($("<span>").text(artic.summary));
                    const body = $("<div>").addClass("collapsible-body").append(span).append(buttonDiv);

                    $li.append(title).append(body);

                    return $li;
                });
                $("#savedResults").append($saves);
            }

            else {
                const $li = $("<li>");

                const title = $("<h5>").text("No Saved Articles. Go To The Home Page and Get Scraping!").addClass("center-align");

                $li.append(title);
                $("#savedResults").append($li);
            }
        });
    });
};

const addNote = function () {
    $("#modalHeader").empty();
    $("#oldNotes").empty();

    $("#textarea1").val("");
    M.textareaAutoResize($("#textarea1"));

    const id = $(this).parent().attr("data-id");
    API.getSavedArticle(id).then(function (data) {
        console.log(data);
        $("#saveNote").attr("data-id", data._id);
        $("#modalHeader").append($("<h5>").text(data.title));

        const $row = $("<row>").append($("<div>").addClass("col s10").append($("<h6>").text(data.note.body)));
        const button = $("<div>").addClass("col s2").append($("<a>").addClass("waves-effect waves-light right btn-floating").attr("note-id", data.note._id).attr("data-id", data._id).attr("id", "clearSavedNote").append($("<i>").addClass("material-icons red").text("close")))
        $row.append(button);


        $("#oldNotes").append($row);

    });
};

const saveNewNote = function () {
    const id = $(this).attr("data-id");
    console.log(id);
    const note = $("#textarea1").val().trim();
    console.log(note);

    API.saveNote(id, note).then(function (data) {
        console.log(data);
    });
    $("#textarea1").val("");
    M.textareaAutoResize($("#textarea1"));
};

const deleteNote = function () {
    console.log("click read");
    const id = $(this).parent().attr("note-id");

    console.log(id);
    API.deleteNote(id).then(function () {
    });

    $("#modalHeader").empty();
    $("#oldNotes").empty();

    $("#textarea1").val("");
    M.textareaAutoResize($("#textarea1"));

    const idTwo = $(this).parent().attr("data-id");
    API.getSavedArticle(idTwo).then(function (data) {
        console.log(data);
        // console.log(data._id);
        $("#saveNote").attr("data-id", data._id);
        $("#modalHeader").append($("<h5>").text(data.title));

        const $row = $("<row>").append($("<div>").addClass("col s10").append($("<h6>").text(data.note.body)));
        const button = $("<div>").addClass("col s2").append($("<a>").addClass("waves-effect waves-light right btn-floating").attr("note-id", data.note._id).attr("id", "clearSavedNote").append($("<i>").addClass("material-icons red").text("close")))
        $row.append(button);


        $("#oldNotes").append($row);

    });
};

$("#savedResults").on("click", ".deleteIt", deleteSavedArt);

$("#clearSavedArticles").on("click", deleteAllSaved);

$("#savedResults").on("click", ".addNote", addNote);

$("#saveNote").on("click", saveNewNote);

$("#oldNotes").on("click", ".red", deleteNote);