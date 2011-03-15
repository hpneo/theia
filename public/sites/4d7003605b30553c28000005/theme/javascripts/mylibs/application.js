
// Background colors
var colors = new Array();
colors['home'] = '#EE2E24';
colors['brand'] = '#ffcd34'; // yellow //'#EE2E24';
colors['what'] = '#80c242';
colors['why'] = '#7f1069'; //'#72175e';
colors['how'] = '#0079c2'; //'#116fab';
colors['schedule'] = "#6a2100";

var font_colors = new Array();
font_colors['home'] = '#EE2E24';
font_colors['brand'] = '#ffcd34'; // yellow //'#EE2E24';
font_colors['what'] = '#80c242';
font_colors['why'] = '#7f1069'; //'#72175e';
font_colors['how'] = '#0079c2'; //'#116fab';


function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function animate_bg(color,ele, from, to) {
	from += from > to ? -1 : 1;
	if(!$.support.opacity){
		if(from != to){
			var opStr = (Math.round(from * 25.5)).toString(16);
			//alert(opStr)
			ele.css({background:'transparent',filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr=#" + opStr + "FFFF00, endColorstr=#" + opStr + "FFFF00)"});   
		}else{
			ele.css({background:'transparent',filter:"none"});   
		}
	}else{
		r = HexToR(color);
		g = HexToG(color);
		b = HexToB(color);
		ele.css("backgroundColor", "rgba(" + r + "," + g +"," + b +"," + (from) / 10 + ")"); 
	}

	if(from != to)  
	setTimeout(function() { animate_bg(ele, from, to) }, 50);
}

function updateHome(){
	
		menu_top = $("#menu").offset().top;
	
		if (menu_top < 100){
	
	
			if ($('body').is(':animated')) {
			// 	//console.log('click por aca esta animado');
				return false;
			}
			else{

				$('body.home').animate({ backgroundColor: colors["home"] }, 1100);
				$('.home #header').animate({ backgroundColor: colors["home"] }, 1100);				
				
			}
				
			}
	
}
setInterval(updateHome,1000);
	
$(document).ready(function(){



		$('#header').css({ backgroundColor: colors["home"], opacity:0.95 });					 				 					
		$('.schedule #header').css({ background: "transparent", opacity:0.95 });		
		$('.inner #header').css({ background: colors["home"], opacity:0.95 });		


		$(".video_display").click(function() {
			$.fancybox({
				'padding'             : 0,
				'autoScale'   : false,
				'transitionIn'        : 'none',
				'transitionOut'       : 'none',
				'title'               : this.title,
				'width'               : 680,
				'height'              : 495,
				'href'                : this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
				'type'                : 'swf',    // <--add a comma here
				'swf'                 : {'allowfullscreen':'true'} // <-- flashvars here
			});
			return false;

		});

		// Cufon tags
		Cufon.replace('#home_events ul.events h3');
		Cufon.replace('.banner .banner-links a.cufon'); 
		Cufon.replace(".content h2");
		Cufon.replace("#header #follow-us li.title");
		Cufon.replace("#menu li a");
		Cufon.replace("div.content.clearfix h3")
		Cufon.replace(".section div.content.clearfix h4")
		Cufon.replace("div#counter.clearfix .cufon")	


		$('#countdown_timer').countdown({until: $.countdown.UTCDate(-5, 2011, 4 - 1, 27),format:"DHM",layout:'<span class="counter_days">{dnn}</span><em>días</em><span class="counter_hours">{hnn}</span><em>horas</em><span class="counter_days">{snn}</span><em>minutos</em>'});


		// Remove no-js from html tag
		$('html').removeClass('no-js');


		/*
		* Setup background and section through hash

	*/
	where = window.location.hash;
	if (where){

		// event.preventDefault();
		var destination = $(where).offset().top;
		$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 500);
		$('body').animate({ backgroundColor: colors[where.replace('#', '')] }, 1100);
		$('#header').animate({ backgroundColor: colors[where.replace('#', '')] }, 1100);
	}

	/*
	* Background color change

	*/
	$("body.home a.anchorLink").click(function(){

		// if ($('body').is(':animated')) {
		// 	//console.log('click por aca esta animado');
		// 	return false;
		// }
		
		
		link = $(this)

		$(".banner-dif").fadeOut("slow")
			// $('#header').css({backgroundColor : colors[window.location.hash.replace('#', '')]});
			$('body').animate({ backgroundColor: colors[$(link).attr('href').replace('#', '')] }, 1100);
			$('#header').animate({ backgroundColor: colors[$(link).attr('href').replace('#', '')], opacity:1 }, 1100);

			$("a.anchorLink").removeClass('active');
			$(link).addClass('active');
			$(".banner-dif").fadeIn(2000);

		// ,function(){
			// 	
			// 			// $("#header").animate({opacity:'1'});
			// 			//    				$('#header').css({background : "none"});
			// 			// $(".banner-dif").fadeIn("fast");			
			// });
			// 	

			//location.hash = "#" + name ;

			return false;
		});	

		/*
		* Scroll to
		*/
		//$("a.anchorLink").anchorAnimate({speed:1100});
		$("body.home a.anchorLink").anchorAnimate();

		/*
		* Banner's slider
		*/
		$('.banner-content, .banner-dif').cycle({
			timeout:4000,
			speed:500,
			sync: 1
		});
		/*
		* Colores de fondo
		*/	

		$(window).bind("scroll", function(event) {

			if ($('body').is(':animated')) {
				return false;
			}

			menu_top = $("#menu").offset().top;
			// console.log(menu_top);
			updateColor(menu_top,0,1000,"home");
			updateColor(menu_top,1001,2500,"brand");
			updateColor(menu_top,2501,4100,"how");			
			updateColor(menu_top,4101,5100,"what");			
			updateColor(menu_top,5100,10100,"why");									
		});

});

function updateColor(menu_top,lower,high,color){

	if ((menu_top > lower) && (menu_top < high)){
    if ($("body.home #header").css("backgroundColor") != colors[color]){
		$('body.home #header').animate({ backgroundColor: colors[color],opacity: 0.9 }, 1100);
		$('body.home').animate({ backgroundColor: colors[color] }, 1100);
		// console.log(color);
		}
	}
};



