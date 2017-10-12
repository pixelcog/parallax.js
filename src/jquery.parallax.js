/*!
 * parallax.js v2.0.0 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2017 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */
import $ from 'jquery';
import generatePlugin from './generate-plugin';

class Parallax {

  ///////////////////////
  // Instance Methods //
  /////////////////////

  constructor(element, options) {
    const $window = $(element);

    Parallax.isSetup || Parallax.init();
    Parallax.instances.push(this);

    if (!options.src && $window.is('img')) {
      options.src = $window.attr('src');
    }

    // match returns null if regex is null i.e. falsy, no additional checks needed
    if (navigator.userAgent.match(options.excludeAgents)) {
      // todo: enhance
      if (options.src && !$window.is('img')) {
        $window.css({
          background: 'url("' + options.src + '")' + options.pos + '/cover'
        });
      }
    } else {
      // migration note: scrapped the whole combined positions option in favor for a lighter footprint, i.e. only separate position options are supported
      // little parse function to keep duplicate code to a minimum.
      function _parsePos(pos, p1, p2) {
        const p = parseInt(options[pos]);
        if (isNaN(p)) {
          if (options[pos] !== p1 && options[pos] !== p2) {
            options.pos += (options[pos] = 'center') + ' ';
          }
        } else {
          options.pos += (options[pos] = p) + 'px ';
        }
      }

      options.pos = '';
      _parsePos('posX', 'left', 'right');
      _parsePos('posY', 'top', 'bottom');

      /** creating the mirror element */
      const $mirror = $('<div>').addClass('parallax-mirror').css({
        visibility: 'hidden',
        zIndex: options.zIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }).prependTo(options.mirrorContainer);

      // interestingly .find('>.parallax-slider') is faster than .children('.parallax-slider')
      let $slider = $window.find('>.parallax-slider');
      if ($slider.length === 0)
        $slider = $('<img>').attr('src', options.src);
      else {
        options.formerParent = $slider.parent();
        options.formerStyles = $slider.prop('style');
      }

      $slider.addClass('parallax-slider').prependTo($mirror);

      // call re-init after all images are loaded within the slider
      $slider.children('img').on('load', () => {
        this.refresh();
        this.render();
      });

      this.$s = $slider;
      this.$m = $mirror;
    }

    this.$w = $window;
    this.o = options;

    if (typeof options.afterSetup === 'function')
      options.afterSetup(this);
  }

  /**
   * recalculates size and position variables, everything except the scroll position.
   */
  refresh() {
    const $window = this.$w;
    const options = this.o;

    // when not initialized yet.
    if (!options)
      return;

    // find out aspect ratio for the first time
    if (!options.aspectRatio) {

      (function ($s, options) {
        // iterate through all children and find out the boundings
        let top = 0, bottom = 0, left = 0, right = 0;
        $s.children().each(function () {
          const $e = $(this);
          const off = $e.offset();
          const eBottom = off.top + $e.outerHeight();
          const eRight = off.left + $e.outerWidth();

          top = off.top < top ? off.top : top;
          left = off.left < left ? off.left : left;
          bottom = eBottom > bottom ? eBottom : bottom;
          right = eRight > right ? eRight : right;
        });

        const contentHeight = bottom - top;
        const contentWidth = right - left;
        // aspectRatio is 0 when contentWidth is 0 and therefore recalculated until there is some width
        options.aspectRatio = contentWidth / (contentHeight || 1);
      })(this.$s, options);
    }
    const aspect = options.aspectRatio || 1;

    options.boxWidth = $window.outerWidth();
    options.boxHeight = $window.outerHeight() + options.bleed * 2;
    options.boxOffsetTop = $window.offset().top - options.bleed;
    options.boxOffsetLeft = $window.offset().left;
    options.boxOffsetBottom = options.boxOffsetTop + options.boxHeight;

    const winHeight = Parallax.winHeight;
    const docHeight = Parallax.docHeight;
    const maxOffset = Math.min(options.boxOffsetTop, docHeight - winHeight);
    const minOffset = Math.max(options.boxOffsetTop + options.boxHeight - winHeight, 0);
    const imageHeightMin = options.boxHeight + (maxOffset - minOffset) * (1 - options.speed) | 0;
    const imageOffsetMin = (options.boxOffsetTop - maxOffset) * (1 - options.speed) | 0;
    let margin;

    // box width is smaller than minimum image width
    if (options.boxWidth < imageHeightMin * aspect) {
      options.imageWidth = imageHeightMin * aspect | 0;
      options.imageHeight = imageHeightMin;
      options.offsetBaseTop = imageOffsetMin;

      margin = options.imageWidth - options.boxWidth;

      if (options.posX === 'left') {
        options.offsetLeft = 0;
      } else if (options.posX === 'right') {
        options.offsetLeft = -margin;
      } else if (!isNaN(options.posX)) {
        options.offsetLeft = Math.max(options.posX, -margin);
      } else {
        options.offsetLeft = -margin / 2 | 0;
      }
    } else {
      options.imageWidth = options.boxWidth;
      options.imageHeight = options.boxWidth / aspect | 0;
      options.offsetLeft = 0;

      margin = options.imageHeight - imageHeightMin;

      if (options.posY === 'top') {
        options.offsetBaseTop = imageOffsetMin;
      } else if (options.posY === 'bottom') {
        options.offsetBaseTop = imageOffsetMin - margin;
      } else if (!isNaN(options.posY)) {
        options.offsetBaseTop = imageOffsetMin + Math.max(options.posY, -margin);
      } else {
        options.offsetBaseTop = imageOffsetMin - margin / 2 | 0;
      }
    }

    if (typeof options.afterRefresh === 'function')
      options.afterRefresh(this);
  }

  /**
   * renders the slider at the correct position relative to the scroll position
   */
  render() {
    const options = this.o;

    const scrollTop = Parallax.scrollTop;
    const scrollLeft = Parallax.scrollLeft;
    const overScroll = options.overScrollFix ? Parallax.overScroll : 0;
    const scrollBottom = scrollTop + Parallax.winHeight;

    if (options.boxOffsetBottom > scrollTop && options.boxOffsetTop <= scrollBottom) {
      options.visibility = 'visible';
      options.mirrorTop = options.boxOffsetTop - scrollTop;
      options.mirrorLeft = options.boxOffsetLeft - scrollLeft;
      options.offsetTop = options.offsetBaseTop - options.mirrorTop * (1 - options.speed);
    } else {
      options.visibility = 'hidden';
    }

    this.$m.css({
      transform: 'translate3d(' + options.mirrorLeft + 'px, ' + (options.mirrorTop - overScroll) + 'px, 0px)',
      visibility: options.visibility,
      height: options.boxHeight,
      width: options.boxWidth,
    });

    this.$s.css({
      transform: 'translate3d(' + options.offsetLeft + 'px, ' + options.offsetTop + 'px, 0px)',
      position: 'absolute',
      height: options.imageHeight,
      width: options.imageWidth,
      maxWidth: 'none',
    });

    if (typeof options.afterRefresh === 'function')
      options.afterRefresh(this);
  }

  /**
   * destroys the current instance and puts the slide back where it was before initializing
   */
  destroy() {
    if (this.$m) { // might be empty on mobile
      this.$m.remove();
    }
    if (this.$s) {

      // remove slider from the sliders array
      for (let i = 0; i < Parallax.instances.length; i++) {
        if (Parallax.instances[i] === this) {
          Parallax.instances.splice(i, 1);
        }
      }

      // append slider back to old parent if exists
      if (this.o.formerParent) {
        this.$s.prop('style', this.o.formerStyles);
        this.o.formerParent.append(this.$s);
      }
    }

    if (Parallax.instances.length === 0) {
      $(window).off('scroll.px.parallax resize.px.parallax load.px.parallax');
      Parallax.isSetup = false;
    }

    if (typeof options.afterDestroy === 'function')
      options.afterDestroy(this);
  }

  /////////////////////
  // Static Methods //
  ///////////////////

  /**
   * initializes the library and all necessary variables shared among all parallax instances
   */
  static init() {
    if (Parallax.isSetup) return;

    const $doc = $(document);
    const $win = $(window);

    function loadDimensions() {
      Parallax.winHeight = $win.height();
      Parallax.winWidth = $win.width();
      Parallax.docHeight = $doc.height();
      Parallax.docWidth = $doc.width();
    }

    function loadScrollPosition() {
      const winScrollTop = $win.scrollTop();
      const scrollTopMax = Parallax.docHeight - Parallax.winHeight;
      const scrollLeftMax = Parallax.docWidth - Parallax.winWidth;
      Parallax.scrollTop = Math.max(0, Math.min(scrollTopMax, winScrollTop));
      Parallax.scrollLeft = Math.max(0, Math.min(scrollLeftMax, $win.scrollLeft()));
      Parallax.overScroll = Math.max(winScrollTop - scrollTopMax, Math.min(winScrollTop, 0));
    }

    $win.on('resize.px.parallax load.px.parallax', function () {
      loadDimensions();
      Parallax.update(true);
    });

    loadDimensions();

    Parallax.isSetup = true;

    let lastPosition = -1;
    (function loop() {
      if (lastPosition !== window.pageYOffset) {   // Avoid overcalculations
        lastPosition = window.pageYOffset;
        loadScrollPosition();
        Parallax.update();
      }
      window.requestAnimationFrame(loop);
    })();
  }

  /**
   * renders all parallax instances
   * @param refresh when true, also call refresh on all instances
   */
  static update(refresh = false) {
    if (refresh)
      $.each(Parallax.instances, function () { this.refresh(); });
    $.each(Parallax.instances, function () { this.render(); });
  }
}

Parallax.DEFAULTS = {
  speed: .2,
  bleed: 0,
  zIndex: -100,
  posX: 'center',
  posY: 'center',
  overScrollFix: false,
  mirrorContainer: 'body',
  excludeAgents: /(iPod|iPhone|iPad|Android)/,
  aspectRatio: null,
  // callback functions:
  afterRefresh: null,
  afterRender: null,
  afterSetup: null,
  afterDestroy: null,
};

Parallax.AUTOINIT = true;

Parallax.scrollTop = 0;
Parallax.scrollLeft = 0;
Parallax.winHeight = 0;
Parallax.winWidth = 0;
Parallax.docHeight = 1 << 30;
Parallax.docWidth = 1 << 30;
Parallax.instances = [];
Parallax.isSetup = false;

/**
 * call auto initialization. This can be supresst by setting the static Parallax.AUTOINIT parameter to false
 */
$(() => {
  if (Parallax.AUTOINIT) {
    $('[data-parallax]').parallax();
  }
});

generatePlugin('parallax', Parallax);
