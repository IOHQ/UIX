/*
 * $.js
 */
 
 
<* // COMPILE FOLDERS.

    var compressed = [], uncompressed = [];
    
    function NAME(x){
        return x.split(".")[0].replace(/[^a-z]/gi, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(w, i){ 
            return i == 0 ? w.toLowerCase() : w.toUpperCase(); 
        }).replace(/\s+/g, '').replace(/^./, x[0].toUpperCase());  
    };
    
    function compress(x){
        x = fn.uncomment(x);
        x = fn.flatten(x);
        x = x
            .replace(/\ {1,5}/gi, " ")
            
            .replace(/\{ /gi, '{')
            .replace(/ \}/gi, '}')
            
            .replace(/\, \"/gi, ',"')
            .replace(/\i\f \(/gi, 'if(')
            .replace(/\e\l\s\e \{/gi, 'else{')
            
        ;
        return x;
    }
     
    fs.readdirSync(`${dir}/.js`).forEach(f=>{
        if (f.split('.')[1] == 'js' || f.split('.')[2] == 'js') {
            var js = include(`${dir}/.js/${f}`).toString();
            var pre = `var $log = $.logging("${NAME(f)}");`;
            uncompressed.push('(function ' + NAME(f) + '(){' + js + '})();'); 
            js = compress(js);
            compressed.push('(function ' + NAME(f) + '(){' + js + '})();');
        }
    });
    
    fs.readdirSync(`${dir}/.js`).forEach(f=>{
        if (f.split('.')[1] !== 'js' && f.split('.')[2] !== 'js') {
            fs.readdirSync(`${dir}/.js/${f}`).forEach(F=>{
                var js = include(`${dir}/.js/${f}/${F}`).toString();
                uncompressed.push('(function(){' + pre + js + '})();'); 
                js = compress(js);
                    var pre = `var $log = $.logging("${NAME(F)}");`;
                compressed.push('(function ' + NAME(F) + '(){' + pre + js + '})();');
            });
        }
    });
    
    
    
    
    ['elements','classes','modules','containers','views','options'].forEach(what=>{
        if (!fs.existsSync(`${dir}/components/${what}`)) return false;
        
        if (fs.existsSync(`${dir}/components/${what}/${what}.js`)) {
            let text = (include(`${dir}/components/${what}/${what}.js`).toString());
            var pre = `var $log = $.logging("${NAME(what)}");`;
            uncompressed.push('(function ' + NAME(what) + '(){' + pre + text + '})();');
            text = compress(text);
            compressed.push('(function ' + NAME(what) + '(){' + pre + text + '})();');
            
        }
         
        fn.directory(dir,'components',what).forEach(f=> { 
            if (!fs.existsSync(`${dir}/components/${what}/${f}/${f}.js`)) return false;
            let text = include(`${dir}/components/${what}/${f}/${f}.js`).toString(); 
            uncompressed.push((text.toString()));
            text = compress(text);
            var pre = `var $log = $.logging("${NAME(what)}_${NAME(f)}");`;
            compressed.push(`/*<${what}/${f.split('.')[0]}>*/\n(function  ${NAME(what)}_${NAME(f)}(){${pre} ${text.trim()}});\n`);
        });
    });
    
    fs.writeFileSync(`${dir}/dist/$.js.css`, uncompressed.join('\n'));
    global.doc({
      title: "$.UIX",
      inputDir: `${dir}/dist`,    // directory with the css files
      outputDir: `${dir}`  // directory that will be created the page
    });
-*>
 

<*-compressed.join('\n')-*>


$.extend({select: Sizzle, ejs:ejs});
$.UIX.init();