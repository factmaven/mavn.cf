var endpoint = 'http://52.66.40.75/box_a7989c20a95c4e7be18c';

function getJsonbox(urlRequest) {
    var request = new XMLHttpRequest;
    request.open('GET', urlRequest, false);
    request.send(null);
    return request.responseText;
}

function isURL(urlRequest) {
    let url = urlRequest
    if (!urlRequest.startsWith('javascript:')) {
        return true;
    } else {
        return false;
    }
}
var hashtag = window.location.hash.substr(1);
if (window.location.hash != '') {
    var jsonReponse = JSON.parse(getJsonbox(endpoint + '/?q=alias:' + hashtag))[0];
    var data = jsonReponse['url'];
    console.log(data);
    if (data != null) {
        if (isURL(data)) {
            window.location.href = data;
        }
    }
}