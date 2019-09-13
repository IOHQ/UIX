/*---
title: JS Introduction
section: Views
---
 
Views are template-enabled components that can be passed content and style options.
 
*/

/*globals $*/
$.extend({
    
    /* Where all the views are stored. */
    "Views": {},
    
    /* Multipurpose function. */
    "View": function(){
        
        var arg = arguments;
        
        // Name is passed but view is not. We're pulling a view
        if (typeof arg[0] == 'string' && typeof arg[1] == 'object') {
         }  
        
        
        
    },
    
    /* Define a new view. */
    "ViewInstance": function(options){
        
        if(!$.CheckOptions([
            {name:"name", required:true, type:"string"},
            {name:"template", required:true, type:"string"},
            {name:"options", required:true, type:"object"}
        ], options)) return false;
        
        
    }
    
})