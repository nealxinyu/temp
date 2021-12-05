const parse_excel = require('../server/parse_excel.js')
const axios = require('axios')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const middleware = require("./middleware");
const validator = require("./validator");

const path = require('path');

const appName = process.env['APP_NAME'] || "skillset"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const constructorMethod = (app) => {

    app.get('/' + appName + '/chart', middleware.loginRequired, async (req, res) => {
        try {
            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            let persons = db.getState()
            persons = parse_excel.addProficiencySummary(persons);

            let skills = parse_excel.getAllSkill(persons);
            let roles = parse_excel.getAllRole(persons);
            let streams = parse_excel.getAllStream(persons);

            const adapter2 = new FileAsync(path.join(__dirname, '../data/db_survey_skill.json'))
            const db2 = await low(adapter2)
            let departmentSkills = db2.getState()
            
            let data = {
                title: "Chart",
                persons: persons,
                skills: skills,
                roles: roles,
                streams: streams,
                departmentSkills: departmentSkills.departmentSkills,
            }

            res.render('chart', data);
        } catch (e) {
            console.log(e);
            res.status(500);
            res.render('error', {title: 500, errorCode: 500});
        }
    });

    app.get('/' + appName + '/', middleware.loginRequired, async (req, res) => {
        try {
            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            // await db.read()
            const allStaff = db.getState()
            const teambook_skill_api = "https://teambook.hk.hsbc/api/v2/getskillsbyuser"
            let request_skill_list = []
            
            for (const staffid of Object.keys(allStaff)) {
                if (db.get(staffid).has("skills").value()) {
                    continue
                }
                request_skill_list.push(
                    axios.get(teambook_skill_api, {params: {staffid: staffid}})
                )
            }

            let skillRes = await axios.all(request_skill_list)
            skillRes.forEach(res => {
                const staffid = res.config.params.staffid
                const skills = res.data.reduce((acc, val) => acc.concat(val.Name), []);
                db.get(staffid).set("skills", skills).write()
            })

            let persons = db.getState()
            persons = parse_excel.addProficiencySummary(persons);

            let skills = parse_excel.getAllSkill(persons);
            let roles = parse_excel.getAllRole(persons);
            let streams = parse_excel.getAllStream(persons);
            
            let data = {
                title: "Home",
                persons: persons,
                skills: skills,
                roles: roles,
                streams: streams,
            }
            res.render('home', data);
        } catch (e) {
            console.log(e);
            res.status(500);
            res.render('error', {title: 500, errorCode: 500});
        }
    });

    app.put('/' + appName + '/api/staff/:staffid/skill/:skill', middleware.loginRequired, async (req, res) => {
        try {
            const userid = validator.validateStaffid(req.params.staffid)
            const skill = validator.validateSkill(req.params.skill)
            const proficiency = parseInt(validator.validateProficiency(req.body.proficiency))

            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            
            if (res.locals.userid != userid) throw "unauthorized user"
            if (!db.has(userid).value()) throw "user not in db"
            if (!db.get(userid).get("skills").has(skill).value()) throw "skill not in db"
            if (![0,1,2,3].includes(proficiency)) throw "invalid proficiency"

            const beforeUpdate = db.get(userid).get("skills").get(skill).value()
            db.get(userid).get("skills").set(skill, proficiency).write()
                        
            res.json({ 
                status: "success", 
                before: beforeUpdate,
                after: db.get(userid).get("skills").get(skill).value()
            });
        } catch (e) {
            res.status(400);
            res.json({status: "error", errorMessage: e});
        }
    });

    app.get('/' + appName + '/api/staff/:staffid/skills', middleware.loginRequired, async (req, res) => {
        try {
            const staffid = validator.validateStaffid(req.params.staffid)

            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            const staff = db.get(staffid).get("skills").value() 
            let skillList = Object.keys(staff).map(key => key.toLowerCase())
            
            const teambook_skill_api = "https://teambook.hk.hsbc/api/v2/getskillsbyuser"
            let skillRes = await axios.get(teambook_skill_api, {params: {staffid: staffid}})

            let changes = {}
            for (let skill of skillRes.data) {
                let skillName = skill['Name']
                if (skillList.includes(skillName.toLowerCase())) continue;
                db.get(staffid).get("skills").set(skillName, 1).write() // add to db
                changes[skillName] = 1 // save in changes for response
            }

            res.json({ 
                status: "success", 
                skills: db.get(staffid).get("skills").value(),
                changes: changes
            });
        } catch (e) {
            res.status(400);
            res.json({status: "error", errorMessage: e});
        }
    });
    
    app.post('/' + appName + '/api/staff/:staffid/skills', middleware.loginRequired, async (req, res) => {
        try {
            const staffid = validator.validateStaffid(req.params.staffid)
            const skillToAdd = validator.validateSkill(req.body.skill)
            
            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            const skills = db.get(staffid).get("skills").value() 

            for (let skill of Object.keys(skills)) {
                if (skillToAdd.toLocaleLowerCase() == skill.toLocaleLowerCase()) {
                    throw `${skillToAdd} already exist`
                }
            }

            let result = await db.get(staffid).get("skills").set(skillToAdd, 1).write() // add to db
            if (!result) {
                throw `something wrong while adding ${skillToAdd}`
            }

            res.json({ 
                status: "success", 
                added: skillToAdd
            });
        } catch (e) {
            res.status(400);
            res.json({status: "error", errorMessage: e});
        }
    });

    app.delete('/' + appName + '/api/staff/:staffid/skill/:skillname', middleware.loginRequired, async (req, res) => {
        try {
            const staffid = validator.validateStaffid(req.params.staffid)
            const skillname = validator.validateSkill(req.params.skillname)

            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            const skills = db.get(staffid).get("skills").value() 

            let match = false;
            for (let skill of Object.keys(skills)) {
                if (skill.toLocaleLowerCase() !== skillname.toLocaleLowerCase()) {
                    continue;
                }
                match = true;
                let result = await db.get(staffid).get("skills").unset(skill).write();
                if (!result) {
                    throw `something wrong while deleting ${skillname}`
                }
            }

            if (!match) {
                throw `${skillname} is not exist`
            }

            res.json({ 
                status: "success", 
                deleted: skillname
            });
        } catch (e) {
            res.status(400);
            res.json({status: "error", errorMessage: e});
        }
    });
    
    app.get('/' + appName + '/api/db', middleware.loginRequired, async (req, res) => {
        try {
            const adapter = new FileAsync(path.join(__dirname, '../data/db.json'))
            const db = await low(adapter)
            const data = db.getState()
            
            res.json(data);
        } catch (e) {
            res.status(400);
            res.json({status: "error", errorMessage: e});
        }
    });

    app.use('/' + appName + '/*', function(req, res) {
        res.status(404);
        res.render('error', {title: "Not Found", errorCode: 404});
    });

};

module.exports = constructorMethod