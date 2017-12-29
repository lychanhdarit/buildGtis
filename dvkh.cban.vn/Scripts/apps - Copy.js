$(document).ready(function () {

    FetchData();
    getCurrentTime();
    var gmarkers = [];
    var map;

    function initialize() {

        var mapProp = {
            center: new google.maps.LatLng(10.777895, 106.681813), //India Lat and Lon
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    }

    google.maps.event.addDomListener(window, 'load', initialize);


    function stringFormat(str) {
        if (str !== undefined && str !== null) {
            str = String(str);
            if (str.trim() !== "") {
                var args = arguments;
                return str.replace(/(\{[^}]+\})/g, function (match) {
                    var n = +match.slice(1, -1);
                    if (n >= 0 && n < args.length - 1) {
                        var a = args[n + 1];
                        return (a !== undefined && a !== null) ? String(a) : "";
                    }
                    return match;
                });
            }
        }
        return "";
    }

    $("#txtSearch").keyup(function () {

        var x = $("#txtSearch").val();

        for (i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(null);
        }


        $.ajax({
            type: "POST",
            url: 'Home/Search', //"../Map/Search"
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "TranID": x }),
            dataType: "json",
            success: function (data) {
                var table = "<table class='table'>";
                $.each(data, function (index, value) {

                    var f = stringFormat('goiclick(\"{0}\")', value.TRANSPORT_ID);

                    table += "<tr  ><td onclick='" + f + "' >" + value.TRANSPORT_ID + "</td></tr>";
                    var latlng = new google.maps.LatLng(value.LATITUDE, value.LONGITUDE);
                    var marker = new google.maps.Marker({

                        center: latlng,
                        position: latlng,
                        icon: "../pinkball.png",
                        zoom: 10,
                        map: map
                    });

                    gmarkers.push(marker);
                    //Add Comment
                    marker.setTitle("ghi chu "+value.TRANSPORT_ID);
                    var infowindow = new google.maps.InfoWindow(
                    {
                        content: "<b>Vị trí này của thiết bị</b>: " + value.TRANSPORT_ID+"<br/>Lý Chanh Đa Ríc<br/><b>09.678.654.04</b>",
                        size: new google.maps.Size(50, 50)
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
                    //Bán kinh
                    var citymap = {
                        center: { lat: value.LATITUDE, lng: value.LONGITUDE },
                        population: 95806278
                    }

                    //var cityCircle = new google.maps.Circle({
                    //    strokeColor: '#FF0000',
                    //    strokeOpacity: 0.8,
                    //    strokeWeight: 2,
                    //    fillColor: '#FF0000',
                    //    fillOpacity: 0.35,
                    //    map: map,
                    //    center: citymap.center,
                    //    radius: Math.sqrt(citymap.population) * 100
                    //});

                });
                table += "</table>";
                //$("#myData").html(table);

                if (x == "") {
                    for (j = 0; j < gmarkers.length; j++) {
                        gmarkers[j].setMap(null);
                    }
                }
            }
        });

    });

})
function goiclick(name) {

    $("#txtSearch").val(name);
    $("#txtSearch").keyup();
}

function goiDoubleclick(name) {
    $('#myModal').modal('show');

    $.ajax({
        type: "POST",
        url: 'Home/Search', //"../Map/Search"
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "TranID": name }),
        dataType: "json",
        success: function (data) {

           
            $.each(data, function (index, value) {

                $("#lat").html(value.LATITUDE);
                $("#long").html(value.LONGITUDE);
                
            });
           

           
        }
    });
}




function stringFormat(str) {
    if (str !== undefined && str !== null) {
        str = String(str);
        if (str.trim() !== "") {
            var args = arguments;
            return str.replace(/(\{[^}]+\})/g, function (match) {
                var n = +match.slice(1, -1);
                if (n >= 0 && n < args.length - 1) {
                    var a = args[n + 1];
                    return (a !== undefined && a !== null) ? String(a) : "";
                }
                return match;
            });
        }
    }
    return "";
}
function getCurrentTime() {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1)
    + "/" + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    $("#lastUpdate").html(datetime);
}


function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear()+" - "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
}

function FetchData() {

    $.ajax({
        type: "POST",
        url: '../Home/IndexJson',
        data: null, // the data in JSON format.  Note it is *not* a JSON object, is is a literal string in JSON format
        contentType: "application/json; charset=utf-8", // we are sending in JSON format so we need to specify this
        dataType: "json", // the data type we want back.  The data will come back in JSON format
        success: function (data) {

            {
                var table = "<table class='table'>";
                table += "<tr  > <th>Biển_số </th>  <th>Thời_gian</th>  <th>Trạng_thái</th> </tr>";
                $.each(data, function (index, value) {

                    var onclickFuntion = stringFormat('goiclick(\"{0}\")', value.Tranid);
                    var onDoubleclickFuntion = stringFormat('goiDoubleclick(\"{0}\")', value.Tranid);
                   
                    var cDate = ToJavaScriptDate(value.timeReal);

                    //Create popup
                    var popupAttrible = " data-toggle='modal' data-target='#myModal'";
                    table += "<tr  onclick='" + onclickFuntion + "'   ondblclick='" + onDoubleclickFuntion + "' ><td>" + value.name + " </td><td class='td'> " + cDate + "</td><td>  " + value.StatusCode + " </td></tr>";

                });
                table += "</table>";
                $("#myData").html(table);


                getCurrentTime();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });


}
setInterval(FetchData, (10000));//10  giay 