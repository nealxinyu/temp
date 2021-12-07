"use strict";function _createForOfIteratorHelper(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,t=function(){};return{s:t,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,l=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){l=!0,s=e},f:function(){try{a||null==r.return||r.return()}finally{if(l)throw s}}}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(r="Object"===r&&e.constructor?e.constructor.name:r)||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}$("span[type=filter-badge-skill],span[type=filter-badge-role],span[type=filter-badge-stream]").on("click",function(){$(this).hasClass("selected")?$(this).removeClass("selected"):$(this).addClass("selected"),$("span[type=card-person-skill]").removeClass("skill-highlight");var e=updateFilterResult();updateSummary(e)}),$('input[name="skill-filter-and-or-condition"]').on("change",function(){var e=updateFilterResult();updateSummary(e)}),$("#skill-selector").select2({placeholder:"Type to search skills..."}),$("#skill-selector").on("change",function(e){$(this).parent().find(".select2-selection__choice").addClass("position-relative badge badge-md badge-secondary my-1 mr-1").removeClass("select2-selection__choice"),$("span[type=card-person-skill]").removeClass("skill-highlight");var t=updateFilterResult();updateSummary(t),showHiddenSkills()});var updateFilterResult=function(){$("div[type=card-person]").removeClass("d-none");var e=getSlectedOptions("filter-badge-role"),t=getSlectedOptions("filter-badge-stream"),r=getSlected("#skill-selector"),n=$('input[name="skill-filter-and-or-condition"]:checked').val();if(0==e.length&&0==t.length&&0==r.length)return{result:$("div[type=card-person]"),selectedRoles:e,selectedStreams:t,selectedSkills:r,selectedMode:n};var s=$("div[type=card-person]"),s=0==e.length?s:filter_person_card_by_slected_options(s,e,"p[type=card-person-role]",null);return s=0==t.length?s:filter_person_card_by_slected_options(s,t,"p[type=card-person-stream]",null),s=0==r.length?s:filter_person_card_by_slected_options(s,r,"span[type=card-person-skill]",n),$("div[type=card-person]").not(s).addClass("d-none"),{result:s,selectedRoles:e,selectedStreams:t,selectedSkills:r,selectedMode:n}},updateSummary=function(e){if($("#summary-result-count").text(e.result.length),$("#summary-selected-options").empty(),e.selectedRoles){var t,r=_createForOfIteratorHelper(e.selectedRoles);try{for(r.s();!(t=r.n()).done;){var n=t.value;$("#summary-selected-options").append("<span class='badge badge-pill badge-person-info badge-md badge-warning badge-no-text-transform m-1'>"+n+"</span>")}}catch(e){r.e(e)}finally{r.f()}}if(e.selectedStreams){var s,a=_createForOfIteratorHelper(e.selectedStreams);try{for(a.s();!(s=a.n()).done;){var l=s.value;$("#summary-selected-options").append("<span class='badge badge-pill badge-person-info badge-md badge-info badge-no-text-transform m-1'>"+l+"</span>")}}catch(e){a.e(e)}finally{a.f()}}success("result updated, ".concat(e.result.length," found"))},getSlectedOptions=function(e){var t=[];return $("span[type="+e+"].selected").each(function(){t.push($(this).text())}),t},getSlected=function(e){var t,r=[],n=_createForOfIteratorHelper($(e).select2("data"));try{for(n.s();!(t=n.n()).done;){var s=t.value;r.push(s.text)}}catch(e){n.e(e)}finally{n.f()}return r},filter_person_card_by_slected_options=function(e,r,n,s){return e.filter(function(){var t,e=!1;return"or"==s||null==s?$(this).find(n).each(function(){var t=this;r.some(function(e){return e.toLowerCase()==$(t).text().toLowerCase()})&&($(this).addClass("skill-highlight"),e=!0)}):"and"==s&&(t=$(this).find(n).map(function(){var t=this;return r.some(function(e){return e.toLowerCase()==$(t).text().toLowerCase()})&&$(this).addClass("skill-highlight"),$(this).text().toLowerCase()}).get(),e=r.every(function(e){return t.includes(e.toLowerCase())})),e})},searchKeyword=function(e){$("span[type=filter-badge-skill]").removeClass("d-none"),$("span[type=filter-badge-skill]").each(function(){-1==$(this).text().toLowerCase().search(e.toLowerCase())&&$(this).addClass("d-none")})};$(".person-skills-container").has("span:nth-child(16)").append('<div class="showhide"><i class="fa fa-angle-down"></i></div>'),$(".person-skills-container").click(function(){var e=$(this).find("i");$cards=$(this).closest(".person-skills-container"),$cards.toggleClass("open"),e.toggleClass("fa-angle-down"),e.toggleClass("fa-angle-up")});var showHiddenSkills=function(){var e=$(".person-skills-container .showhide").find("i");cards=e.closest(".person-skills-container"),cards.addClass("open"),e.removeClass("fa-angle-down"),e.addClass("fa-angle-up")};