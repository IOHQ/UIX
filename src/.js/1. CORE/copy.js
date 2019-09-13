/*---
title: $.copy
section: Tools
---
Create a copy of an object.
 
 
```javascript
var MyObject = { "a": 1 };
var NewObject = $.copy(MyObject);
NewObject.a++;

return JSON.stringify($log(MyObject), false ,2);
```

 
*/ 

/* globals $ */
$.extend({
    
    "copy": function $_copy(arg) {
        
        // recursive copy
        var copy = function(o){
            var out, v, key;
            out = Array.isArray(o) ? [] : {};
            for (key in o) {
                v = o[key];
                out[key] = (typeof v === "object" && v !== null) ? copy(v) : v;
            }
            return out;
        }; 
        
        // return the copy.
        return copy(arg);
        
    }
    
});