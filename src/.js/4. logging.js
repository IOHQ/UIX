/*---
title: $.logging
section: Tools
---
Enable a function-specific logging function.
```javascript
var $log = $.logging('My Category');
$log("Hello world!");
```


When passing multiple arguments, the console will create a group of the arguments prefixed by their type.
 
 
```javascript
// Post a simple log.
function MyFirstFunction(){
    var $log = $.logging('MyFirstFunction');
    $log('1+2 is ' + (1+2));
}

// Log something in groups.
function mySecondFunction(){
    var $log = $.logging('mySecondFunction');
    $log('1+1 is:', {answer:1+1}, 'but it is not: ' + (2+2));
}

MyFirstFunction();
mySecondFunction();
```

 
*/ 

/*global $*/
$.extend({
    "logs": {},
    "logging": function(what, toggle){
        
        var on = true;
        if (typeof toggle == 'boolean') on = toggle;
        
        if (typeof $.logs[what] == 'undefined') $.logs[what] = {
            name: what,
            t: Date.now(),
            logs: {}
        };
        
        return function(){
            
            try {
                if ($.cookie('_LOGGING')) $['log-config']  = JSON.parse($.cookie('_LOGGING'))["log-config"];
            } catch (e) {}
                
            if ( typeof $['log-config'] =='object' ){
             
                if (typeof $['log-config'][what] == 'boolean')  on = $['log-config'][what];
                else if (typeof $['log-config']['*'] == 'boolean')  on = $['log-config']['*'];
            }
                
            
            var data = [];
            for(var each in arguments) data.push(arguments[each]);
                
            var LogID = $.uid();
                
            $.logs[what].last = Date.now();
            $.logs[what].logs[LogID] = {data:({t:Date.now(), d:data})};
    
            if (on && typeof console == 'object' && typeof console.log == 'function' && typeof console.groupCollapsed == 'function'){
                var prefix = '%c[' + what + ']';
                
                var len = 16, pad = "";
                for(var l=prefix.length; l<len; l++) pad += " ";
                prefix = pad + prefix;
                     
                    
                var group = (data.length>1?true:false);
                if (group) console.groupCollapsed(prefix, 'color:cornflowerblue', data[0]);
                var x = 0;
                data.forEach(function(l){
                    x++;
                    var out = '<' + ($.type(l).type) + '>';
                    if (!group) console.log(prefix, 'color:cornflowerblue', l);
                    if (x==1) return false;
                    if (group) console.log('%c' + out, 'color:orange', l);
                });
                if (group) console.groupEnd();
            }
             
            return {
                tag: function(){
                    var tags = [];
                    for(var each in arguments) tags.push(arguments[each].trim());
                    $.logs[what].logs[LogID].tags = tags;
                }
            };
        };
    }
});