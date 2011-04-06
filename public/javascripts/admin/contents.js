$(document).ready(function() {
  var updateContentsOrder = function() {
    var lists = $('ul#contents-list.sortable');
    var ids = jQuery.map(lists, function(list) {
        return(jQuery.map($(list).sortable('toArray'), function(el) {
          return el.match(/content-(\w+)/)[1];
        }).join(','));
    }).join(',');
    $('#order').val(ids || '');
  }

  $('ul#contents-list.sortable').sortable({
    handle: 'em',
    items: 'li.content',
    stop: function(event, ui) { updateContentsOrder(); }
  });

  try {
    $('textarea.html').tinymce(TinyMceDefaultSettings);
  } catch (e) { /* tinymce not loaded */ }

  $.datepicker.setDefaults($.datepicker.regional[I18nLocale]);
  $('input[type=text].date').datepicker($.datepicker.regional[I18nLocale]);
  
  $('a.gallery').click(function(e){
  	e.preventDefault();
	if($('#content_gallery').val()==""){
	  	$('#content_gallery').val($(this).attr('id'));
		$(this).parent().addClass("selected");
	}
	else{
		$('#content_gallery').val("");
		$('ul.gallery li').removeClass("selected");
	}
  });
});
