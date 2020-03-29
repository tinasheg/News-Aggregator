$(document).on("click", "#scrape-button", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    window.location.replace("/scrape");
});

$(document).on("click", ".delete-article", function () {
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/saved/" + thisId
    })
        .then(function (data) {
            console.log(data);
            location.reload();
        });
});

$(document).on("click", ".save-article", function () {
    const thisId = $(this).attr("data-id");
    $(this).hide();
    const data = {}
    data.title = $("#title-" + thisId).text();
    data.link = $("#link-" + thisId).text();
    data.excerpt = $("#excerpt-" + thisId).text();
    $.ajax({
        method: "POST",
        dataType: "json",
        url: "/api/saved",
        data: data
    })
});

$(document).on("click", ".note-comment", function () {
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    window.location.replace("/articles/" + thisId);
});

$(document).on("click", "#submit-note", function () {
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#title-note").val(),
            body: $("#note-description").val()
        }
    })
        .then(function (data) {
            console.log(data);
            window.location.replace("/articles/" + data._id);
        });
    $("#title-note").val("");
    $("#note-description").val("");
});

$(document).on("click", ".delete-note", function () {
    const thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            location.reload();
        });
});