$(document).ready(function(){
	
	$('html').removeClass('no-js');
	
	$("a.anchorLink").click(function(){
		
		//var colors = new Object();
		var colors = new Array();
		colors['what'] = '#EE2E24';
		colors['why'] = '#72175e';
		colors['how'] = '#6c3e17';
		colors['brand'] = '#116fab';
		
		$('body').animate({ backgroundColor: colors[$(this).attr('href').replace('#', '')] }, 1100);
		
		return false;
	});	
	
	$("a.anchorLink").anchorAnimate({speed:1100});
	
	$('#section-brand .banner-content').cycle({
		timeout:4000,
		speed:500,
		sync: 1
	});

});