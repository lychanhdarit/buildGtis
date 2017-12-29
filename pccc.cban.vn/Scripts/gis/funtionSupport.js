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

    return (-diff.months()) + "M" + (-diff.days()) + "D " + (-diff.hours()) + "h" + (-diff.minutes()) + "m.";

}
function ConvertToBinary(value) {
    return parseInt(value).toString(2);
}