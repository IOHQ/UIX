/*globals $*/


// Requirements
$.extend({
    "CheckOption": function(rule, option){
      var opts = {}, n = null;
      for(var each in rule) n = each;
      opts[n] = option;
      return $.CheckOptions([rule], opts);  
    },
    "CheckOptions": function(rules, options){
        var errs = [];
        for(var n in rules){
            var r = rules[n];
            if (r.required && !options[n]) errs.push("'" + n + "' is required to be passed.");
            if (typeof r.type == 'string' && typeof options[n] !== r.type)  errs.push("'" + n + "' must be passed as type '" + r.type + "'.");
            if (typeof r.validation !== 'undefined' && r.validation.test(String(options[n]))) errs.push("'" + n + "' does not satisfy validation: '" + r.validation + "'");
        } 
        return (errs.length==0?true:errs);
    }
});