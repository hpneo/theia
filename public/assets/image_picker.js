/*
    http://www.JSON.org/json2.js
    2009-04-16

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
var CodeMirrorConfig=window.CodeMirrorConfig||{},CodeMirror=function(){function D(a,b){for(var c in b)a.hasOwnProperty(c)||(a[c]=b[c])}function E(a,b){for(var c=0;c<a.length;c++)b(a[c])}function s(a){return document.createElementNS&&document.documentElement.namespaceURI!==null?document.createElementNS("http://www.w3.org/1999/xhtml",a):document.createElement(a)}function F(a,b){var c=s("div"),d=s("div");c.style.position="absolute";c.style.height="100%";if(c.style.setExpression)try{c.style.setExpression("height",
"this.previousSibling.offsetHeight + 'px'")}catch(h){}c.style.top="0px";c.style.left="0px";c.style.overflow="hidden";a.appendChild(c);d.className="CodeMirror-line-numbers";c.appendChild(d);d.innerHTML="<div>"+b+"</div>";return c}function G(a){if(typeof a.parserfile=="string")a.parserfile=[a.parserfile];if(typeof a.basefiles=="string")a.basefiles=[a.basefiles];if(typeof a.stylesheet=="string")a.stylesheet=[a.stylesheet];var b=['<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head>'];
b.push('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>');var c=a.noScriptCaching?"?nocache="+(new Date).getTime().toString(16):"";E(a.stylesheet,function(d){b.push('<link rel="stylesheet" type="text/css" href="'+d+c+'"/>')});E(a.basefiles.concat(a.parserfile),function(d){/^https?:/.test(d)||(d=a.path+d);b.push('<script type="text/javascript" src="'+d+c+'"><\/script>')});b.push('</head><body style="border-width: 0;" class="editbox" spellcheck="'+(a.disableSpellcheck?"false":"true")+'"></body></html>');
return b.join("")}function t(a,b){this.options=b=b||{};D(b,CodeMirrorConfig);if(b.dumbTabs)b.tabMode="spaces";else if(b.normalTab)b.tabMode="default";if(b.cursorActivity)b.onCursorActivity=b.cursorActivity;var c=this.frame=s("iframe");if(b.iframeClass)c.className=b.iframeClass;c.frameBorder=0;c.style.border="0";c.style.width="100%";c.style.height="100%";c.style.display="block";var d=this.wrapping=s("div");d.style.position="relative";d.className="CodeMirror-wrapping";d.style.width=b.width;d.style.height=
b.height=="dynamic"?b.minHeight+"px":b.height;var h=this.textareaHack=s("textarea");d.appendChild(h);h.style.position="absolute";h.style.left="-10000px";h.style.width="10px";h.tabIndex=1E5;c.CodeMirror=this;if(b.domain&&H){this.html=G(b);c.src="javascript:(function(){document.open();"+(b.domain?'document.domain="'+b.domain+'";':"")+"document.write(window.frameElement.CodeMirror.html);document.close();})()"}else c.src="javascript:;";a.appendChild?a.appendChild(d):a(d);d.appendChild(c);if(b.lineNumbers)this.lineNumbers=
F(d,b.firstLineNumber);this.win=c.contentWindow;if(!b.domain||!H){this.win.document.open();this.win.document.write(G(b));this.win.document.close()}}D(CodeMirrorConfig,{stylesheet:[],path:"",parserfile:[],basefiles:["util.js","stringstream.js","select.js","undo.js","editor.js","tokenize.js"],iframeClass:null,passDelay:200,passTime:50,lineNumberDelay:200,lineNumberTime:50,continuousScanning:false,saveFunction:null,onLoad:null,onChange:null,undoDepth:50,undoDelay:800,disableSpellcheck:true,textWrapping:true,
readOnly:false,width:"",height:"300px",minHeight:100,autoMatchParens:false,markParen:null,unmarkParen:null,parserConfig:null,tabMode:"indent",enterMode:"indent",electricChars:true,reindentOnLoad:false,activeTokens:null,onCursorActivity:null,lineNumbers:false,firstLineNumber:1,onLineNumberClick:null,indentUnit:2,domain:null,noScriptCaching:false,incrementalLoading:false});var H=document.selection&&window.ActiveXObject&&/MSIE/.test(navigator.userAgent);t.prototype={init:function(){this.options.initCallback&&
this.options.initCallback(this);this.options.onLoad&&this.options.onLoad(this);this.options.lineNumbers&&this.activateLineNumbers();this.options.reindentOnLoad&&this.reindent();this.options.height=="dynamic"&&this.setDynamicHeight()},getCode:function(){return this.editor.getCode()},setCode:function(a){this.editor.importCode(a)},selection:function(){this.focusIfIE();return this.editor.selectedText()},reindent:function(){this.editor.reindent()},reindentSelection:function(){this.focusIfIE();this.editor.reindentSelection(null)},
focusIfIE:function(){this.win.select.ie_selection&&document.activeElement!=this.frame&&this.focus()},focus:function(){this.win.focus();this.editor.selectionSnapshot&&this.win.select.setBookmark(this.win.document.body,this.editor.selectionSnapshot)},replaceSelection:function(a){this.focus();this.editor.replaceSelection(a);return true},replaceChars:function(a,b,c){this.editor.replaceChars(a,b,c)},getSearchCursor:function(a,b,c){return this.editor.getSearchCursor(a,b,c)},undo:function(){this.editor.history.undo()},
redo:function(){this.editor.history.redo()},historySize:function(){return this.editor.history.historySize()},clearHistory:function(){this.editor.history.clear()},grabKeys:function(a,b){this.editor.grabKeys(a,b)},ungrabKeys:function(){this.editor.ungrabKeys()},setParser:function(a,b){this.editor.setParser(a,b)},setSpellcheck:function(a){this.win.document.body.spellcheck=a},setStylesheet:function(a){if(typeof a==="string")a=[a];for(var b={},c={},d=this.win.document.getElementsByTagName("link"),h=0,
e;e=d[h];h++)if(e.rel.indexOf("stylesheet")!==-1)for(var f=0;f<a.length;f++){var n=a[f];if(e.href.substring(e.href.length-n.length)===n){b[e.href]=true;c[n]=true}}for(h=0;e=d[h];h++)if(e.rel.indexOf("stylesheet")!==-1)e.disabled=!(e.href in b);for(f=0;f<a.length;f++){n=a[f];if(!(n in c)){e=this.win.document.createElement("link");e.rel="stylesheet";e.type="text/css";e.href=n;this.win.document.getElementsByTagName("head")[0].appendChild(e)}}},setTextWrapping:function(a){if(a!=this.options.textWrapping){this.win.document.body.style.whiteSpace=
a?"":"nowrap";this.options.textWrapping=a;if(this.lineNumbers){this.setLineNumbers(false);this.setLineNumbers(true)}}},setIndentUnit:function(a){this.win.indentUnit=a},setUndoDepth:function(a){this.editor.history.maxDepth=a},setTabMode:function(a){this.options.tabMode=a},setEnterMode:function(a){this.options.enterMode=a},setLineNumbers:function(a){if(a&&!this.lineNumbers){this.lineNumbers=F(this.wrapping,this.options.firstLineNumber);this.activateLineNumbers()}else if(!a&&this.lineNumbers){this.wrapping.removeChild(this.lineNumbers);
this.wrapping.style.paddingLeft="";this.lineNumbers=null}},cursorPosition:function(a){this.focusIfIE();return this.editor.cursorPosition(a)},firstLine:function(){return this.editor.firstLine()},lastLine:function(){return this.editor.lastLine()},nextLine:function(a){return this.editor.nextLine(a)},prevLine:function(a){return this.editor.prevLine(a)},lineContent:function(a){return this.editor.lineContent(a)},setLineContent:function(a,b){this.editor.setLineContent(a,b)},removeLine:function(a){this.editor.removeLine(a)},
insertIntoLine:function(a,b,c){this.editor.insertIntoLine(a,b,c)},selectLines:function(a,b,c,d){this.win.focus();this.editor.selectLines(a,b,c,d)},nthLine:function(a){for(var b=this.firstLine();a>1&&b!==false;a--)b=this.nextLine(b);return b},lineNumber:function(a){for(var b=0;a!==false;){b++;a=this.prevLine(a)}return b},jumpToLine:function(a){if(typeof a=="number")a=this.nthLine(a);this.selectLines(a,0);this.win.focus()},currentLine:function(){return this.lineNumber(this.cursorLine())},cursorLine:function(){return this.cursorPosition().line},
cursorCoords:function(a){return this.editor.cursorCoords(a)},activateLineNumbers:function(){function a(){if(e.offsetWidth!=0){for(var g=e;g.parentNode;g=g.parentNode);if(!i.parentNode||g!=document||!f.Editor){try{y()}catch(k){}clearInterval(J)}else if(i.offsetWidth!=z){z=i.offsetWidth;e.parentNode.style.paddingLeft=z+"px"}}}function b(){i.scrollTop=q.scrollTop||n.documentElement.scrollTop||0}function c(g){var k=l.firstChild.offsetHeight;if(k!=0){k=Math.ceil((50+Math.max(q.offsetHeight,Math.max(e.offsetHeight,
q.scrollHeight||0)))/k);for(var o=l.childNodes.length;o<=k;o++){var w=s("div");w.appendChild(document.createTextNode(g?String(o+j.options.firstLineNumber):"\u00a0"));l.appendChild(w)}}}function d(){function g(){c(true);b()}j.updateNumbers=g;var k=f.addEventHandler(f,"scroll",b,true),o=f.addEventHandler(f,"resize",g,true);y=function(){k();o();if(j.updateNumbers==g)j.updateNumbers=null};g()}function h(){function g(p,A){r||(r=l.appendChild(s("div")));I&&I(r,A,p);u.push(r);u.push(p);B=r.offsetHeight+
r.offsetTop;r=r.nextSibling}function k(){for(var p=0;p<u.length;p+=2)u[p].innerHTML=u[p+1];u=[]}function o(){if(!(!l.parentNode||l.parentNode!=j.lineNumbers)){for(var p=(new Date).getTime()+j.options.lineNumberTime;m;){for(g(C++,m.previousSibling);m&&!f.isBR(m);m=m.nextSibling)for(var A=m.offsetTop+m.offsetHeight;l.offsetHeight&&A-3>B;)g("&nbsp;");if(m)m=m.nextSibling;if((new Date).getTime()>p){k();v=setTimeout(o,j.options.lineNumberDelay);return}}for(;r;)g(C++);k();b()}}function w(p){b();c(p);m=
q.firstChild;r=l.firstChild;B=0;C=j.options.firstLineNumber;o()}function x(){v&&clearTimeout(v);if(j.editor.allClean())w();else v=setTimeout(x,200)}var m,r,C,B,u=[],I=j.options.styleNumbers;w(true);var v=null;j.updateNumbers=x;var K=f.addEventHandler(f,"scroll",b,true),L=f.addEventHandler(f,"resize",x,true);y=function(){v&&clearTimeout(v);if(j.updateNumbers==x)j.updateNumbers=null;K();L()}}var e=this.frame,f=e.contentWindow,n=f.document,q=n.body,i=this.lineNumbers,l=i.firstChild,j=this,z=null;i.onclick=
function(g){var k=j.options.onLineNumberClick;if(k){g=(g||window.event).target||(g||window.event).srcElement;var o=g==i?NaN:Number(g.innerHTML);isNaN(o)||k(o,g)}};var y=function(){};a();var J=setInterval(a,500);(this.options.textWrapping||this.options.styleNumbers?h:d)()},setDynamicHeight:function(){function a(){for(var q=0,i=h.lastChild,l;i&&d.isBR(i);){i.hackBR||q++;i=i.previousSibling}if(i){e=i.offsetHeight;l=i.offsetTop+(1+q)*e}else if(e)l=q*e;if(l)b.wrapping.style.height=Math.max(n+l,b.options.minHeight)+
"px"}var b=this,c=b.options.onCursorActivity,d=b.win,h=d.document.body,e=null,f=null,n=2*b.frame.offsetTop;h.style.overflowY="hidden";d.document.documentElement.style.overflowY="hidden";this.frame.scrolling="no";setTimeout(a,300);b.options.onCursorActivity=function(q){c&&c(q);clearTimeout(f);f=setTimeout(a,100)}}};t.InvalidLineHandle={toString:function(){return"CodeMirror.InvalidLineHandle"}};t.replace=function(a){if(typeof a=="string")a=document.getElementById(a);return function(b){a.parentNode.replaceChild(b,
a)}};t.fromTextArea=function(a,b){function c(){a.value=e.getCode()}if(typeof a=="string")a=document.getElementById(a);b=b||{};if(a.style.width&&b.width==null)b.width=a.style.width;if(a.style.height&&b.height==null)b.height=a.style.height;if(b.content==null)b.content=a.value;if(a.form){typeof a.form.addEventListener=="function"?a.form.addEventListener("submit",c,false):a.form.attachEvent("onsubmit",c);var d=a.form.submit,h=function(){c();a.form.submit=d;a.form.submit();a.form.submit=h};a.form.submit=
h}a.style.display="none";var e=new t(function(f){a.nextSibling?a.parentNode.insertBefore(f,a.nextSibling):a.parentNode.appendChild(f)},b);e.save=c;e.toTextArea=function(){c();a.parentNode.removeChild(e.wrapping);a.style.display="";if(a.form){a.form.submit=d;typeof a.form.removeEventListener=="function"?a.form.removeEventListener("submit",c,false):a.form.detachEvent("onsubmit",c)}};return e};t.isProbablySupported=function(){var a;return window.opera?Number(window.opera.version())>=9.52:/Apple Computer, Inc/.test(navigator.vendor)&&
(a=navigator.userAgent.match(/Version\/(\d+(?:\.\d+)?)\./))?Number(a[1])>=3:document.selection&&window.ActiveXObject&&(a=navigator.userAgent.match(/MSIE (\d+(?:\.\d*)?)\b/))?Number(a[1])>=6:(a=navigator.userAgent.match(/gecko\/(\d{8})/i))?Number(a[1])>=20050901:(a=navigator.userAgent.match(/AppleWebKit\/(\d+)/))?Number(a[1])>=525:null};return t}();
/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 * 
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 *
 * Version: 1.3.1 (05/03/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {

	var tmp, loading, overlay, wrap, outer, inner, close, nav_left, nav_right,

		selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

		ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,

		loadingTimer, loadingFrame = 1,

		start_pos, final_pos, busy = false, shadow = 20, fx = $.extend($('<div/>')[0], { prop: 0 }), titleh = 0, 

		isIE6 = !$.support.opacity && !window.XMLHttpRequest,

		/*
		 * Private methods 
		 */

		fancybox_abort = function() {
			loading.hide();

			imgPreloader.onerror = imgPreloader.onload = null;

			if (ajaxLoader) {
				ajaxLoader.abort();
			}

			tmp.empty();
		},

		fancybox_error = function() {
			$.fancybox('<p id="fancybox_error">The requested content cannot be loaded.<br />Please try again later.</p>', {
				'scrolling'		: 'no',
				'padding'		: 20,
				'transitionIn'	: 'none',
				'transitionOut'	: 'none'
			});
		},

		fancybox_get_viewport = function() {
			return [ $(window).width(), $(window).height(), $(document).scrollLeft(), $(document).scrollTop() ];
		},

		fancybox_get_zoom_to = function () {
			var view	= fancybox_get_viewport(),
				to		= {},

				margin = currentOpts.margin,
				resize = currentOpts.autoScale,

				horizontal_space	= (shadow + margin) * 2,
				vertical_space		= (shadow + margin) * 2,
				double_padding		= (currentOpts.padding * 2),
				
				ratio;

			if (currentOpts.width.toString().indexOf('%') > -1) {
				to.width = ((view[0] * parseFloat(currentOpts.width)) / 100) - (shadow * 2) ;
				resize = false;

			} else {
				to.width = currentOpts.width + double_padding;
			}

			if (currentOpts.height.toString().indexOf('%') > -1) {
				to.height = ((view[1] * parseFloat(currentOpts.height)) / 100) - (shadow * 2);
				resize = false;

			} else {
				to.height = currentOpts.height + double_padding;
			}

			if (resize && (to.width > (view[0] - horizontal_space) || to.height > (view[1] - vertical_space))) {
				if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
					horizontal_space	+= double_padding;
					vertical_space		+= double_padding;

					ratio = Math.min(Math.min( view[0] - horizontal_space, currentOpts.width) / currentOpts.width, Math.min( view[1] - vertical_space, currentOpts.height) / currentOpts.height);

					to.width	= Math.round(ratio * (to.width	- double_padding)) + double_padding;
					to.height	= Math.round(ratio * (to.height	- double_padding)) + double_padding;

				} else {
					to.width	= Math.min(to.width,	(view[0] - horizontal_space));
					to.height	= Math.min(to.height,	(view[1] - vertical_space));
				}
			}

			to.top	= view[3] + ((view[1] - (to.height	+ (shadow * 2 ))) * 0.5);
			to.left	= view[2] + ((view[0] - (to.width	+ (shadow * 2 ))) * 0.5);

			if (currentOpts.autoScale === false) {
				to.top	= Math.max(view[3] + margin, to.top);
				to.left	= Math.max(view[2] + margin, to.left);
			}

			return to;
		},

		fancybox_format_title = function(title) {
			if (title && title.length) {
				switch (currentOpts.titlePosition) {
					case 'inside':
						return title;
					case 'over':
						return '<span id="fancybox-title-over">' + title + '</span>';
					default:
						return '<span id="fancybox-title-wrap"><span id="fancybox-title-left"></span><span id="fancybox-title-main">' + title + '</span><span id="fancybox-title-right"></span></span>';
				}
			}

			return false;
		},

		fancybox_process_title = function() {
			var title	= currentOpts.title,
				width	= final_pos.width - (currentOpts.padding * 2),
				titlec	= 'fancybox-title-' + currentOpts.titlePosition;
				
			$('#fancybox-title').remove();

			titleh = 0;

			if (currentOpts.titleShow === false) {
				return;
			}

			title = $.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(title, currentArray, currentIndex, currentOpts) : fancybox_format_title(title);

			if (!title || title === '') {
				return;
			}

			$('<div id="fancybox-title" class="' + titlec + '" />').css({
				'width'			: width,
				'paddingLeft'	: currentOpts.padding,
				'paddingRight'	: currentOpts.padding
			}).html(title).appendTo('body');

			switch (currentOpts.titlePosition) {
				case 'inside':
					titleh = $("#fancybox-title").outerHeight(true) - currentOpts.padding;
					final_pos.height += titleh;
				break;

				case 'over':
					$('#fancybox-title').css('bottom', currentOpts.padding);
				break;

				default:
					$('#fancybox-title').css('bottom', $("#fancybox-title").outerHeight(true) * -1);
				break;
			}

			$('#fancybox-title').appendTo( outer ).hide();
		},

		fancybox_set_navigation = function() {
			$(document).unbind('keydown.fb').bind('keydown.fb', function(e) {
				if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
					e.preventDefault();
					$.fancybox.close();

				} else if (e.keyCode == 37) {
					e.preventDefault();
					$.fancybox.prev();

				} else if (e.keyCode == 39) {
					e.preventDefault();
					$.fancybox.next();
				}
			});

			if ($.fn.mousewheel) {
				wrap.unbind('mousewheel.fb');

				if (currentArray.length > 1) {
					wrap.bind('mousewheel.fb', function(e, delta) {
						e.preventDefault();

						if (busy || delta === 0) {
							return;
						}

						if (delta > 0) {
							$.fancybox.prev();
						} else {
							$.fancybox.next();
						}
					});
				}
			}

			if (!currentOpts.showNavArrows) { return; }

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
				nav_left.show();
			}

			if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length -1)) {
				nav_right.show();
			}
		},

		fancybox_preload_images = function() {
			var href, 
				objNext;
				
			if ((currentArray.length -1) > currentIndex) {
				href = currentArray[ currentIndex + 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}

			if (currentIndex > 0) {
				href = currentArray[ currentIndex - 1 ].href;

				if (typeof href !== 'undefined' && href.match(imgRegExp)) {
					objNext = new Image();
					objNext.src = href;
				}
			}
		},

		_finish = function () {
			inner.css('overflow', (currentOpts.scrolling == 'auto' ? (currentOpts.type == 'image' || currentOpts.type == 'iframe' || currentOpts.type == 'swf' ? 'hidden' : 'auto') : (currentOpts.scrolling == 'yes' ? 'auto' : 'visible')));

			if (!$.support.opacity) {
				inner.get(0).style.removeAttribute('filter');
				wrap.get(0).style.removeAttribute('filter');
			}

			$('#fancybox-title').show();

			if (currentOpts.hideOnContentClick)	{
				inner.one('click', $.fancybox.close);
			}
			if (currentOpts.hideOnOverlayClick)	{
				overlay.one('click', $.fancybox.close);
			}

			if (currentOpts.showCloseButton) {
				close.show();
			}

			fancybox_set_navigation();

			$(window).bind("resize.fb", $.fancybox.center);

			if (currentOpts.centerOnScroll) {
				$(window).bind("scroll.fb", $.fancybox.center);
			} else {
				$(window).unbind("scroll.fb");
			}

			if ($.isFunction(currentOpts.onComplete)) {
				currentOpts.onComplete(currentArray, currentIndex, currentOpts);
			}

			busy = false;

			fancybox_preload_images();
		},

		fancybox_draw = function(pos) {
			var width	= Math.round(start_pos.width	+ (final_pos.width	- start_pos.width)	* pos),
				height	= Math.round(start_pos.height	+ (final_pos.height	- start_pos.height)	* pos),

				top		= Math.round(start_pos.top	+ (final_pos.top	- start_pos.top)	* pos),
				left	= Math.round(start_pos.left	+ (final_pos.left	- start_pos.left)	* pos);

			wrap.css({
				'width'		: width		+ 'px',
				'height'	: height	+ 'px',
				'top'		: top		+ 'px',
				'left'		: left		+ 'px'
			});

			width	= Math.max(width - currentOpts.padding * 2, 0);
			height	= Math.max(height - (currentOpts.padding * 2 + (titleh * pos)), 0);

			inner.css({
				'width'		: width		+ 'px',
				'height'	: height	+ 'px'
			});

			if (typeof final_pos.opacity !== 'undefined') {
				wrap.css('opacity', (pos < 0.5 ? 0.5 : pos));
			}
		},

		fancybox_get_obj_pos = function(obj) {
			var pos		= obj.offset();

			pos.top		+= parseFloat( obj.css('paddingTop') )	|| 0;
			pos.left	+= parseFloat( obj.css('paddingLeft') )	|| 0;

			pos.top		+= parseFloat( obj.css('border-top-width') )	|| 0;
			pos.left	+= parseFloat( obj.css('border-left-width') )	|| 0;

			pos.width	= obj.width();
			pos.height	= obj.height();

			return pos;
		},

		fancybox_get_zoom_from = function() {
			var orig = selectedOpts.orig ? $(selectedOpts.orig) : false,
				from = {},
				pos,
				view;

			if (orig && orig.length) {
				pos = fancybox_get_obj_pos(orig);

				from = {
					width	: (pos.width	+ (currentOpts.padding * 2)),
					height	: (pos.height	+ (currentOpts.padding * 2)),
					top		: (pos.top		- currentOpts.padding - shadow),
					left	: (pos.left		- currentOpts.padding - shadow)
				};
				
			} else {
				view = fancybox_get_viewport();

				from = {
					width	: 1,
					height	: 1,
					top		: view[3] + view[1] * 0.5,
					left	: view[2] + view[0] * 0.5
				};
			}

			return from;
		},

		fancybox_show = function() {
			loading.hide();

			if (wrap.is(":visible") && $.isFunction(currentOpts.onCleanup)) {
				if (currentOpts.onCleanup(currentArray, currentIndex, currentOpts) === false) {
					$.event.trigger('fancybox-cancel');

					busy = false;
					return;
				}
			}

			currentArray	= selectedArray;
			currentIndex	= selectedIndex;
			currentOpts		= selectedOpts;

			inner.get(0).scrollTop	= 0;
			inner.get(0).scrollLeft	= 0;

			if (currentOpts.overlayShow) {
				if (isIE6) {
					$('select:not(#fancybox-tmp select)').filter(function() {
						return this.style.visibility !== 'hidden';
					}).css({'visibility':'hidden'}).one('fancybox-cleanup', function() {
						this.style.visibility = 'inherit';
					});
				}

				overlay.css({
					'background-color'	: currentOpts.overlayColor,
					'opacity'			: currentOpts.overlayOpacity
				}).unbind().show();
			}

			final_pos = fancybox_get_zoom_to();

			fancybox_process_title();

			if (wrap.is(":visible")) {
				$( close.add( nav_left ).add( nav_right ) ).hide();

				var pos = wrap.position(),
					equal;

				start_pos = {
					top		:	pos.top ,
					left	:	pos.left,
					width	:	wrap.width(),
					height	:	wrap.height()
				};

				equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

				inner.fadeOut(currentOpts.changeFade, function() {
					var finish_resizing = function() {
						inner.html( tmp.contents() ).fadeIn(currentOpts.changeFade, _finish);
					};
					
					$.event.trigger('fancybox-change');

					inner.empty().css('overflow', 'hidden');

					if (equal) {
						inner.css({
							top			: currentOpts.padding,
							left		: currentOpts.padding,
							width		: Math.max(final_pos.width	- (currentOpts.padding * 2), 1),
							height		: Math.max(final_pos.height	- (currentOpts.padding * 2) - titleh, 1)
						});
						
						finish_resizing();

					} else {
						inner.css({
							top			: currentOpts.padding,
							left		: currentOpts.padding,
							width		: Math.max(start_pos.width	- (currentOpts.padding * 2), 1),
							height		: Math.max(start_pos.height	- (currentOpts.padding * 2), 1)
						});
						
						fx.prop = 0;

						$(fx).animate({ prop: 1 }, {
							 duration	: currentOpts.changeSpeed,
							 easing		: currentOpts.easingChange,
							 step		: fancybox_draw,
							 complete	: finish_resizing
						});
					}
				});

				return;
			}

			wrap.css('opacity', 1);

			if (currentOpts.transitionIn == 'elastic') {
				start_pos = fancybox_get_zoom_from();

				inner.css({
						top			: currentOpts.padding,
						left		: currentOpts.padding,
						width		: Math.max(start_pos.width	- (currentOpts.padding * 2), 1),
						height		: Math.max(start_pos.height	- (currentOpts.padding * 2), 1)
					})
					.html( tmp.contents() );

				wrap.css(start_pos).show();

				if (currentOpts.opacity) {
					final_pos.opacity = 0;
				}

				fx.prop = 0;

				$(fx).animate({ prop: 1 }, {
					 duration	: currentOpts.speedIn,
					 easing		: currentOpts.easingIn,
					 step		: fancybox_draw,
					 complete	: _finish
				});

			} else {
				inner.css({
						top			: currentOpts.padding,
						left		: currentOpts.padding,
						width		: Math.max(final_pos.width	- (currentOpts.padding * 2), 1),
						height		: Math.max(final_pos.height	- (currentOpts.padding * 2) - titleh, 1)
					})
					.html( tmp.contents() );

				wrap.css( final_pos ).fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
			}
		},

		fancybox_process_inline = function() {
			tmp.width(	selectedOpts.width );
			tmp.height(	selectedOpts.height );

			if (selectedOpts.width	== 'auto') {
				selectedOpts.width = tmp.width();
			}
			if (selectedOpts.height	== 'auto') {
				selectedOpts.height	= tmp.height();
			}

			fancybox_show();
		},
		
		fancybox_process_image = function() {
			busy = true;

			selectedOpts.width	= imgPreloader.width;
			selectedOpts.height	= imgPreloader.height;

			$("<img />").attr({
				'id'	: 'fancybox-img',
				'src'	: imgPreloader.src,
				'alt'	: selectedOpts.title
			}).appendTo( tmp );

			fancybox_show();
		},

		fancybox_start = function() {
			fancybox_abort();

			var obj	= selectedArray[ selectedIndex ],
				href, 
				type, 
				title,
				str,
				emb,
				selector,
				data;

			selectedOpts = $.extend({}, $.fn.fancybox.defaults, (typeof $(obj).data('fancybox') == 'undefined' ? selectedOpts : $(obj).data('fancybox')));
			title = obj.title || $(obj).title || selectedOpts.title || '';
			
			if (obj.nodeName && !selectedOpts.orig) {
				selectedOpts.orig = $(obj).children("img:first").length ? $(obj).children("img:first") : $(obj);
			}

			if (title === '' && selectedOpts.orig) {
				title = selectedOpts.orig.attr('alt');
			}

			if (obj.nodeName && (/^(?:javascript|#)/i).test(obj.href)) {
				href = selectedOpts.href || null;
			} else {
				href = selectedOpts.href || obj.href || null;
			}

			if (selectedOpts.type) {
				type = selectedOpts.type;

				if (!href) {
					href = selectedOpts.content;
				}
				
			} else if (selectedOpts.content) {
				type	= 'html';

			} else if (href) {
				if (href.match(imgRegExp)) {
					type = 'image';

				} else if (href.match(swfRegExp)) {
					type = 'swf';

				} else if ($(obj).hasClass("iframe")) {
					type = 'iframe';

				} else if (href.match(/#/)) {
					obj = href.substr(href.indexOf("#"));

					type = $(obj).length > 0 ? 'inline' : 'ajax';
				} else {
					type = 'ajax';
				}
			} else {
				type = 'inline';
			}

			selectedOpts.type	= type;
			selectedOpts.href	= href;
			selectedOpts.title	= title;

			if (selectedOpts.autoDimensions && selectedOpts.type !== 'iframe' && selectedOpts.type !== 'swf') {
				selectedOpts.width		= 'auto';
				selectedOpts.height		= 'auto';
			}

			if (selectedOpts.modal) {
				selectedOpts.overlayShow		= true;
				selectedOpts.hideOnOverlayClick	= false;
				selectedOpts.hideOnContentClick	= false;
				selectedOpts.enableEscapeButton	= false;
				selectedOpts.showCloseButton	= false;
			}

			if ($.isFunction(selectedOpts.onStart)) {
				if (selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts) === false) {
					busy = false;
					return;
				}
			}

			tmp.css('padding', (shadow + selectedOpts.padding + selectedOpts.margin));

			$('.fancybox-inline-tmp').unbind('fancybox-cancel').bind('fancybox-change', function() {
				$(this).replaceWith(inner.children());
			});

			switch (type) {
				case 'html' :
					tmp.html( selectedOpts.content );
					fancybox_process_inline();
				break;

				case 'inline' :
					$('<div class="fancybox-inline-tmp" />').hide().insertBefore( $(obj) ).bind('fancybox-cleanup', function() {
						$(this).replaceWith(inner.children());
					}).bind('fancybox-cancel', function() {
						$(this).replaceWith(tmp.children());
					});

					$(obj).appendTo(tmp);

					fancybox_process_inline();
				break;

				case 'image':
					busy = false;

					$.fancybox.showActivity();

					imgPreloader = new Image();

					imgPreloader.onerror = function() {
						fancybox_error();
					};

					imgPreloader.onload = function() {
						imgPreloader.onerror = null;
						imgPreloader.onload = null;
						fancybox_process_image();
					};

					imgPreloader.src = href;
		
				break;

				case 'swf':
					str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
					emb = '';
					
					$.each(selectedOpts.swf, function(name, val) {
						str += '<param name="' + name + '" value="' + val + '"></param>';
						emb += ' ' + name + '="' + val + '"';
					});

					str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

					tmp.html(str);

					fancybox_process_inline();
				break;

				case 'ajax':
					selector	= href.split('#', 2);
					data		= selectedOpts.ajax.data || {};

					if (selector.length > 1) {
						href = selector[0];

						if (typeof data == "string") {
							data += '&selector=' + selector[1];
						} else {
							data.selector = selector[1];
						}
					}

					busy = false;
					$.fancybox.showActivity();

					ajaxLoader = $.ajax($.extend(selectedOpts.ajax, {
						url		: href,
						data	: data,
						error	: fancybox_error,
						success : function(data, textStatus, XMLHttpRequest) {
							if (ajaxLoader.status == 200) {
								tmp.html( data );
								fancybox_process_inline();
							}
						}
					}));

				break;

				case 'iframe' :
					$('<iframe id="fancybox-frame" name="fancybox-frame' + new Date().getTime() + '" frameborder="0" hspace="0" scrolling="' + selectedOpts.scrolling + '" src="' + selectedOpts.href + '"></iframe>').appendTo(tmp);
					fancybox_show();
				break;
			}
		},

		fancybox_animate_loading = function() {
			if (!loading.is(':visible')){
				clearInterval(loadingTimer);
				return;
			}

			$('div', loading).css('top', (loadingFrame * -40) + 'px');

			loadingFrame = (loadingFrame + 1) % 12;
		},

		fancybox_init = function() {
			if ($("#fancybox-wrap").length) {
				return;
			}

			$('body').append(
				tmp			= $('<div id="fancybox-tmp"></div>'),
				loading		= $('<div id="fancybox-loading"><div></div></div>'),
				overlay		= $('<div id="fancybox-overlay"></div>'),
				wrap		= $('<div id="fancybox-wrap"></div>')
			);

			if (!$.support.opacity) {
				wrap.addClass('fancybox-ie');
				loading.addClass('fancybox-ie');
			}

			outer = $('<div id="fancybox-outer"></div>')
				.append('<div class="fancy-bg" id="fancy-bg-n"></div><div class="fancy-bg" id="fancy-bg-ne"></div><div class="fancy-bg" id="fancy-bg-e"></div><div class="fancy-bg" id="fancy-bg-se"></div><div class="fancy-bg" id="fancy-bg-s"></div><div class="fancy-bg" id="fancy-bg-sw"></div><div class="fancy-bg" id="fancy-bg-w"></div><div class="fancy-bg" id="fancy-bg-nw"></div>')
				.appendTo( wrap );

			outer.append(
				inner		= $('<div id="fancybox-inner"></div>'),
				close		= $('<a id="fancybox-close"></a>'),

				nav_left	= $('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),
				nav_right	= $('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')
			);

			close.click($.fancybox.close);
			loading.click($.fancybox.cancel);

			nav_left.click(function(e) {
				e.preventDefault();
				$.fancybox.prev();
			});

			nav_right.click(function(e) {
				e.preventDefault();
				$.fancybox.next();
			});

			if (isIE6) {
				overlay.get(0).style.setExpression('height',	"document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + 'px'");
				loading.get(0).style.setExpression('top',		"(-20 + (document.documentElement.clientHeight ? document.documentElement.clientHeight/2 : document.body.clientHeight/2 ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop )) + 'px'");

				outer.prepend('<iframe id="fancybox-hide-sel-frame" src="javascript:\'\';" scrolling="no" frameborder="0" ></iframe>');
			}
		};

	/*
	 * Public methods 
	 */

	$.fn.fancybox = function(options) {
		$(this)
			.data('fancybox', $.extend({}, options, ($.metadata ? $(this).metadata() : {})))
			.unbind('click.fb').bind('click.fb', function(e) {
				e.preventDefault();

				if (busy) {
					return;
				}

				busy = true;

				$(this).blur();

				selectedArray	= [];
				selectedIndex	= 0;

				var rel = $(this).attr('rel') || '';

				if (!rel || rel == '' || rel === 'nofollow') {
					selectedArray.push(this);

				} else {
					selectedArray	= $("a[rel=" + rel + "], area[rel=" + rel + "]");
					selectedIndex	= selectedArray.index( this );
				}

				fancybox_start();

				return false;
			});

		return this;
	};

	$.fancybox = function(obj) {
		if (busy) {
			return;
		}

		busy = true;

		var opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

		selectedArray	= [];
		selectedIndex	= opts.index || 0;

		if ($.isArray(obj)) {
			for (var i = 0, j = obj.length; i < j; i++) {
				if (typeof obj[i] == 'object') {
					$(obj[i]).data('fancybox', $.extend({}, opts, obj[i]));
				} else {
					obj[i] = $({}).data('fancybox', $.extend({content : obj[i]}, opts));
				}
			}

			selectedArray = jQuery.merge(selectedArray, obj);

		} else {
			if (typeof obj == 'object') {
				$(obj).data('fancybox', $.extend({}, opts, obj));
			} else {
				obj = $({}).data('fancybox', $.extend({content : obj}, opts));
			}

			selectedArray.push(obj);
		}

		if (selectedIndex > selectedArray.length || selectedIndex < 0) {
			selectedIndex = 0;
		}

		fancybox_start();
	};

	$.fancybox.showActivity = function() {
		clearInterval(loadingTimer);

		loading.show();
		loadingTimer = setInterval(fancybox_animate_loading, 66);
	};

	$.fancybox.hideActivity = function() {
		loading.hide();
	};

	$.fancybox.next = function() {
		return $.fancybox.pos( currentIndex + 1);
	};
	
	$.fancybox.prev = function() {
		return $.fancybox.pos( currentIndex - 1);
	};

	$.fancybox.pos = function(pos) {
		if (busy) {
			return;
		}

		pos = parseInt(pos, 10);

		if (pos > -1 && currentArray.length > pos) {
			selectedIndex = pos;
			fancybox_start();
		}

		if (currentOpts.cyclic && currentArray.length > 1 && pos < 0) {
			selectedIndex = currentArray.length - 1;
			fancybox_start();
		}

		if (currentOpts.cyclic && currentArray.length > 1 && pos >= currentArray.length) {
			selectedIndex = 0;
			fancybox_start();
		}

		return;
	};

	$.fancybox.cancel = function() {
		if (busy) {
			return;
		}

		busy = true;

		$.event.trigger('fancybox-cancel');

		fancybox_abort();

		if (selectedOpts && $.isFunction(selectedOpts.onCancel)) {
			selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);
		}

		busy = false;
	};

	// Note: within an iframe use - parent.$.fancybox.close();
	$.fancybox.close = function() {
		if (busy || wrap.is(':hidden')) {
			return;
		}

		busy = true;

		if (currentOpts && $.isFunction(currentOpts.onCleanup)) {
			if (currentOpts.onCleanup(currentArray, currentIndex, currentOpts) === false) {
				busy = false;
				return;
			}
		}

		fancybox_abort();

		$(close.add( nav_left ).add( nav_right )).hide();

		$('#fancybox-title').remove();

		wrap.add(inner).add(overlay).unbind();

		$(window).unbind("resize.fb scroll.fb");
		$(document).unbind('keydown.fb');

		function _cleanup() {
			overlay.fadeOut('fast');

			wrap.hide();

			$.event.trigger('fancybox-cleanup');

			inner.empty();

			if ($.isFunction(currentOpts.onClosed)) {
				currentOpts.onClosed(currentArray, currentIndex, currentOpts);
			}

			currentArray	= selectedOpts	= [];
			currentIndex	= selectedIndex	= 0;
			currentOpts		= selectedOpts	= {};

			busy = false;
		}

		inner.css('overflow', 'hidden');

		if (currentOpts.transitionOut == 'elastic') {
			start_pos = fancybox_get_zoom_from();

			var pos = wrap.position();

			final_pos = {
				top		:	pos.top ,
				left	:	pos.left,
				width	:	wrap.width(),
				height	:	wrap.height()
			};

			if (currentOpts.opacity) {
				final_pos.opacity = 1;
			}

			fx.prop = 1;

			$(fx).animate({ prop: 0 }, {
				 duration	: currentOpts.speedOut,
				 easing		: currentOpts.easingOut,
				 step		: fancybox_draw,
				 complete	: _cleanup
			});

		} else {
			wrap.fadeOut( currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
		}
	};

	$.fancybox.resize = function() {
		var c, h;
		
		if (busy || wrap.is(':hidden')) {
			return;
		}

		busy = true;

		c = inner.wrapInner("<div style='overflow:auto'></div>").children();
		h = c.height();

		wrap.css({height:	h + (currentOpts.padding * 2) + titleh});
		inner.css({height:	h});

		c.replaceWith(c.children());

		$.fancybox.center();
	};

	$.fancybox.center = function() {
		busy = true;

		var view	= fancybox_get_viewport(),
			margin	= currentOpts.margin,
			to		= {};

		to.top	= view[3] + ((view[1] - ((wrap.height() - titleh) + (shadow * 2 ))) * 0.5);
		to.left	= view[2] + ((view[0] - (wrap.width() + (shadow * 2 ))) * 0.5);

		to.top	= Math.max(view[3] + margin, to.top);
		to.left	= Math.max(view[2] + margin, to.left);

		wrap.css(to);

		busy = false;
	};

	$.fn.fancybox.defaults = {
		padding				:	10,
		margin				:	20,
		opacity				:	false,
		modal				:	false,
		cyclic				:	false,
		scrolling			:	'auto',	// 'auto', 'yes' or 'no'

		width				:	560,
		height				:	340,

		autoScale			:	true,
		autoDimensions		:	true,
		centerOnScroll		:	false,

		ajax				:	{},
		swf					:	{ wmode: 'transparent' },

		hideOnOverlayClick	:	true,
		hideOnContentClick	:	false,

		overlayShow			:	true,
		overlayOpacity		:	0.3,
		overlayColor		:	'#666',

		titleShow			:	true,
		titlePosition		:	'outside',	// 'outside', 'inside' or 'over'
		titleFormat			:	null,

		transitionIn		:	'fade',	// 'elastic', 'fade' or 'none'
		transitionOut		:	'fade',	// 'elastic', 'fade' or 'none'

		speedIn				:	300,
		speedOut			:	300,

		changeSpeed			:	300,
		changeFade			:	'fast',

		easingIn			:	'swing',
		easingOut			:	'swing',

		showCloseButton		:	true,
		showNavArrows		:	true,
		enableEscapeButton	:	true,

		onStart				:	null,
		onCancel			:	null,
		onComplete			:	null,
		onCleanup			:	null,
		onClosed			:	null
	};

	$(document).ready(function() {
		fancybox_init();
	});

})(jQuery);
(function(){var c=0,h=[],j={},f={},a={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},i=/[<>&\"\']/g,b;function e(){this.returnValue=false}function g(){this.cancelBubble=true}(function(k){var l=k.split(/,/),m,o,n;for(m=0;m<l.length;m+=2){n=l[m+1].split(/ /);for(o=0;o<n.length;o++){f[n[o]]=l[m]}}})("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats,docx pptx xlsx,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/html,htm html xhtml,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/x-flv,flv,video/vnd.rn-realvideo,rv,text/plain,asc txt text diff log,application/octet-stream,exe");var d={STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-700,mimeTypes:f,extend:function(k){d.each(arguments,function(l,m){if(m>0){d.each(l,function(o,n){k[n]=o})}});return k},cleanName:function(k){var l,m;m=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"];for(l=0;l<m.length;l+=2){k=k.replace(m[l],m[l+1])}k=k.replace(/\s+/g,"_");k=k.replace(/[^a-z0-9_\-\.]+/gi,"");return k},addRuntime:function(k,l){l.name=k;h[k]=l;h.push(l);return l},guid:function(){var k=new Date().getTime().toString(32),l;for(l=0;l<5;l++){k+=Math.floor(Math.random()*65535).toString(32)}return(d.guidPrefix||"p")+k+(c++).toString(32)},buildUrl:function(l,k){var m="";d.each(k,function(o,n){m+=(m?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(o)});if(m){l+=(l.indexOf("?")>0?"&":"?")+m}return l},each:function(n,o){var m,l,k;if(n){m=n.length;if(m===b){for(l in n){if(n.hasOwnProperty(l)){if(o(n[l],l)===false){return}}}}else{for(k=0;k<m;k++){if(o(n[k],k)===false){return}}}}},formatSize:function(k){if(k===b){return d.translate("N/A")}if(k>1048576){return Math.round(k/1048576,1)+" MB"}if(k>1024){return Math.round(k/1024,1)+" KB"}return k+" b"},getPos:function(l,p){var q=0,o=0,s,r=document,m,n;l=l;p=p||r.body;function k(w){var u,v,t=0,z=0;if(w){v=w.getBoundingClientRect();u=r.compatMode==="CSS1Compat"?r.documentElement:r.body;t=v.left+u.scrollLeft;z=v.top+u.scrollTop}return{x:t,y:z}}if(l.getBoundingClientRect&&(navigator.userAgent.indexOf("MSIE")>0&&r.documentMode!==8)){m=k(l);n=k(p);return{x:m.x-n.x,y:m.y-n.y}}s=l;while(s&&s!=p&&s.nodeType){q+=s.offsetLeft||0;o+=s.offsetTop||0;s=s.offsetParent}s=l.parentNode;while(s&&s!=p&&s.nodeType){q-=s.scrollLeft||0;o-=s.scrollTop||0;s=s.parentNode}return{x:q,y:o}},getSize:function(k){return{w:k.clientWidth||k.offsetWidth,h:k.clientHeight||k.offsetHeight}},parseSize:function(k){var l;if(typeof(k)=="string"){k=/^([0-9]+)([mgk]+)$/.exec(k.toLowerCase().replace(/[^0-9mkg]/g,""));l=k[2];k=+k[1];if(l=="g"){k*=1073741824}if(l=="m"){k*=1048576}if(l=="k"){k*=1024}}return k},xmlEncode:function(k){return k?(""+k).replace(i,function(l){return a[l]?"&"+a[l]+";":l}):k},toArray:function(m){var l,k=[];for(l=0;l<m.length;l++){k[l]=m[l]}return k},addI18n:function(k){return d.extend(j,k)},translate:function(k){return j[k]||k},addEvent:function(l,k,m){if(l.attachEvent){l.attachEvent("on"+k,function(){var n=window.event;if(!n.target){n.target=n.srcElement}n.preventDefault=e;n.stopPropagation=g;m(n)})}else{if(l.addEventListener){l.addEventListener(k,m,false)}}}};d.Uploader=function(n){var l={},q,p=[],r,m;q=new d.QueueProgress();n=d.extend({chunk_size:0,max_file_size:"1gb",multi_selection:true,file_data_name:"file",filters:[]},n);function o(){var s;if(this.state==d.STARTED&&r<p.length){s=p[r++];if(s.status==d.QUEUED){this.trigger("UploadFile",s)}else{o.call(this)}}else{this.stop()}}function k(){var t,s;q.reset();for(t=0;t<p.length;t++){s=p[t];if(s.size!==b){q.size+=s.size;q.loaded+=s.loaded}else{q.size=b}if(s.status==d.DONE){q.uploaded++}else{if(s.status==d.FAILED){q.failed++}else{q.queued++}}}if(q.size===b){q.percent=p.length>0?Math.ceil(q.uploaded/p.length*100):0}else{q.bytesPerSec=Math.ceil(q.loaded/((+new Date()-m||1)/1000));q.percent=q.size>0?Math.ceil(q.loaded/q.size*100):0}}d.extend(this,{state:d.STOPPED,features:{},files:p,settings:n,total:q,id:d.guid(),init:function(){var x=this,y,u,t,w=0,v;n.page_url=n.page_url||document.location.pathname.replace(/\/[^\/]+$/g,"/");if(!/^(\w+:\/\/|\/)/.test(n.url)){n.url=n.page_url+n.url}n.chunk_size=d.parseSize(n.chunk_size);n.max_file_size=d.parseSize(n.max_file_size);x.bind("FilesAdded",function(z,C){var B,A,F=0,E,D=n.filters;if(D&&D.length){E={};d.each(D,function(G){d.each(G.extensions.split(/,/),function(H){E[H.toLowerCase()]=true})})}for(B=0;B<C.length;B++){A=C[B];A.loaded=0;A.percent=0;A.status=d.QUEUED;if(E&&!E[A.name.toLowerCase().split(".").slice(-1)]){z.trigger("Error",{code:d.FILE_EXTENSION_ERROR,message:"File extension error.",file:A});continue}if(A.size!==b&&A.size>n.max_file_size){z.trigger("Error",{code:d.FILE_SIZE_ERROR,message:"File size error.",file:A});continue}p.push(A);F++}if(F){x.trigger("QueueChanged");x.refresh()}});if(n.unique_names){x.bind("UploadFile",function(z,A){A.target_name=A.id+".tmp"})}x.bind("UploadProgress",function(z,A){if(A.status==d.QUEUED){A.status=d.UPLOADING}A.percent=A.size>0?Math.ceil(A.loaded/A.size*100):100;k()});x.bind("StateChanged",function(z){if(z.state==d.STARTED){m=(+new Date())}});x.bind("QueueChanged",k);x.bind("Error",function(z,A){if(A.file){A.file.status=d.FAILED;k();window.setTimeout(function(){o.call(x)})}});x.bind("FileUploaded",function(z,A){A.status=d.DONE;z.trigger("UploadProgress",A);o.call(x)});if(n.runtimes){u=[];v=n.runtimes.split(/\s?,\s?/);for(y=0;y<v.length;y++){if(h[v[y]]){u.push(h[v[y]])}}}else{u=h}function s(){var C=u[w++],B,z,A;if(C){B=C.getFeatures();z=x.settings.required_features;if(z){z=z.split(",");for(A=0;A<z.length;A++){if(!B[z[A]]){s();return}}}C.init(x,function(D){if(D&&D.success){x.features=B;x.trigger("Init",{runtime:C.name});x.trigger("PostInit");x.refresh()}else{s()}})}else{x.trigger("Error",{code:d.INIT_ERROR,message:"Init error."})}}s()},refresh:function(){this.trigger("Refresh")},start:function(){if(this.state!=d.STARTED){r=0;this.state=d.STARTED;this.trigger("StateChanged");o.call(this)}},stop:function(){if(this.state!=d.STOPPED){this.state=d.STOPPED;this.trigger("StateChanged")}},getFile:function(t){var s;for(s=p.length-1;s>=0;s--){if(p[s].id===t){return p[s]}}},removeFile:function(t){var s;for(s=p.length-1;s>=0;s--){if(p[s].id===t.id){return this.splice(s,1)[0]}}},splice:function(u,s){var t;t=p.splice(u,s);this.trigger("FilesRemoved",t);this.trigger("QueueChanged");return t},trigger:function(t){var v=l[t.toLowerCase()],u,s;if(v){s=Array.prototype.slice.call(arguments);s[0]=this;for(u=0;u<v.length;u++){if(v[u].func.apply(v[u].scope,s)===false){return false}}}return true},bind:function(s,u,t){var v;s=s.toLowerCase();v=l[s]||[];v.push({func:u,scope:t||this});l[s]=v},unbind:function(s,u){var v=l[s.toLowerCase()],t;if(v){for(t=v.length-1;t>=0;t--){if(v[t].func===u){v.splice(t,1)}}}}})};d.File=function(n,l,m){var k=this;k.id=n;k.name=l;k.size=m;k.loaded=0;k.percent=0;k.status=0};d.Runtime=function(){this.getFeatures=function(){};this.init=function(k,l){}};d.QueueProgress=function(){var k=this;k.size=0;k.loaded=0;k.uploaded=0;k.failed=0;k.queued=0;k.percent=0;k.bytesPerSec=0;k.reset=function(){k.size=k.loaded=k.uploaded=k.failed=k.queued=k.percent=k.bytesPerSec=0}};d.runtimes={};window.plupload=d})();(function(b){var c={};function a(i,e,k,j,d){var l,g,f,h;g=google.gears.factory.create("beta.canvas");g.decode(i);h=Math.min(e/g.width,k/g.height);if(h<1){e=Math.round(g.width*h);k=Math.round(g.height*h)}else{e=g.width;k=g.height}g.resize(e,k);return g.encode(d,{quality:j/100})}b.runtimes.Gears=b.addRuntime("gears",{getFeatures:function(){return{dragdrop:true,jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(g,i){var h;if(!window.google||!google.gears){return i({success:false})}try{h=google.gears.factory.create("beta.desktop")}catch(f){return i({success:false})}function d(k){var j,e,l=[],m;for(e=0;e<k.length;e++){j=k[e];m=b.guid();c[m]=j.blob;l.push(new b.File(m,j.name,j.blob.length))}g.trigger("FilesAdded",l)}g.bind("PostInit",function(){var j=g.settings,e=document.getElementById(j.drop_element);if(e){b.addEvent(e,"dragover",function(k){h.setDropEffect(k,"copy");k.preventDefault()});b.addEvent(e,"drop",function(l){var k=h.getDragData(l,"application/x-gears-files");if(k){d(k.files)}l.preventDefault()});e=0}b.addEvent(document.getElementById(j.browse_button),"click",function(o){var n=[],l,k,m;o.preventDefault();for(l=0;l<j.filters.length;l++){m=j.filters[l].extensions.split(",");for(k=0;k<m.length;k++){n.push("."+m[k])}}h.openFiles(d,{singleFile:!j.multi_selection,filter:n})})});g.bind("UploadFile",function(o,l){var q=0,p,m,n=0,k=o.settings.resize,e;m=o.settings.chunk_size;e=m>0;p=Math.ceil(l.size/m);if(!e){m=l.size;p=1}if(k&&/\.(png|jpg|jpeg)$/i.test(l.name)){c[l.id]=a(c[l.id],k.width,k.height,k.quality||90,/\.png$/i.test(l.name)?"image/png":"image/jpeg")}l.size=c[l.id].length;function j(){var u,w,s=o.settings.multipart,r=0,v={name:l.target_name||l.name};function t(y){var x,C="----pluploadboundary"+b.guid(),A="--",B="\r\n",z;if(s){u.setRequestHeader("Content-Type","multipart/form-data; boundary="+C);x=google.gears.factory.create("beta.blobbuilder");b.each(o.settings.multipart_params,function(E,D){x.append(A+C+B+'Content-Disposition: form-data; name="'+D+'"'+B+B);x.append(E+B)});x.append(A+C+B+'Content-Disposition: form-data; name="'+o.settings.file_data_name+'"; filename="'+l.name+'"'+B+"Content-Type: application/octet-stream"+B+B);x.append(y);x.append(B+A+C+A+B);z=x.getAsBlob();r=z.length-y.length;y=z}u.send(y)}if(l.status==b.DONE||l.status==b.FAILED||o.state==b.STOPPED){return}if(e){v.chunk=q;v.chunks=p}w=Math.min(m,l.size-(q*m));u=google.gears.factory.create("beta.httprequest");u.open("POST",b.buildUrl(o.settings.url,v));if(!s){u.setRequestHeader("Content-Disposition",'attachment; filename="'+l.name+'"');u.setRequestHeader("Content-Type","application/octet-stream")}b.each(o.settings.headers,function(y,x){u.setRequestHeader(x,y)});u.upload.onprogress=function(x){l.loaded=n+x.loaded-r;o.trigger("UploadProgress",l)};u.onreadystatechange=function(){var x;if(u.readyState==4){if(u.status==200){x={chunk:q,chunks:p,response:u.responseText,status:u.status};o.trigger("ChunkUploaded",l,x);if(x.cancelled){l.status=b.FAILED;return}n+=w;if(++q>=p){l.status=b.DONE;o.trigger("FileUploaded",l,{response:u.responseText,status:u.status})}else{j()}}else{o.trigger("Error",{code:b.HTTP_ERROR,message:"HTTP Error.",file:l,chunk:q,chunks:p,status:u.status})}}};if(q<p){t(c[l.id].slice(q*m,w))}}j()});i({success:true})}})})(plupload);(function(c){var a={};function b(l){var k,j=typeof l,h,e,g,f;if(j==="string"){k="\bb\tt\nn\ff\rr\"\"''\\\\";return'"'+l.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g,function(n,m){var i=k.indexOf(m);if(i+1){return"\\"+k.charAt(i+1)}n=m.charCodeAt().toString(16);return"\\u"+"0000".substring(n.length)+n})+'"'}if(j=="object"){e=l.length!==h;k="";if(e){for(g=0;g<l.length;g++){if(k){k+=","}k+=b(l[g])}k="["+k+"]"}else{for(f in l){if(l.hasOwnProperty(f)){if(k){k+=","}k+=b(f)+":"+b(l[f])}}k="{"+k+"}"}return k}if(l===h){return"null"}return""+l}function d(o){var r=false,f=null,k=null,g,h,i,q,j,m=0;try{try{k=new ActiveXObject("AgControl.AgControl");if(k.IsVersionSupported(o)){r=true}k=null}catch(n){var l=navigator.plugins["Silverlight Plug-In"];if(l){g=l.description;if(g==="1.0.30226.2"){g="2.0.30226.2"}h=g.split(".");while(h.length>3){h.pop()}while(h.length<4){h.push(0)}i=o.split(".");while(i.length>4){i.pop()}do{q=parseInt(i[m],10);j=parseInt(h[m],10);m++}while(m<i.length&&q===j);if(q<=j&&!isNaN(q)){r=true}}}}catch(p){r=false}return r}c.silverlight={trigger:function(j,f){var h=a[j],g,e;if(h){e=c.toArray(arguments).slice(1);e[0]="Silverlight:"+f;setTimeout(function(){h.trigger.apply(h,e)},0)}}};c.runtimes.Silverlight=c.addRuntime("silverlight",{getFeatures:function(){return{jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(l,m){var k,h="",j=l.settings.filters,g,f=document.body;if(!d("2.0.31005.0")||(window.opera&&window.opera.buildNumber)){m({success:false});return}a[l.id]=l;k=document.createElement("div");k.id=l.id+"_silverlight_container";c.extend(k.style,{position:"absolute",top:"0px",background:l.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100px",height:"100px",overflow:"hidden",opacity:l.settings.shim_bgcolor?"":0.01});k.className="plupload silverlight";if(l.settings.container){f=document.getElementById(l.settings.container);f.style.position="relative"}f.appendChild(k);for(g=0;g<j.length;g++){h+=(h!=""?"|":"")+j[g].title+" | *."+j[g].extensions.replace(/,/g,";*.")}k.innerHTML='<object id="'+l.id+'_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="'+l.settings.silverlight_xap_url+'"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="initParams" value="id='+l.id+",filter="+h+'"/></object>';function e(){return document.getElementById(l.id+"_silverlight").content.Upload}l.bind("Silverlight:Init",function(){var i,n={};l.bind("Silverlight:StartSelectFiles",function(o){i=[]});l.bind("Silverlight:SelectFile",function(o,r,p,q){var s;s=c.guid();n[s]=r;n[r]=s;i.push(new c.File(s,p,q))});l.bind("Silverlight:SelectSuccessful",function(){if(i.length){l.trigger("FilesAdded",i)}});l.bind("Silverlight:UploadChunkError",function(o,r,p,s,q){l.trigger("Error",{code:c.IO_ERROR,message:"IO Error.",details:q,file:o.getFile(n[r])})});l.bind("Silverlight:UploadFileProgress",function(o,s,p,r){var q=o.getFile(n[s]);if(q.status!=c.FAILED){q.size=r;q.loaded=p;o.trigger("UploadProgress",q)}});l.bind("Refresh",function(o){var p,q,r;p=document.getElementById(o.settings.browse_button);q=c.getPos(p,document.getElementById(o.settings.container));r=c.getSize(p);c.extend(document.getElementById(o.id+"_silverlight_container").style,{top:q.y+"px",left:q.x+"px",width:r.w+"px",height:r.h+"px"})});l.bind("Silverlight:UploadChunkSuccessful",function(o,r,p,u,t){var s,q=o.getFile(n[r]);s={chunk:p,chunks:u,response:t};o.trigger("ChunkUploaded",q,s);if(q.status!=c.FAILED){e().UploadNextChunk()}if(p==u-1){q.status=c.DONE;o.trigger("FileUploaded",q,{response:t})}});l.bind("Silverlight:UploadSuccessful",function(o,r,p){var q=o.getFile(n[r]);q.status=c.DONE;o.trigger("FileUploaded",q,{response:p})});l.bind("FilesRemoved",function(o,q){var p;for(p=0;p<q.length;p++){e().RemoveFile(n[q[p].id])}});l.bind("UploadFile",function(o,q){var r=o.settings,p=r.resize||{};e().UploadFile(n[q.id],c.buildUrl(o.settings.url,{name:q.target_name||q.name}),b({chunk_size:r.chunk_size,image_width:p.width,image_height:p.height,image_quality:p.quality||90,multipart:!!r.multipart,multipart_params:r.multipart_params||{},headers:r.headers}))});m({success:true})})}})})(plupload);(function(c){var a={};function b(){var d;try{d=navigator.plugins["Shockwave Flash"];d=d.description}catch(f){try{d=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(e){d="0.0"}}d=d.match(/\d+/g);return parseFloat(d[0]+"."+d[1])}c.flash={trigger:function(f,d,e){setTimeout(function(){var j=a[f],h,g;if(j){j.trigger("Flash:"+d,e)}},0)}};c.runtimes.Flash=c.addRuntime("flash",{getFeatures:function(){return{jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(g,l){var k,f,h,e,m=0,d=document.body;if(b()<10){l({success:false});return}a[g.id]=g;k=document.getElementById(g.settings.browse_button);f=document.createElement("div");f.id=g.id+"_flash_container";c.extend(f.style,{position:"absolute",top:"0px",background:g.settings.shim_bgcolor||"transparent",zIndex:99999,width:"100%",height:"100%"});f.className="plupload flash";if(g.settings.container){d=document.getElementById(g.settings.container);d.style.position="relative"}d.appendChild(f);h="id="+escape(g.id);f.innerHTML='<object id="'+g.id+'_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="'+g.settings.flash_swf_url+'"><param name="movie" value="'+g.settings.flash_swf_url+'" /><param name="flashvars" value="'+h+'" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';function j(){return document.getElementById(g.id+"_flash")}function i(){if(m++>5000){l({success:false});return}if(!e){setTimeout(i,1)}}i();k=f=null;g.bind("Flash:Init",function(){var p={},o,n=g.settings.resize||{};e=true;j().setFileFilters(g.settings.filters,g.settings.multi_selection);g.bind("UploadFile",function(q,r){var s=q.settings;j().uploadFile(p[r.id],c.buildUrl(s.url,{name:r.target_name||r.name}),{chunk_size:s.chunk_size,width:n.width,height:n.height,quality:n.quality||90,multipart:s.multipart,multipart_params:s.multipart_params,file_data_name:s.file_data_name,format:/\.(jpg|jpeg)$/i.test(r.name)?"jpg":"png",headers:s.headers})});g.bind("Flash:UploadProcess",function(r,q){var s=r.getFile(p[q.id]);if(s.status!=c.FAILED){s.loaded=q.loaded;s.size=q.size;r.trigger("UploadProgress",s)}});g.bind("Flash:UploadChunkComplete",function(q,s){var t,r=q.getFile(p[s.id]);t={chunk:s.chunk,chunks:s.chunks,response:s.text};q.trigger("ChunkUploaded",r,t);if(r.status!=c.FAILED){j().uploadNextChunk()}if(s.chunk==s.chunks-1){r.status=c.DONE;q.trigger("FileUploaded",r,{response:s.text})}});g.bind("Flash:SelectFiles",function(q,t){var s,r,u=[],v;for(r=0;r<t.length;r++){s=t[r];v=c.guid();p[v]=s.id;p[s.id]=v;u.push(new c.File(v,s.name,s.size))}if(u.length){g.trigger("FilesAdded",u)}});g.bind("Flash:SecurityError",function(q,r){g.trigger("Error",{code:c.SECURITY_ERROR,message:"Security error.",details:r.message,file:g.getFile(p[r.id])})});g.bind("Flash:GenericError",function(q,r){g.trigger("Error",{code:c.GENERIC_ERROR,message:"Generic error.",details:r.message,file:g.getFile(p[r.id])})});g.bind("Flash:IOError",function(q,r){g.trigger("Error",{code:c.IO_ERROR,message:"IO error.",details:r.message,file:g.getFile(p[r.id])})});g.bind("QueueChanged",function(q){g.refresh()});g.bind("FilesRemoved",function(q,s){var r;for(r=0;r<s.length;r++){j().removeFile(p[s[r].id])}});g.bind("StateChanged",function(q){g.refresh()});g.bind("Refresh",function(q){var r,s,t;j().setFileFilters(g.settings.filters,g.settings.multi_selection);r=document.getElementById(q.settings.browse_button);s=c.getPos(r,document.getElementById(q.settings.container));t=c.getSize(r);c.extend(document.getElementById(q.id+"_flash_container").style,{top:s.y+"px",left:s.x+"px",width:t.w+"px",height:t.h+"px"})});l({success:true})})}})})(plupload);(function(a){a.runtimes.BrowserPlus=a.addRuntime("browserplus",{getFeatures:function(){return{dragdrop:true,jpgresize:true,pngresize:true,chunks:true,progress:true,multipart:true}},init:function(g,i){var e=window.BrowserPlus,h={},d=g.settings,c=d.resize;function f(n){var m,l,j=[],k,o;for(l=0;l<n.length;l++){k=n[l];o=a.guid();h[o]=k;j.push(new a.File(o,k.name,k.size))}if(l){g.trigger("FilesAdded",j)}}function b(){g.bind("PostInit",function(){var m,k=d.drop_element,o=g.id+"_droptarget",j=document.getElementById(k),l;function p(r,q){e.DragAndDrop.AddDropTarget({id:r},function(s){e.DragAndDrop.AttachCallbacks({id:r,hover:function(t){if(!t&&q){q()}},drop:function(t){if(q){q()}f(t)}},function(){})})}function n(){document.getElementById(o).style.top="-1000px"}if(j){if(document.attachEvent&&(/MSIE/gi).test(navigator.userAgent)){m=document.createElement("div");m.setAttribute("id",o);a.extend(m.style,{position:"absolute",top:"-1000px",background:"red",filter:"alpha(opacity=0)",opacity:0});document.body.appendChild(m);a.addEvent(j,"dragenter",function(r){var q,s;q=document.getElementById(k);s=a.getPos(q);a.extend(document.getElementById(o).style,{top:s.y+"px",left:s.x+"px",width:q.offsetWidth+"px",height:q.offsetHeight+"px"})});p(o,n)}else{p(k)}}a.addEvent(document.getElementById(d.browse_button),"click",function(v){var t=[],r,q,u=d.filters,s;v.preventDefault();for(r=0;r<u.length;r++){s=u[r].extensions.split(",");for(q=0;q<s.length;q++){t.push(a.mimeTypes[s[q]])}}e.FileBrowse.OpenBrowseDialog({mimeTypes:t},function(w){if(w.success){f(w.value)}})});j=m=null});g.bind("UploadFile",function(n,k){var m=h[k.id],j={},l=n.settings.chunk_size,o,p=[];function r(s,u){var t;if(k.status==a.FAILED){return}j.name=k.target_name||k.name;if(l){j.chunk=s;j.chunks=u}t=p.shift();e.Uploader.upload({url:a.buildUrl(n.settings.url,j),files:{file:t},cookies:document.cookies,postvars:n.settings.multipart_params,progressCallback:function(x){var w,v=0;o[s]=parseInt(x.filePercent*t.size/100,10);for(w=0;w<o.length;w++){v+=o[w]}k.loaded=v;n.trigger("UploadProgress",k)}},function(w){var v,x;if(w.success){v=w.value.statusCode;if(l){n.trigger("ChunkUploaded",k,{chunk:s,chunks:u,response:w.value.body,status:v})}if(p.length>0){r(++s,u)}else{k.status=a.DONE;n.trigger("FileUploaded",k,{response:w.value.body,status:v});if(v>=400){n.trigger("Error",{code:a.HTTP_ERROR,message:"HTTP Error.",file:k,status:v})}}}else{n.trigger("Error",{code:a.GENERIC_ERROR,message:"Generic Error.",file:k,details:w.error})}})}function q(s){k.size=s.size;if(l){e.FileAccess.chunk({file:s,chunkSize:l},function(v){if(v.success){var w=v.value,t=w.length;o=Array(t);for(var u=0;u<t;u++){o[u]=0;p.push(w[u])}r(0,t)}})}else{o=Array(1);p.push(s);r(0,1)}}if(c&&/\.(png|jpg|jpeg)$/i.test(k.name)){BrowserPlus.ImageAlter.transform({file:m,quality:c.quality||90,actions:[{scale:{maxwidth:c.width,maxheight:c.height}}]},function(s){if(s.success){q(s.value.file)}})}else{q(m)}});i({success:true})}if(e){e.init(function(k){var j=[{service:"Uploader",version:"3"},{service:"DragAndDrop",version:"1"},{service:"FileBrowse",version:"1"},{service:"FileAccess",version:"2"}];if(c){j.push({service:"ImageAlter",version:"4"})}if(k.success){e.require({services:j},function(l){if(l.success){b()}else{i()}})}else{i()}})}else{i()}}})})(plupload);(function(b){function a(i,l,j,c,k){var e,d,h,g,f;e=document.createElement("canvas");e.style.display="none";document.body.appendChild(e);d=e.getContext("2d");h=new Image();h.onload=function(){var o,m,n;f=Math.min(l/h.width,j/h.height);if(f<1){o=Math.round(h.width*f);m=Math.round(h.height*f)}else{o=h.width;m=h.height}e.width=o;e.height=m;d.drawImage(h,0,0,o,m);g=e.toDataURL(c);g=g.substring(g.indexOf("base64,")+7);g=atob(g);e.parentNode.removeChild(e);k({success:true,data:g})};h.src=i}b.runtimes.Html5=b.addRuntime("html5",{getFeatures:function(){var g,d,f,e,c;d=f=e=c=false;if(window.XMLHttpRequest){g=new XMLHttpRequest();f=!!g.upload;d=!!(g.sendAsBinary||g.upload)}if(d){e=!!(File&&File.prototype.getAsDataURL);c=!!(File&&File.prototype.slice)}return{html5:d,dragdrop:window.mozInnerScreenX!==undefined||c,jpgresize:e,pngresize:e,multipart:e,progress:f}},init:function(e,f){var c={};function d(k){var h,g,j=[],l;for(g=0;g<k.length;g++){h=k[g];l=b.guid();c[l]=h;j.push(new b.File(l,h.fileName,h.fileSize))}if(j.length){e.trigger("FilesAdded",j)}}if(!this.getFeatures().html5){f({success:false});return}e.bind("Init",function(l){var p,n=[],k,o,h=l.settings.filters,j,m,g=document.body;p=document.createElement("div");p.id=l.id+"_html5_container";for(k=0;k<h.length;k++){j=h[k].extensions.split(/,/);for(o=0;o<j.length;o++){m=b.mimeTypes[j[o]];if(m){n.push(m)}}}b.extend(p.style,{position:"absolute",background:e.settings.shim_bgcolor||"transparent",width:"100px",height:"100px",overflow:"hidden",zIndex:99999,opacity:e.settings.shim_bgcolor?"":0});p.className="plupload html5";if(e.settings.container){g=document.getElementById(e.settings.container);g.style.position="relative"}g.appendChild(p);p.innerHTML='<input id="'+e.id+'_html5" style="width:100%;" type="file" accept="'+n.join(",")+'" '+(e.settings.multi_selection?'multiple="multiple"':"")+" />";document.getElementById(e.id+"_html5").onchange=function(){d(this.files);this.value=""}});e.bind("PostInit",function(){var g=document.getElementById(e.settings.drop_element);if(g){b.addEvent(g,"dragover",function(h){h.preventDefault()});b.addEvent(g,"drop",function(i){var h=i.dataTransfer;if(h&&h.files){d(h.files)}i.preventDefault()})}});e.bind("Refresh",function(g){var h,i,j;h=document.getElementById(e.settings.browse_button);i=b.getPos(h,document.getElementById(g.settings.container));j=b.getSize(h);b.extend(document.getElementById(e.id+"_html5_container").style,{top:i.y+"px",left:i.x+"px",width:j.w+"px",height:j.h+"px"})});e.bind("UploadFile",function(g,j){var n=new XMLHttpRequest(),i=n.upload,h=g.settings.resize,m,l=0;function k(o){var s="----pluploadboundary"+b.guid(),q="--",r="\r\n",p="";if(g.settings.multipart){n.setRequestHeader("Content-Type","multipart/form-data; boundary="+s);b.each(g.settings.multipart_params,function(u,t){p+=q+s+r+'Content-Disposition: form-data; name="'+t+'"'+r+r;p+=u+r});p+=q+s+r+'Content-Disposition: form-data; name="'+g.settings.file_data_name+'"; filename="'+j.name+'"'+r+"Content-Type: application/octet-stream"+r+r+o+r+q+s+q+r;l=p.length-o.length;o=p}n.sendAsBinary(o)}if(j.status==b.DONE||j.status==b.FAILED||g.state==b.STOPPED){return}if(i){i.onprogress=function(o){j.loaded=o.loaded-l;g.trigger("UploadProgress",j)}}n.onreadystatechange=function(){var o;if(n.readyState==4){try{o=n.status}catch(p){o=0}j.status=b.DONE;j.loaded=j.size;g.trigger("UploadProgress",j);g.trigger("FileUploaded",j,{response:n.responseText,status:o});if(o>=400){g.trigger("Error",{code:b.HTTP_ERROR,message:"HTTP Error.",file:j,status:o})}}};n.open("post",b.buildUrl(g.settings.url,{name:j.target_name||j.name}),true);n.setRequestHeader("Content-Type","application/octet-stream");b.each(g.settings.headers,function(p,o){n.setRequestHeader(o,p)});m=c[j.id];if(n.sendAsBinary){if(h&&/\.(png|jpg|jpeg)$/i.test(j.name)){a(m.getAsDataURL(),h.width,h.height,/\.png$/i.test(j.name)?"image/png":"image/jpeg",function(o){if(o.success){j.size=o.data.length;k(o.data)}else{k(m.getAsBinary())}})}else{k(m.getAsBinary())}}else{n.send(m)}});f({success:true})}})})(plupload);(function(a){a.runtimes.Html4=a.addRuntime("html4",{getFeatures:function(){return{multipart:true}},init:function(f,g){var d={},c,b;function e(l){var k,j,m=[],n,h;h=l.value.replace(/\\/g,"/");h=h.substring(h.length,h.lastIndexOf("/")+1);n=a.guid();k=new a.File(n,h);d[n]=k;k.input=l;m.push(k);if(m.length){f.trigger("FilesAdded",m)}}f.bind("Init",function(p){var h,x,v,t=[],o,u,m=p.settings.filters,l,s,r=/MSIE/.test(navigator.userAgent),k="javascript",w,j=document.body,n;if(f.settings.container){j=document.getElementById(f.settings.container);j.style.position="relative"}c=(typeof p.settings.form=="string")?document.getElementById(p.settings.form):p.settings.form;if(!c){n=document.getElementById(f.settings.browse_button);for(;n;n=n.parentNode){if(n.nodeName=="FORM"){c=n}}}if(!c){c=document.createElement("form");c.style.display="inline";n=document.getElementById(f.settings.container);n.parentNode.insertBefore(c,n);c.appendChild(n)}c.setAttribute("method","post");c.setAttribute("enctype","multipart/form-data");a.each(p.settings.multipart_params,function(z,y){var i=document.createElement("input");a.extend(i,{type:"hidden",name:y,value:z});c.appendChild(i)});b=document.createElement("iframe");b.setAttribute("src",k+':""');b.setAttribute("name",p.id+"_iframe");b.setAttribute("id",p.id+"_iframe");b.style.display="none";a.addEvent(b,"load",function(B){var C=B.target,z=f.currentfile,A;try{A=C.contentWindow.document||C.contentDocument||window.frames[C.id].document}catch(y){p.trigger("Error",{code:a.SECURITY_ERROR,message:"Security error.",file:z});return}if(A.location.href=="about:blank"||!z){return}var i=A.documentElement.innerText||A.documentElement.textContent;if(i!=""){z.status=a.DONE;z.loaded=1025;z.percent=100;if(z.input){z.input.removeAttribute("name")}p.trigger("UploadProgress",z);p.trigger("FileUploaded",z,{response:i});if(c.tmpAction){c.setAttribute("action",c.tmpAction)}if(c.tmpTarget){c.setAttribute("target",c.tmpTarget)}}});c.appendChild(b);if(r){window.frames[b.id].name=b.name}x=document.createElement("div");x.id=p.id+"_iframe_container";for(o=0;o<m.length;o++){l=m[o].extensions.split(/,/);for(u=0;u<l.length;u++){s=a.mimeTypes[l[u]];if(s){t.push(s)}}}a.extend(x.style,{position:"absolute",background:"transparent",width:"100px",height:"100px",overflow:"hidden",zIndex:99999,opacity:0});w=f.settings.shim_bgcolor;if(w){a.extend(x.style,{background:w,opacity:1})}x.className="plupload_iframe";j.appendChild(x);function q(){v=document.createElement("input");v.setAttribute("type","file");v.setAttribute("accept",t.join(","));v.setAttribute("size",1);a.extend(v.style,{width:"100%",height:"100%",opacity:0});if(r){a.extend(v.style,{filter:"alpha(opacity=0)"})}a.addEvent(v,"change",function(i){var y=i.target;if(y.value){q();y.style.display="none";e(y)}});x.appendChild(v);return true}q()});f.bind("Refresh",function(h){var i,j,k;i=document.getElementById(f.settings.browse_button);j=a.getPos(i,document.getElementById(h.settings.container));k=a.getSize(i);a.extend(document.getElementById(f.id+"_iframe_container").style,{top:j.y+"px",left:j.x+"px",width:k.w+"px",height:k.h+"px"})});f.bind("UploadFile",function(h,i){if(i.status==a.DONE||i.status==a.FAILED||h.state==a.STOPPED){return}if(!i.input){i.status=a.ERROR;return}i.input.setAttribute("name",h.settings.file_data_name);c.tmpAction=c.getAttribute("action");c.setAttribute("action",a.buildUrl(h.settings.url,{name:i.target_name||i.name}));c.tmpTarget=c.getAttribute("target");c.setAttribute("target",b.name);this.currentfile=i;c.submit()});f.bind("FilesRemoved",function(h,k){var j,l;for(j=0;j<k.length;j++){l=k[j].input;if(l){l.parentNode.removeChild(l)}}});g({success:true})}})})(plupload);
$.fn.imagepicker = function(options) {

  var defaults = {
    insertFn: null
  };
  var options = $.extend(defaults, options);

  var copyLinkToEditor = function(link, event) {
    var editor = CodeMirrorEditors[0].editor;
    var handle = editor.cursorLine(), position = editor.cursorPosition(handle).character;

    var value = options.insertFn != null ? options.insertFn(link) : link.attr('href');

    editor.insertIntoLine(handle, position, value);

    event.stopPropagation();
    event.preventDefault();

    $.fancybox.close();
  }

  var setupUploader = function() {
    var multipartParams = {};
    multipartParams[$('meta[name=csrf-param]').attr('content')] = $('meta[name=csrf-token]').attr('content');

    var uploader = new plupload.Uploader({
      runtimes : (jQuery.browser.webkit == true ? 'flash' : 'html5,flash'),
      container: 'theme-images',
      browse_button : 'upload-link',
      max_file_size : '5mb',
      url : $('a#upload-link').attr('href'),
      flash_swf_url : '/javascripts/admin/plugins/plupload/plupload.flash.swf',
      multipart: true,
      multipart_params: multipartParams
    });

    uploader.bind('QueueChanged', function() {
      uploader.start();
    });

    uploader.bind('FileUploaded', function(up, file, response) {
      var json = JSON.parse(response.response);

      if (json.status == 'success') {
        var asset = $('.asset-picker ul li.new-asset')
          .clone()
          .insertBefore($('.asset-picker ul li.clear'))
          .addClass('asset');

        asset.find('strong a').attr('href', json.url)
          .attr('data-local-path', json.local_path)
          .html(json.local_path).bind('click', function(e) {
          copyLinkToEditor($(this), e);
        });
        asset.find('.more .size').html(json.size);
        asset.find('.more .date').html(json.date);

        if ($('.asset-picker ul li.asset').length % 3 == 0)
          asset.addClass('last');

        asset.removeClass('new-asset');

        $('.asset-picker p.no-items').hide();

        $('.asset-picker ul').scrollTo($('li.asset:last'), 400);
      }
    });

    uploader.init();
  }

  return this.each(function() {
    $(this).fancybox({
      'onComplete': function() {
        setupUploader();

        $('ul.theme-assets strong a').bind('click', function(e) { copyLinkToEditor($(this), e); });
      }
    });
  });
};