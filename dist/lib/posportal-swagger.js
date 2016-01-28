/**
 * Created by Michael Wenk on 1/25/16.
 */

var HMACRequestSigner = function(name, user, secret) {
    this.name = name;
    this.user = user;
    this.secret = secret;
}

HMACRequestSigner.prototype.apply = function(obj, authorizations ) {
    console.log('obj=');
    console.log(obj);
    hmacRequest(obj,this.user, this.secret);
    return true;



}

function hmacRequest(obj,apiKey,secret) {

    var timestamp = new Date().toISOString();
    var hashedEntity = "";

    if (obj.body != null) {
        hashedEntity = CryptoJS.SHA256(obj.body);
    }
    else {
        hashedEntity = "";
    }
    var contentType = obj.headers["Content-Type"];
    console.log("contentType=" + contentType);
    if (contentType == null) {
        contentType = "";
    }

    var hmacInput = obj.method + "\n" + contentType + "\n" + hashedEntity + "\n" + timestamp + "\n" + obj.url;
    console.log("hmacInput=" + hmacInput);
    var hmacOutput = CryptoJS.HmacSHA256(hmacInput, secret);
    obj.headers["Authorization"] = apiKey + ":" + hmacOutput.toString(CryptoJS.enc.Base64);
    obj.headers["Timestamp"] = timestamp;
}