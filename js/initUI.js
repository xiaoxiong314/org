$(document).ready(function () {
    _disableOffset();   //默认不生成边线，偏移值不可用

    $("input[type=checkbox]").change(function (e) {
        if (!e.target.checked) {
            _disableOffset();
        }
        else {
            _enableOffset();
        }
    });


});



function _disableOffset() {
    $("#offset").attr('disabled', 'disabled');
    $("#offset").css("background", "#EFEFEF");
}
function _enableOffset() {
    $("#offset").removeAttr('disabled');
    $("#offset").css("background", "transparent");
}