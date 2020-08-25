let postJsonbox = (address, longUrl, shortUrl) => {
    let request = new XMLHttpRequest();
    request.open("POST", address);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let data = {
        "url": longUrl,
        "alias": shortUrl
    };
    request.send(JSON.stringify(data));
};

let checkCustomUrlAlias = () => {
    document.getElementById("error-message").innerHTML = "";
    let customAlias = document.getElementById("url-alias").value;
    let jsonResponse = JSON.parse(getJsonbox(endpoint + "/?q=alias:" + customAlias));

    if (jsonResponse.length === 0){
        return true;
    }

    jsonResponse = jsonResponse[0]["url"]
    let data = jsonResponse;

    if (data != null) {
        return false;
    } else if (data == null) {
        return true;
    }
};

let getUrl = () => {
    let url = document.getElementById("long-url").value;

    return url;
};

let generateShortcode = () => {
    let shortcode = "";
    let possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
        shortcode += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
    }
    return shortcode;
};

let generateHash = () => {
    if (document.getElementById("url-alias").value == "") {
        window.location.hash = generateShortcode();
        checkIsUnique();
    } else {
        window.location.hash = document.getElementById("url-alias").value;
    }
};

let checkIsUnique = () => {
    let url = window.location.hash.substr(1);
    let jsonResponse = JSON.parse(getJsonbox(endpoint + "/?q=alias:" + url))[0];
    let data = jsonResponse;

    if (data != null) {
        generateHash();
    }
};

let copyToClipboard = (containerid) => {
    let elementType = document.getElementById(containerid);

    if (document.selection) { // IE
        if (elementType.nodeName.toLowerCase() === "input") {
            document.getElementById(containerid).select();
            document.execCommand("copy");
        } else {
            let range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
            document.execCommand("copy");
        }
    } else if (window.getSelection) {
        if (elementType.nodeName.toLowerCase() === "input") {
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

let sendRequest = (url) => {
    let longUrl = url;
    let shortUrl = window.location.hash.substr(1)
    let address = endpoint + "/";
    postJsonbox(address, longUrl, shortUrl);
    document.getElementById("short-url").value = window.location.href;
    document.getElementById("sucess-message").innerHTML = "Short URL created and copied to clipboard";
    copyToClipboard("short-url");
};

let shortUrl = () => {
    let longUrl = getUrl();
    let urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    let customAliasRegex = /^([a-zA-Z0-9 _-]+)$/;
    let prococolValid = urlRegex.test(longUrl);

    if (!prococolValid) {
        document.getElementById("error-message").innerHTML = "Invalid input. Make sure it starts with <code>http://</code> or <code>https://</code>";
    } else {
        document.getElementById("error-message").innerHTML = "";
        if (document.getElementById("url-alias").value == "") {
            generateHash();
            sendRequest(longUrl);
        } else {
            if (customAliasRegex.test(document.getElementById("url-alias").value)) {
                if (checkCustomUrlAlias()) {
                    generateHash();
                    sendRequest(longUrl);
                } else {
                    document.getElementById("error-message").innerHTML = "Custom alias in use, choose another alias";                }
            } else {
                document.getElementById("error-message").innerHTML = "Use only alphanumerics and underscore";
            }
        }
    }
};
document.getElementById("submit-button").addEventListener("click", shortUrl);