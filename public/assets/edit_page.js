(function(b){var e,d,a=[],c=window;b.fn.tinymce=function(j){var p=this,g,k,h,m,i,l="",n="";if(!p.length){return p}if(!j){return tinyMCE.get(p[0].id)}function o(){var r=[],q=0;if(f){f();f=null}p.each(function(t,u){var s,w=u.id,v=j.oninit;if(!w){u.id=w=tinymce.DOM.uniqueId()}s=new tinymce.Editor(w,j);r.push(s);if(v){s.onInit.add(function(){var x,y=v;if(++q==r.length){if(tinymce.is(y,"string")){x=(y.indexOf(".")===-1)?null:tinymce.resolve(y.replace(/\.\w+$/,""));y=tinymce.resolve(y)}y.apply(x||tinymce,r)}})}});b.each(r,function(t,s){s.render()})}if(!c.tinymce&&!d&&(g=j.script_url)){d=1;h=g.substring(0,g.lastIndexOf("/"));if(/_(src|dev)\.js/g.test(g)){n="_src"}m=g.lastIndexOf("?");if(m!=-1){l=g.substring(m+1)}c.tinyMCEPreInit=c.tinyMCEPreInit||{base:h,suffix:n,query:l};if(g.indexOf("gzip")!=-1){i=j.language||"en";g=g+(/\?/.test(g)?"&":"?")+"js=true&core=true&suffix="+escape(n)+"&themes="+escape(j.theme)+"&plugins="+escape(j.plugins)+"&languages="+i;if(!c.tinyMCE_GZ){tinyMCE_GZ={start:function(){tinymce.suffix=n;function q(r){tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(r))}q("langs/"+i+".js");q("themes/"+j.theme+"/editor_template"+n+".js");q("themes/"+j.theme+"/langs/"+i+".js");b.each(j.plugins.split(","),function(s,r){if(r){q("plugins/"+r+"/editor_plugin"+n+".js");q("plugins/"+r+"/langs/"+i+".js")}})},end:function(){}}}}b.ajax({type:"GET",url:g,dataType:"script",cache:true,success:function(){tinymce.dom.Event.domLoaded=1;d=2;if(j.script_loaded){j.script_loaded()}o();b.each(a,function(q,r){r()})}})}else{if(d===1){a.push(o)}else{o()}}return p};b.extend(b.expr[":"],{tinymce:function(g){return g.id&&!!tinyMCE.get(g.id)}});function f(){function i(l){if(l==="remove"){this.each(function(n,o){var m=h(o);if(m){m.remove()}})}this.find("span.mceEditor,div.mceEditor").each(function(n,o){var m=tinyMCE.get(o.id.replace(/_parent$/,""));if(m){m.remove()}})}function k(n){var m=this,l;if(n!==e){i.call(m);m.each(function(p,q){var o;if(o=tinyMCE.get(q.id)){o.setContent(n)}})}else{if(m.length>0){if(l=tinyMCE.get(m[0].id)){return l.getContent()}}}}function h(m){var l=null;(m)&&(m.id)&&(c.tinymce)&&(l=tinyMCE.get(m.id));return l}function g(l){return !!((l)&&(l.length)&&(c.tinymce)&&(l.is(":tinymce")))}var j={};b.each(["text","html","val"],function(n,l){var o=j[l]=b.fn[l],m=(l==="text");b.fn[l]=function(s){var p=this;if(!g(p)){return o.apply(p,arguments)}if(s!==e){k.call(p.filter(":tinymce"),s);o.apply(p.not(":tinymce"),arguments);return p}else{var r="";var q=arguments;(m?p:p.eq(0)).each(function(u,v){var t=h(v);r+=t?(m?t.getContent().replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g,""):t.getContent()):o.apply(b(v),q)});return r}}});b.each(["append","prepend"],function(n,m){var o=j[m]=b.fn[m],l=(m==="prepend");b.fn[m]=function(q){var p=this;if(!g(p)){return o.apply(p,arguments)}if(q!==e){p.filter(":tinymce").each(function(s,t){var r=h(t);r&&r.setContent(l?q+r.getContent():r.getContent()+q)});o.apply(p.not(":tinymce"),arguments);return p}}});b.each(["remove","replaceWith","replaceAll","empty"],function(m,l){var n=j[l]=b.fn[l];b.fn[l]=function(){i.call(this,l);return n.apply(this,arguments)}});j.attr=b.fn.attr;b.fn.attr=function(n,q,o){var m=this;if((!n)||(n!=="value")||(!g(m))){return j.attr.call(m,n,q,o)}if(q!==e){k.call(m.filter(":tinymce"),q);j.attr.call(m.not(":tinymce"),n,q,o);return m}else{var p=m[0],l=h(p);return l?l.getContent():j.attr.call(b(p),n,q,o)}}}})(jQuery);
$(document).ready(function() {

  var enableNav = function() {
    $('#editable-elements .nav a').click(function(e) {
      var index = parseInt($(this).attr('href').match(/block-(.+)/)[1]);

      $('#editable-elements .wrapper ul li.block').hide();
      $('#block-' + index).show();

      $(this).parent().find('.on').removeClass('on');
      $(this).addClass('on');

      e.preventDefault();
    });
  }

  enableNav();

  $.subscribe('form.saved.success', function(event, data) {
    if (data.editable_elements != '') {
      $('#editable-elements').replaceWith(data.editable_elements);
      enableNav();

      $('textarea.html').tinymce(TinyMceDefaultSettings);
    }
  }, []);

  $('textarea.html').tinymce(TinyMceDefaultSettings);

});

$(document).ready(function() {

  // open / close folder
  $('#pages-list ul.folder img.toggler').click(function(e) {
    var toggler = $(this);
    var children = toggler.parent().find('> ul.folder');
    if (children.is(':visible')) {
      children.slideUp('fast', function() {
        toggler.attr('src', toggler.attr('src').replace('open', 'closed'));
        $.cookie(children.attr('id'), 'none');
      });
    } else {
      children.slideDown('fast', function() {
        toggler.attr('src', toggler.attr('src').replace('closed', 'open'));
        $.cookie(children.attr('id'), 'block');
      });
    }
  });

  // sortable folder items
  $('#pages-list ul.folder').sortable({
    'handle': 'em',
    'axis': 'y',
    'update': function(event, ui) {
      var params = $(this).sortable('serialize', { 'key': 'children[]' });
      params += '&_method=put';

      $.post($(this).attr('data_url'), params, function(data) {
        var error = typeof(data.error) != 'undefined';
        $.growl((error ? 'error' : 'success'), (error ? data.error : data.notice));
      }, 'json');
    }
  });
  
  // templatized feature

  $.subscribe('toggle.page_templatized.checked', function(event, data) {
    $('#page_slug_input').hide();
    $('#page_redirect').parent('li').hide();
    $('#page_listed').parent('li').hide();
    $('#page_content_type_id_input').show();
  }, []);

  $.subscribe('toggle.page_templatized.unchecked', function(event, data) {
    $('#page_slug_input').show();
    $('#page_redirect').parent('li').show();
    $('#page_listed').parent('li').show();
    $('#page_slug').val(makeSlug($('#page_title').val())).addClass('touched');
    $('#page_content_type_id_input').hide();
  }, []);

  // redirect feature

  $.subscribe('toggle.page_redirect.checked', function(event, data) {
    $('#page_templatized').parent('li').hide();
    $('#page_cache_strategy_input').hide();
    $('#page_redirect_url_input').show();
  }, []);

 $.subscribe('toggle.page_redirect.unchecked', function(event, data) {
    $('#page_templatized').parent('li').show();
    $('#page_cache_strategy_input').show();
    $('#page_redirect_url_input').hide();
  }, []);

  // automatic slug from page title
  $('#page_title').keypress(function() {
    var input = $(this);
    var slug = $('#page_slug');

    if (!slug.hasClass('filled')) {
      setTimeout(function() {
        slug.val(makeSlug(input.val())).addClass('touched');
      }, 50);
    }
  });

  $('#page_slug').keypress(function() {
    $(this).addClass('filled').addClass('touched');
  });

  var lookForSlugAndUrl = function() {
    params = 'parent_id=' + $('#page_parent_id').val() + "&slug=" + $('#page_slug').val();
    $.get($('#page_slug').attr('data_url'), params, function(data) {
      $('#page_slug_input .inline-hints').html(data.url).effect('highlight');
    }, 'json');
  };

  $('#page_parent_id').change(lookForSlugAndUrl);

  setInterval(function() {
    var slug = $('#page_slug');
    if (slug.hasClass('touched')) {
      slug.removeClass('touched');
      lookForSlugAndUrl();
    }
  }, 2000);

  if (typeof $.fn.imagepicker != 'undefined')
    $('a#image-picker-link').imagepicker({
      insertFn: function(link) {
        return "{{ '" + link.attr('data-local-path') + "' | theme_image_url }}";
      }
    });

});
