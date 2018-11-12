let globalTimeout;

window.onload = function(){
	$('body').addClass('loaded');
}

$(document).ready(function(){

	$('#header-img').on('load', function(){
		$('body').addClass('loaded');
	});

	const pages = ["laf", "buckingham", "powercrunch", "fix", "fnb", "contivio", "sambazon", "protohomes", "trensor"];

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
			}, 200);

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

	     return $(this.oldContainer).css('opacity', '0').delay(800).promise();

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

	const hidePreloader = () => {
		flipping.read();
		$('#name').css('display', 'block');
		$('#preloader').css('display', 'none');
		flipping.flip();
		setTimeout(function(){
			$('#bio .vaporize').removeClass('hide');
		}, 300);
		setTimeout(function(){
			$('.portfolio').removeClass('hidden');
		}, 600);
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
		//setTimeout(function(){
			//hideBlocks();
		//}, 1300);
		setTimeout(function(){
			showNav();
		}, 1000);
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
		  const transition = 3000;
		  const delayRange = 600;
		  const rand = Math.floor(Math.random() * delayRange);
		  $(element).css('transition', transition + 'ms');
		  $(element).css('transition-delay', rand + 'ms');
		  $(element).css('transition-property', 'opacity');
			//$(element).css('transition-timing-function', 'ease-in');
		});

	});

//Preloader Loading
		let delay = 0;
		let interval = 150;
		const numChars = 12;
		$('#preload-inner img').each(function(){
			delay += interval;
			const el = $(this);
			setTimeout(function(){
				$(el).removeClass('hidden');
			}, delay);
		});
		setTimeout(function(){
			//hidePreloader();
			$('#preload-inner img').mouseover(function(){
				hidePreloader();
			});
		}, interval * (numChars+1));


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

//Preloader Stuff
/*
	var renderer, scene, camera, light, circles;

	var ww      = window.innerWidth,
	wh          = window.innerHeight,
	speed       = .2,
	mouseX       = 0,
	colors      = [
	                0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF,
									0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF,
									0xFFFFFF,0xFFFFFF,0xFFFFFF,0xFFFFFF
	            ],
	closest     = {position:{z:0}},
	farest      = {position:{z:0}},
	radius      = 2,
	segments    = 4;
	function init(){

	    renderer = new THREE.WebGLRenderer({canvas : document.getElementById('scene')});
	    renderer.setSize(ww,wh);

	    scene = new THREE.Scene();
	    scene.fog = new THREE.Fog( 0xFFFFFF, 300, 700 );
	    scene.background = new THREE.Color(0xFAFAFA);

	    camera = new THREE.PerspectiveCamera(50,ww/wh, 0.1, 10000 );
	    camera.position.set(0,0,0);
	    scene.add(camera);

	    window.addEventListener("mousemove", mousemove);
	    window.addEventListener("resize", resize);

	    createCircles();

			//$('#preload-inner img').click(function(){
				//scene.background = new THREE.Color(0xFFFFFF);
			//});

	}

	var resize = function(){
	    ww = window.innerWidth;
	    wh = window.innerHeight;
	    camera.aspect = ww / wh;
	    camera.updateProjectionMatrix();

	    renderer.setSize( ww, wh );
	};
	var mousemove = function(e){
	    //speed = (wh/2-e.clientY)/(wh/2)*1;
	    mouseX = (ww/2-e.clientX)/(ww/5)*5;
	};

	var createCircles = function(){

	    circles = new THREE.Object3D();
	    scene.add(circles);

	    for(var i=0;i<20;i++){
	        addCircle();
	    }
	    render();

	};

	var removeLine = function(isFarest){
	    if(isFarest){
	       for(var i=0,j=circles.children.length;i<j;i++){
	            if(circles.children[i] === farest){
	                circles.remove(circles.children[i]);
	            }
	        }
	    }
	    else{
	        for(var i=0,j=circles.children.length;i<j;i++){
	            if(circles.children[i] === closest){
	                circles.remove(circles.children[i]);
	            }
	        }
	    }
	};


	var addCircle = function(top){
	    var row = new THREE.Object3D();
	    if(top){
	        row.degreesRotation = (closest.degreesRotation-1) || 0;
	    }
	    else{
	        row.degreesRotation = (farest.degreesRotation+1) || 0;
	    }
	    for(var j=0;j<12;j++){
	        var material = new THREE.MeshBasicMaterial({
	            color: colors[j]
	        });
	        var circleGeometry = new THREE.CircleGeometry( radius, segments );
	        var circle = new THREE.Mesh( circleGeometry, material );
	        var translate = new THREE.Matrix4().makeTranslation(30,0,0);
	        var rotation =  new THREE.Matrix4().makeRotationZ(Math.PI*2/12*j+row.degreesRotation*.3);
	        circle.applyMatrix( new THREE.Matrix4().multiplyMatrices(rotation, translate) );
	        row.add(circle);
	    }
	    if(top){
	        row.position.z = (closest.position.z/35+1)*35;
	    }
	    else{
	        row.position.z = (farest.position.z/35-1)*35;
	    }
	    circles.add(row);
	    closest = circles.children[0];
	    farest = circles.children[0];
	    for(var i=0,j=circles.children.length;i<j;i++){
	        if(circles.children[i].position.z>closest.position.z){
	            closest = circles.children[i];
	        }
	        if(circles.children[i].position.z<farest.position.z){
	            farest = circles.children[i];
	        }
	    }
	};


	var render = function () {
	    requestAnimationFrame(render);

	    camera.position.z -= speed;
	    camera.position.x += (mouseX-camera.position.x)*.008;
	    // If closest element is behind camera
	    if(camera.position.z<(closest.position.z-35) && speed>0){
	        removeLine(false);
	        addCircle();
	    }
	    else if(camera.position.z>(farest.position.z+665) && speed<0){
	        removeLine(true);
	        addCircle(true);
	    }

	    renderer.render(scene, camera);

	};

	init();
	*/

});
