$(document).ready(function(){
	
	// Remove no-js from html tag
	$('html').removeClass('no-js');
	
	/*
	 * Background color change
	 */
	$("a.anchorLink").click(function(){
		
		if ($('body').is(':animated')) {
			return false;
		}
		
		if ( $(this).hasClass('active') == true ) {
			return false;
		}
		
		//var colors = new Object();
		var colors = new Array();
		colors['what'] = '#EE2E24';
		colors['why'] = '#72175e';
		colors['how'] = '#6c3e17';
		colors['brand'] = '#116fab';
		
		$('body').animate({ backgroundColor: colors[$(this).attr('href').replace('#', '')] }, 1100);
		
		return false;
	});	
	
	/*
	 * Scroll to
	 */
	$("a.anchorLink").anchorAnimate({speed:1100});
	
	/*
	 * Banner's slider
	 */
	$('#section-brand .banner-content').cycle({
		timeout:4000,
		speed:500,
		sync: 1
	});
	
	
	$(window).bind("scroll", function(event) {
		 
		 $(".section:in-viewport").each(function(){
			 menu_top = $("#menu").offset().top;
			 section_top = $(this).offset().top;
			 
			 
			 if (menu_top - 130 > section_top){
				 var name = $(this).find('a.link-anchor').attr("name");
				 //$("a.anchorLink").click();
				 //console.log(name);
			}			 
		 });
		 
	});

});