(function(b){var e,d,a=[],c=window;b.fn.tinymce=function(j){var p=this,g,k,h,m,i,l="",n="";if(!p.length){return p}if(!j){return tinyMCE.get(p[0].id)}function o(){var r=[],q=0;if(f){f();f=null}p.each(function(t,u){var s,w=u.id,v=j.oninit;if(!w){u.id=w=tinymce.DOM.uniqueId()}s=new tinymce.Editor(w,j);r.push(s);if(v){s.onInit.add(function(){var x,y=v;if(++q==r.length){if(tinymce.is(y,"string")){x=(y.indexOf(".")===-1)?null:tinymce.resolve(y.replace(/\.\w+$/,""));y=tinymce.resolve(y)}y.apply(x||tinymce,r)}})}});b.each(r,function(t,s){s.render()})}if(!c.tinymce&&!d&&(g=j.script_url)){d=1;h=g.substring(0,g.lastIndexOf("/"));if(/_(src|dev)\.js/g.test(g)){n="_src"}m=g.lastIndexOf("?");if(m!=-1){l=g.substring(m+1)}c.tinyMCEPreInit=c.tinyMCEPreInit||{base:h,suffix:n,query:l};if(g.indexOf("gzip")!=-1){i=j.language||"en";g=g+(/\?/.test(g)?"&":"?")+"js=true&core=true&suffix="+escape(n)+"&themes="+escape(j.theme)+"&plugins="+escape(j.plugins)+"&languages="+i;if(!c.tinyMCE_GZ){tinyMCE_GZ={start:function(){tinymce.suffix=n;function q(r){tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(r))}q("langs/"+i+".js");q("themes/"+j.theme+"/editor_template"+n+".js");q("themes/"+j.theme+"/langs/"+i+".js");b.each(j.plugins.split(","),function(s,r){if(r){q("plugins/"+r+"/editor_plugin"+n+".js");q("plugins/"+r+"/langs/"+i+".js")}})},end:function(){}}}}b.ajax({type:"GET",url:g,dataType:"script",cache:true,success:function(){tinymce.dom.Event.domLoaded=1;d=2;if(j.script_loaded){j.script_loaded()}o();b.each(a,function(q,r){r()})}})}else{if(d===1){a.push(o)}else{o()}}return p};b.extend(b.expr[":"],{tinymce:function(g){return g.id&&!!tinyMCE.get(g.id)}});function f(){function i(l){if(l==="remove"){this.each(function(n,o){var m=h(o);if(m){m.remove()}})}this.find("span.mceEditor,div.mceEditor").each(function(n,o){var m=tinyMCE.get(o.id.replace(/_parent$/,""));if(m){m.remove()}})}function k(n){var m=this,l;if(n!==e){i.call(m);m.each(function(p,q){var o;if(o=tinyMCE.get(q.id)){o.setContent(n)}})}else{if(m.length>0){if(l=tinyMCE.get(m[0].id)){return l.getContent()}}}}function h(m){var l=null;(m)&&(m.id)&&(c.tinymce)&&(l=tinyMCE.get(m.id));return l}function g(l){return !!((l)&&(l.length)&&(c.tinymce)&&(l.is(":tinymce")))}var j={};b.each(["text","html","val"],function(n,l){var o=j[l]=b.fn[l],m=(l==="text");b.fn[l]=function(s){var p=this;if(!g(p)){return o.apply(p,arguments)}if(s!==e){k.call(p.filter(":tinymce"),s);o.apply(p.not(":tinymce"),arguments);return p}else{var r="";var q=arguments;(m?p:p.eq(0)).each(function(u,v){var t=h(v);r+=t?(m?t.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,""):t.getContent()):o.apply(b(v),q)});return r}}});b.each(["append","prepend"],function(n,m){var o=j[m]=b.fn[m],l=(m==="prepend");b.fn[m]=function(q){var p=this;if(!g(p)){return o.apply(p,arguments)}if(q!==e){p.filter(":tinymce").each(function(s,t){var r=h(t);r&&r.setContent(l?q+r.getContent():r.getContent()+q)});o.apply(p.not(":tinymce"),arguments);return p}}});b.each(["remove","replaceWith","replaceAll","empty"],function(m,l){var n=j[l]=b.fn[l];b.fn[l]=function(){i.call(this,l);return n.apply(this,arguments)}});j.attr=b.fn.attr;b.fn.attr=function(n,q,o){var m=this;if((!n)||(n!=="value")||(!g(m))){return j.attr.call(m,n,q,o)}if(q!==e){k.call(m.filter(":tinymce"),q);j.attr.call(m.not(":tinymce"),n,q,o);return m}else{var p=m[0],l=h(p);return l?l.getContent():j.attr.call(b(p),n,q,o)}}}})(jQuery);
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
        'scrolling'   : 'no',
        'padding'   : 20,
        'transitionIn'  : 'none',
        'transitionOut' : 'none'
      });
    },

    fancybox_get_viewport = function() {
      return [ $(window).width(), $(window).height(), $(document).scrollLeft(), $(document).scrollTop() ];
    },

    fancybox_get_zoom_to = function () {
      var view  = fancybox_get_viewport(),
        to    = {},

        margin = currentOpts.margin,
        resize = currentOpts.autoScale,

        horizontal_space  = (shadow + margin) * 2,
        vertical_space    = (shadow + margin) * 2,
        double_padding    = (currentOpts.padding * 2),

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
          horizontal_space  += double_padding;
          vertical_space    += double_padding;

          ratio = Math.min(Math.min( view[0] - horizontal_space, currentOpts.width) / currentOpts.width, Math.min( view[1] - vertical_space, currentOpts.height) / currentOpts.height);

          to.width  = Math.round(ratio * (to.width  - double_padding)) + double_padding;
          to.height = Math.round(ratio * (to.height - double_padding)) + double_padding;

        } else {
          to.width  = Math.min(to.width,  (view[0] - horizontal_space));
          to.height = Math.min(to.height, (view[1] - vertical_space));
        }
      }

      to.top  = view[3] + ((view[1] - (to.height  + (shadow * 2 ))) * 0.5);
      to.left = view[2] + ((view[0] - (to.width + (shadow * 2 ))) * 0.5);

      if (currentOpts.autoScale === false) {
        to.top  = Math.max(view[3] + margin, to.top);
        to.left = Math.max(view[2] + margin, to.left);
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
      var title = currentOpts.title,
        width = final_pos.width - (currentOpts.padding * 2),
        titlec  = 'fancybox-title-' + currentOpts.titlePosition;

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
        'width'     : width,
        'paddingLeft' : currentOpts.padding,
        'paddingRight'  : currentOpts.padding
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

      if (currentOpts.hideOnContentClick) {
        inner.one('click', $.fancybox.close);
      }
      if (currentOpts.hideOnOverlayClick) {
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
      var width = Math.round(start_pos.width  + (final_pos.width  - start_pos.width)  * pos),
        height  = Math.round(start_pos.height + (final_pos.height - start_pos.height) * pos),

        top   = Math.round(start_pos.top  + (final_pos.top  - start_pos.top)  * pos),
        left  = Math.round(start_pos.left + (final_pos.left - start_pos.left) * pos);

      wrap.css({
        'width'   : width   + 'px',
        'height'  : height  + 'px',
        'top'   : top   + 'px',
        'left'    : left    + 'px'
      });

      width = Math.max(width - currentOpts.padding * 2, 0);
      height  = Math.max(height - (currentOpts.padding * 2 + (titleh * pos)), 0);

      inner.css({
        'width'   : width   + 'px',
        'height'  : height  + 'px'
      });

      if (typeof final_pos.opacity !== 'undefined') {
        wrap.css('opacity', (pos < 0.5 ? 0.5 : pos));
      }
    },

    fancybox_get_obj_pos = function(obj) {
      var pos   = obj.offset();

      pos.top   += parseFloat( obj.css('paddingTop') )  || 0;
      pos.left  += parseFloat( obj.css('paddingLeft') ) || 0;

      pos.top   += parseFloat( obj.css('border-top-width') )  || 0;
      pos.left  += parseFloat( obj.css('border-left-width') ) || 0;

      pos.width = obj.width();
      pos.height  = obj.height();

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
          width : (pos.width  + (currentOpts.padding * 2)),
          height  : (pos.height + (currentOpts.padding * 2)),
          top   : (pos.top    - currentOpts.padding - shadow),
          left  : (pos.left   - currentOpts.padding - shadow)
        };

      } else {
        view = fancybox_get_viewport();

        from = {
          width : 1,
          height  : 1,
          top   : view[3] + view[1] * 0.5,
          left  : view[2] + view[0] * 0.5
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

      currentArray  = selectedArray;
      currentIndex  = selectedIndex;
      currentOpts   = selectedOpts;

      inner.get(0).scrollTop  = 0;
      inner.get(0).scrollLeft = 0;

      if (currentOpts.overlayShow) {
        if (isIE6) {
          $('select:not(#fancybox-tmp select)').filter(function() {
            return this.style.visibility !== 'hidden';
          }).css({'visibility':'hidden'}).one('fancybox-cleanup', function() {
            this.style.visibility = 'inherit';
          });
        }

        overlay.css({
          'background-color'  : currentOpts.overlayColor,
          'opacity'     : currentOpts.overlayOpacity
        }).unbind().show();
      }

      final_pos = fancybox_get_zoom_to();

      fancybox_process_title();

      if (wrap.is(":visible")) {
        $( close.add( nav_left ).add( nav_right ) ).hide();

        var pos = wrap.position(),
          equal;

        start_pos = {
          top   : pos.top ,
          left  : pos.left,
          width : wrap.width(),
          height  : wrap.height()
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
              top     : currentOpts.padding,
              left    : currentOpts.padding,
              width   : Math.max(final_pos.width  - (currentOpts.padding * 2), 1),
              height    : Math.max(final_pos.height - (currentOpts.padding * 2) - titleh, 1)
            });

            finish_resizing();

          } else {
            inner.css({
              top     : currentOpts.padding,
              left    : currentOpts.padding,
              width   : Math.max(start_pos.width  - (currentOpts.padding * 2), 1),
              height    : Math.max(start_pos.height - (currentOpts.padding * 2), 1)
            });

            fx.prop = 0;

            $(fx).animate({ prop: 1 }, {
               duration : currentOpts.changeSpeed,
               easing   : currentOpts.easingChange,
               step   : fancybox_draw,
               complete : finish_resizing
            });
          }
        });

        return;
      }

      wrap.css('opacity', 1);

      if (currentOpts.transitionIn == 'elastic') {
        start_pos = fancybox_get_zoom_from();

        inner.css({
            top     : currentOpts.padding,
            left    : currentOpts.padding,
            width   : Math.max(start_pos.width  - (currentOpts.padding * 2), 1),
            height    : Math.max(start_pos.height - (currentOpts.padding * 2), 1)
          })
          .html( tmp.contents() );

        wrap.css(start_pos).show();

        if (currentOpts.opacity) {
          final_pos.opacity = 0;
        }

        fx.prop = 0;

        $(fx).animate({ prop: 1 }, {
           duration : currentOpts.speedIn,
           easing   : currentOpts.easingIn,
           step   : fancybox_draw,
           complete : _finish
        });

      } else {
        inner.css({
            top     : currentOpts.padding,
            left    : currentOpts.padding,
            width   : Math.max(final_pos.width  - (currentOpts.padding * 2), 1),
            height    : Math.max(final_pos.height - (currentOpts.padding * 2) - titleh, 1)
          })
          .html( tmp.contents() );

        wrap.css( final_pos ).fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
      }
    },

    fancybox_process_inline = function() {
      tmp.width(  selectedOpts.width );
      tmp.height( selectedOpts.height );

      if (selectedOpts.width  == 'auto') {
        selectedOpts.width = tmp.width();
      }
      if (selectedOpts.height == 'auto') {
        selectedOpts.height = tmp.height();
      }

      fancybox_show();
    },

    fancybox_process_image = function() {
      busy = true;

      selectedOpts.width  = imgPreloader.width;
      selectedOpts.height = imgPreloader.height;

      $("<img />").attr({
        'id'  : 'fancybox-img',
        'src' : imgPreloader.src,
        'alt' : selectedOpts.title
      }).appendTo( tmp );

      fancybox_show();
    },

    fancybox_start = function() {
      fancybox_abort();

      var obj = selectedArray[ selectedIndex ],
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
        type  = 'html';

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

      selectedOpts.type = type;
      selectedOpts.href = href;
      selectedOpts.title  = title;

      if (selectedOpts.autoDimensions && selectedOpts.type !== 'iframe' && selectedOpts.type !== 'swf') {
        selectedOpts.width    = 'auto';
        selectedOpts.height   = 'auto';
      }

      if (selectedOpts.modal) {
        selectedOpts.overlayShow    = true;
        selectedOpts.hideOnOverlayClick = false;
        selectedOpts.hideOnContentClick = false;
        selectedOpts.enableEscapeButton = false;
        selectedOpts.showCloseButton  = false;
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
          selector  = href.split('#', 2);
          data    = selectedOpts.ajax.data || {};

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
            url       : href,
            data      : data,
            error     : fancybox_error,
            dataType  : 'html',
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
        tmp     = $('<div id="fancybox-tmp"></div>'),
        loading   = $('<div id="fancybox-loading"><div></div></div>'),
        overlay   = $('<div id="fancybox-overlay"></div>'),
        wrap    = $('<div id="fancybox-wrap"></div>')
      );

      if (!$.support.opacity) {
        wrap.addClass('fancybox-ie');
        loading.addClass('fancybox-ie');
      }

      outer = $('<div id="fancybox-outer"></div>')
        .append('<div class="fancy-bg" id="fancy-bg-n"></div><div class="fancy-bg" id="fancy-bg-ne"></div><div class="fancy-bg" id="fancy-bg-e"></div><div class="fancy-bg" id="fancy-bg-se"></div><div class="fancy-bg" id="fancy-bg-s"></div><div class="fancy-bg" id="fancy-bg-sw"></div><div class="fancy-bg" id="fancy-bg-w"></div><div class="fancy-bg" id="fancy-bg-nw"></div>')
        .appendTo( wrap );

      outer.append(
        inner   = $('<div id="fancybox-inner"></div>'),
        close   = $('<a id="fancybox-close"></a>'),

        nav_left  = $('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'),
        nav_right = $('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')
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
        overlay.get(0).style.setExpression('height',  "document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + 'px'");
        loading.get(0).style.setExpression('top',   "(-20 + (document.documentElement.clientHeight ? document.documentElement.clientHeight/2 : document.body.clientHeight/2 ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop )) + 'px'");

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

        selectedArray = [];
        selectedIndex = 0;

        var rel = $(this).attr('rel') || '';

        if (!rel || rel == '' || rel === 'nofollow') {
          selectedArray.push(this);

        } else {
          selectedArray = $("a[rel=" + rel + "], area[rel=" + rel + "]");
          selectedIndex = selectedArray.index( this );
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

    selectedArray = [];
    selectedIndex = opts.index || 0;

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

      currentArray  = selectedOpts  = [];
      currentIndex  = selectedIndex = 0;
      currentOpts   = selectedOpts  = {};

      busy = false;
    }

    inner.css('overflow', 'hidden');

    if (currentOpts.transitionOut == 'elastic') {
      start_pos = fancybox_get_zoom_from();

      var pos = wrap.position();

      final_pos = {
        top   : pos.top ,
        left  : pos.left,
        width : wrap.width(),
        height  : wrap.height()
      };

      if (currentOpts.opacity) {
        final_pos.opacity = 1;
      }

      fx.prop = 1;

      $(fx).animate({ prop: 0 }, {
         duration : currentOpts.speedOut,
         easing   : currentOpts.easingOut,
         step   : fancybox_draw,
         complete : _cleanup
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

    wrap.css({height: h + (currentOpts.padding * 2) + titleh});
    inner.css({height:  h});

    c.replaceWith(c.children());

    $.fancybox.center();
  };

  $.fancybox.center = function() {
    busy = true;

    var view  = fancybox_get_viewport(),
      margin  = currentOpts.margin,
      to    = {};

    to.top  = view[3] + ((view[1] - ((wrap.height() - titleh) + (shadow * 2 ))) * 0.5);
    to.left = view[2] + ((view[0] - (wrap.width() + (shadow * 2 ))) * 0.5);

    to.top  = Math.max(view[3] + margin, to.top);
    to.left = Math.max(view[2] + margin, to.left);

    wrap.css(to);

    busy = false;
  };

  $.fn.fancybox.defaults = {
    padding       : 10,
    margin        : 20,
    opacity       : false,
    modal       : false,
    cyclic        : false,
    scrolling     : 'auto', // 'auto', 'yes' or 'no'

    width       : 560,
    height        : 340,

    autoScale     : true,
    autoDimensions    : true,
    centerOnScroll    : false,

    ajax        : {},
    swf         : { wmode: 'transparent' },

    hideOnOverlayClick  : true,
    hideOnContentClick  : false,

    overlayShow     : true,
    overlayOpacity    : 0.3,
    overlayColor    : '#666',

    titleShow     : true,
    titlePosition   : 'outside',  // 'outside', 'inside' or 'over'
    titleFormat     : null,

    transitionIn    : 'fade', // 'elastic', 'fade' or 'none'
    transitionOut   : 'fade', // 'elastic', 'fade' or 'none'

    speedIn       : 300,
    speedOut      : 300,

    changeSpeed     : 300,
    changeFade      : 'fast',

    easingIn      : 'swing',
    easingOut     : 'swing',

    showCloseButton   : true,
    showNavArrows   : true,
    enableEscapeButton  : true,

    onStart       : null,
    onCancel      : null,
    onComplete      : null,
    onCleanup     : null,
    onClosed      : null
  };

  $(document).ready(function() {
    fancybox_init();
  });

})(jQuery);
/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line != "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag);
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message:
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value = context;
      var path = name.split(/\./);
      for(var i = 0; i < path.length; i++) {
        name = path[i];
        if(value && is_kinda_truthy(value[name])) {
          value = value[name];
        } else if(i == 0 && is_kinda_truthy(this.context[name])) {
          value = this.context[name];
        } else {
          value = undefined;
        }
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
// edit category collection
$(document).ready(function() {
  $('button.edit-categories-link').click(function() {
    var link = $(this);
    $.fancybox({
      titleShow: false,
      href: link.attr('data-url'),
      padding: 0,
      onComplete: function() { SetupCustomFieldCategoryEditor(link.prev()); },
      onCleanup: function() { }
    })
  });
});

var SetupCustomFieldCategoryEditor = function(target) {

  var wrapper = $('#edit-custom-field-category');
  var form = wrapper.find('form.formtastic');
  var submitButton = wrapper.find('.popup-actions button');
  var list = wrapper.find('ol');
  var template = $('#category-tmpl').html();
  var baseInputName = $('#category-tmpl').attr('data-base-input-name');
  var data = categories;
  var index = 0;

  var refreshPosition = function() {
    $.each(list.find('li.added:visible input[data-field=position]'), function(index) { $(this).val(index); });
  }

  var updateTargetCallback = function(data) {
    if (data.error == null) {
      list = data.category_items.sort(function(a, b) { return (a.position - b.position); });

      var options = '';
      var selectedValue = target.val();
      for (var i = 0; i < list.length; i++)
        options += '<option value="' + list[i].id + '" >' + list[i].name + '</option>';

      target.html(options);
      target.val(selectedValue);

      $.fancybox.close();
    } else
      $.growl("error", data.error);
  }

  var updateTarget = function(event) {
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      data: form.serialize(),
      url: form.attr('action'),
      success: updateTargetCallback
    });
    event.preventDefault();
    event.stopPropagation();
  }

  var registerTemplateEvents = function(domField) {
    var nameDom = domField.find('input[data-field=name]');

    // bind the "Add field" button
    domField.find('button').bind('click', function(e) {
      var newItem = $.extend({}, data.template);
      newItem.name = nameDom.val().trim();

      if (newItem.name == '') return false;

      addItem(newItem, { refreshPosition: true });

      // reset template values
      nameDom.val('').focus();

      e.preventDefault(); e.stopPropagation();
    });

    nameDom.keypress(function(e) {
      if (e.which == 13) {
        domField.find('button').trigger('click');
        e.preventDefault();
      }
    });
  }

  var registerItemEvents = function(category, domField) {
    // remove
    domField.find('a.remove').click(function(e) {
      if (confirm($(this).attr('data-confirm'))) {
        if (category.new_record)
          domField.remove();
        else
          domField.hide().find('input[data-field=_destroy]').val(1);

        refreshPosition();

        $.fancybox.resize();
      }
      e.preventDefault(); e.stopPropagation();
    });
  }

  var addItem = function(category, options) {
    options = $.extend({
      'is_template': false,
      'refreshPosition': false
    }, options);

    category = $.extend({
      behaviour_flag: function() { return options.is_template ? 'template' : 'added' },
      new_record_flag: function() { return this.new_record == true && options.is_template == false ? 'new' : '' },
      errors_flag: function() { return this.errors && Object.size(this.errors) > 0 ? 'error' : '' },
      base_name: function() { return options.is_template ? '' : baseInputName + "[" + index + "]"; },
      base_dom_id: function() { return options.is_template ? 'category_template' : 'category_' + index; },
      if_existing_record: function() { return this.new_record == false }
    }, category);

    var html = Mustache.to_html(template, category);

    if (options.is_template) {
      domField = list.append(html).find('.template');

      registerTemplateEvents(domField);
    }
    else {
      domField = list.find('> .template').before(html).prev('li');

      registerItemEvents(category, domField);

      list.sortable('refresh');

      if (options.refreshPosition) refreshPosition();

      index++;
    }

    $.fancybox.resize();
  }

  /* ___ SETUP ___ */
  var setup = function() {
    // sortable list
    list.sortable({
      handle: 'span.handle',
      items: 'li:not(.template)',
      axis: 'y',
      update: refreshPosition
    });

    // add the template field used to insert the new ones
    addItem(data.template, { is_template: true });

    // add the existing fields (if present)
    for (var i = 0; i < data.collection.length; i++)
      addItem(data.collection[i]);

    submitButton.click(updateTarget);
   }

   setup(); // <- let's the show begin
};