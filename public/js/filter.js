"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$('span[type=filter-badge-skill],span[type=filter-badge-role],span[type=filter-badge-stream]').on('click', function () {
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected");
  } else {
    $(this).addClass("selected");
  }

  $('span[type=card-person-skill]').removeClass("skill-highlight");
  var smmmary = updateFilterResult();
  updateSummary(smmmary);
}); // $('span[type=filter-badge-skill-mode]').on('click', function() {
//     $('span[type=filter-badge-skill-mode]').removeClass("selected");
//     $(this).addClass("selected");
//     let smmmary = updateFilterResult();
//     updateSummary(smmmary);
// });

$('input[name="skill-filter-and-or-condition"]').on('change', function () {
  var smmmary = updateFilterResult();
  updateSummary(smmmary);
}); // $('#filter-search-input').on('input', function() {
//     let keyword = $(this).val()
//     let smmmary = searchKeyword(keyword);
//     updateSummary(smmmary);
// });

$('#skill-selector').select2({
  placeholder: "Type to search skills..."
}); // $("select").on("select2:select", function (evt) {
//     let $element = $(evt.params.data.element);
//     $element.detach();
//     $(this).append($element);
//     $(this).trigger("change");
// });

$('#skill-selector').on('change', function (ele) {
  $(this).parent().find('.select2-selection__choice').addClass('position-relative badge badge-md badge-secondary my-1 mr-1').removeClass('select2-selection__choice');
  $('span[type=card-person-skill]').removeClass("skill-highlight");
  var smmmary = updateFilterResult();
  updateSummary(smmmary);
  showHiddenSkills();
});

var updateFilterResult = function updateFilterResult() {
  // remove all display: none
  $('div[type=card-person]').removeClass("d-none"); // get selected options

  var selectedRoles = getSlectedOptions("filter-badge-role");
  var selectedStreams = getSlectedOptions("filter-badge-stream"); // let selectedSkills = getSlectedOptions("filter-badge-skill")

  var selectedSkills = getSlected("#skill-selector");
  var selectedMode = $('input[name="skill-filter-and-or-condition"]:checked').val(); // if no option selected, display all

  if (selectedRoles.length == 0 && selectedStreams.length == 0 && selectedSkills.length == 0) {
    return {
      result: $('div[type=card-person]'),
      selectedRoles: selectedRoles,
      selectedStreams: selectedStreams,
      selectedSkills: selectedSkills,
      selectedMode: selectedMode
    };
  } // filter person,


  var result = $('div[type=card-person]');
  result = selectedRoles.length == 0 ? result : filter_person_card_by_slected_options(result, selectedRoles, 'p[type=card-person-role]', null);
  result = selectedStreams.length == 0 ? result : filter_person_card_by_slected_options(result, selectedStreams, 'p[type=card-person-stream]', null);
  result = selectedSkills.length == 0 ? result : filter_person_card_by_slected_options(result, selectedSkills, 'span[type=card-person-skill]', selectedMode); // hide card 

  $('div[type=card-person]').not(result).addClass("d-none");
  return {
    result: result,
    selectedRoles: selectedRoles,
    selectedStreams: selectedStreams,
    selectedSkills: selectedSkills,
    selectedMode: selectedMode
  };
};

var updateSummary = function updateSummary(summary) {
  $('#summary-result-count').text(summary.result.length);
  $('#summary-selected-options').empty();

  if (summary.selectedRoles) {
    var _iterator = _createForOfIteratorHelper(summary.selectedRoles),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var role = _step.value;
        $('#summary-selected-options').append("<span class='badge badge-pill badge-person-info badge-md badge-warning badge-no-text-transform m-1'>" + role + "</span>");
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  if (summary.selectedStreams) {
    var _iterator2 = _createForOfIteratorHelper(summary.selectedStreams),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var stream = _step2.value;
        $('#summary-selected-options').append("<span class='badge badge-pill badge-person-info badge-md badge-info badge-no-text-transform m-1'>" + stream + "</span>");
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  } // if (summary.selectedMode) {
  //     $('#summary-selected-options').append("<span class='badge badge-pill badge-md badge-success m-1'>" + summary.selectedMode + "</span>");
  // }
  // if (summary.selectedSkills) {
  //     for (let skill of summary.selectedSkills) {
  //         $('#summary-selected-options').append("<span class='badge badge-md badge-secondary m-1'>" + skill + "</span>");
  //     }
  // }


  success("result updated, ".concat(summary.result.length, " found"));
};

var getSlectedOptions = function getSlectedOptions(type) {
  var res = [];
  $('span[type=' + type + '].selected').each(function () {
    res.push($(this).text());
  });
  return res;
};

var getSlected = function getSlected(selector) {
  var selected = $(selector).select2('data');
  var res = [];

  var _iterator3 = _createForOfIteratorHelper(selected),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      res.push(item.text);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return res;
};

var filter_person_card_by_slected_options = function filter_person_card_by_slected_options(personCards, selected, type, mode) {
  var res = personCards.filter(function () {
    var isContain = false;

    if (mode == 'or' || mode == null) {
      $(this).find(type).each(function () {
        var _this = this;

        if (selected.some(function (x) {
          return x.toLowerCase() == $(_this).text().toLowerCase();
        })) {
          $(this).addClass("skill-highlight");
          isContain = true;
          return;
        }
      });
    } else if (mode == 'and') {
      var personSkills = $(this).find(type).map(function () {
        var _this2 = this;

        if (selected.some(function (x) {
          return x.toLowerCase() == $(_this2).text().toLowerCase();
        })) {
          $(this).addClass("skill-highlight");
        }

        return $(this).text().toLowerCase();
      }).get();
      isContain = selected.every(function (v) {
        return personSkills.includes(v.toLowerCase());
      });
    }

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
}; // let el = document.getElementById('sortable-test');
// let sortable = Sortable.create(el);


$(".person-skills-container").has("span:nth-child(16)").append('<div class="showhide"><i class="fa fa-angle-down"></i></div>');
$(".person-skills-container").click(function () {
  var $this = $(this).find('i');
  $cards = $(this).closest('.person-skills-container');
  $cards.toggleClass('open');
  $this.toggleClass('fa-angle-down');
  $this.toggleClass('fa-angle-up');
});

var showHiddenSkills = function showHiddenSkills() {
  var showhide = $(".person-skills-container .showhide");
  var icon = showhide.find('i');
  var cards = icon.closest('.person-skills-container');
  cards.addClass('open');
  icon.removeClass('fa-angle-down');
  icon.addClass('fa-angle-up');
};