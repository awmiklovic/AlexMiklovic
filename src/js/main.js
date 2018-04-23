let globalTimeout;

window.onload = function(){
	$('body').addClass('loaded');
}

$(document).ready(function(){

	$('#header-img').on('load', function(){
		$('body').addClass('loaded');
	});

	const pages = ["laf", "powercrunch", "fix", "fnb", "contivio", "sambazon", "protohomes"];

	Barba.Pjax.start();

	$(document).on('click', '#next', function(){
		let currentURL = window.location.pathname;
		let nextPage = '/';
		currentURL = currentURL.slice(1, -5);
		pages.forEach(function(page, i){
			//alert(pages.length);
			if(currentURL == pages[i]){
				if(i+1 >= pages.length){
					nextPage = pages[0];
				} else nextPage = pages[i+1];
			}
		});
		Barba.Pjax.goTo("/"+nextPage+".html");
	});

	$(document).on('click', '#prev', function(){
		let currentURL = window.location.pathname;
		let nextPage = '/';
		currentURL = currentURL.slice(1, -5);
		pages.forEach(function(page, i){
			//alert(pages.length);
			if(currentURL == pages[i]){
				if(i-1 <= 0){
					nextPage = pages[pages.length-1];
				} else nextPage = pages[i-1];
			}
		});
		Barba.Pjax.goTo("/"+nextPage+".html");
	});

	var ShortFadeTransition = Barba.BaseTransition.extend({

		start: function() {
			Promise
			  .all([this.newContainerLoading, this.fadeOut()])
			  .then(this.fadeIn.bind(this));
		},

		fadeOut: function() {

			return $(this.oldContainer).css('opacity', '0').delay(400).promise();
		 
		},

		fadeIn: function() {
			/**
			 * this.newContainer is the HTMLElement of the new Container
			 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
			 * Please note, newContainer is available just after newContainerLoading is resolved!
			 */

			var _this = this;
			var $el = $(this.newContainer);
			$el.css('transition', '0ms');
			$el.css('opacity', '0');

			$(this.oldContainer).hide();

			setTimeout(function(){
				$el.css('transition', '600ms');
				$el.css('opacity', '1');
				_this.done();
			}, 100);
		}

	});


	var FadeTransition = Barba.BaseTransition.extend({
	  start: function() {
	    /**
	     * This function is automatically called as soon the Transition starts
	     * this.newContainerLoading is a Promise for the loading of the new container
	     * (Barba.js also comes with an handy Promise polyfill!)
	     */

	    // As soon the loading is finished and the old page is faded out, let's fade the new page
	    Promise
	      .all([this.newContainerLoading, this.fadeOut()])
	      .then(this.fadeIn.bind(this));
	  },

	  fadeOut: function() {
	    /**
	     * this.oldContainer is the HTMLElement of the old Container
	     */
	     
	     return $(this.oldContainer).css('opacity', '0').delay(2000).promise();
	     
	  },

	  fadeIn: function() {
		/**
		 * this.newContainer is the HTMLElement of the new Container
		 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
		 * Please note, newContainer is available just after newContainerLoading is resolved!
		 */

		var _this = this;
		var $el = $(this.newContainer);
		$el.css('transition', '0ms');
		$el.css('opacity', '0');

		$(this.oldContainer).hide();

		setTimeout(function(){
			$el.css('transition', '600ms');
			$el.css('opacity', '1');
			_this.done();
		}, 1000);
	  }
	});

	/**
	 * Next step, you have to tell Barba to use the new Transition
	 */

	Barba.Pjax.getTransition = function() {
	  /**
	   * Here you can use your own logic!
	   * For example you can use different Transition based on the current page or link...
	   */
		var currentURL = Barba.HistoryManager.prevStatus().url;
		currentURL = currentURL.split('/');
		currentURL = currentURL[currentURL.length - 1];

		var targetURL = Barba.Utils.getCurrentUrl();
		targetURL = targetURL.split('/');
		targetURL = targetURL[targetURL.length - 1];

		console.log(currentURL + " " + targetURL);

		$("html, body").animate({ scrollTop: "0px" });

         if(currentURL == '' || targetURL == ''){
         	console.log('long');
         	return FadeTransition;
         } else{
         	console.log('short');
         	return ShortFadeTransition;
         }
	};

	//Flipping Animations

	const flipping = new Flipping({
	  duration:600
	});

	const hideBlocks = () => {
		flipping.read();
		$('.portfolio').css('display', 'none');
		$('#bio').css('display', 'none');
		flipping.flip();
	}

	const showBlocks = () => {
		flipping.read();
		$('.portfolio').css('display', 'inline-block');
		$('#bio').css('display', 'inline-block');
		flipping.flip();
	}

	const showNav = () => {
		flipping.read();
		$('nav').css('display', 'block');
		$('#name').css('display', 'none');
		flipping.flip();
	}

	const hideNav = () => {
		flipping.read();
		$('#name').css('display', 'block');
		$('nav').css('display', 'none');
		flipping.flip();
	}

	//Bind Portfolio Images

	$('.portfolio a:not(.no-trigger)').click(function(){
		$(this).addClass('hidden');
		$('#bio .vaporize').addClass('hide');
		$('.portfolio').each(function(i){
			const el = $(this);
			const rand = Math.floor(Math.random() * 600);
			const delay = rand;
			setTimeout(function(){
				$(el).addClass('hidden');
			}, delay);
		});
		setTimeout(function(){
			hideBlocks();
		}, 1300);
		setTimeout(function(){
			showNav();
		}, 2000);
	});

	$('#nav-name').click(function(){
		//alert('test');
		$('.portfolio').addClass('hidden');
		$('#bio .vaporize').addClass('hide');
		$('.portfolio').css('display', 'none');
		$('#bio').css('display', 'none');
		setTimeout(function(){
			hideNav();
		}, 400);
		setTimeout(function(){
			showBlocks();
		}, 1000);
		setTimeout(function(){
			$('#bio .vaporize').removeClass('hide');
		}, 1600);
		setTimeout(function(){
			$('.portfolio').removeClass('hidden');
		}, 2000);
		Barba.Pjax.goTo('/');
	});

	//Vaporize Text
	$('.vaporize').each(function(){

		const text = $(this).text();
		const wordArray = text.split(' ');
		let newArray = '<span>';
		newArray += wordArray.join(' </span><span>');
		newArray += "</span>";
		$(this).html(newArray);

		const animateArray = Array.from($('.vaporize span'));
		animateArray.forEach(function(element){
		  const transition = 1500;
		  const delayRange = 600;
		  const rand = Math.floor(Math.random() * delayRange);
		  $(element).css('transition', transition + 'ms');
		  $(element).css('transition-delay', rand + 'ms');
		  $(element).css('transition-property', 'opacity');
		});

	});


	//Lazy Load Videos
	$(document).on('mouseenter', '.play-btn', function(){
		const video = $(this).parent().find('video');
		const inner = $(this).parent().find('.inner');
		const wireframe = $(this).parent();
		if(video.length > 0){
			const overlay = $(this).parent().find('.vid-overlay');
			//clearTimeout(globalTimeout);
			const source = $(video).children('source');
			if(!source.attr('src')){
				const src = source.attr('data-src');
				source.attr('src', src);
				video[0].load();
				overlay.addClass('center');
				video[0].addEventListener('loadeddata', function() {
   					// Video is loaded and can be played
					video[0].play();
					globalTimeout = setTimeout(function(){
						wireframe.addClass('show');
					}, 600);
				}, false);
			} else{
				overlay.addClass('center');
				clearTimeout(globalTimeout);
				globalTimeout = setTimeout(function(){
					wireframe.addClass('show');
				}, 600);
				video[0].play();
			}
		}
	});

	$(document).on('mouseleave', '.mobile-wireframe, .desktop-wireframe', function(){
		clearTimeout(globalTimeout);
		const inner = $(this).children('.inner');
		const video = inner.children('video');
		const overlay = inner.children('.vid-overlay');	
		const wireframe = $(this);	
		if(video.length > 0){
			wireframe.removeClass('show');
			globalTimeout = setTimeout(function(){
				video[0].pause();
				overlay.removeClass('center');
			}, 600);
		}
	});

});



