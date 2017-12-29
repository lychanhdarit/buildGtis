//Khởi động trang
$(document).ready(function () {
    //Hiện thị lực lượng 
    getAddressType();
    //Hiện thị trang thái trả về từ phương tiên
    GetDataRealTime();
    //Lấy thời gian hiện tại
    getCurrentTime();
    //Hiện thị trạng thái cảnh báo
    GetDataSOS();
})

// Khai báo biến 
var geocoder;
var gmarkers = [];
var map;
var currentPos, searchStartLatLng, searchEndLatLng;
var ItemSelectValue;
var directionDisplay;
var directionsService;
var arr = [];
var markers = [];
var Icon;
var Name;
var TypeMenu = [];
function initialize() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    var mapProp = {
        center: new google.maps.LatLng(10.777895, 106.681813),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP //'satellite'//
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);


    // Create the search box and link it to the UI element.
    var input = document.getElementById('txtSearch');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            searchStartLatLng = place.geometry.location;
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    //Box Đến
    // Search box to
    var inputTp = document.getElementById('txtSearchTo');
    var searchBoxTo = new google.maps.places.SearchBox(inputTp);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBoxTo.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBoxTo.addListener('places_changed', function () {
        var places = searchBoxTo.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            searchEndLatLng = place.geometry.location;

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    //Click do duong
    google.maps.event.addListener(map, 'click', function (event) {

        var location = event.latLng;
        var marker = new google.maps.Marker
         ({
             position: location,
             map: map
         });
        map.setCenter(location);
        arr.push(location);
        if (arr.length > 1) {
            var endA = arr[arr.length - 1];
            var startA = arr[arr.length - 2];
            directionGo(startA, endA);
        }
        else {
            end = location;
            directionGo(currentPos, end);
        }
    });
    //directionsDisplay.setMap(map);
}
//google.maps.event.addDomListener(window, 'load', initialize);

//Hiện thị đường đi 
function directionGo(start, end) {
    var request =
    {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route
    (
        request,
        function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        }
    );
    directionsDisplay.setMap(map);
}
function directionGoStatic() {

    if (searchStartLatLng == null)
        searchStartLatLng = currentPos;
    var request =
    {
        origin: searchStartLatLng,
        destination: searchEndLatLng,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route
    (
        request,
        function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        }
    );
    directionsDisplay.setMap(map);
}

//CLick hiện thị vị trí SOS
function onClickPositionSOS(TranID, sosID) {

    var IconStatus, URLSERVICE;

    IconStatus = "../Content/icon/fire.png";
    URLSERVICE = '../Home/SearchSOS';


    for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
    }
    //alert(TranID);
    //map.setMap(null);
    $.ajax({
        type: "POST",
        url: URLSERVICE,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "sosID": sosID }),
        dataType: "json",
        beforeSend: function () {
            $('#preloader').addClass('preActive');
        },
        complete: function () {
            $('#preloader').removeClass('preActive');
        },
        success: function (data) {

            ItemSelectValue = TranID;
            $.each(data, function (index, value) {
                //Add Point
                Icon = IconStatus;
                Name = TranID;
                SetMapComment(value.LATITUDE, value.LONGITUDE, Icon, TranID);
                var x = $("#chkMoBanKinh").is(":checked");

                Radius(x);
                currentPos = new google.maps.LatLng(value.LATITUDE, value.LONGITUDE);

                //gmarkers.push(marker);
            });


            if (TranID == "") {
                for (j = 0; j < gmarkers.length; j++) {
                    gmarkers[j].setMap(null);
                }
            }
        }
    });

}

// Click hiện vị trí phương tiện
function goiclick(TranID, StatusCode) {

    var IconStatus, URLSERVICE;
    switch (StatusCode) {
        case 1:
            IconStatus = "../Content/icon/fire.png";
            URLSERVICE = '../Home/SearchSOS';
            break;
        case 2:
            IconStatus = "../Content/icon/reset.png";
            URLSERVICE = '../Home/Search';
            break;

    }

    for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
    }
    //alert(TranID);
    //map.setMap(null);
    $.ajax({
        type: "POST",
        url: URLSERVICE,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "TranID": TranID }),
        dataType: "json",
        beforeSend: function () {
            $('#preloader').addClass('preActive');
        },
        complete: function () {
            $('#preloader').removeClass('preActive');
        },
        success: function (data) {

            ItemSelectValue = TranID;
            $.each(data, function (index, value) {
                //Add Point
                Icon = IconStatus;
                Name = TranID;
                SetMapComment(value.LATITUDE, value.LONGITUDE, Icon, TranID);
                var x = $("#chkMoBanKinh").is(":checked");

                Radius(x);
                currentPos = new google.maps.LatLng(value.LATITUDE, value.LONGITUDE);

                //gmarkers.push(marker);
            });


            if (TranID == "") {
                for (j = 0; j < gmarkers.length; j++) {
                    gmarkers[j].setMap(null);
                }
            }
        }
    });

}

//Hiện thị Tạo tin sos
function openSosFormCodeAddress() {
    var address = document.getElementById("txtSearch").value;


    if (geocoder) {
        geocoder.geocode
        (
            {
                'address': address
            },
            function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);

                    var marker = new google.maps.Marker
                    (
                        {
                            map: map,
                            position: results[0].geometry.location
                        }
                    );

                    $("#txtDC").val(address);
                    $("#txtTenDiem").val(results[0].geometry.location);
                    var LatLngPost = [];
                    LatLngPost = $("#txtTenDiem").val().split(',');
                    if (LatLngPost.length > 0) {
                        var LatPost = LatLngPost[0].replace("(", "");
                        var LngPost = LatLngPost[1].replace(")", "");
                        $("#txtSDT").val(LatPost);
                        $("#txtGC").val(LngPost);
                    }


                }
                else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            } // hết "function(results, status) "
        );
    }  // hết "if (geocoder)"
    $('#taoSOS').modal('show');
}

// Double click hiện thị bảng xử lý SOS
function goiDoubleclick(TranID) {
    $('#myModal').modal('show');
    var LocaNameTransport;
    $.ajax({
        type: "POST",
        url: '../Home/SOSJsonLoadProcess', //"../Map/Search"
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "TranID": TranID }),
        dataType: "json",
        beforeSend: function () {
            $('#preloaderPop').addClass('preActive');
        },
        complete: function () {
            $('#preloaderPop').removeClass('preActive');

        },
        success: function (data) {
            $("#dataStatus").html("");
            $.each(data, function (index, value) {


                var table = "<table id='myDataTableStatus' class='table table-striped table-bordered' cellspacing='0' width='100%'>";
                table += "<thead><tr> <th>Chọn</th> <th>Thời gian</th><th>Mã SK</th> <th>Loại</th><th>Xử lý</th></tr></thead><tbody>";
                $.each(data, function (index, value) {

                    var cDate = ToJavaScriptDate(value.timeReal);

                    table += "<tr>";
                    table += "<td>  <input name='sosCheck' id='chk-" + value.idSOS + "' value='" + value.idSOS + "' type='checkbox'   /> </td><td class='td'> " + cDate + "</td><td>  " + value.name + " </td><td> SOS: " + value.StatusCode + "</td><td>  " + value.ProcessStatus + " </td>";
                    table += "</tr>";
                    LocaNameTransport = value.name;
                });
                table += "</tbody></table>";

                $("#dataStatus").html(table);

                $('#myDataTableStatus').DataTable({
                    scrollY: 320,
                    paging: false
                });

            });

            $("#txtTransport").val(LocaNameTransport);

            checkboxes = getcheckboxes();
            for (var i = 0, n = checkboxes.length; i < n; i++) {
                checkboxes[i].checked = true;
            }

        }
    });



}

//Lấy dữ liệu trang thái từ phương tiện
function GetDataRealTime() {

    $.ajax({
        type: "POST",
        url: '../Home/IndexJson',
        data: null, // the data in JSON format.  Note it is *not* a JSON object, is is a literal string in JSON format
        contentType: "application/json; charset=utf-8", // we are sending in JSON format so we need to specify this
        dataType: "json", // the data type we want back.  The data will come back in JSON format
        //beforeSend: function () {
        //    $('#preloaderBox').addClass('preActive');
        //},
        //complete: function () {
        //    $('#preloaderBox').removeClass('preActive');
        //},
        success: function (data) {

            {
                var table = "<table class='table'>";
                table += "<tr  > <th>Tên </th>  <th>Times</th>  <th>Zone</th><th>Loại</th> </tr>";
                $.each(data, function (index, value) {

                    var onclickFuntion = stringFormat('goiclick(\"{0}\",2)', value.Tranid);
                    var onDoubleclickFuntion = stringFormat('goiDoubleclick(\"{0}\")', value.Tranid);

                    var cDate = TimeSpan(value.timeReal);
                    var Zone, TypeS;
                    var bitS = ConvertToBinary(value.StatusCode);
                    Zone = bitS;
                    TypeS = bitS;
                    //Create popup
                    var popupAttrible = " data-toggle='modal' data-target='#myModal'";
                    table += "<tr  onclick='" + onclickFuntion + "'   ondblclick='" + onDoubleclickFuntion + "' >";
                    table += "<td>" + value.name + " </td><td class='td'> " + cDate + "</td><td>  " + Zone.length + " </td>";
                    table += "<td>" + TypeS.length + " </td></tr>";

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
setInterval(GetDataRealTime, (10000));//10  giay 

//Lấy dữ liệu trang thái Cảnh báo từ phương tiện
function GetDataSOS() {

    $.ajax({
        type: "POST",
        url: '../Home/SOSJson',
        data: null, // the data in JSON format.  Note it is *not* a JSON object, is is a literal string in JSON format
        contentType: "application/json; charset=utf-8", // we are sending in JSON format so we need to specify this
        dataType: "json", // the data type we want back.  The data will come back in JSON format
        //beforeSend: function () {
        //    $('#preloaderBox').addClass('preActive');
        //},
        //complete: function () {
        //    $('#preloaderBox').removeClass('preActive');
        //},
        success: function (data) {

            {
                var table = "<table class='table'>";
                table += "<tr  > <th>Tên </th>  <th>Times</th>  <th>Zone</th><th>Loại</th> </tr>";
                $.each(data, function (index, value) {

                    var onclickFuntion = stringFormat('onClickPositionSOS(\"{0}\",{1})', value.Tranid, value.sosID);
                    var onDoubleclickFuntion = stringFormat('goiDoubleclick(\"{0}\")', value.Tranid);


                    var cDate = TimeSpan(value.timeReal);
                    var Zone, TypeS;
                    var bitS = ConvertToBinary(value.StatusCode);
                    Zone = bitS;
                    TypeS = bitS;
                    //Create popup
                    //var popupAttrible = " data-toggle='modal' data-target='#myModal'";
                    table += "<tr  onclick='" + onclickFuntion + "'   ondblclick='" + onDoubleclickFuntion + "' >";
                    table += "<td>" + value.name + " </td><td class='td'> " + cDate + "</td><td>  " + Zone.length + " </td>";
                    table += "<td>" + TypeS.length + " </td></tr>";
                });
                table += "</tbody></table>";
                $("#myDataSOS").html(table);


                getCurrentTime();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });


}

setInterval(GetDataSOS, (10000));//10  giay 
//PT
//CLick hiện thị vị trí lực lượng từ danh sách
function getAddressOnClick(typeAddress, iCon) {


    $.ajax({
        type: "POST",
        url: '../Home/Address',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "typeAddress": typeAddress }),
        dataType: "json",
        beforeSend: function () {
            $('#preloader').addClass('preActive');
        },
        complete: function () {
            $('#preloader').removeClass('preActive');
        },
        success: function (data) {

            if ($("#m-" + typeAddress + "").attr('class') == "menu-active-icon") {
                $("#m-" + typeAddress + "").removeClass("menu-active-icon");
            }
            else {

                $.each(data, function (index, value) {
                    var info = "<div class='info-g'>";
                    info += "<h4>Thông Tin Lực Lượng </h3>";
                    info += "Tên liên hệ:  " + (value.NAME == null ? "<i>chưa cập nhật</i>" : "<b>" + value.NAME + "</b>") + "<br/><br/>";
                    info += "Số Điện Thoại: " + (value.PHONE == null ? "<i>chưa cập nhật</i>" : "<b>" + value.PHONE + "</b>") + "<br/><br/>";
                    info += "Email: " + (value.TYPE == null ? "<i>chưa cập nhật</i>" : "<b>" + value.TYPE + "</b>") + "<br/><br/>";
                    info += "Địa chỉ: " + (value.ADDRESS == null ? "<i>chưa cập nhật</i>" : "<b>" + value.ADDRESS + "</b>") + "<br/><br/>";
                    info += "</div>";
                    SetMapCommentClick(value.LATITUDE, value.LONGITUDE, "../Content/icon/" + iCon, info);
                });

                $("#m-" + typeAddress + "").addClass("menu-active-icon");
            }
        }

    });

}

//Xóa map
function cleanMap() {

    for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
    }
    for (i = 0; i < TypeMenu.length; i++) {
        $("#m-" + TypeMenu[i] + "").removeClass("menu-active-icon");
    }



}

//Hiện thị các loại lực lượng
function getAddressType() {
    var html = "";
    $.ajax({
        type: "POST",
        url: '../Home/AddressType',
        contentType: "application/json; charset=utf-8",
        data: null,
        dataType: "json",
        beforeSend: function () {
            $('#preloader').addClass('preActive');
        },
        complete: function () {
            $('#preloader').removeClass('preActive');
        },
        success: function (data) {
            $.each(data, function (index, value) {

                var onclickFuntion = stringFormat('getAddressOnClick(\"{0}\",\"{1}\")', value.TYPE_ID, value.ICON_URL);
                html += "<a id='m-" + value.TYPE_ID + "' href='#' onclick='" + onclickFuntion + "' title='" + value.LOCAL_NAME + "'> <img src='../Content/icon/" + value.ICON_URL + "' class='menu-icon spin circle' alt='" + value.LOCAL_NAME + "'/> </a>";
                TypeMenu.push(value.TYPE_ID);
            });
            $("#myMenuType").html(html);
        }

    });

}

//Hiện thị bảng thông tin trên map mặc định
function SetMapComment(LATITUDE, LONGITUDE, ICON, TransportID) {

    var latlng = new google.maps.LatLng(LATITUDE, LONGITUDE);
    var marker = new google.maps.Marker({
        position: latlng,
        icon: ICON,
        map: map
    });

    gmarkers.push(marker);
    //Add Comment
    SetComment(marker, TransportID, latlng)
}

//Hiện thị bảng thông tin trên map khi click
function SetMapCommentClick(LATITUDE, LONGITUDE, ICON, iNFO) {

    var latlng = new google.maps.LatLng(LATITUDE, LONGITUDE);
    var marker = new google.maps.Marker({
        position: latlng,
        icon: ICON,
        map: map
        //
    });

    gmarkers.push(marker);
    //Add Comment
    marker.setTitle("Lực lượng");
    var infowindow = new google.maps.InfoWindow(
    {
        content: iNFO,
        size: new google.maps.Size(50, 50)
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
}

// Thông tin của phương tiện
function SetComment(marker, TransportID, pos) {

    marker.setTitle("Thông tin vị trí: " + TransportID);
    var infoTran;

    $.ajax({
        type: "POST",
        url: '../Home/InfoTran', //"../Map/Search"
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "TransportID": TransportID }),
        dataType: "json",
        success: function (data) {
            infoTran = "<div class='info-g'>";
            infoTran += "<h4>Thông Tin Liên Hệ </h3>";
            infoTran += "Tên người liên hệ:  " + (data.FullName == null ? "<i>chưa cập nhật</i>" : "<b>" + data.FullName + "</b>") + "<br/><br/>";
            infoTran += "Số Điện Thoại: " + (data.Phone == null ? "<i>chưa cập nhật</i>" : "<b>" + data.Phone + "</b>") + "<br/><br/>";
            infoTran += "Email: " + (data.Email == null ? "<i>chưa cập nhật</i>" : "<b>" + data.Email + "</b>") + "<br/><br/>";
            infoTran += "Địa chỉ: " + (data.Address == null ? "<i>chưa cập nhật</i>" : "<b>" + data.Address + "</b>") + "<br/><br/>";
            infoTran += "----------------------------------------------<br/>";
            infoTran += "Tên phương tiện:  " + (data.TransportName == null ? "<i>chưa cập nhật</i>" : "<b>" + data.TransportName + "</b>") + "<br/><br/>";
            infoTran += "Địa chỉ phương tiện: " + (data.TransportAddress == null ? "<i>chưa cập nhật</i>" : "<b>" + data.TransportAddress + "</b>") + "<br/><br/>";
            infoTran += "LAT:" + (data.Lat == null ? "<i>chưa cập nhật</i>" : "<b>" + data.Lat + "</b>") + "<br/><br/>";
            infoTran += "LONG:" + (data.Long == null ? "<i>chưa cập nhật</i>" : "<b>" + data.Long + "</b>") + "<br/><br/>";
            infoTran += "</div>";
            //alert(infoTran);
            var infowindow = new google.maps.InfoWindow(
               {

                   content: infoTran,
                   size: new google.maps.Size(50, 50)
               });
            infowindow.open(map, marker);
            google.maps.event.addListener(marker, 'dblclick', function () {
                $('#myModal').modal('show');
            });

        }

    });



}

// Hiện thị bán kính
function Radius(check) {

    //var chkMoBanKinh = document.getElementById('chkMoBanKinh');
    if (check == true) {

        var banKinh = $("#ddlBanKinh option:selected").val();
        var infowindow = new google.maps.InfoWindow(
        {
            content: "<b>Bán kính đã chọn:</b>: " + banKinh + " m.<br/>Nhấp <b>chuột phải</b> để xóa bán kính",
            size: new google.maps.Size(90, 90)
        });

        var marker = new google.maps.Marker({
            position: currentPos,
            map: map
        });


        infowindow.open(map, marker);

        var circle = new google.maps.Circle({
            map: map,
            position: currentPos,
            radius: parseInt(banKinh),    //1000 = 1km in metres
            strokeColor: '#f7c04c',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: '#f7c04c',
            fillOpacity: 0.35,
            editable: true,

        });

        circle.bindTo('center', infowindow, 'position');
        //map.setCenter(currentPos);
        google.maps.event.addListener(circle, "radius_change", function () {
            //   $("#abc").html = circle.getRadius();
        })
        google.maps.event.addListener(circle, "center_change", function () {
            //$("#abc").html = circle.getCenter();
        })
        google.maps.event.addListener(circle, "rightclick", function () {

            this.setMap(null);
            $("#chkMoBanKinh").attr("checked", false);
        })

    }
    else {
        //alert("không check");
        //infowindow = new google.maps.InfoWindow(null);

        //circle.bindTo('center', infowindow, 'position');
        //map.setCenter(currentPos);
    }

}

function SetCommentClick(marker, Name) {

    marker.setTitle("ghi chu " + Name);
    var infowindow = new google.maps.InfoWindow(
    {
        content: "<b>Vị trí này của thiết bị</b>: " + Name + "<br/>Lý Chanh Đa Ríc<br/><b>09.678.654.04</b>",
        size: new google.maps.Size(50, 50)
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
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
    return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " - " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
}
function TimeSpan(value) {

    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));

    const diff = moment.duration(Date.now() - dt)
    //return diff.years() + " năm " + diff.months() + " tháng " + diff.days() + " ngày " + diff.hours() + " giờ " + diff.minutes() + " phút " + diff.seconds() + " giây ";

    return diff.months() + " tháng " + diff.days() + " ngày " + diff.hours() + " giờ " + diff.minutes() + " phút trước.";

}
function ConvertToBinary(value) {
    return parseInt(value).toString(2);
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


    if (ckbox.is(':checked')) {

        $("input[name='sosCheck']:checked").each(function () {

            chkId += $(this).attr("value") + ",";
            //chkId = chkId.slice(0, -1);

        });

        //    alert($(this).val()); // return all values of checkboxes checked
        alert(chkId); // return value of checkbox checked
    }
    else {
        alert("chua chom");
    }

}