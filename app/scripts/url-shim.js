try {
    new URL('http://uitdatabank.be');
} catch (e) {
    function URL (uri) {
        this.uri = uri;
    }

    URL.prototype = {
        toString: function () {
            return this.uri;
        }
    }
}