/*globals $*/
(function() {

  'use strict';

  function test(){
    $("code").forEach(function(element){

	  var result = null; 
  	if (
  	   /results/i.test(element.className)
  	|| element.className !== 'lang-css'
  	) return false;
  	
  
  	if (element.getAttribute('result_element')) 
  		result = $('#'+element.getAttribute('result_element'))[0];
  	else {
  		result = document.createElement('code');
  		result.id = $.uid();
  		result.setAttribute('class', 'lang-javascript results');
  		element.setAttribute('result_element', result.id);
  		element.parentElement.appendChild(result);
      }
      var code = element.innerText.replace(/return/gi, '');
  	if (!/\$log/.test(code)) try {
  		var r = eval(code);
  		r = r.replace(/>/gi, '&gt;').replace(/</gi, '&lt;');
  		result.innerHTML = '// <b>result:</b> ' + JSON.stringify(r, false, 2);
    } catch (e) { }
  
  });
  }

  function init() {

    var $menu  = document.querySelector('nav');
    var $links = $menu.querySelectorAll('a');
    var $docs  = document.querySelectorAll('section');  
    
    window.catalog = [];
    $('a').forEach(function(a){
      if (a.getAttribute('data-title')) catalog.push({
        name:  a.getAttribute('data-title'),
        desc:  a.getAttribute('data-description'),
        href:  a.getAttribute('href')
      });
    
    });
    
    // Example Options
    $('.example').forEach(function(element){
      element.addEventListener('click', function(){
        if (this.className == 'example pop') this.className = 'example';
        else this.className = 'example pop';
      });
    });
    
    $('section').forEach(function(element){
      element.addEventListener('click', function(){
        if ( !RegExp(this.id, 'i').test(window.location.href) ) window.location.href = '#' + this.id; 
      });
    });
    
    
    $('.search input')[0].addEventListener('keyup', function(){
      
      var term = $('.search input')[0].value;
      term = $.getAlphaNumeric(term);
     console.log(term);
     
      var found = false;
      
      catalog.forEach(function(i){
       if (new RegExp(term,'i').test(i.name)) found  = i.href;
      });
      
      if (!found) catalog.forEach(function(i){
        if (new RegExp(term,'i').test(i.desc)) found = i.href;
      });
      
      if (found) {
        window.location.href = found;
        selectLink( found.split('#')[1] );
        $('.search input')[0].focus();
      }
      
    });

    var map = function(el, fn){
      var a = [];
      var i = el.length;
      while (i--) {
        a.push(fn(el[i]));
      }
      return a;
    }

    map($links, function(link) {
      link.addEventListener('click', click);
    })

    var allDocs = map($docs, function(doc){
      return doc;
    });

    function click(e) {
      selectLink( e.target.getAttribute('href').split('#')[1] );
    }

    function scroll(e) {
      var gap = 200;
      var target = allDocs
        .filter(function(x){
          return x.getBoundingClientRect().top - gap < 0;
        })
        .reduce(function(a, b){
          if ( a && b ) {
            a = a.getBoundingClientRect().top - gap > b.getBoundingClientRect().top - gap ? a : b;
          } else if ( b ) {
            a = b;
          }
          return a;
        },false);
        if(target.getAttribute) window.history.replaceState({page: 3}, target.getAttribute('data-title'), '#' + target.id);
       selectLink(target.id);
    }

    function selectLink( href ) {
      $('section, article').forEach(function(element){
        element.classList.remove("selected");
      });
      if ( !href ) {
        return false;
      }
      var href = '#' + href,
          parent = href.split('_')[0],
          i = $links.length,
          link;
      map($links, function(link) {
        var linkHref = link.getAttribute('href');
  
        link.parentElement.classList.remove('selected');
        if( linkHref === href || linkHref === parent ) {
          $(linkHref)[0].classList.add('selected');
          $(linkHref.split("_")[0])[0].className = 'selected';
          link.parentElement.classList.add('selected');
        }
      });
     test();
    }

    function menuMain(e) { 
      $menu.classList.remove('opened');
    }

   
    $menu.addEventListener('click', menuMain, false );

    window.addEventListener('scroll', scroll, false );
    test();
  }

  document.addEventListener('DOMContentLoaded', init, false);

})();