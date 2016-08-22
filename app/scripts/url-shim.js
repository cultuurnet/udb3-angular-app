try {
  new URL('http://uitdatabank.be');
} catch (e) {

  URL = function (uri) { // jshint ignore:line
    this.uri = uri;
  };

  URL.prototype = {
    toString: function () {
      return this.uri;
    }
  };
}
