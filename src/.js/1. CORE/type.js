/*---
title: $.type
section: Tools
---
Get specific details on some data.
 
```javascript
$.type(5.2);
//  result -> {type: "float", native: "number", isNumber: true, isFloat: true, isOdd: true}
```

 
*/ 

/*globals $, print*/
 
if (!$.type) $.extend({
    "type": function(x){
         
        var native = typeof x;
        var type = native;
        var is = {};
         
        
        if (native == 'number' || native == 'string'){
            
            if (parseInt(x) == x) is.integar = "integar";
            else if (parseFloat(x) == x) is.float = "float";
            
            if (is.integar || is.float) {
                
                if (parseFloat(x) % 2 == 0) is.even = true;
                else is.odd = true;
                
                if (is.integar) is.whole = true; 
                
            }
            
        }
         
        if ( native == 'number') {
            
            
            if (is.float) type = 'float';
            else if (is.integar) type = 'integar';
        }
         
        
        if (native == 'object'){
            if (typeof Array.isArray === 'undefined') {
              Array.isArray = function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
              }
            };
            if (Array.isArray(x)) type = "array";
            type.isArray = true;
        }
        
        var details = {type:type, native:native};
        details["is" + $.capitalize(native)] = true;
        details["is" + $.capitalize(type.toString())] = true;
        for(var each in is) details["is" + $.capitalize(each)] = true;
         
        
        return details;
        
    },
    "compareType": function(a,b,c){
        var d = (typeof c=='string'?c:'type');
        return ($.type(a)[d] === $.type(b)[d]);
    }
});