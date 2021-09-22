// append tag element ( imgal-modal-close ) and download;
$(document).ready(function(){
	$('.imgal-img').click(function(){
		let imageSrc = $(this).attr("src");
		let imageAlt = $(this).attr("alt");
        let fileExt = window.location.pathname.split('.').pop(); //split ext and get extension
        let fileName = imageSrc.split('.')[0].replace(' copy','-imagesource');
        let imgrplc = fileName+fileExt;

		$('.imgal-container').hide();

		$('body').append(
			'<div class="imgal-modal">'+
			'<span id="imgal-modal-close"">X</span>'+
            '<a href="'+imageSrc+'" download="'+imgrplc+'" class="downloadImg">Download</a>'+
			'<img src="' + imageSrc + '" alt="' + imageAlt + '" class="imgal-modal-img"></img>'+
			'</div'
		).hide().show('fast');

		$('#imgal-modal-close').click(function(){
			$('.imgal-container').show();
			$('.imgal-modal').hide('fast', function(){
				$(this).remove();
			});
		});
	});
});