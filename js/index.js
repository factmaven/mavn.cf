let pushJSON = (address, longurl, shorturl) => {
    let request = new XMLHttpRequest();
    request.open('POST', address);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    let data = {
        "url": longurl,
        "alias": shorturl
    };
    request.send(JSON.stringify(data));
};

let cinp = () => {
    document.getElementById("url-error").innerHTML = "";
    let cival = document.getElementById("custom-alias").value;

    let res = JSON.parse(fetchJSON(endpoint + '/?q=alias:' + cival))[0]["url"];
    let data = res;

    if (data != null) {
        return false;
    } else if (data == null) {
        return true;
    }

};

let geturl = () => {
    let url = document.getElementById("long-url").value;
    return url;
};

let getrandom = () => {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

let genhash = () => {
    if (document.getElementById("custom-alias").value == "") {
        window.location.hash = getrandom();
        check_is_unique();
    } else {
        window.location.hash = document.getElementById("custom-alias").value;
    }
};

let check_is_unique = () => {
    let url = window.location.hash.substr(1);
    let res = JSON.parse(fetchJSON(endpoint + '/?q=alias:' + url))[0];
    let data = res;

    if (data != null) {
        genhash();
    }
};

let copyer = (containerid) => {
    let elt = document.getElementById(containerid);
    if (document.selection) { // IE
        if (elt.nodeName.toLowerCase() === "input") {
            document.getElementById(containerid).select();
            document.execCommand("copy");
        } else {
            let range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
            document.execCommand("copy");
        }
    } else if (window.getSelection) {
        if (elt.nodeName.toLowerCase() === "input") {
            document.getElementById(containerid).select();
            document.execCommand("copy");
        } else {
            let range_ = document.createRange();
            range_.selectNode(document.getElementById(containerid));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range_);
            document.execCommand("copy");
        }
    }
};

let send_request = (url) => {
    let longurl = url;
    let shorturl = window.location.hash.substr(1)
    let address = endpoint + "/";
    // console.log(address)
    pushJSON(address, longurl, shorturl);
    document.getElementById('short-url').value = window.location.href;
    document.getElementById('sucess').innerHTML = "Short URL Copied to Clipboard!";
    copyer("short-url");
};

let shorturl = () => {
    let longurl = geturl();
    let regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    let cre = /^([a-zA-Z0-9 _-]+)$/;
    let protocol_ok = regex.test(longurl);
    if (!protocol_ok) {
        document.getElementById("url-error").style.color = "red";
        document.getElementById("url-error").innerHTML = "❌ Invalid URL";
    } else {
        document.getElementById("url-error").innerHTML = "";
        if (document.getElementById("custom-alias").value == "") {
            genhash();
            send_request(longurl);
        } else {
            if (cre.test(document.getElementById("custom-alias").value)) {
                if (cinp()) {
                    document.getElementById("url-error").style.color = "cyan";
                    document.getElementById("url-error").innerHTML = " Custom Address Available ✔️";
                    genhash();
                    send_request(longurl);
                } else {
                    document.getElementById("url-error").style.color = "red";
                    document.getElementById("url-error").innerHTML = "❌ Custom Address Already Used, Choose Another";
                    document.getElementById("custom-alias").placeholder = document.getElementById("custom-alias").value;
                    document.getElementById("custom-alias").value = "";
                }
            } else {
                document.getElementById("url-error").style.color = "red";
                document.getElementById("url-error").innerHTML = "Invalid Custom URL! Use only Alphanumerics and underscore!";
                document.getElementById("custom-alias").placeholder = document.getElementById("custom-alias").value;
                document.getElementById("custom-alias").value = "";
            }
        }
    }
};
document.getElementById("shorten-url").addEventListener("click", shorturl);