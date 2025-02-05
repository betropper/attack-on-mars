(function() {

  function hasES6() {
    "use strict";

    if (typeof Symbol == "undefined") return false;
    try {
        eval("class Foo {}");
        eval("var bar = (x) => x+1");
    } catch (e) { return false; }

    return true;
  }

  if (hasES6()) {
    var name = document.currentScript.dataset.file;
    document.write('<script src="js/phaser.js"></script>');
    document.write('<script src="js/phaser-kinetic-scrolling-plugin.js"></script>');
    document.write('<script src="js/phaser-state-transition.js"></script>');
    document.write('<script id = "attackonmars" src="' + name + '"></script>');
  } else {
    document.write("<h1>Sorry, your browser is too old to play this game.</h1>"); 
  }

})();
