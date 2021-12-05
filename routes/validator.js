const xss = require("xss");

let validateStaffid = (staffid) => {
    staffid = xss(staffid.trim())
    if (staffid.length == 0) throw "invalid staffid length"

    let rgx = /^\d+$/
    if (!staffid.match(rgx)) throw "invalid staffid"

    return staffid
}

let validateSkill = (skill) => {
    skill = xss(skill.trim())
    if (skill.length == 0) throw "invalid skill length"
    if (skill.length > 80) throw "skill length is too large"

    return skill
}

let validateProficiency = (proficiency) => {
    proficiency = xss(proficiency.trim())

    const valid = ['0', '1', '2', '3']
    if (!valid.includes(proficiency))  throw "invalid proficiency"

    return proficiency
}

module.exports = {
    validateStaffid,
    validateSkill,
    validateProficiency
}