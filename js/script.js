// Имитатор плеера Articulate
function MimicPlayer() {
  this.storage = {};

  this.GetVar = function (variable) {
    if (typeof variable != 'string') {
      throw new Error('Некорректное обращение');
    }

    if (this.storage[variable] != undefined) {
      return this.storage[variable];
    } else {
      throw new Error('Переменная ' + variable + ' не существует');
    }
  };
  this.SetVar = function (variable, newValue) {
    if (this.storage[variable] != undefined) {
      var oldType = typeof this.storage[variable],
        newType = typeof newValue;

      if (newType != oldType) {
        throw new Error(
          'Попытка присвоить переменной типа ' + oldType + ' тип ' + newType
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
      throw new Error('Переменная ' + variable + ' не существует');
    }
  };
}

var player = parent.GetPlayer ? parent.GetPlayer() : new MimicPlayer();

stringsController = {
  settingController: {
    showCorrect: true,
    sendArtVarCorrect: function () {
      return 'passed';
    },
    sendArtVarFailed: function () {
      return 'failed';
    },
    getArtVar: function () {
      return 'questionString_1';
    },
  },
  dataString: [{ id: 1, currentRight: '', correctRight: '', isCorrect: false }],
  activeLeftElem: '',
  activeRightElem: '',
  startElem: {},
  initData: function () {
    var leftElems = document.querySelectorAll('.left-column .zone');
    var currentLength = this.dataString.length;
    if (currentLength === leftElems.length) return false;
    var countIndexStrings = leftElems.length + 1;
    for (var i = 2; i < countIndexStrings; i += 1) {
      var string = {
        id: i,
        currentRight: '',
        correctRight: '',
        isCorrect: false,
      };
      this.dataString.push(string);
    }
    var rightColumn = document.querySelector('.right-column');
    var cloneNode = rightColumn.cloneNode(true);
    this.startElem = cloneNode;
  },
  showData: function () {
    console.log(this.dataString);
  },
  getString: function (id) {
    var numId = Number(id);
    var strings = this.dataString;
    for (var i = 0; i < strings.length; i += 1) {
      var string = strings[i];
      if (string['id'] === numId) return string;
    }
  },
  getStringFromRightId: function (rightId) {
    var strings = this.dataString;
    for (var i = 0; i < strings.length; i += 1) {
      var string = strings[i];
      if (string['currentRight'] === rightId) return string;
    }
  },
  removeActiveClass: function (childElem) {
    var parent = childElem.parentElement;
    var elems = parent.querySelectorAll('.zone');
    for (var i = 0; i < elems.length; i += 1) {
      var elem = elems[i];
      elem.classList.remove('active');
    }
    return true;
  },
  setActive: function (elem) {
    var idAtt = elem.getAttribute('id');
    var isActive = elem.classList.contains('active');
    stringsController.removeActiveClass(elem);
    var position = idAtt.indexOf('left') + 1 ? 'Left' : 'Right';
    if (isActive) {
      stringsController['active' + position + 'Elem'] = '';
      return false;
    }
    elem.classList.add('active');
    stringsController['active' + position + 'Elem'] = idAtt;
    return true;
  },
  drawLine: function (leftElem, rightElem) {
    var leftPoint = leftElem.querySelector('.point');
    var rightPoint = rightElem.querySelector('.point');
    var x1 = leftPoint.getBoundingClientRect().left + leftPoint.offsetWidth / 2;
    var x2 =
      rightPoint.getBoundingClientRect().left + rightPoint.offsetWidth / 2;
    var y1 = leftPoint.getBoundingClientRect().top + leftPoint.offsetHeight / 2;
    var y2 =
      rightPoint.getBoundingClientRect().top + rightPoint.offsetHeight / 2;
    var idAtt = leftElem.getAttribute('id');
    var id = idAtt.slice(-1);
    var idLine = 'line_' + id;
    var line = document.querySelector('.line-svg');
    var cloneLine = line.cloneNode(true);
    cloneLine.setAttribute('x1', x1);
    cloneLine.setAttribute('x2', x2);
    cloneLine.setAttribute('y1', y1);
    cloneLine.setAttribute('y2', y2);
    cloneLine.setAttribute('id', idLine);
    var svg = document.querySelector('svg');
    svg.appendChild(cloneLine);
  },
  setChecked: function () {
    var leftActiveElemId = stringsController['activeLeftElem'];
    var rightActiveElemId = stringsController['activeRightElem'];
    var notActiveElems = leftActiveElemId === '' || rightActiveElemId === '';
    if (notActiveElems) return false;
    var leftElem = document.querySelector('#' + leftActiveElemId);
    var rightElem = document.querySelector('#' + rightActiveElemId);
    this.removeActiveClass(leftElem);
    this.removeActiveClass(rightElem);
    leftElem.classList.add('checked');
    rightElem.classList.add('checked');
    this.drawLine(leftElem, rightElem);
    return true;
  },
  checkCorrect: function (string) {
    var current = string['currentRight'];
    var correct = string['correctRight'];
    var isCorrect = current === correct;
    string['isCorrect'] = isCorrect;
  },
  setActiveResult: function () {
    var leftActiveElemId = stringsController['activeLeftElem'];
    var rightActiveElemId = stringsController['activeRightElem'];
    var notActiveElems = leftActiveElemId === '' || rightActiveElemId === '';
    if (notActiveElems) return false;
    var activeLeftId = leftActiveElemId.slice(-1);
    var activeString = stringsController.getString(activeLeftId);
    activeString['currentRight'] = rightActiveElemId;
    stringsController.checkCorrect(activeString);
    stringsController['activeLeftElem'] = '';
    stringsController['activeRightElem'] = '';
    return true;
  },
  clearCheked: function (childElem) {
    var childId = childElem.getAttribute('id');
    var childIdNum = childId.slice(-1);
    var isLeft = childId.indexOf('left') + 1;
    var string = isLeft
      ? this.getString(childIdNum)
      : this.getStringFromRightId(childId);
    var lineId = 'line_' + string['id'];
    var svg = document.querySelector('svg');
    var line = document.querySelector('#' + lineId);
    if (line) svg.removeChild(line);
    var leftId = 'left_' + string['id'];
    var rightId = string['currentRight'];
    var leftElem = document.querySelector('#' + leftId);
    var rightElem = document.querySelector('#' + rightId);
    leftElem.classList.remove('checked');
    rightElem.classList.remove('checked');
    string['currentRight'] = '';
    string['isCorrect'] = false;
  },
  behaviorActiveElemsColumn: function (elem) {
    elem.addEventListener('click', function () {
      var isChecked = elem.classList.contains('checked');
      if (isChecked) {
        stringsController.clearCheked(elem);
        return true;
      }
      stringsController.setActive(elem);
      stringsController.setChecked();
      stringsController.setActiveResult();
    });
    return true;
  },
  setToggle: function () {
    var elems = document.querySelectorAll('.zone');
    for (var i = 0; i < elems.length; i += 1) {
      var elem = elems[i];
      this.behaviorActiveElemsColumn(elem);
    }
    return true;
  },
  shuffleRightColumn: function () {
    var rightColumn = document.querySelector('.right-column');
    var cloneNode = this.startElem.cloneNode(true);
    var cloneElems = cloneNode.querySelectorAll('.zone');
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
    while (rightColumn.firstChild) {
      rightColumn.removeChild(rightColumn.firstChild);
    }
    for (var i = 0; i < tempArr.length; i += 1) {
      var index = tempArr[i];
      rightColumn.appendChild(cloneElems[index]);
    }
  },
  saveCorrectValue: function () {
    var rightElems = document.querySelectorAll('.right-column .zone');
    for (var i = 0; i < rightElems.length; i += 1) {
      var elem = rightElems[i];
      var idElem = elem.getAttribute('id');
      var idNum = idElem.slice(-1);
      var string = this.getString(idNum);
      var futureId = 'right_' + (i + 1);
      string['correctRight'] = futureId;
    }
  },
  reWriteId: function () {
    var rightElems = document.querySelectorAll('.right-column .zone');
    for (var i = 0; i < rightElems.length; i += 1) {
      var elem = rightElems[i];
      var point = elem.querySelector('.point');
      var idPoint = 'right_p' + (i + 1);
      var id = 'right_' + (i + 1);
      elem.setAttribute('id', id);
      point.setAttribute('id', idPoint);
    }
  },
  clearAllData: function () {
    var strings = this.dataString;
    for (var i = 0; i < strings.length; i += 1) {
      var string = strings[i];
      string['correctRight'] = '';
      string['currentRight'] = '';
      string['isCorrect'] = false;
    }
    var leftElems = document.querySelectorAll('.left-column .zone');
    for (var i = 0; i < leftElems.length; i += 1) {
      var leftElem = leftElems[i];
      leftElem.classList.remove('checked');
      leftElem.classList.remove('active');
      leftElem.classList.remove('bad');
      leftElem.classList.remove('good');
    }
    var svg = document.querySelector('svg');
    while (svg.childNodes.length > 2) {
      svg.removeChild(svg.lastChild);
    }
  },
  checkCorrectQuestion: function () {
    var strings = this.dataString;
    var correctText = this.settingController.sendArtVarCorrect();
    var failedText = this.settingController.sendArtVarFailed();
    var showCorrect = this.settingController['showCorrect'];
    //    var text = document.querySelector('.text');
    var mistake = 0;
    for (var i = 0; i < strings.length; i += 1) {
      var string = strings[i];
      var isCorrect = string['isCorrect'];
      if (showCorrect) this.markString(string, isCorrect);
      mistake = isCorrect ? (mistake += 0) : (mistake += 1);
    }
    var result = mistake === 0 ? correctText : failedText;
    //    text.textContent = result;
    this.sendArticulateResult(result);
  },
  markString: function (string, mark) {
    var leftId = 'left_' + string['id'];
    var rightId = string['currentRight'];
    var leftElem = document.querySelector('#' + leftId);
    var rightElem = document.querySelector('#' + rightId);
    if (mark) {
      leftElem.classList.add('good');
      rightElem.classList.add('good');
    } else {
      leftElem.classList.add('bad');
      rightElem.classList.add('bad');
    }
    var close = document.querySelector('.close');
    var container = document.querySelector('.container');
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    close.style.width = width + 'px';
    close.style.height = height + 'px';
    close.style.display = 'block';
  },
  sendArticulateResult: function (value) {
    player.SetVar(this.settingController.getArtVar(), value);
  },
  init: function () {
    this.initData();
    this.shuffleRightColumn();
    this.saveCorrectValue();
    this.reWriteId();
    this.setToggle();
  },
  reload: function () {
    this.clearAllData();
    this.shuffleRightColumn();
    this.saveCorrectValue();
    this.reWriteId();
    var rightElems = document.querySelectorAll('.right-column .zone');
    for (var i = 0; i < rightElems.length; i += 1) {
      var rightElem = rightElems[i];
      rightElem.classList.add('disable');
      this.behaviorActiveElemsColumn(rightElem);
    }
    var close = document.querySelector('.close');
    close.style.display = 'none';
    // var text = document.querySelector('.text');
    // text.textContent = 'Результат';
  },
};

stringsController.init();
