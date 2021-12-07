$('span[type=filter-badge-skill],span[type=filter-badge-role],span[type=filter-badge-stream]').on('click', function() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $(this).addClass("selected");
    }

    $('span[type=card-person-skill]').removeClass("skill-highlight")
    
    let smmmary = updateFilterResult();
    updateSummary(smmmary);
});

// $('span[type=filter-badge-skill-mode]').on('click', function() {
//     $('span[type=filter-badge-skill-mode]').removeClass("selected");
//     $(this).addClass("selected");
//     let smmmary = updateFilterResult();
//     updateSummary(smmmary);
// });

$('input[name="skill-filter-and-or-condition"]').on('change', function() {
    let smmmary = updateFilterResult();
    updateSummary(smmmary);
});

// $('#filter-search-input').on('input', function() {
//     let keyword = $(this).val()
//     let smmmary = searchKeyword(keyword);
//     updateSummary(smmmary);
// });

$('#skill-selector').select2({
    placeholder: "Type to search skills..."
});

// $("select").on("select2:select", function (evt) {
//     let $element = $(evt.params.data.element);
//     $element.detach();
//     $(this).append($element);
//     $(this).trigger("change");
// });

$('#skill-selector').on('change',function(ele){
    $(this)
        .parent()
        .find('.select2-selection__choice')
        .addClass('position-relative badge badge-md badge-secondary my-1 mr-1')
        .removeClass('select2-selection__choice')
    
    $('span[type=card-person-skill]').removeClass("skill-highlight")
    let smmmary = updateFilterResult();
    updateSummary(smmmary);
    showHiddenSkills()
});

let updateFilterResult = function() {
    // remove all display: none
    $('div[type=card-person]').removeClass("d-none")

    // get selected options
    let selectedRoles = getSlectedOptions("filter-badge-role")
    let selectedStreams = getSlectedOptions("filter-badge-stream")
    // let selectedSkills = getSlectedOptions("filter-badge-skill")
    let selectedSkills = getSlected("#skill-selector")
    let selectedMode =  $('input[name="skill-filter-and-or-condition"]:checked').val()

    // if no option selected, display all
    if (selectedRoles.length   == 0 &&
        selectedStreams.length == 0 &&
        selectedSkills.length   == 0) {
            return {    
                result: $('div[type=card-person]'),
                selectedRoles: selectedRoles,
                selectedStreams: selectedStreams,
                selectedSkills: selectedSkills,
                selectedMode: selectedMode
            }
    }
        
    // filter person,
    let result = $('div[type=card-person]')
    result = selectedRoles.length   == 0 ? result : filter_person_card_by_slected_options(result, selectedRoles, 'p[type=card-person-role]', null)
    result = selectedStreams.length == 0 ? result : filter_person_card_by_slected_options(result, selectedStreams, 'p[type=card-person-stream]', null)
    result = selectedSkills.length  == 0 ? result : filter_person_card_by_slected_options(result, selectedSkills, 'span[type=card-person-skill]', selectedMode)

    // hide card 
    $('div[type=card-person]').not(result).addClass("d-none")

    return {    result: result,
                selectedRoles: selectedRoles,
                selectedStreams: selectedStreams,
                selectedSkills: selectedSkills,
                selectedMode: selectedMode
            };
}

let updateSummary = function(summary) {
    $('#summary-result-count').text(summary.result.length);

    $('#summary-selected-options').empty();
    if (summary.selectedRoles) {
        for (let role of summary.selectedRoles) {
            $('#summary-selected-options').append("<span class='badge badge-pill badge-person-info badge-md badge-warning badge-no-text-transform m-1'>" + role + "</span>");
        }
    }
    if (summary.selectedStreams) {
        for (let stream of summary.selectedStreams) {
            $('#summary-selected-options').append("<span class='badge badge-pill badge-person-info badge-md badge-info badge-no-text-transform m-1'>" + stream + "</span>");
        }
    }
    // if (summary.selectedMode) {
    //     $('#summary-selected-options').append("<span class='badge badge-pill badge-md badge-success m-1'>" + summary.selectedMode + "</span>");
    // }
    // if (summary.selectedSkills) {
    //     for (let skill of summary.selectedSkills) {
    //         $('#summary-selected-options').append("<span class='badge badge-md badge-secondary m-1'>" + skill + "</span>");
    //     }
    // }

    success(`result updated, ${summary.result.length} found`)
}

let getSlectedOptions = function(type) {
    let res = []
    $('span[type='+type+'].selected').each(function() {
        res.push($(this).text());
    });
    return res
}

let getSlected = function(selector) {
    let selected = $(selector).select2('data');
    let res = []
    for (let item of selected) {
        res.push(item.text)
    }
    return res
}

let filter_person_card_by_slected_options = function(personCards, selected, type, mode) {
    let res = personCards.filter(function() {
        let isContain = false;
        if (mode == 'or' || mode == null) {
            $(this).find(type).each(function() {
                if (selected.some(x => x.toLowerCase() == $(this).text().toLowerCase())) {
                    $(this).addClass("skill-highlight")
                    isContain = true;
                    return;
                }
            })
        } else if (mode == 'and') {
            let personSkills = $(this).find(type).map(function(){
                if (selected.some(x => x.toLowerCase() == $(this).text().toLowerCase())) {
                    $(this).addClass("skill-highlight")
                }
                return $(this).text().toLowerCase()
            }).get()
            isContain = selected.every(v => personSkills.includes(v.toLowerCase()));
        }
        
        return isContain;
    });

    return res;
}

let searchKeyword = function(keyword) {
    $('span[type=filter-badge-skill]').removeClass("d-none")
    $('span[type=filter-badge-skill]').each(function() {
        if ($(this).text().toLowerCase().search(keyword.toLowerCase()) == -1) {
            $(this).addClass("d-none")
        }
    });
}



// let el = document.getElementById('sortable-test');
// let sortable = Sortable.create(el);


$(".person-skills-container").has("span:nth-child(16)").append('<div class="showhide"><i class="fa fa-angle-down"></i></div>');
$(".person-skills-container").click(function() {
    var $this = $(this).find('i')
    $cards = $(this).closest('.person-skills-container');
    $cards.toggleClass('open');
    $this.toggleClass('fa-angle-down')
    $this.toggleClass('fa-angle-up')
});

let showHiddenSkills = function() {
    let showhide = $(".person-skills-container .showhide")
    let icon = showhide.find('i')
    cards = icon.closest('.person-skills-container');
    cards.addClass('open');
    icon.removeClass('fa-angle-down');
    icon.addClass('fa-angle-up');
}
