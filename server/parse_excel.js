const xlsx = require('xlsx')

function readExcel(file){
    let wb = xlsx.readFile(file);
    let sheet_name_list = wb.SheetNames;
    let xlData = xlsx.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]);
    return xlData;
}

function readSkillsets(xlData) {
    let res = []
    xlData.forEach(row => {
        let person = {}
        let skills = []
        for (const [key, value] of Object.entries(row)) {
            if (key.toLowerCase().includes("skill")) {
                skills.push(value);
            }
        }
        person.id = row['Staff ID']
        person.name = row['Resource name']
        person.stream = row['Work stream']
        person.role = row['Role']
        person.skills = processSkills(skills);
        res.push(person)
    })
    return res;
}

function addProficiencySummary(persons) {
    Object.values(persons).forEach(detail => {
        let proficiencyDict = {
            'fresh': [],
            'junior': [],
            'proficient': [],
            'expert': []
        }

        Object.entries(detail.skills).forEach(([skillname, proficiency]) => {
            switch(proficiency) {
                case 0:
                    proficiencyDict['fresh'].push(skillname)
                    break
                case 1:
                    proficiencyDict['junior'].push(skillname)
                    break
                case 2:
                    proficiencyDict['proficient'].push(skillname)
                    break
                case 3:
                    proficiencyDict['expert'].push(skillname)
                    break
                default:
                    break
            }
        })

        detail.proficiency = proficiencyDict
    })

    return persons
}

// function readSurveySkillsets(xlData) {
//     let res = []
//     xlData.forEach(row => {
//         let person = {}
//         person.id = row['Staff ID']
//         person.name = row['Staff name']
//         delete row['Staff ID']
//         delete row['Staff name']
//         delete row['Created Time']
//         delete row['Update Time']
//         let skillsProficiency = {}
//         for (const [key, value] of Object.entries(row)) {
//             let proficiency = null;
//             switch(value) {
//                 case 'Rare experience, first touch or know about some concepts':
//                     proficiency = 0
//                     break
//                 case 'Junior level, used in 1-2 projects/use cases':
//                     proficiency = 1
//                     break
//                 case 'Proficient level, used 3 - 6 projects/use cases, understand the advanced usage':
//                     proficiency = 2
//                     break
//                 case 'Expert, master the advanced usage, understand the constraints, limits':
//                     proficiency = 3
//                     break
//                 default:
//                     proficiency = 0
//             }
//             skillsProficiency[key] = proficiency
//         }
//         person.skillsProficiency = skillsProficiency;
//         res.push(person)
//     })
//     for (let person of res) {
//         let sortedSkills = sortDictByValue(person.skillsProficiency)
//         let skills = {
//             'fresh': [],
//             'junior': [],
//             'proficient': [],
//             'expert': []
//         }
//         for (let s of sortedSkills) {
//             switch(s[1]) {
//                 case 0:
//                     skills['fresh'].push(s[0])
//                     break
//                 case 1:
//                     skills['junior'].push(s[0])
//                     break
//                 case 2:
//                     skills['proficient'].push(s[0])
//                     break
//                 case 3:
//                     skills['expert'].push(s[0])
//                     break
//                 default:
//                     proficiency = null
//             }
//         }
//         person.skills = skills
//     }
//     return res;
// }

// function sortDictByValue(dict) {
//     // Create items array
//     let items = Object.keys(dict).map(function(key) {
//         return [key, dict[key]];
//     });
  
//     // Sort the array based on the second element
//     items.sort(function(first, second) {
//         return second[1] - first[1];
//     });
  
//     return items;
// }

function processSkills(skills) {
    skills = [...new Set(skills)];
    return skills;
}

function getAllSkill(skillsets) {
    let res = []
    Object.values(skillsets).forEach(
        person => res = res.concat(Object.keys(person.skills))
    )
    res = sortByFrequencyAndRemoveDuplicates(res, true)
    return res;
}

function getAllRole(skillsets) {
    let res = []
    Object.values(skillsets).forEach(
        person => res = res.concat(person.role)
    )
    res = sortByFrequencyAndRemoveDuplicates(res, false)
    return res;
}

function getAllStream(skillsets) {
    let res = []
    Object.values(skillsets).forEach(
        person => res = res.concat(person.stream)
    )
    res = sortByFrequencyAndRemoveDuplicates(res, false)
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

module.exports = {
    readExcel,
    readSkillsets,
    addProficiencySummary,
    getAllSkill,
    getAllRole,
    getAllStream
}
  