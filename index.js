var dist = require('distruct');
global.doc = require('./tools/doc');
  
global.fs = require('fs');
dist.config('./config.json');
dist.build();
dist.serve();