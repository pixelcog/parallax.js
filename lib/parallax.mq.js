/*!
 * Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-mq-teststyles
 */
 window.CustomModernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(prefixes.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.8.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={},m={},n={},o=[],p=o.slice,q,r=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},s=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return r("@media "+b+" { #"+g+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=p.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(p.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(p.call(arguments)))};return e});for(var A in l)u(l,A)&&(q=A.toLowerCase(),e[q]=l[A](),o.push((e[q]?"":"no-")+q));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)u(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},v(""),h=j=null,e._version=d,e.mq=s,e.testStyles=r,e}(this,this.document);

/*!
 * parallax.js v1.3.3 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2015 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */
(function ($, CustomModernizr, window, document, undefined) {
  //////////////////////////////////////////////////////////////////////////////
  // Polyfill for requestAnimationFrame
  // via: https://gist.github.com/paulirish/1579671
  //////////////////////////////////////////////////////////////////////////////
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                    window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }());

  //////////////////////////////////////////////////////////////////////////////
  // Parallax Constructor
  //////////////////////////////////////////////////////////////////////////////
  function Parallax(element, options) {
    var self = this;

    if (typeof options === 'object') {
      delete options.refresh;
      delete options.render;
      $.extend(this, options);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Device logic
    ////////////////////////////////////////////////////////////////////////////
    this.ios = navigator.userAgent.match(/(iPod|iPhone|iPad)/);
    this.android = navigator.userAgent.match(/(Android)/);
    this.deviceFallback = (this.ios && this.iosFix || this.android && this.androidFix);

    ////////////////////////////////////////////////////////////////////////////
    // Original element
    ////////////////////////////////////////////////////////////////////////////
    this.$element = $(element);

    if (!this.imageSrc && this.$element.is('img')) {
      this.imageSrc = this.$element.attr('src');
    }

    ////////////////////////////////////////////////////////////////////////////
    // Kick-off responsive if enabled
    ////////////////////////////////////////////////////////////////////////////
    if (this.responsive) {
      this.imageSources = this.$element.find('>span');
      this.loadedImages = {};

      // Not responsive if no image sources are found
      if (!this.imageSources.length) {
        this.responsive = false;
      } else {
        var elementSrc = this.$element.data('image-src');

        if (!elementSrc) {
          // If no image-src is set to fallback on if no media queries match,
          // fallback to a transparent 1x1 gif.
          this.elementSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        } else {
          this.elementSrc = elementSrc;
        }

        this.setResponsiveImageSrc();
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Set up positions
    ////////////////////////////////////////////////////////////////////////////
    var positions = (this.position + '').toLowerCase().match(/\S+/g) || [];

    if (positions.length < 1) {
      positions.push('center');
    }
    if (positions.length === 1) {
      positions.push(positions[0]);
    }

    if (positions[0] === 'top' || positions[0] === 'bottom' ||
        positions[1] === 'left' || positions[1] === 'right') {
      positions = [positions[1], positions[0]];
    }

    if (this.positionX !== undefined) {
      positions[0] = this.positionX.toLowerCase();
    }

    if (this.positionY !== undefined) {
      positions[1] = this.positionY.toLowerCase();
    }

    self.positionX = positions[0];
    self.positionY = positions[1];

    if (this.positionX !== 'left' && this.positionX !== 'right') {
      if (isNaN(parseInt(this.positionX, 10))) {
        this.positionX = 'center';
      } else {
        this.positionX = parseInt(this.positionX, 10);
      }
    }

    if (this.positionY !== 'top' && this.positionY !== 'bottom') {
      if (isNaN(parseInt(this.positionY, 10))) {
        this.positionY = 'center';
      } else {
        this.positionY = parseInt(this.positionY, 10);
      }
    }

    this.position =
      this.positionX + (isNaN(this.positionX)? '' : 'px') + ' ' +
      this.positionY + (isNaN(this.positionY)? '' : 'px');

    ////////////////////////////////////////////////////////////////////////////
    // Set up device fallback if enabled
    ////////////////////////////////////////////////////////////////////////////
    if (this.deviceFallback) {
      this.$element.css({
        backgroundImage: 'url("' + this.imageSrc + '")',
        backgroundSize: 'cover',
        backgroundPosition: this.position,
        backgroundRepeat: 'no-repeat'
      });

      Parallax.isSetup || Parallax.setup();
      Parallax.sliders.push(self);
      Parallax.isFresh = false;
      Parallax.requestRender();

      return this;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Set up mirror
    ////////////////////////////////////////////////////////////////////////////
    this.$mirror = $('<div />').prependTo('body');

    this.$mirror.addClass('parallax-mirror').css({
      opacity: 0,
      zIndex: this.zIndex,
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    });

    ////////////////////////////////////////////////////////////////////////////
    // Set up slider
    ////////////////////////////////////////////////////////////////////////////
    this.$slider = $('<img />').prependTo(this.$mirror);

    this.$slider.addClass('parallax-slider').one('load', function() {
      if (!self.naturalHeight || !self.naturalWidth) {
        self.naturalHeight = this.naturalHeight || this.height || 1;
        self.naturalWidth  = this.naturalWidth  || this.width  || 1;
      }

      self.aspectRatio = self.naturalWidth / self.naturalHeight;

      Parallax.isSetup || Parallax.setup();
      Parallax.sliders.push(self);
      Parallax.isFresh = false;
      Parallax.requestRender();
    });

    if (!this.responsive) {
      this.$slider[0].src = this.imageSrc;

      if (this.naturalHeight && this.naturalWidth || this.$slider[0].complete) {
        this.$slider.trigger('load');
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Parallax Instance Methods
  //////////////////////////////////////////////////////////////////////////////
  $.extend(Parallax.prototype, {
    speed:    0.2,
    bleed:    0,
    zIndex:   -100,
    iosFix:   true,
    androidFix: true,
    position: 'center',
    overScrollFix: false,
    responsive: false,

    refresh: function() {
      if (this.responsive) {
        this.setResponsiveImageSrc();

        if (this.deviceFallback) {
          return;
        }
      }

      this.boxWidth        = this.$element.outerWidth();
      this.boxHeight       = this.$element.outerHeight() + this.bleed * 2;
      this.boxOffsetTop    = this.$element.offset().top - this.bleed;
      this.boxOffsetLeft   = this.$element.offset().left;
      this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;

      var winHeight = Parallax.winHeight;
      var docHeight = Parallax.docHeight;
      var maxOffset = Math.min(this.boxOffsetTop, docHeight - winHeight);
      var minOffset = Math.max(this.boxOffsetTop + this.boxHeight - winHeight, 0);
      var imageHeightMin = this.boxHeight + (maxOffset - minOffset) * (1 - this.speed) | 0;
      var imageOffsetMin = (this.boxOffsetTop - maxOffset) * (1 - this.speed) | 0;
      var margin;

      if (imageHeightMin * this.aspectRatio >= this.boxWidth) {
        this.imageWidth    = imageHeightMin * this.aspectRatio | 0;
        this.imageHeight   = imageHeightMin;
        this.offsetBaseTop = imageOffsetMin;

        margin = this.imageWidth - this.boxWidth;

        if (this.positionX === 'left') {
          this.offsetLeft = 0;
        } else if (this.positionX === 'right') {
          this.offsetLeft = - margin;
        } else if (!isNaN(this.positionX)) {
          this.offsetLeft = Math.max(this.positionX, - margin);
        } else {
          this.offsetLeft = - margin / 2 | 0;
        }
      } else {
        this.imageWidth    = this.boxWidth;
        this.imageHeight   = this.boxWidth / this.aspectRatio | 0;
        this.offsetLeft    = 0;

        margin = this.imageHeight - imageHeightMin;

        if (this.positionY === 'top') {
          this.offsetBaseTop = imageOffsetMin;
        } else if (this.positionY === 'bottom') {
          this.offsetBaseTop = imageOffsetMin - margin;
        } else if (!isNaN(this.positionY)) {
          this.offsetBaseTop = imageOffsetMin + Math.max(this.positionY, - margin);
        } else {
          this.offsetBaseTop = imageOffsetMin - margin / 2 | 0;
        }
      }
    },

    render: function() {
      if (this.deviceFallback) {
        return;
      }

      var scrollTop    = Parallax.scrollTop;
      var scrollLeft   = Parallax.scrollLeft;
      var overScroll   = this.overScrollFix ? Parallax.overScroll : 0;
      var scrollBottom = scrollTop + Parallax.winHeight;
      var visible = this.boxOffsetBottom >= scrollTop && this.boxOffsetTop <= scrollBottom;

      this.mirrorTop = this.boxOffsetTop  - scrollTop;
      this.mirrorLeft = this.boxOffsetLeft - scrollLeft;
      this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed);

      this.$mirror.css({
        transform: 'translate3d(0px, 0px, 0px)',
        opacity: (visible) ? 1 : 0,
        top: this.mirrorTop - overScroll,
        left: this.mirrorLeft,
        height: this.boxHeight,
        width: this.boxWidth
      });

      this.$slider.css({
        transform: 'translate3d(0px, 0px, 0px)',
        position: 'absolute',
        top: this.offsetTop,
        left: this.offsetLeft,
        height: this.imageHeight,
        width: this.imageWidth,
        maxWidth: 'none'
      });
    },

    loadResponsiveImage: function() {
      if (!this.responsive) {
        return;
      }

      var alreadyLoaded = this.loadedImages[this.imageSrc];

      if (typeof alreadyLoaded !== 'undefined') {
        this.setResponsiveImage(alreadyLoaded);
      } else {
        var img = new Image();

        img.onload = function() {
          this.loadedImages[this.imageSrc] = img;
          this.setResponsiveImage(img);
        }.bind(this);

        img.src = this.imageSrc;
      }
    },

    setResponsiveImageSrc: function() {
      if (!this.responsive) {
        return;
      }

      var matches = [];
      for (var i = 0, l = this.imageSources.length; i < l; i++) {
        var dataSrc = this.imageSources[i].getAttribute('data-image-src');
        var dataMedia = this.imageSources[i].getAttribute('data-media-query');

        if (dataSrc && (dataMedia && CustomModernizr.mq(dataMedia))) {
          matches.push(dataSrc);
        }
      }

      if (matches.length) {
        // Has matches and get last matched
        var src = matches.pop();
        var exp = new RegExp(src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        if (!exp.test(this.imageSrc)) {
          this.imageSrc = src;
          this.loadResponsiveImage();
        }
      } else {
        // If no media queries match load fallback `image-src`.
        this.imageSrc = this.elementSrc;
        this.loadResponsiveImage();
      }
    },

    setResponsiveImage: function(img) {
      if (!this.responsive) {
        return;
      }

      if (this.deviceFallback) {
        this.$element.css({
          backgroundImage: 'url("' + this.imageSrc + '")'
        });
      } else {
        this.naturalWidth = img.width;
        this.naturalHeight = img.height;
        this.aspectRatio = this.naturalWidth / this.naturalHeight;

        this.$slider[0].src = this.imageSrc;
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  // Parallax Static Methods
  //////////////////////////////////////////////////////////////////////////////
  $.extend(Parallax, {
    $win: $(window),
    $doc: $(document),
    scrollTop:    0,
    scrollLeft:   0,
    winHeight:    0,
    winWidth:     0,
    docHeight:    1 << 30,
    docWidth:     1 << 30,
    sliders:      [],
    isReady:      false,
    isFresh:      false,
    isBusy:       false,

    setup: function() {
      if (this.isReady) {
        return;
      }

      this.$win.on('resize.px.parallax load.px.parallax', this.update)
               .on('scroll.px.parallax load.px.parallax', this.scroll);

      this.update();
      this.isReady = true;
    },

    update: function() {
      Parallax.winHeight = Parallax.$win.height();
      Parallax.winWidth  = Parallax.$win.width();
      Parallax.docHeight = Parallax.$doc.height();
      Parallax.docWidth  = Parallax.$doc.width();
      Parallax.isFresh = false;
      Parallax.requestRender();
    },

    scroll: function() {
      var scrollTopMax  = Parallax.docHeight - Parallax.winHeight;
      var scrollLeftMax = Parallax.docWidth  - Parallax.winWidth;

      Parallax.scrollTop  = Math.max(0, Math.min(scrollTopMax,  Parallax.$win.scrollTop()));
      Parallax.scrollLeft = Math.max(0, Math.min(scrollLeftMax, Parallax.$win.scrollLeft()));
      Parallax.overScroll = Math.max(Parallax.$win.scrollTop() - scrollTopMax, Math.min(Parallax.$win.scrollTop(), 0));
      Parallax.requestRender();
    },

    configure: function(options) {
      if (typeof options === 'object') {
        delete options.refresh;
        delete options.render;
        $.extend(this.prototype, options);
      }
    },

    refresh: function() {
      $.each(this.sliders, function(){ this.refresh(); });
      this.isFresh = true;
    },

    render: function() {
      this.isFresh || this.refresh();
      $.each(this.sliders, function(){ this.render(); });
    },

    requestRender: function() {
      var self = this;

      if (!this.isBusy) {
        this.isBusy = true;

        window.requestAnimationFrame(function() {
          self.render();
          self.isBusy = false;
        });
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  // Parallax Plugin Definition
  //////////////////////////////////////////////////////////////////////////////
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var options = typeof option === 'object' && option;

      if (this === window || this === document || $this.is('body')) {
        Parallax.configure(options);
      }
      else if (!$this.data('px.parallax')) {
        options = $.extend({}, $this.data(), options);
        $this.data('px.parallax', new Parallax(this, options));
      }
      if (typeof option === 'string') {
        Parallax[option]();
      }
    });
  }

  var old = $.fn.parallax;

  $.fn.parallax             = Plugin;
  $.fn.parallax.Constructor = Parallax;

  //////////////////////////////////////////////////////////////////////////////
  // Parallax No Conflict
  //////////////////////////////////////////////////////////////////////////////
  $.fn.parallax.noConflict = function () {
    $.fn.parallax = old;
    return this;
  };

  //////////////////////////////////////////////////////////////////////////////
  // Parallax Data-API
  //////////////////////////////////////////////////////////////////////////////
  $(document).on('ready.px.parallax.data-api', function () {
    $('[data-parallax="scroll"]').parallax();
  });

}(jQuery, (window.CustomModernizr || window.Modernizr), window, document));
