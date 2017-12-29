
$(document).on("click", ".close_button", function () {
    $(".box-nessage").addClass('thu-gon').removeClass('mo-ra');
    $(".close_button").addClass('clickable').removeClass('close_button');
    $(".clickable").html("+");
});

$(document).on("click", ".clickable", function () {
    $(".box-nessage").addClass('mo-ra').removeClass('thu-gon');
    $(".clickable").addClass('close_button').removeClass('clickable');
    $(".close_button").html("-");
});



$(document).on("click", ".close-menu", function () {
    $(".box-action-menu").addClass('thu-gon-menu').removeClass('mo-menu-ra');
    $(".close-menu").addClass('open-menu').removeClass('close-menu');
    $(".open-menu").html("+");
});

$(document).on("click", ".open-menu", function () {
    $(".box-action-menu").addClass('mo-menu-ra').removeClass('thu-gon-menu');
    $(".open-menu").addClass('close-menu').removeClass('open-menu');
    $(".close-menu").html("-");
});



$(document).on("click", ".close-seacrh", function () {

    $(".collapse-menu").addClass('thu-gon-menu').removeClass('mo-menu-ra');
    $(".close-seacrh").addClass('open-seacrh').removeClass('close-seacrh');
    $(".open-seacrh").html('<i class="fa fa-search-plus" aria-hidden="true"></i> ');
});

$(document).on("click", ".open-seacrh", function () {
    $(".collapse-menu").addClass('mo-menu-ra').removeClass('thu-gon-menu');
    $(".open-seacrh").addClass('close-seacrh').removeClass('open-seacrh');
    $(".close-seacrh").html('<i class="fa fa-search-minus" aria-hidden="true"></i>');
});

function getPopSearch()
{
    $('#myModalSearch').modal('show');
}
