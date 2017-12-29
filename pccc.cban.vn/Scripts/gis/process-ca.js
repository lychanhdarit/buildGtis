function openTaoDieuDongAddress(Address, Phone) {

    var vtri = $('#txtVT').val()
    if (vtri.length == 0) {
        alert("chưa biết vị trí cảnh báo")
    }
    else {
        $('#txtSDTDD').val(Phone);
        $('#txtAd').val(Address);
        $('#taoDieuDong').modal('show');
    }

}

function getcheckboxes() {
    var node_list = document.getElementsByName('sosCheck');
    var checkboxes = [];
    for (var i = 0; i < node_list.length; i++) {
        var node = node_list[i];
        if (node.getAttribute('type') == 'checkbox') {
            checkboxes.push(node);
        }
    }
    return checkboxes;
}
function CheckAllStatus(source) {
    checkboxes = getcheckboxes();
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    }
}
function getValueCheckbox() {
    var ckbox = $("input[name='sosCheck']");
    var chkId = '';

    var statusXL = $("#ddlStatusXuly option:selected").val();

    if (ckbox.is(':checked')) {

        $("input[name='sosCheck']:checked").each(function () {

            chkId += $(this).attr("value") + ",";
            //chkId = chkId.slice(0, -1);

        });

        //    alert($(this).val()); // return all values of checkboxes checked
        alert(chkId + " - " + statusXL); // return value of checkbox checked
    }
    else {
        alert("chua chom");
    }

}

function processSOS() {

    var ckbox = $("input[name='sosCheck']");
    var ArrSosId = '';
    var statusXL = $("#ddlStatusXuly option:selected").val();

    if (ckbox.is(':checked')) {

        $("input[name='sosCheck']:checked").each(function () {

            ArrSosId += $(this).attr("value") + ",";
            
        });

        //    alert($(this).val()); // return all values of checkboxes checked
       // alert(ArrSosId); // return value of checkbox checked

        var html = "";
        $.ajax({
            type: "POST",
            url: '../LiveTracking/ProcessSOS',
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({  SOS_ARR: ArrSosId, status: statusXL}),
            dataType: "json",
            beforeSend: function () {
                $('#preloader').addClass('preActive');
            },
            complete: function () {
                $('#preloader').removeClass('preActive');
            },
            success: function (data) {
                alert(data);
            }

        });

    }
    else {
        alert("Chưa chọn tin xử lý!");
    }
   
}