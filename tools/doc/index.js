var fs       = require('co-fs-extra'),
    marked   = require('marked'),
    matter   = require('gray-matter'),
    ejs      = require('ejs'),
    walkSync = require('walk-sync'),
    slug     = require('slug');

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js')
      .highlightAuto(code).value;
  }
});

var commentPattern = /\/\*---([\s\S]+?)?\*\//g,
    examplePattern = /```example([\s\S]+?)```/g,
    templatePath = __dirname + '/template';
    
var DEFAULT_OPTIONS = {
  base:                     '',
  title:                    'Extras',
  highlightTheme:           'github'
};

module.exports = doc;

function doc(opts){
  if (!(this instanceof doc)) {
    return new doc(opts);
  }
  this.opts = Object.assign({}, DEFAULT_OPTIONS, opts);
  this.comments = {};
  this.contents = [];
  this.run();
}

doc.prototype.run = function(){
  var paths = walkSync(this.opts.inputDir, { directories: false });
  var i = paths.length;
  var path;
  while (i--) {
    path = this.opts.inputDir +'/'+ paths[i];
    console.log('Reading file', path, '...'); 
    this.processFile(fs.readFileSync(path, 'utf8'));
  }
  this.compileTemplate();
};

doc.prototype.processFile = function(fileContent){ 
  var separated = this.separeCommentsOfContents(fileContent);
  this.addContent( separated.content );

  var index = -1;
  var total = separated.comment.length - 1;
  var comment,
      parsed,
      data,
      content;
  while (index++ < total) {
    comment = separated.comment[index];
    parsed = matter(comment);
    data = parsed.data;
    content = this.replaceExampleInPureHtml(parsed.content);
    content = marked(content);
    content = this.addHighlightTag(content);
    this.addComment(data, content);
  }
};

doc.prototype.separeCommentsOfContents = function(fileContent){
  var comments = [];
  fileContent = fileContent.replace(commentPattern, function(item){
    item = item.replace("section:", "reserved:");
    item = item.replace("title:", "section:");
    item = item.replace("reserved:", "title:");
    comments.push(item.replace('/*','').replace('*/',''));
    return '';
  });
  return {
    comment: comments,
    content: fileContent
  }
};

doc.prototype.replaceExampleInPureHtml = function(comment){
  return comment.replace(examplePattern, function(example){
        return [ '<div class="example clearfix">',
          example.replace(/(```example)/g,'').replace(/```/,'').replace(/^\n/,''),
          '</div>'].join('');
      });
};

doc.prototype.addHighlightTag = function(comment){
  return comment.
    replace(/<pre>/g, function(i) {
      return i.replace('>', ' class="hljs">').trim();
    });
};

doc.prototype.addContent = function(content){
  this.contents.push(content);
};

doc.prototype.addComment = function(data, content){
  if (!this.comments[data.title]) {
    this.comments[data.title] = {
      id: this.generateId(data.title),
      title: data.title,
      resume: data.resume,
      sections: []
    };
  }
  this.comments[data.title].sections.push( {
    id: this.generateId(data.section, data.title),
    title: data.section,
    content: content
  });
};

doc.prototype.generateId = function(string, prefix) {
  string = prefix ? prefix +'_'+ string : string ;
  return slug(string, { lower: true });
};

doc.prototype.compileTemplate = function(){ 
  var dest = this.opts.outputDir +'/index.html';
  var indexFile = fs.readFileSync(templatePath +'/index.html').toString();
   
  
  console.log('templating..');
  try {
    var tmpl = ejs.render(indexFile, {
      base:   this.opts.base,
      title:  this.opts.title,
      items:  this.comments
    }, {delimiter: "%"});
    fs.writeFileSync(dest, tmpl);
    console.log('Done! Page created in', dest);
  } catch (e) {
    e.message = 'Failed to create the files at: ' + this.opts.outputDir + '\n\n' + e.message;
    throw e;
  }
};
