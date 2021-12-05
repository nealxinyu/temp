const appName = process.env['APP_NAME'] || "skillset"

let loginRequired;

if (process.env['APP_NAME']) {
  loginRequired = (req, res, next) => {
    if (!req.cookies.apprunnersession) {
      res.redirect(`/login/?nextUrl=%2F${appName}%2F`);
      return;
    }
    try {
      const apprunnersession = JSON.parse(req.cookies.apprunnersession);
      res.locals.username = apprunnersession.displayName;  
      res.locals.userid = apprunnersession.adUserId;
    } catch (e) {
      console.log(e);
    }
    next();
  }
} else {
  loginRequired = (req, res, next) => {
    res.locals.username = "devuser";
    res.locals.userid = "34037436";
    
    next();
  }
}

module.exports = {
  loginRequired
}