$('span[type=filter-badge-role],span[type=filter-badge-stream]').on('click', function() {
    if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
    } else {
        $(this).addClass("selected");
    }
    
    updateBarChart();
});

$('span[type=filter-badge-skill]').on('click', function() {
    $('span[type=filter-badge-skill]').removeClass("selected");
    $(this).addClass("selected");
    $('#modal-filter-2').modal('hide')
    updatePieChart();
});

$('#filter-search-input').on('input', function() {
    let keyword = $(this).val()
    searchKeyword(keyword)
});

let getSlectedOptions = function(type) {
    let res = []
    $('span[type='+type+'].selected').each(function() {
        res.push($(this).text());
    });
    return res
}


let updateBarChart = function() {
    // get selected options
    let selectedRoles = getSlectedOptions("filter-badge-role")
    let selectedStreams = getSlectedOptions("filter-badge-stream")

    let filtered = [];
    if (selectedRoles.length == 0 && selectedStreams.length == 0) {
        filtered = rawdata;
    } else {
        if (selectedStreams.length == 0) {
            Object.values(rawdata).forEach(person => {
                if (selectedRoles.some(x => x.toLowerCase() == person.role.toLowerCase())) {
                    filtered.push(person);
                }
            })
        } else if (selectedRoles.length == 0) {
            Object.values(rawdata).forEach(person => {
                if (selectedStreams.some(x => x.toLowerCase() == person.stream.toLowerCase())) {
                    filtered.push(person);
                }
            })
        } else {
            let temp = []
            Object.values(rawdata).forEach(person => {
                if (selectedRoles.some(x => x.toLowerCase() == person.role.toLowerCase())) {
                    temp.push(person);
                }
            })
            for (let person of temp) {
                if (selectedStreams.some(x => x.toLowerCase() == person.stream.toLowerCase())) {
                    filtered.push(person);
                }
            }
        }
    }

    let skills = getAllSkill(filtered)
    let labels = []
    let data = []
    for (let skill of skills) {
        labels.push(skill[0])
        data.push(skill[1])
    }
    barChart.setOption({
        xAxis: {
            data: labels.slice(0, 20)
        },
        series: [{
            data: data.slice(0, 20)
        }]
    });
}

let updatePieChart = function() {
    // get selected options
    let selectedSkills = getSlectedOptions("filter-badge-skill")
    let selectedSkill
    if (selectedSkills.length) {
        selectedSkill = selectedSkills[0]
    } else {
        return;
    }

    let roles = getAllRole(rawdata)
    let steams = getAllStream(rawdata)

    let roleChartData = {}
    for (let role of roles) {
        roleChartData[role[0]] = {value: 0, name: role[0]}
    }

    let streamChartData = {}
    for (let stream of steams) {
        streamChartData[stream[0]] = {value: 0, name: stream[0]}
    }

    Object.values(rawdata).forEach(person => {
        if (Object.keys(person.skills).some(x => x.toLowerCase() == selectedSkill.toLowerCase())) {
            streamChartData[person.stream].value += 1
            roleChartData[person.role].value += 1
        }
    })

    let roleChartDataList = []
    let streamChartDataList = []
    for (var key in roleChartData) {
        roleChartDataList.push(roleChartData[key]);
    }
    for (var key in streamChartData) {
        streamChartDataList.push(streamChartData[key]);
    }

    pieChartRole.setOption({
        series: [
            {
                data: roleChartDataList,
            }
        ]
    });

    pieChartStream.setOption({
        series: [
            {
                data: streamChartDataList,
            }
        ]
    });
}



let initCharts = function() {
    addModalSettingOptionToChart(barChart, '#modal-filter-1')
    addModalSettingOptionToChart(pieChartRole, '#modal-filter-2')
    addModalSettingOptionToChart(pieChartStream, '#modal-filter-2')
    updateBarChart()
    $('span[type=filter-badge-skill]').first().click()
}

initCharts();

function addModalSettingOptionToChart(chart, modalId) {
    chart.setOption({
        toolbox: {
            feature: {
                mySetting: {
                    show: true,
                    icon: 'path://M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z',
                    onclick: () => $(modalId).modal()
                }
            }
        }
    })
}

function getAllSkill(persons) {
    let res = []
    Object.values(persons).forEach(
        person => {
            const skills = Object.keys(person.skills)
            res = res.concat(skills)
        }
    )
    res = sortByFrequencyAndRemoveDuplicates(res, isToUpperCase=true)
    return res;
}

function getAllRole(persons) {
    let res = []
    Object.values(persons).forEach(
        person => res = res.concat(person.role)
    )
    res = sortByFrequencyAndRemoveDuplicates(res, isToUpperCase=false)
    return res;
}

function getAllStream(persons) {
    let res = []
    Object.values(persons).forEach(
        person => res = res.concat(person.stream)
    )
    res = sortByFrequencyAndRemoveDuplicates(res, isToUpperCase=false)
    return res;
}

function sortByFrequencyAndRemoveDuplicates(array, isToUpperCase) {
    let frequency = {}, value;

    // compute frequencies of each value
    for(let i = 0; i < array.length; i++) {
        value = isToUpperCase ? array[i].toUpperCase() : array[i];
        if(value in frequency) {
            frequency[value]++;
        }
        else {
            frequency[value] = 1;
        }
    }

    // make array from the frequency object to de-duplicate
    let uniques = [];
    for(value in frequency) {
        uniques.push(value);
    }

    // sort the uniques array in descending order by frequency
    uniques = uniques.sort((a, b) => frequency[b] - frequency[a]);

    // add frequency to the list
    let res = []
    for (let i = 0; i < uniques.length; i++) {
        res.push([uniques[i], frequency[uniques[i]]])
    }
    return res;
}

let updateSummary = function(summary) {
    $('#summary-result-count').text(summary.result.length);
    $('#summary-selected-options').empty();
    for (let role of summary.selectedRoles) {
        $('#summary-selected-options').append("<span class='badge badge-pill badge-person-info badge-md badge-warning badge-no-text-transform m-1'>" + role + "</span>");
    }
    for (let stream of summary.selectedStreams) {
        $('#summary-selected-options').append("<span class='badge badge-pill badge badge-pill badge-person-info badge-md badge-info badge-no-text-transform m-1'>" + stream + "</span>");
    }
    for (let skill of summary.selectedSkills) {
        $('#summary-selected-options').append("<span class='badge badge-md badge-secondary m-1'>" + skill + "</span>");
    }
}

let filter_person_card_by_slected_options = function(personCards, selected, type) {
    let res = personCards.filter(function() {
        isContain = false;
        $(this).find(type).each(function() {
            // let selectedLowercase = selected.map(v => v.toLowerCase());
            // if (selectedLowercase.includes($(this).text().toLowerCase())) {
            if (selected.some(x => x.toLowerCase() == $(this).text().toLowerCase())) {
                isContain = true;
                return;
            }
        })
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















skillPriorityBarChart.on('click', function (params) {
    const modalSelector = '#modal-bar-detail'
    const filteredPersonData = updateBarDetailModal(modalSelector, params.seriesName, params.name);
    if (filteredPersonData.length) {
        $(modalSelector).modal()
    }
});

let sortByPriority = function() {
    let selected = {
        'Fresh': true,
        'Junior': true,
        'Proficient': true,
        'Master': true
    }
    skillPriorityBarChart.setOption({legend: { selected: selected} });

    updateSkillPriorityBarChart('priority', true);
}

let sortBy = 0;
let sortByParams = function() {
    const keywords = ['Fresh', 'Junior', 'Proficient', 'Master']
    const keyword = keywords[sortBy++ % 4]
    updateSkillPriorityBarChart(keyword);
    
    let selected = {
        'Fresh': false,
        'Junior': false,
        'Proficient': false,
        'Master': false
    }
    selected[keyword] = true
    skillPriorityBarChart.setOption({legend: { selected: selected} });
}

let updateBarDetailModal = function(modalSelector, proficiencyName, skillName) {
    const proficiencyNumber = getProficiencyNumber(proficiencyName)
    const filteredPersonData = Object.values(rawdata).filter(person => 
        proficiencyNumber == person['skills'][skillName]
    );

    $(modalSelector + ' #modal-bar-detail-title').html(`${filteredPersonData.length} <span style="color:red">${proficiencyName}</span> in <span style="color:red">${skillName}</span>`);
    $(modalSelector + ' .row').html(getPersonCardHtml(filteredPersonData));
    $('span[type=modal-card-person-skill]').each(function() {
        if ($(this).text().toLowerCase() == skillName.toLowerCase()) {
            $(this).addClass("skill-highlight")
        }
    });
    return filteredPersonData
}

let getPersonCardHtml = function(personsData) {
    let res = ""
    for (const personData of personsData) {
        res += `
        <div type="modal-card-person" class="col-sm-12 col-lg-4 col-xl-4">
            <div class="card my-2 d-flex flex-grow-1 border-0">
                <div class="card-body">
                    <h4 class="mb-0">${personData.name}</h4>
                    <div class="mb-4">
                        <p class="text-muted mb-0">${personData.id}</p>
                    </div>
        `
        if (personData?.proficiency?.expert) {
            for (const skill of personData.proficiency.expert) {
                res += `\n<span type="modal-card-person-skill" class="badge badge-md badge-default my-1">${skill}</span>`
            }
        }
        if (personData?.proficiency?.proficient) {
            for (const skill of personData.proficiency.proficient) {
                res += `\n<span type="modal-card-person-skill" class="badge badge-md badge-info my-1">${skill}</span>`
            }
        }
        if (personData?.proficiency?.junior) {
            for (const skill of personData.proficiency.junior) {
                res += `\n<span type="modal-card-person-skill" class="badge badge-md badge-secondary my-1">${skill}</span>`
            }
        }
        if (personData?.proficiency?.fresh) {
            for (const skill of personData.proficiency.fresh) {
                res += `\n<span type="modal-card-person-skill" class="badge badge-md badge-secondary opacity-50 my-1">${skill}</span>`
            }
        }
        res += `
                </div>
            </div>
        </div>
        `
    }
    return res
}

let getProficiencyNumber = function(proficiencyName) {
    const proficiencyDict = {
        'Fresh': 0,
        'Junior': 1,
        'Proficient': 2,
        'Master': 3
    }
    return proficiencyDict[proficiencyName]
}

let addSkillPriorityToDict = function(skillsCount) {
    let skillPriority = departmentSkills;
    // $.ajax({
    //     type: 'GET',
    //     url: '/skillset/public/js/skill_priority.json',
    //     dataType: 'json',
    //     success: function(data) {skillPriority= data},
    //     data: {},
    //     async: false
    // });
    for (const key in skillsCount) {
        let priority = skillPriority[key];
        skillsCount[key]['priority'] = (typeof priority == "undefined") ? 999 : priority;
    }
    return skillsCount
}

let updateSkillPriorityBarChart = function(sortKey, reverse = false) {
    // get selected options
    let skillsCount = getSkillsCount(rawdata)
    skillsCount = addSkillPriorityToDict(skillsCount)

    skills = Object.keys(skillsCount)
    if (sortKey) {
        skills = Object.keys(skillsCount).sort(function(a, b) {
            if (reverse) {
                return skillsCount[a][sortKey] - skillsCount[b][sortKey];
            } else {
                return skillsCount[b][sortKey] - skillsCount[a][sortKey];
            }
        })
    }

    let stackedData = getDataForStackedBarChart(skillsCount, skills)

    skillPriorityBarChart.setOption({
        xAxis: {
            data: skills
        },
        series: [
            {
                name: 'Fresh',
                data: stackedData['Fresh']
            },
            {
                name: 'Junior',
                data: stackedData['Junior']
            },
            {
                name: 'Proficient',
                data: stackedData['Proficient']
            },
            {
                name: 'Master',
                data: stackedData['Master']
            },
            {
                name: 'Proficiency Index',
                data: stackedData['Proficiency Index']
            }
        ]
    });
}

function getSkillsCount(rawdata) {
    let skillsCount = {}
    let skills = departmentSkills;
    for (let s of skills) {
        skillsCount[s] = {
            'Fresh': 0,
            'Junior': 0,
            'Proficient': 0,
            'Master': 0
        }
    }
   
    Object.values(rawdata).forEach(person => {
        for (const [key, value] of Object.entries(person.skills)) {
            if (!(key in skillsCount)) continue;
            switch (value) {
                case 0:
                    skillsCount[key]['Fresh'] += 1
                    break
                case 1:
                    skillsCount[key]['Junior'] += 1
                    break
                case 2:
                    skillsCount[key]['Proficient'] += 1
                    break
                case 3:
                    skillsCount[key]['Master'] += 1
                    break
                default:
                    break
            }
        }
    })

    return skillsCount
}

function getDataForStackedBarChart(skillsCount, skills) {
    let stackedData = {
        'Fresh' : [],
        'Junior': [],
        'Proficient': [],
        'Master': [],
        'Proficiency Index': []
    }
    
    for (let skill of skills) {
        stackedData['Fresh'].push(skillsCount[skill]['Fresh'])
        stackedData['Junior'].push(skillsCount[skill]['Junior'])
        stackedData['Proficient'].push(skillsCount[skill]['Proficient'])
        stackedData['Master'].push(skillsCount[skill]['Master'])
    }

    stackedData['Proficiency Index'] = getProficiencyIndex(stackedData)

    return stackedData;
}

function getProficiencyIndex(stackedData) {
    let res = []
    for (let i = 0; i < stackedData['Fresh'].length; i++) {
        const proficiencyIndex = Math.round(stackedData['Fresh'][i] * 0 + stackedData['Junior'][i] * 0.34 + stackedData['Proficient'][i] * 0.67 + stackedData['Master'][i] * 1)
        res.push(proficiencyIndex)
    }
    return res;
}

let initSkillPriorityChart = function() {
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
    })
    updateSkillPriorityBarChart('priority', true);
}

initSkillPriorityChart();