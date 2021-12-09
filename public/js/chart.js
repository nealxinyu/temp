"use strict";

function _objectValues(obj) {
  var values = [];
  var keys = Object.keys(obj);

  for (var k = 0; k < keys.length; k++) values.push(obj[keys[k]]);

  return values;
}

function _objectEntries(obj) {
  var entries = [];
  var keys = Object.keys(obj);

  for (var k = 0; k < keys.length; k++) entries.push([keys[k], obj[keys[k]]]);

  return entries;
}

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$('span[type=filter-badge-role],span[type=filter-badge-stream]').on('click', function () {
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected");
  } else {
    $(this).addClass("selected");
  }

  updateBarChart();
});
$('span[type=filter-badge-skill]').on('click', function () {
  $('span[type=filter-badge-skill]').removeClass("selected");
  $(this).addClass("selected");
  $('#modal-filter-2').modal('hide');
  updatePieChart();
});
$('#filter-search-input').on('input', function () {
  var keyword = $(this).val();
  searchKeyword(keyword);
});

var getSlectedOptions = function getSlectedOptions(type) {
  var res = [];
  $('span[type=' + type + '].selected').each(function () {
    res.push($(this).text());
  });
  return res;
};

var updateBarChart = function updateBarChart() {
  // get selected options
  var selectedRoles = getSlectedOptions("filter-badge-role");
  var selectedStreams = getSlectedOptions("filter-badge-stream");
  var filtered = [];

  if (selectedRoles.length == 0 && selectedStreams.length == 0) {
    filtered = rawdata;
  } else {
    if (selectedStreams.length == 0) {
      _objectValues(rawdata).forEach(function (person) {
        if (selectedRoles.some(function (x) {
          return x.toLowerCase() == person.role.toLowerCase();
        })) {
          filtered.push(person);
        }
      });
    } else if (selectedRoles.length == 0) {
      _objectValues(rawdata).forEach(function (person) {
        if (selectedStreams.some(function (x) {
          return x.toLowerCase() == person.stream.toLowerCase();
        })) {
          filtered.push(person);
        }
      });
    } else {
      var temp = [];

      _objectValues(rawdata).forEach(function (person) {
        if (selectedRoles.some(function (x) {
          return x.toLowerCase() == person.role.toLowerCase();
        })) {
          temp.push(person);
        }
      });

      var _loop = function _loop() {
        var person = _temp[_i];

        if (selectedStreams.some(function (x) {
          return x.toLowerCase() == person.stream.toLowerCase();
        })) {
          filtered.push(person);
        }
      };

      for (var _i = 0, _temp = temp; _i < _temp.length; _i++) {
        _loop();
      }
    }
  }

  var skills = getAllSkill(filtered);
  var labels = [];
  var data = [];

  var _iterator = _createForOfIteratorHelper(skills),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var skill = _step.value;
      labels.push(skill[0]);
      data.push(skill[1]);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  barChart.setOption({
    xAxis: {
      data: labels.slice(0, 20)
    },
    series: [{
      data: data.slice(0, 20)
    }]
  });
};

var updatePieChart = function updatePieChart() {
  // get selected options
  var selectedSkills = getSlectedOptions("filter-badge-skill");
  var selectedSkill;

  if (selectedSkills.length) {
    selectedSkill = selectedSkills[0];
  } else {
    return;
  }

  var roles = getAllRole(rawdata);
  var steams = getAllStream(rawdata);
  var roleChartData = {};

  var _iterator2 = _createForOfIteratorHelper(roles),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var role = _step2.value;
      roleChartData[role[0]] = {
        value: 0,
        name: role[0]
      };
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var streamChartData = {};

  var _iterator3 = _createForOfIteratorHelper(steams),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var stream = _step3.value;
      streamChartData[stream[0]] = {
        value: 0,
        name: stream[0]
      };
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  _objectValues(rawdata).forEach(function (person) {
    if (Object.keys(person.skills).some(function (x) {
      return x.toLowerCase() == selectedSkill.toLowerCase();
    })) {
      streamChartData[person.stream].value += 1;
      roleChartData[person.role].value += 1;
    }
  });

  var roleChartDataList = [];
  var streamChartDataList = [];

  for (var key in roleChartData) {
    roleChartDataList.push(roleChartData[key]);
  }

  for (var key in streamChartData) {
    streamChartDataList.push(streamChartData[key]);
  }

  pieChartRole.setOption({
    series: [{
      data: roleChartDataList
    }]
  });
  pieChartStream.setOption({
    series: [{
      data: streamChartDataList
    }]
  });
};

var initCharts = function initCharts() {
  addModalSettingOptionToChart(barChart, '#modal-filter-1');
  addModalSettingOptionToChart(pieChartRole, '#modal-filter-2');
  addModalSettingOptionToChart(pieChartStream, '#modal-filter-2');
  updateBarChart();
  $('span[type=filter-badge-skill]').first().click();
};

initCharts();

function addModalSettingOptionToChart(chart, modalId) {
  chart.setOption({
    toolbox: {
      feature: {
        mySetting: {
          show: true,
          icon: 'path://M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z',
          onclick: function onclick() {
            return $(modalId).modal();
          }
        }
      }
    }
  });
}

function getAllSkill(persons) {
  var res = [];

  _objectValues(persons).forEach(function (person) {
    var skills = Object.keys(person.skills);
    res = res.concat(skills);
  });

  res = sortByFrequencyAndRemoveDuplicates(res, true);
  return res;
}

function getAllRole(persons) {
  var res = [];

  _objectValues(persons).forEach(function (person) {
    return res = res.concat(person.role);
  });

  res = sortByFrequencyAndRemoveDuplicates(res, false);
  return res;
}

function getAllStream(persons) {
  var res = [];

  _objectValues(persons).forEach(function (person) {
    return res = res.concat(person.stream);
  });

  res = sortByFrequencyAndRemoveDuplicates(res, false);
  return res;
}

function sortByFrequencyAndRemoveDuplicates(array, isToUpperCase) {
  var frequency = {},
      value; // compute frequencies of each value

  for (var i = 0; i < array.length; i++) {
    value = isToUpperCase ? array[i].toUpperCase() : array[i];

    if (value in frequency) {
      frequency[value]++;
    } else {
      frequency[value] = 1;
    }
  } // make array from the frequency object to de-duplicate


  var uniques = [];

  for (value in frequency) {
    uniques.push(value);
  } // sort the uniques array in descending order by frequency


  uniques = uniques.sort(function (a, b) {
    return frequency[b] - frequency[a];
  }); // add frequency to the list

  var res = [];

  for (var _i2 = 0; _i2 < uniques.length; _i2++) {
    res.push([uniques[_i2], frequency[uniques[_i2]]]);
  }

  return res;
}

var updateSummary = function updateSummary(summary) {
  $('#summary-result-count').text(summary.result.length);
  $('#summary-selected-options').empty();

  var _iterator4 = _createForOfIteratorHelper(summary.selectedRoles),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var role = _step4.value;
      $('#summary-selected-options').append("<span class='badge badge-pill badge-person-info badge-md badge-warning badge-no-text-transform m-1'>" + role + "</span>");
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  var _iterator5 = _createForOfIteratorHelper(summary.selectedStreams),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var stream = _step5.value;
      $('#summary-selected-options').append("<span class='badge badge-pill badge badge-pill badge-person-info badge-md badge-info badge-no-text-transform m-1'>" + stream + "</span>");
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  var _iterator6 = _createForOfIteratorHelper(summary.selectedSkills),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var skill = _step6.value;
      $('#summary-selected-options').append("<span class='badge badge-md badge-secondary m-1'>" + skill + "</span>");
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
};

var filter_person_card_by_slected_options = function filter_person_card_by_slected_options(personCards, selected, type) {
  var res = personCards.filter(function () {
    isContain = false;
    $(this).find(type).each(function () {
      var _this = this;

      // let selectedLowercase = selected.map(v => v.toLowerCase());
      // if (selectedLowercase.includes($(this).text().toLowerCase())) {
      if (selected.some(function (x) {
        return x.toLowerCase() == $(_this).text().toLowerCase();
      })) {
        isContain = true;
        return;
      }
    });
    return isContain;
  });
  return res;
};

var searchKeyword = function searchKeyword(keyword) {
  $('span[type=filter-badge-skill]').removeClass("d-none");
  $('span[type=filter-badge-skill]').each(function () {
    if ($(this).text().toLowerCase().search(keyword.toLowerCase()) == -1) {
      $(this).addClass("d-none");
    }
  });
};

skillPriorityBarChart.on('click', function (params) {
  var modalSelector = '#modal-bar-detail';
  var filteredPersonData = updateBarDetailModal(modalSelector, params.seriesName, params.name);

  if (filteredPersonData.length) {
    $(modalSelector).modal();
  }
});

var sortByPriority = function sortByPriority() {
  var selected = {
    'Fresh': true,
    'Junior': true,
    'Proficient': true,
    'Master': true
  };
  skillPriorityBarChart.setOption({
    legend: {
      selected: selected
    }
  });
  updateSkillPriorityBarChart('priority', true);
};

var sortBy = 0;

var sortByParams = function sortByParams() {
  var keywords = ['Fresh', 'Junior', 'Proficient', 'Master'];
  var keyword = keywords[sortBy++ % 4];
  updateSkillPriorityBarChart(keyword);
  var selected = {
    'Fresh': false,
    'Junior': false,
    'Proficient': false,
    'Master': false
  };
  selected[keyword] = true;
  skillPriorityBarChart.setOption({
    legend: {
      selected: selected
    }
  });
};

var updateBarDetailModal = function updateBarDetailModal(modalSelector, proficiencyName, skillName) {
  var proficiencyNumber = getProficiencyNumber(proficiencyName);

  var filteredPersonData = _objectValues(rawdata).filter(function (person) {
    return proficiencyNumber == person['skills'][skillName];
  });

  $(modalSelector + ' #modal-bar-detail-title').html("".concat(filteredPersonData.length, " <span style=\"color:red\">").concat(proficiencyName, "</span> in <span style=\"color:red\">").concat(skillName, "</span>"));
  $(modalSelector + ' .row').html(getPersonCardHtml(filteredPersonData));
  $('span[type=modal-card-person-skill]').each(function () {
    if ($(this).text().toLowerCase() == skillName.toLowerCase()) {
      $(this).addClass("skill-highlight");
    }
  });
  return filteredPersonData;
};

var getPersonCardHtml = function getPersonCardHtml(personsData) {
  var res = "";

  var _iterator7 = _createForOfIteratorHelper(personsData),
      _step7;

  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var _personData$proficien, _personData$proficien2, _personData$proficien3, _personData$proficien4;

      var personData = _step7.value;
      res += "\n        <div type=\"modal-card-person\" class=\"col-sm-12 col-lg-4 col-xl-4\">\n            <div class=\"card my-2 d-flex flex-grow-1 border-0\">\n                <div class=\"card-body\">\n                    <h4 class=\"mb-0\">".concat(personData.name, "</h4>\n                    <div class=\"mb-4\">\n                        <p class=\"text-muted mb-0\">").concat(personData.id, "</p>\n                    </div>\n        ");

      if (personData !== null && personData !== void 0 && (_personData$proficien = personData.proficiency) !== null && _personData$proficien !== void 0 && _personData$proficien.expert) {
        var _iterator8 = _createForOfIteratorHelper(personData.proficiency.expert),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var skill = _step8.value;
            res += "\n<span type=\"modal-card-person-skill\" class=\"badge badge-md badge-default my-1\">".concat(skill, "</span>");
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }

      if (personData !== null && personData !== void 0 && (_personData$proficien2 = personData.proficiency) !== null && _personData$proficien2 !== void 0 && _personData$proficien2.proficient) {
        var _iterator9 = _createForOfIteratorHelper(personData.proficiency.proficient),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _skill = _step9.value;
            res += "\n<span type=\"modal-card-person-skill\" class=\"badge badge-md badge-info my-1\">".concat(_skill, "</span>");
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      }

      if (personData !== null && personData !== void 0 && (_personData$proficien3 = personData.proficiency) !== null && _personData$proficien3 !== void 0 && _personData$proficien3.junior) {
        var _iterator10 = _createForOfIteratorHelper(personData.proficiency.junior),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var _skill2 = _step10.value;
            res += "\n<span type=\"modal-card-person-skill\" class=\"badge badge-md badge-secondary my-1\">".concat(_skill2, "</span>");
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }

      if (personData !== null && personData !== void 0 && (_personData$proficien4 = personData.proficiency) !== null && _personData$proficien4 !== void 0 && _personData$proficien4.fresh) {
        var _iterator11 = _createForOfIteratorHelper(personData.proficiency.fresh),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var _skill3 = _step11.value;
            res += "\n<span type=\"modal-card-person-skill\" class=\"badge badge-md badge-secondary opacity-50 my-1\">".concat(_skill3, "</span>");
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
      }

      res += "\n                </div>\n            </div>\n        </div>\n        ";
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }

  return res;
};

var getProficiencyNumber = function getProficiencyNumber(proficiencyName) {
  var proficiencyDict = {
    'Fresh': 0,
    'Junior': 1,
    'Proficient': 2,
    'Master': 3
  };
  return proficiencyDict[proficiencyName];
};

var addSkillPriorityToDict = function addSkillPriorityToDict(skillsCount) {
  var skillPriority = departmentSkills; // $.ajax({
  //     type: 'GET',
  //     url: '/skillset/public/js/skill_priority.json',
  //     dataType: 'json',
  //     success: function(data) {skillPriority= data},
  //     data: {},
  //     async: false
  // });

  for (var key in skillsCount) {
    var priority = skillPriority[key];
    skillsCount[key]['priority'] = typeof priority == "undefined" ? 999 : priority;
  }

  return skillsCount;
};

var updateSkillPriorityBarChart = function updateSkillPriorityBarChart(sortKey) {
  var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // get selected options
  var skillsCount = getSkillsCount(rawdata);
  skillsCount = addSkillPriorityToDict(skillsCount);
  var skills = Object.keys(skillsCount);

  if (sortKey) {
    skills = Object.keys(skillsCount).sort(function (a, b) {
      if (reverse) {
        return skillsCount[a][sortKey] - skillsCount[b][sortKey];
      } else {
        return skillsCount[b][sortKey] - skillsCount[a][sortKey];
      }
    });
  }

  var stackedData = getDataForStackedBarChart(skillsCount, skills);
  skillPriorityBarChart.setOption({
    xAxis: {
      data: skills
    },
    series: [{
      name: 'Fresh',
      data: stackedData['Fresh']
    }, {
      name: 'Junior',
      data: stackedData['Junior']
    }, {
      name: 'Proficient',
      data: stackedData['Proficient']
    }, {
      name: 'Master',
      data: stackedData['Master']
    }, {
      name: 'Proficiency Index',
      data: stackedData['Proficiency Index']
    }]
  });
};

function getSkillsCount(rawdata) {
  var skillsCount = {};
  var skills = departmentSkills;

  var _iterator12 = _createForOfIteratorHelper(skills),
      _step12;

  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var s = _step12.value;
      skillsCount[s] = {
        'Fresh': 0,
        'Junior': 0,
        'Proficient': 0,
        'Master': 0
      };
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }

  _objectValues(rawdata).forEach(function (person) {
    for (var _i3 = 0, _Object$entries = _objectEntries(person.skills); _i3 < _Object$entries.length; _i3++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      if (!(key in skillsCount)) continue;

      switch (value) {
        case 0:
          skillsCount[key]['Fresh'] += 1;
          break;

        case 1:
          skillsCount[key]['Junior'] += 1;
          break;

        case 2:
          skillsCount[key]['Proficient'] += 1;
          break;

        case 3:
          skillsCount[key]['Master'] += 1;
          break;

        default:
          break;
      }
    }
  });

  return skillsCount;
}

function getDataForStackedBarChart(skillsCount, skills) {
  var stackedData = {
    'Fresh': [],
    'Junior': [],
    'Proficient': [],
    'Master': [],
    'Proficiency Index': []
  };

  var _iterator13 = _createForOfIteratorHelper(skills),
      _step13;

  try {
    for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
      var skill = _step13.value;
      stackedData['Fresh'].push(skillsCount[skill]['Fresh']);
      stackedData['Junior'].push(skillsCount[skill]['Junior']);
      stackedData['Proficient'].push(skillsCount[skill]['Proficient']);
      stackedData['Master'].push(skillsCount[skill]['Master']);
    }
  } catch (err) {
    _iterator13.e(err);
  } finally {
    _iterator13.f();
  }

  stackedData['Proficiency Index'] = getProficiencyIndex(stackedData);
  return stackedData;
}

function getProficiencyIndex(stackedData) {
  var res = [];

  for (var i = 0; i < stackedData['Fresh'].length; i++) {
    var proficiencyIndex = Math.round(stackedData['Fresh'][i] * 0 + stackedData['Junior'][i] * 0.34 + stackedData['Proficient'][i] * 0.67 + stackedData['Master'][i] * 1);
    res.push(proficiencyIndex);
  }

  return res;
}

var initSkillPriorityChart = function initSkillPriorityChart() {
  skillPriorityBarChart.setOption({
    toolbox: {
      feature: {
        mySortByParams: {
          show: true,
          icon: 'path://M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11z',
          onclick: sortByParams
        },
        mySortByPriority: {
          show: true,
          icon: 'path://M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38',
          onclick: sortByPriority
        }
      }
    }
  });
  updateSkillPriorityBarChart('priority', true);
};

initSkillPriorityChart();