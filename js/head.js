var endpoint = "https://jsonbox.io/box_0394827869549f2a7393";

function fetchJSON(a) {
    var f = new XMLHttpRequest;
    f.open("GET", a, false);
    f.send(null);
    return f.responseText
}

function isURL(a) {
    let url = a
    if (!a.startsWith("javascript:")) {
        return true;
    } else {
        return false;
    }
}
var hashh = window.location.hash.substr(1);
if (window.location.hash != "") {
    var res = JSON.parse(fetchJSON(endpoint + "/?q=alias:" + hashh))[0];
    var data = res["url"];
    console.log(data);
    if (data != null) {
        if (isURL(data)) {
            window.location.href = data;
        }
    }
}