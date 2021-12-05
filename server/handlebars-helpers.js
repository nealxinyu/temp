module.exports = {
    isFromTheThird: function (index, options) {
      if (index >= 2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },

    section: function(name, block) { 
      if (!this._sections) this._sections = {};
      this._sections[name] = block.fn(this); 
      return null;
    },

    json: function(context) {
      return JSON.stringify(context);
    },

    eq: function(arg1, arg2) {
      return (arg1 == arg2) ? true : false;
    },

    len: function(obj) {
      return Object.keys(obj).length;
    },

    json: function(arg) {
      return JSON.stringify(arg);
    }
}