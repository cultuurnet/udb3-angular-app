try {
  new URL('http://uitdatabank.be');
} catch (e) {

  URL = function (uri) { // jshint ignore:line
    this.uri = uri;

    this.toString = function() {
      return this.uri;
    }
  };
}
