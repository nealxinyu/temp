"use strict";

$('#myskills-sync').on('click', function () {
  var userid = $('span #userid').text();
  startLoading('#myskills-sync');
  $.ajax({
    type: 'GET',
    url: "/skillset/api/staff/".concat(encodeURIComponent(userid), "/skills"),
    dataType: 'json'
  }).done(function (data) {
    if (data["status"] != "success") {
      error(data["errorMessage"], '#myskills-sync');
      return;
    }

    if (Object.keys(data["changes"]).length == 0) {
      success("no changes are made", '#myskills-sync');
      return;
    }

    for (var _i = 0, _Object$keys = Object.keys(data["changes"]); _i < _Object$keys.length; _i++) {
      var skill = _Object$keys[_i];
      addSkillToDom(skill);
    }

    success("".concat(Object.keys(data["changes"]).length, " changes are made"), '#myskills-sync');
  }).fail(function (res) {
    error("".concat(res.responseJSON.errorMessage), '#myskills-sync');
  });
});
$('#myskills-container').on('click', 'span[data-role=remove]', function (e) {
  e.stopPropagation();
  var skill = $(this).parent().attr('data-skill');
  $('#modal-delete-skill .skill').text(skill);
  $('#modal-delete-skill button').attr('data-skill', skill);
  $('#modal-delete-skill').modal('show');
});
$('#modal-delete-skill button[type=myskill-delete-skill]').on('click', function () {
  var userid = $('span #userid').text();
  var skill = $(this).attr('data-skill');
  startLoading();
  $.ajax({
    type: 'DELETE',
    url: "/skillset/api/staff/".concat(encodeURIComponent(userid), "/skill/").concat(encodeURIComponent(skill)),
    dataType: 'json'
  }).done(function (data) {
    if (data["status"] != "success") {
      error(data["errorMessage"]);
      return;
    }

    $("#myskills-container div[data-skill=\"".concat(data["deleted"], "\"]")).remove();
    success("".concat(data["deleted"], " is deleted"));
    $('#modal-delete-skill').modal('hide');
  }).fail(function (res) {
    error("".concat(res.responseJSON.errorMessage));
  });
});
$('#myskills-container').on('click', 'div[type=myskill-badge]', function () {
  var skill = $(this).attr('data-skill');
  $('#modal-update-proficiency .skill').text(skill);
  $('#modal-update-proficiency button').attr('data-skill', skill);
  $('#modal-update-proficiency').modal('show');
});
$('#myskills-add').on('mouseover', function () {
  $(this).find('input').focus();
});
$('#myskills-add input').on('keypress', function (e) {
  if (e.which == 13) {
    var skill = $('#myskills-add-input').val();
    var userid = $('span #userid').text();
    addSkill(userid, skill);
  }
});
$('#myskills-add-btn').on('click', function (e) {
  var skill = $('#myskills-add-input').val();
  var userid = $('span #userid').text();
  addSkill(userid, skill);
});

var addSkill = function addSkill(userid, skill) {
  startLoading('#myskills-add-btn');
  $.ajax({
    type: 'POST',
    url: "/skillset/api/staff/".concat(encodeURIComponent(userid), "/skills"),
    dataType: 'json',
    data: {
      skill: skill
    }
  }).done(function (data) {
    if (data["status"] != "success") {
      error(data["errorMessage"], '#myskills-add-btn');
      return;
    }

    var addedSkill = data["added"];
    addSkillToDom(addedSkill);
    $('#myskills-add-input').val('');
    success("".concat(addedSkill, " is added"), '#myskills-add-btn');
  }).fail(function (res) {
    error("".concat(res.responseJSON.errorMessage), '#myskills-add-btn');
  });
};

var addSkillToDom = function addSkillToDom(skill) {
  $('#myskills-container .badge-secondary').last().after("\n        <div type=\"myskill-badge\" data-skill=\"".concat(skill, "\" class=\"badge badge-myskill badge-md badge-secondary my-1\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"click to set the proficiency\">\n            <span>").concat(skill, "</span>\n            <span data-role=\"remove\"></span>\n        </div>\n    "));
};

$('button[type=myskill-update-proficiency]').on('click', function () {
  var userid = $('span #userid').text();
  var skill = $(this).attr("data-skill");
  var skillBadge = $("#myskills-container div[type=myskill-badge][data-skill=\"".concat(skill, "\"]"));
  $.ajax({
    type: 'PUT',
    url: "/skillset/api/staff/".concat(encodeURIComponent(userid), "/skill/").concat(encodeURIComponent(skill)),
    dataType: 'json',
    data: {
      proficiency: $(this).attr("proficiency")
    }
  }).done(function (res) {
    skillBadge.removeClass('badge-default').removeClass('badge-info').removeClass('badge-secondary').removeClass('badge-tertiary');

    switch (res.after) {
      case 0:
        $('#myskills-container .badge-tertiary').last().after(skillBadge).after(" ");
        skillBadge.addClass('badge-tertiary');
        break;

      case 1:
        $('#myskills-container .badge-secondary').last().after(skillBadge).after(" ");
        skillBadge.addClass('badge-secondary');
        break;

      case 2:
        $('#myskills-container .badge-info').last().after(skillBadge).after(" ");
        skillBadge.addClass('badge-info');
        break;

      case 3:
        $('#myskills-container .badge-default').last().after(skillBadge).after(" ");
        skillBadge.addClass('badge-default');
        break;

      default:
        break;
    }

    success("proficiency updated");
    $('#modal-update-proficiency').modal('hide');
  }).fail(function (res) {
    error("".concat(res.responseJSON.errorMessage));
  });
});