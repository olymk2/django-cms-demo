var autoScrollMilliseconds=15000;
var autoScrollIds=new Array();
var autoScrollTimer=null;

function autoScroll(slider){
	autoScrollIds.push(slider);
	startAutoScroll();
}

function doAutoScroll(){
	for(var i=0; i<autoScrollIds.length; ++i)
		  $(autoScrollIds[i]).next('.slider-navi').find('a[rel=next]').click();
	startAutoScroll();
}

function startAutoScroll(){
	if(!autoScrollTimer) autoScrollTimer=setTimeout('doAutoScroll()',autoScrollMilliseconds);
}

function stopAutoScroll(){
	clearTimeout(autoScrollTimer);
	autoScrollTimer=null;
}

function slider_rotate(id,n,slide_breite){
	stopAutoScroll();
    var pos=-((n-1)*slide_breite);
    $('#'+id+' .slides ul').animate({'left':pos},slide_breite,function(){
		$('#'+id+' .slider-navi li:nth-child('+(n+1)+')').addClass('aktiv');
    });
    startAutoScroll();
}

/* Automatisches Faden des Main-Sliders */
var autoMain_sliderTimer=0;

function doAutoMain_slider(){
	var n=$('#main-slider ul li.aktiv').removeClass('aktiv').find('a').attr('rel');
	if(n){
		n++;
		if($('#main-slider ul li a[rel='+n+']').length==0) n=1;
		$('#main-slider ul li a[rel='+n+']').trigger('mouseenter');
	}
	autoMain_sliderTimer=null;
	startAutoMain_slider();
}

function startAutoMain_slider(){
	if(!autoMain_sliderTimer) autoMain_sliderTimer=setTimeout('doAutoMain_slider()',8000);
}

function stopAutoMain_slider(){
	clearTimeout(autoMain_sliderTimer);
	autoMain_sliderTimer=null;
}

$(document).ready(function() {

	// Bilder wechseln bei MouseOver
	$('#main-slider ul li').mouseenter(function(){
		stopAutoMain_slider();
		if(!$(this).hasClass('aktiv')){
			var n=$(this).find('a').attr('rel');
			if(n){
				var a=$('#main-slider ul li.aktiv').removeClass('aktiv').find('a').attr('rel');
				var i=1;
				$('#main-slider .slider-img li').stop(true).each(function(){
					if(i!=a) $(this).fadeOut(1);
					i++;
				});
				if (!isNaN(a))
					$('#main-slider .slider-img li:nth-child('+a+')').fadeOut(500);
				$('#main-slider .slider-img li:nth-child('+n+')').stop(true).fadeTo(500,1);
				$(this).addClass('aktiv');
			}
		}
	}).mouseleave(function(){
		startAutoMain_slider();
	});

	// Slider initialisieren
	$('.slider').each(function(){
		$(this).find('.slider-navi').css('display','block');
		var ul_breite=$(this).find('.slides ul li').length*$(this).find('.slides ul li:first').outerWidth();
		$(this).find('.slides ul:first').css('width',ul_breite+'px');
		$(this).find('.slides').css('overflow','hidden');
		var id=$(this).attr('id');
		$('#'+id+' .slider-navi li').click(function(event){
			var a=$('#'+id+' .slider-navi li.aktiv').removeClass('aktiv').find('a').attr('rel');
			if(a){
				a=parseInt(a);
				var n=$(this).find('a').attr('rel');
				var slider_anzahl=$('#'+id+' .slider-navi li').length-2;
			    var slide_breite=$('#'+id+' .slides ul li').outerWidth();
				if(n=='back'){
					n=a-1; if(n<1) n=slider_anzahl;
				}
				if(n=='next'){
					n=a+1; if(n>slider_anzahl) n=1;
				}
				n=parseInt(n);
				var slide=$('#'+id+' .slides ul li:nth-child('+n+')');
				var data_ajax=slide.attr('data-ajax');
				if(data_ajax){
					// Inhalt muss erst per AJAX nachgeladen werden
					slide.load(slide.parent().attr('data-ajax').replace(/1/g,data_ajax),function(response, status, req){
						if(response.substr(0,34)=='<!-- aus Anwendung Presseforum -->'){
							slide.attr('data-ajax','');
							slider_rotate(id,n,slide_breite);
						}
						else{
							alert('Fehler beim Nachladen der Daten');
							$('#'+id+' .slider-navi li:nth-child('+(a+1)+')').addClass('aktiv');
						}
					});
				}
				else{
					slider_rotate(id,n,slide_breite);
				}
			}
			event.preventDefault();
		});
	});
});