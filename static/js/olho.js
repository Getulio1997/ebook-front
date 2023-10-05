$(document).ready(function () {
    $("#showPassword").click(function () {
        var senhaInput = $("#senha");
        var icon = $("#showPassword");

        if (senhaInput.attr("type") === "password") {
            senhaInput.attr("type", "text");
            icon.removeClass("fa-eye-slash");
            icon.addClass("fa-eye");
        } else {
            senhaInput.attr("type", "password");
            icon.removeClass("fa-eye");
            icon.addClass("fa-eye-slash");
        }
    });
});