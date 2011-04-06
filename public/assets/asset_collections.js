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
// Fix
$(document).ready(function() {

  var wrapper = $('fieldset.editable-list.fields');
  var list = wrapper.find('ol');
  var template = wrapper.find('script[name=template]').html();
  var baseInputName = wrapper.find('script[name=template]').attr('data-base-input-name');
  var data = eval(wrapper.find('script[name=data]').html());
  var index = 0;

  var domFieldVal = function(domField, fieldName, val) {
    var el = domField.find('input[data-field=' + fieldName + '], select[data-field=' + fieldName + ']');
    return (typeof(val) == 'undefined' ? el.val() : el.val(val));
  }

  var domBoxAttr = function(fieldName) {
    return $('#fancybox-wrap form').find('input[name=custom_fields_field[' + fieldName + ']], select[name=custom_fields_field[' + fieldName + ']]');
  }

  var domBoxAttrVal = function(fieldName, val) {
    return (typeof(val) == 'undefined' ? domBoxAttr(fieldName).val() : domBoxAttr(fieldName).val(val));
  }

  /* ___ Register all the different events when a field is added (destroy, edit details, ...etc) ___ */

  var registerFieldEvents = function(field, domField) {
    // select
    domField.find('em').click(function() {
      $(this).hide();
      $(this).next().show();
    });

    domField.find('select').each(function() {
      var select = $(this);
      select.hover(function() {
        clearTimeout($.data(select, 'timer'));
      },
      function() {
        $.data(select, 'timer', setTimeout(function() {
          select.hide();
          select.prev().show();
        }, 1000));
      }).change(function() {
        selectOnChange(select);
      });
    });

    // checkbox
    domField.find('input[type=checkbox]').click(function() { domField.toggleClass('required'); });

    // edit
    domField.find('a.edit').click(function(e) {
      var link = $(this);
      var attributes = ['_alias', 'hint', 'text_formatting'];

      $.fancybox({
        titleShow: false,
        content: $(link.attr('href')).parent().html(),
        padding: 0,
        onComplete: function() {
          $('#fancybox-wrap .popup-actions button[type=submit]').click(function(e) {
            $.each(attributes, function(index, name) {
              var val = domBoxAttrVal(name).trim();
              if (val != '') domFieldVal(domField, name, val);
            });
            domBoxAttr('text_formatting').parent().hide();

            $.fancybox.close();
            e.preventDefault(); e.stopPropagation();
          });

          // copy current val to the form in the box
          $.each(attributes, function(index, name) {
            var val = domFieldVal(domField, name).trim();
            if (val == '' && name == '_alias') val = makeSlug(domFieldVal(domField, 'label'));

            domBoxAttrVal(name, val);
          });
          if (domFieldVal(domField, 'kind').toLowerCase() == 'text') domBoxAttr('text_formatting').parents('li').show();
        }
      });
      e.preventDefault(); e.stopPropagation();
    });

    // remove
    domField.find('a.remove').click(function(e) {
      if (confirm($(this).attr('data-confirm'))) {
        if (field.new_record)
          domField.remove();
        else
          domField.hide().find('input[data-field=_destroy]').val(1);
        refreshPosition();
      }
      e.preventDefault(); e.stopPropagation();
    });
  }

  var registerFieldTemplateEvents = function(domField) {
    // checkbox
    domField.find('input[type=checkbox]').click(function() { domField.toggleClass('required'); });

    var labelDom = domField.find('input[data-field=label]').focus(function() {
      if ($(this).val() == data.template.label) $(this).val('');
    }).focusout(function() {
      if ($(this).val() == '') $(this).val(data.template.label);
    });
    var kindDom = domField.find('select[data-field=kind]');
    var requiredDom = domField.find('input[data-field=required]');

    // bind the "Add field" button
    domField.find('button').click(function(e) {
      var newField = $.extend({}, data.template);
      newField._alias = '';
      newField.label = labelDom.val().trim();
      newField.kind = kindDom.val();
      newField.required = requiredDom.is(':checked');

      if (newField.label == '' || newField.label == data.template.label) return false;

      // reset template values
      labelDom.val(data.template.label);
      kindDom.val(data.template.kind);
      requiredDom.attr('checked', '');
      domField.removeClass('required');

      addField(newField, { refreshPosition: true });

      e.preventDefault(); e.stopPropagation();
    });
  }

  var refreshPosition = function() {
    $.each(list.find('li.added:visible input[data-field=position]'), function(index) { $(this).val(index); });
  }

  var selectOnChange = function(select) {
    select.hide().prev()
      .show()
      .html(select[0].options[select[0].options.selectedIndex].text);
  }

  /* ___ Add a field in the list of fields ___ */
  var addField = function(field, options) {
    options = $.extend({
      'is_template': false,
      'refreshPosition': false
    }, options);

    field = $.extend({
      behaviour_flag: function() { return options.is_template ? 'template' : 'added' },
      new_record_flag: function() { return this.new_record == true && options.is_template == false ? 'new' : '' },
      errors_flag: function() { return Object.size(this.errors) > 0 ? 'error' : '' },
      required_flag: function() { return this.required ? 'required' : ''; },
      base_name: function() { return options.is_template ? '' : baseInputName + "[" + index + "]"; },
      base_dom_id: function() { return options.is_template ? 'custom_field_template' : 'custom_field_' + index; },
      required_checked: function() { return this.required ? 'checked' : ''; },
      if_existing_record: function() { return this.new_record == false }
    }, field);

    var html = Mustache.to_html(template, field);

    var domField = null;

    if (options.is_template) {
      domField = list.append(html).find('.template');

      registerFieldTemplateEvents(domField);
    }
    else {
      domField = list.find('> .template').before(html).prev('li');

      registerFieldEvents(field, domField);

      list.sortable('refresh');

      if (options.refreshPosition) refreshPosition();

      index++;
    }

    domField.find('select').val(field.kind);
    domField.find('em').html(domField.find('select option:selected').text());
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
    addField(data.template, { is_template: true });

    // add the existing fields (if present)
    for (var i = 0; i < data.collection.length; i++) {
      addField(data.collection[i]);
    }
  }

  setup(); // <- let's the show begin
});

// $(document).ready(function() {
//
//   $('fieldset.fields').parents('form').submit(function() {
//     $('fieldset.fields li.template input, fieldset.fields li.template select').attr('disabled', 'disabled');
//   });
//
//   var defaultValue = $('fieldset.fields li.template input[type=text]').val();
//   var selectOnChange = function(select) {
//     select.hide();
//     select.prev()
//       .show()
//       .html(select[0].options[select[0].options.selectedIndex].text);
//   }
//
//   var refreshPosition = function() {
//     jQuery.each($('fieldset.fields li.added input.position'), function(index) {
//       $(this).val(index);
//     });
//   }
//
//   /* __ fields ___ */
//   $('fieldset.fields li.added select').each(function() {
//     var select = $(this)
//       .hover(function() {
//         clearTimeout(select.attr('timer'));
//       }, function() {
//         select.attr('timer', setTimeout(function() {
//           select.hide();
//           select.prev().show();
//         }, 1000));
//       })
//       .change(function() { selectOnChange(select); });
//
//     select.prev().click(function() {
//       $(this).hide();
//       select.show();
//     });
//   });
//
//   $('fieldset.fields li.template input[type=text]').focus(function() {
//     if ($(this).hasClass('void') && $(this).parents('li').hasClass('template'))
//       $(this).val('').removeClass('void');
//   });
//
//   $('fieldset.fields li.template button').click(function() {
//     var lastRow = $(this).parents('li.template');
//
//     var label = lastRow.find('input.label').val().trim();
//     if (label == '' || label == defaultValue) return false;
//
//     var newRow = lastRow.clone(true).removeClass('template').addClass('added new').insertBefore(lastRow);
//
//     var dateFragment = '[' + new Date().getTime() + ']';
//     newRow.find('input, select').each(function(index) {
//       $(this).attr('name', $(this).attr('name').replace('[-1]', dateFragment));
//     });
//
//     var select = newRow.find('select')
//       .val(lastRow.find('select').val())
//       .change(function() { selectOnChange(select); })
//       .hover(function() {
//         clearTimeout(select.attr('timer'));
//       }, function() {
//         select.attr('timer', setTimeout(function() {
//           select.hide();
//           select.prev().show();
//         }, 1000));
//       });
//     select.prev()
//       .html(select[0].options[select[0].options.selectedIndex].text)
//       .click(function() {
//         $(this).hide();
//         select.show();
//       });
//
//     // then "reset" the form
//     lastRow.find('input.label').val(defaultValue).addClass('void');
//
//     // warn the sortable widget about the new row
//     $("fieldset.fields ol").sortable('refresh');
//
//     refreshPosition();
//   });
//
//   $('fieldset.fields li a.remove').click(function(e) {
//     if (confirm($(this).attr('data-confirm'))) {
//       var parent = $(this).parents('li');
//
//       if (parent.hasClass('new'))
//         parent.remove();
//       else {
//         var field = parent.find('input.position')
//         field.attr('name', field.attr('name').replace('[position]', '[_destroy]'));
//
//         parent.hide().removeClass('added')
//       }
//
//       refreshPosition();
//     }
//
//     e.preventDefault();
//     e.stopPropagation();
//   });
//
//   // sortable list
//   $("fieldset.fields ol").sortable({
//     handle: 'span.handle',
//     items: 'li:not(.template)',
//     axis: 'y',
//     update: refreshPosition
//   });
//
//   // edit in depth custom field
//   $('fieldset.fields li.item span.actions a.edit').click(function() {
//     var link = $(this);
//     $.fancybox({
//       titleShow: false,
//       content: $(link.attr('href')).parent().html(),
//       onComplete: function() {
//         $('#fancybox-wrap form').submit(function(e) {
//           $.fancybox.close();
//           e.preventDefault();
//           e.stopPropagation();
//         });
//
//         var parent = link.parent();
//
//         if (parent.prevAll('select').val() == 'Text') {
//           var formatting = parent.prevAll('.text-formatting').val();
//           $('#fancybox-wrap #custom_fields_field_text_formatting').val(formatting);
//           $('#fancybox-wrap #custom_fields_field_text_formatting_input').show();
//         } else {
//           $('#fancybox-wrap #custom_fields_field_text_formatting_input').hide();
//         }
//
//         var alias = parent.prevAll('.alias').val().trim();
//         if (alias == '') alias = makeSlug(link.parent().prevAll('.label').val());
//         $('#fancybox-wrap #custom_fields_field__alias').val(alias);
//
//         var hint = parent.prevAll('.hint').val();
//         $('#fancybox-wrap #custom_fields_field_hint').val(hint);
//       },
//       onCleanup: function() {
//         var parent = link.parent();
//
//         var alias = $('#fancybox-wrap #custom_fields_field__alias').val().trim();
//         if (alias != '') parent.prevAll('.alias').val(alias);
//         var hint = $('#fancybox-wrap #custom_fields_field_hint').val().trim();
//         if (hint != '') parent.prevAll('.hint').val(hint);
//         var formatting = $('#fancybox-wrap #custom_fields_field_text_formatting').val();
//         parent.prevAll('.text-formatting').val(formatting);
//       }
//     })
//   });
// });

$(document).ready(function() {

  // automatic slug from collection name
  $('#asset_collection_name').keypress(function() {
    var input = $(this);
    var slug = $('#asset_collection_slug');

    if (!slug.hasClass('filled')) {
      setTimeout(function() {
        slug.val(input.val().replace(/\s/g, '_').toLowerCase());
      }, 50);
    }
  });

  $('#asset_collection_slug').keypress(function() { $(this).addClass('filled'); });

  // sortable assets

  var updateAssetsOrder = function() {
    var list = $('ul.assets.sortable');
    var ids = jQuery.map(list.sortable('toArray'), function(e) {
      return e.match(/asset-(\w+)/)[1];
    }).join(',');
    $('#asset_collection_assets_order').val(ids || '');
  }

  var setLastClassForAssets = function() {
    $('ul.assets li.last').removeClass('last');
    var i = parseInt($('ul.assets li.asset').size() / 6);
    while (i > 0) {
      $('ul.assets li.asset:eq(' + (i * 6 - 1) + ')').addClass('last');
      i--;
    }
  }

  $('ul.assets.sortable').sortable({
    items: 'li.asset',
    stop: function(event, ui) { updateAssetsOrder(); setLastClassForAssets(); }
  });

  $('ul.assets.sortable li div.actions a.remove').click(function(e) {
    if (confirm($(this).attr('data-confirm'))) {
      $(this).parents('li').remove();

      updateAssetsOrder();

      if ($('ul.assets li.asset').size() == 0) $('p.no-items').show();

      setLastClassForAssets();
    }
    e.preventDefault();
    e.stopPropagation();
  });

});
