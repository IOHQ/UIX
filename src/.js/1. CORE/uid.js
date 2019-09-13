/*---
title: $.uid
section: Tools
---
Generate a unique identifier.
 
```javascript
$.uid();
//  result -> {type: "float", native: "number", isNumber: true, isFloat: true, isOdd: true}
```
 

 
*/ 
$.uid = function(prefix){
    
    if (!window._UIDCOUNTER) window._UIDCOUNTER = Date.now();
    return (prefix?prefix:'a') + String(++window._UIDCOUNTER);
    
};