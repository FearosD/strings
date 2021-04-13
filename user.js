var showCorrect = function () {
  var frames = document.querySelectorAll('iframe');
  for (var i = 0; i < frames.length; i += 1) {
    var frame = frames[i].contentDocument;
    var hasElem = frame.querySelector('#left_1');
    if (hasElem) {
      var frameObj = frames[i].contentWindow;
      break;
    }
  }
  frameObj.stringsController.showCorrect();
};
