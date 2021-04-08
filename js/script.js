// Имитатор плеера Articulate
function MimicPlayer() {
  this.storage = {};

  this.GetVar = function (variable) {
    if (typeof variable != "string") {
      throw new Error("Некорректное обращение");
    }

    if (this.storage[variable] != undefined) {
      return this.storage[variable];
    } else {
      throw new Error("Переменная " + variable + " не существует");
    }
  };
  this.SetVar = function (variable, newValue) {
    if (this.storage[variable] != undefined) {
      var oldType = typeof this.storage[variable],
        newType = typeof newValue;

      if (newType != oldType) {
        throw new Error(
          "Попытка присвоить переменной типа " + oldType + " тип " + newType
        );
        return false;
      }
    }
    this.storage[variable] = newValue;
    return true;
  };
  this.DelVar = function (variable) {
    if (this.storage[variable]) {
      delete this.storage[variable];
      return true;
    } else {
      throw new Error("Переменная " + variable + " не существует");
    }
  };
}

var player = parent.GetPlayer ? parent.GetPlayer() : new MimicPlayer();
var line = document.querySelector(".line-svg");

var point1 = document.querySelector("#l-p1");
var point2 = document.querySelector("#r-p1");

var x1 = point1.getBoundingClientRect().left + point1.offsetWidth / 2;
var x2 = point2.getBoundingClientRect().left + point2.offsetWidth / 2;

var y1 = point1.getBoundingClientRect().top + point1.offsetHeight / 2;
var y2 = point2.getBoundingClientRect().top + point2.offsetHeight / 2;

var draw = function () {
  line.setAttribute("x1", x1);
  line.setAttribute("x2", x2);
  line.setAttribute("y1", y1);
  line.setAttribute("y2", y2);
};

// var toggleActive = function (elem) {
//   elem.addEventListener('click', function () {
//     elem.classList.toggle('active');
//     var att = elem.getAttribute('id');
//     console.log(att);
//   });
// };

// var zones = document.querySelectorAll('.zone');

// for (var i = 0; i < zones.length; i += 1) {
//   var zone = zones[i];
//   toggleActive(zone);
// }

stringsController = {
  dataString: [
    { id: 1, currentRight: "", corerctRight: "", isCorrecrt: false },
    { id: 2, currentRight: "", corerctRight: "", isCorrecrt: false },
  ],
  activeElem: "",
  showData: function () {
    console.log(this.dataString);
  },
  getString: function (id) {
    var numId = Number(id);
    var strings = this.dataString;
    for (var i = 0; i < strings.length; i += 1) {
      var string = strings[i];
      if (string["id"] === numId) return string;
    }
  },
  setLeftValue: function (id, value) {
    var string = this.getString(id);
    string["left"] = value;
    return true;
  },
  clearLeftValue: function (id) {
    var string = this.getString(id);
    string["left"] = "";
  },
  behaviorActiveLeftColumn: function (elem) {
    elem.addEventListener("click", function () {
      var isActive = elem.classList.contains("active");
      var idAtt = elem.getAttribute("id");
      // var id = idAtt.slice(1);
      if (isActive) {
        elem.classList.remove("active");
        stringsController["activeElem"] = "";
        stringsController.toggleDisRightColumn();
        // stringsController.clearLeftValue(id);
        stringsController.showData();
        console.log(stringsController["activeElem"]);
        return true;
      }
      stringsController.removeActiveClass();
      elem.classList.add("active");
      // stringsController.setLeftValue(id, idAtt);
      stringsController["activeElem"] = idAtt;
      stringsController.toggleDisRightColumn();
      stringsController.showData();
      console.log(stringsController["activeElem"]);
    });
    return true;
  },
  behaviorActiveRightColumn: function (elem) {
    elem.addEventListener("click", function () {
      var isDisable = elem.classList.contains("disable");
      if (isDisable) return false;
      console.log("ok");
    });
    return true;
  },
  toggleDisRightColumn: function () {
    var isActive = this.activeElem;
    var rightElems = document.querySelectorAll(".right-column .zone");
    for (var i = 0; i < rightElems.length; i += 1) {
      var elem = rightElems[i];
      if (isActive === "") {
        elem.classList.add("disable");
      } else {
        elem.classList.remove("disable");
      }
    }
    return true;
  },
  removeActiveClass: function () {
    var elems = document.querySelectorAll(".left-column .zone");
    for (var i = 0; i < elems.length; i += 1) {
      var elem = elems[i];
      elem.classList.remove("active");
    }
    return true;
  },
  setToggle: function () {
    var leftElems = document.querySelectorAll(".left-column .zone");
    for (var i = 0; i < leftElems.length; i += 1) {
      var leftElem = leftElems[i];
      this.behaviorActiveLeftColumn(leftElem);
    }
    var rightElems = document.querySelectorAll(".right-column .zone");
    for (var i = 0; i < rightElems.length; i += 1) {
      var rightElem = rightElems[i];
      this.behaviorActiveRightColumn(rightElem);
    }
    return true;
  },
  shuffleRightColumn: function () {
    var rightColumn = document.querySelector(".right-column");
    var cloneNode = rightColumn.cloneNode(true);
    var cloneElems = cloneNode.querySelectorAll(".zone");
    var tempArr = [];
    for (var i = 0; i < cloneElems.length; i += 1) {
      tempArr.push(i);
    }
    for (var i = tempArr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = tempArr[i];
      tempArr[i] = tempArr[j];
      tempArr[j] = temp;
    }
    console.log(tempArr);
    while (rightColumn.firstChild) {
      rightColumn.removeChild(rightColumn.firstChild);
    }
    for (var i = 0; i < tempArr.length; i += 1) {
      var index = tempArr[i];
      rightColumn.appendChild(cloneElems[index]);
    }
  },
  saveCorrectValue: function () {
    var rightElems = document.querySelectorAll(".right-column .zone");
    for (var i = 0; i < rightElems.length; i += 1) {
      var elem = rightElems[i];
      var idElem = elem.getAttribute("id");
      var idNum = idElem.slice(1);
      console.log(idNum);
      var string = this.getString(idNum);
      var futureId = "r" + (i + 1);
      string["corerctRight"] = futureId;
    }
  },
  reWriteId: function () {
    var rightElems = document.querySelectorAll(".right-column .zone");
    for (var i = 0; i < rightElems.length; i += 1) {
      var elem = rightElems[i];
      var id = 'r' + (i+1);
      elem.setAttribute('id', id);
    }
  },
};

stringsController.setToggle();
