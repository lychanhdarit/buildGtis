$(document).ready(function () {
    getAddressType();
    //GetDataRealTime();
    getCurrentTime();
    GetDataSOS();

})

// Khai bao ban do
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
// Click hien thong tin
function goiclick(TranID, sosID) {

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
            $('#txtVT').val(sosID);
            $.each(data, function (index, value) {
                //Add Point
                Icon = IconStatus;
                Name = TranID;
                SetMapComment(value.LATITUDE, value.LONGITUDE, Icon, TranID);
                var x = $("#chkMoBanKinh").is(":checked");
                currentPos = new google.maps.LatLng(value.LATITUDE, value.LONGITUDE);
                Radius(x);


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

//search Map
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

// Double click hien thong tin
function goiDoubleclick(TranID) {
    $('#myModal').modal('show');
    var LocaNameTransport;
    $.ajax({
        type: "POST",
        url: '../LiveTracking/SOSJsonLoadProcess', //"../Map/Search"
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


//PT
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
                var i = 0;
                $.each(data, function (index, value) {
                    var info = "<div class='info-g'>";
                    info += "<h4>Thông Tin Lực Lượng </h3><hr/>";
                    info += "Tên liên hệ:  " + (value.NAME == null ? "<i>chưa cập nhật</i>" : "<b>" + value.NAME + "</b>") + "<br/><br/>";
                    info += "Số Điện Thoại: " + (value.PHONE == null ? "<i>chưa cập nhật</i>" : "<b>" + value.PHONE + "</b>") + "<br/><br/>";
                    info += "Email: " + (value.TYPE == null ? "<i>chưa cập nhật</i>" : "<b>" + value.TYPE + "</b>") + "<br/><br/>";
                    info += "Địa chỉ: " + (value.ADDRESS == null ? "<i>chưa cập nhật</i>" : "<b>" + value.ADDRESS + "</b>") + "<br/><br/>";
                    if (value.TYPE == 3) {

                        var onclickFuntion = stringFormat('openTaoDieuDongAddress(\"{0}\",\"{1}\")', value.ADDRESS, value.PHONE);
                        info += "<input id='btnSOS' type='button' value='Điều động lực lượng' class='btn btn-warning' onclick='" + onclickFuntion + "' /><br/>";
                    }
                    info += "</div>";
                    i++;
                    SetMapCommentClick(value.LATITUDE, value.LONGITUDE, "../Content/icon/" + iCon, info,i);
                });

                $("#m-" + typeAddress + "").addClass("menu-active-icon");
            }
        }

    });

}

function cleanMap() {

    for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
    }
    for (i = 0; i < TypeMenu.length; i++) {
        $("#m-" + TypeMenu[i] + "").removeClass("menu-active-icon");
    }

}
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
//Ham ho tro3
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
function addMarkerWithTimeout(position, timeout) {

    window.setTimeout(function () {
        markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
        }));

    }, timeout);

}
function SetMapCommentClick(LATITUDE, LONGITUDE, ICON, iNFO,i) {

    var latlng = new google.maps.LatLng(LATITUDE, LONGITUDE);
    var marker = new google.maps.Marker({
        position: latlng,
        icon: ICON,
        map: map
        //
    });

    //window.setTimeout(function () {
    //    marker.push(new google.maps.Marker({
    //        position: latlng,
    //        map: map,
    //        animation: google.maps.Animation.DROP
    //    }));

    //}, i * 200);

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

function Radius(check) {

    //var chkMoBanKinh = document.getElementById('chkMoBanKinh');
    //if (check == true) {

    var banKinh = $("#ddlBanKinh option:selected").val();

    //var cityCircle = new google.maps.Circle({
    //    strokeColor: '#f7c04c',
    //    strokeOpacity: 0.8,
    //    strokeWeight: 2,
    //    fillColor: '#f7c04c',
    //    fillOpacity: 0.35,
    //    map: map,
    //    center: currentPos,
    //    radius: parseInt(banKinh)
    //});
    /* circle test
   ----------------------------------------------- */
    var _radius = parseInt(banKinh);
    var rMin = _radius * 4 / 5;
    var rMax = _radius;
    var direction = 1;

    var circleOption = {
        center: currentPos,
        fillColor: '#f7c04c',
        fillOpacity: 0.6,
        map: map,
        radius: parseInt(banKinh),
        strokeColor: '#f7c04c',
        strokeOpacity: 1,
        strokeWeight: 0.5
    };

    var circle = new google.maps.Circle(circleOption);

    var circleTimer = setInterval(function () {
        var radius = circle.getRadius();

        if ((radius > rMax) || (radius < rMin)) {
            direction *= -1;
        }

        var _par = (radius / _radius) - 0.7;

        circleOption.radius = radius + direction * 10;
        circleOption.fillOpacity = 1 * _par;

        circle.setOptions(circleOption);
    }, 20);

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
    // }
}

//Lay du lieu
function GetDataSosOlD() {

    $.ajax({
        type: "POST",
        url: '../LiveTracking/SOSJson',
        data: null, // the data in JSON format.  Note it is *not* a JSON object, is is a literal string in JSON format
        contentType: "application/json; charset=utf-8", // we are sending in JSON format so we need to specify this
        dataType: "json", // the data type we want back.  The data will come back in JSON format

        success: function (data) {

            {
                var table = "<table class='table'>";
                table += "<tr  > <th>Tên </th>  <th>Times</th>  <th>Zone</th><th>Loại</th> </tr><tbody>";
                $.each(data, function (index, value) {

                    var onclickFuntion = stringFormat('goiclick(\"{0}\",{1})', value.Tranid, value.sosID);
                    var onDoubleclickFuntion = stringFormat('goiDoubleclick(\"{0}\")', value.Tranid);

                    var cDate = ToJavaScriptDate(value.timeReal);
                    var timeSpan = TimeSpan(value.timeReal);
                    var Zone, TypeS;
                    var bitS = ConvertToBinary(value.StatusCode);
                    Zone = bitS;
                    TypeS = bitS;
                    //Create popup
                    //var popupAttrible = " data-toggle='modal' data-target='#myModal'";
                    table += "<tr  onclick='" + onclickFuntion + "'   ondblclick='" + onDoubleclickFuntion + "' >";
                    table += "<td>" + value.name + " </td><td class='td'> <i>" + timeSpan + "</i></td><td>  " + Zone.length + " </td>";
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


//Set Time Get Data
//setInterval(GetDataSosOlD, (10000));//10  giay 
function IconStatus(bit) {
    var IconS = "../Content/icon/status_sos/warning.png";
    if (bit >= 7 && bit <= 23)
        IconS = "../Content/icon/status_sos/sos" + bit + ".png";
    return IconS;
}
function GetDataSOS() {

    $.ajax({
        type: "POST",
        url: '../LiveTracking/IndexJson',
        data: null, // the data in JSON format.  Note it is *not* a JSON object, is is a literal string in JSON format
        contentType: "application/json; charset=utf-8", // we are sending in JSON format so we need to specify this
        dataType: "json", // the data type we want back.  The data will come back in JSON format

        success: function (data) {

            {
                var table = "<table class='table'>";
                table += "<tbody>";
                $.each(data, function (index, value) {

                    var onclickFuntion = stringFormat('goiclick(\"{0}\",{1})', value.Tranid, value.sosID);
                    var onDoubleclickFuntion = stringFormat('goiDoubleclick(\"{0}\")', value.Tranid);

                   // FullName, Phone, Address, TransportName, TransportAddress, Lat, Long)
                    var clickInfoTran = stringFormat('GetInfoTransport(\"{0}\",\"{1}\",\"{2}\",\"{3}\",\"{4}\",\"{5}\",\"{6}\",\"{7}\")', value.FullName, value.Phone, value.Address, value.TransportName, value.TransportAddress, value.Lat, value.Long, value.DriverName);

                    //var cDate = ToJavaScriptDate(value.timeReal);
                    var timeSpan = TimeSpan(value.timeReal);
                    var Zone, TypeS;
                    var bitS = ConvertToBinary(value.StatusCode);
                    Zone = bitS;
                    TypeS = bitS;
                    //Create popup
                    //var popupAttrible = " data-toggle='modal' data-target='#myModal'";
                    table += "<tr  onclick='" + clickInfoTran + "'   ondblclick='" + onDoubleclickFuntion + "' >";
                    table += "<td>" + value.TransportName + " <i>" + timeSpan + "</i> <img src='" + IconStatus(Zone.length) + "' alt='SOS Zone" + (Zone.length - 7) + "' title='SOS Zone-" + (Zone.length - 7) + "' /> </td></tr>";
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
function GetInfoTransport(FullName, Phone, Address, TransportName, TransportAddress, Lat, Long, DriverName) {

    IconStatus = "../Content/icon/fire.png";
    var latlng = new google.maps.LatLng(Lat, Long);
    var marker = new google.maps.Marker({
       
        position: latlng,
        icon: IconStatus,
        map: map,
        animation: google.maps.Animation.DROP
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
    gmarkers.push(marker);
    //Add Comment

    var infoTran = "<div class='info-g'>";
    infoTran += "Tên người liên hệ:  " + (FullName == null ? "<i>chưa cập nhật</i>" : "<b>" + FullName + "</b>") + "<br/>";
    infoTran += "Tel: " + (Phone == null ? "<i>chưa cập nhật</i>" : "<b>" + Phone + "</b>") + "<br/>";
  
    infoTran += "Địa chỉ: " + (Address == null ? "<i>chưa cập nhật</i>" : "<b>" + Address + "</b>") + "<br/>";
    infoTran += "----------------------------------------------<br/>";
    infoTran += "Quản lý: " + (DriverName == null ? "<i>chưa cập nhật</i>" : "<b>" + DriverName + "</b>") + "<br/>";
    infoTran += "Phương tiện:  " + (TransportName == null ? "<i>chưa cập nhật</i>" : "<b>" + TransportName + "</b>") + "<br/>";
    infoTran += "Địa chỉ phương tiện: " + (TransportAddress == null ? "<i>chưa cập nhật</i>" : "<b>" + TransportAddress + "</b>") + "<br/>";
    infoTran += "LatLng:(" + (Lat == null ? "<i>chưa cập nhật</i>" : "<b>" + Lat + "</b>") + "," + (Long == null ? "<i>chưa cập nhật</i>" : "<b>" + Long + "</b>)") + "<br/>";
    infoTran += "<br/>  <input id='txtLL' type='text' placeholder=' nhập tên lực lượng' class='form-control' style=' width: 70%;float: left;font-size: 0.8em;padding: 0px !important; height: 30px;border-radius: 0px !important;'/><input id='btnĐD' type='button' value='Điều Động' class='btn btn-warning'  style=' width: 30%;float: right;font-size: 0.8em; height: 30px;border-radius: 0px !important;'/><br/>";
    infoTran += "</div>";

    var infowindow = new google.maps.InfoWindow(
              {

                  content: infoTran,
                  size: new google.maps.Size(50, 50)
              });
    infowindow.open(map, marker);
    google.maps.event.addListener(marker, 'dblclick', function () {
        $('#myModal').modal('show');
    });

    var x = $("#chkMoBanKinh").is(":checked");
    currentPos = new google.maps.LatLng(Lat, Long);
    Radius(x);
    map.setCenter(currentPos);
    //alert(currentPos);
}


