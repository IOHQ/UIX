/*globals $*/
if (typeof window.$.extend !== 'function') {
    window.$.extend = function(){
        var arg = arguments, n;
        if (typeof arg[1] == 'object') for(n in arg[1]) $[arg[0]] = arg[1][n];
        else for(n in arg[0]) $[n] = arg[0][n]; 
    };
}