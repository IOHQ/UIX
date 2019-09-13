/*globals $*/
 
// $.cache([item_ids], {update}, callback())
// -or-
// $.cache('users', [item_ids], callback())
// -or-
// $.cache('users', callback())
// -or-
// $.cache('users', {"<item_id>": {update}})

// The cache store:
/**
$.data.users = {
	"a": {one:1, two:2, three:3},
	"b": {four:4, five:5, six:6},
	"c": {seven:7, eight:8, nine:9}
};

$.data.channels = {
	"a": {one:1, two:2, three:3},
	"b": {four:4, five:5, six:6},
	"c": {seven:7, eight:8, nine:9}
};
**/

// Configure where to get the cache from.
$.Cache = function(config){
	
	if (!config.cache) return new Error('"cache" function needs passed into the $.Cache config.');

	var $log = $.logging('$.Cache');
		
	// Query the Cache.
	var $t = config;
	
	if (!$t.lifespan) $t.lifespan = 10000;
	
	$.extend($t, {
		
		cache: config.cache,
			
		data: {},
		
		status: {},
		
		jobs: {},
		
		query: function(){
			 
			var ids = [], update = null, callback = function(){}, args = arguments;
			var upsert = null;
		
			for(var each in args) if (typeof args[each] == 'function') callback = args[each];
			
			
			if (typeof args[0] == 'string') ids = args[0].split(',');
			if (typeof args[0] == 'object'){
					
				// Arg 1 is an array of user_ids.
				if (typeof args[0].push == 'function') ids = args[0];
				 
				// Arg 1 is an upsert query.
				else {
					upsert = args[0];
				}
				
			}
			
			if (typeof args[1] == 'object') update = args[1];
		 
		  // Build the upsert.
		  if (!upsert && update) {
		  	upsert = {};
		  	ids.forEach(function(id){
		  		upsert[id] = JSON.parse(JSON.stringify(update));
		  	});	
		  }
		  
		  
		  // Upsert is built.
	
		  if (upsert) $t.write(upsert, callback);
		  else $t.read(ids, callback);
			  
			
		},
		
		write: function(upsert, recache){
			
			var start = Date.now();
			
			var ids = [];
			for(var each in upsert) ids.push(each);
			$t.read(ids, function(){
				
				var loop = function(write, read, item){
					 
					if (
						typeof read[item] == 'object' 
						&& read[item] !== null 
						&& typeof read[item].push !== 'function') {
						 
						if (!write[item]) write[item] = {_c:Date.now(), _u:Date.now()};
						else write[item]._m = Date.now();
						
						if (recache == true) write[item]._r = Date.now();
						
						for(var each in read[item]) loop(write[item], read[item], each);
					
						
					} else write[item] = read[item];
					
				};
				for(var each in upsert) loop($t.data, upsert, each);
	
				if (typeof recache == 'function') recache(null);
			});
			
			
		},
		
		get: function(id, callback){
			$t.read([id], function(data){
				callback(data[id]);	
			});
		},
		
		read: function(ids, callback){ 
			var updates = [], results = {};
			
			ids.forEach(function(id){
				
				if (
					typeof $t.data[id] !== 'object'
					||
					!$t.data[id]._r
					||
					(Date.now() - $t.data[id]._r) > $t.lifespan
				) {
					updates.push(id);
				}
				
			});
			 
			// Read the data.
			var read = function(){
				ids.forEach(function(id){
					results[id] = $t.data[id];
				});
				callback(results);
			};
			
				var args = {ids:updates},
					jobId = JSON.stringify(args);
					
			// If updates are needed, fetch them first.
			if (updates.length > 0) {
				
				if (!$t.jobs[jobId]) $t.jobs[jobId] = [];
				
				$t.jobs[jobId].push(read);
				$log('Added Job:', args);
				
				if ($t.jobs[jobId].length==1) $t.cache({ids: updates}, function(){
	
					$t.jobs[jobId].forEach(function(job){ 
						job();
						$log('Job Completed.');
						updates.forEach(function(id){
							if ($t.data[id]) $t.data[id]._r = Date.now();
						});
					});
					
					$t.jobs[jobId] = [];
					
				});
			} else read();
			 
			
		},
		
		clear: function(){
			$t.data = {};
		}
			
	 
	});
		
	return $t;
	
};