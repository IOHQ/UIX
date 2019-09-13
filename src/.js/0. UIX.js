/*globals $, Sizzle*/

var UIX = window.UIX = {
    version:"1.0.0", 
    author:"uix@iohq.org"
};

if (typeof $ == 'undefined') window.$ = function(arg){
    return Sizzle(arg);
};
