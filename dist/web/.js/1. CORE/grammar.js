/* globals $ */

var grammar = {
    
/*---
title: $.capitalize
section: Grammar
---
Capitalize the first letter of a string.
```javascript
$.capitalize("hello!");
```
*/ 

    "capitalize": function(p){
        var cap = function(t){ return t.replace(/^./, t[0].toUpperCase()); };
        return cap(p);
    },
    
/*---
section: Grammar
title: $.lower
---
Convert a string to lowercase.
```javascript
return $.lower("HELLO!"); 
```
*/ 
    
    "lower": function(text){
        return text.toLowerCase();
    },
    
/*---
section: Grammar
title: $.upper
---
Convert a string to uppercase.
```javascript
return $.upper("hello!"); 
```
*/ 

    "upper": function(text){
        return text.toUpperCase();
    },
/*---
section: Grammar
title: $.camel
---
Convert some text to CamelCase.
```javascript
return $.camel("My Name Is Paul!"); 
```
*/    
    "camel": function(text){
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, function(w, i){ 
            return i == 0 ? w.toLowerCase() : w.toUpperCase(); 
        }).replace(/\s+/g, ''); 
    
    },
/*---
section: Grammar
title: $.getAlphaNumeric
---
Return only alpha-numeric characters.
```javascript
return $.getAlphaNumeric("Walter JR. is 17 years old.");
```
*/      
    "getAlphaNumeric": function(text){
        return text.replace(/[^0-9a-z]/gi, '');
    },
/*---
section: Grammar
title: $.getNumbers
---
Return only alpha-numeric characters.
```javascript
return $.getNumbers("Walter JR. is 17 years old."); 
```
*/     
    "getNumbers": function(text){
        return text.replace(/[^0-9]/gi, '');
    },
/*---
section: Grammar
title: $.getLetters
---
Return only alphabetical characters.
```javascript
return $.getLetters("WalterJRisyearsold"); 
```
*/     
    "getLetters": function(text){
        return text.replace(/[^a-z]/gi, '');
    }
    
};

$.extend(grammar);