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

    // match returns null if regex is null i.e. falsy, no additional checks needed
    if (navigator.userAgent.match(options.excludeAgents)) {
      // todo: enhance
      if (options.src && !$window.is('img')) {
        $window.css('background', 'url("' + options.src + '") ' + options.pos + '/cover');
      }
    } else {

      if (options.scrollingSelector) {
        Parallax.scrollingElement = $(options.scrollingSelector)[0];
      }

      // init global instance
      Parallax.isSet || Parallax.init();
      Parallax.iList.push(this);

      /** creating the mirror element */
      const $mirror = $('<div>').addClass('parallax-mirror').css({
        visibility: 'hidden',
        zIndex: options.zIndex,
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }).prependTo($(options.mirrorSelector));

      /** finding the slider with the selector provided*/
      let $slider = $window.find(options.sliderSelector);

      if ($slider.length === 0) {
        $slider = $('<img>').attr('src', options.src);
      } else {
        /** former parent where the slider will be added again when destroyed */
        options.formerParent = $slider.parent();
        /** former styles which will be set again when destroyed */
        options.formerStyles = $slider.prop('style');
      }

      $slider.addClass('parallax-slider').prependTo($mirror);

      // call re-init after all images are loaded within the slider
      $slider.children('img').add($slider).on('load', () => {
        // this also calls the refresh method of the parallax once the image is loaded
        Parallax.update(true);
      });

      this.$s = $slider;
      this.$m = $mirror;
    }

    this.$w = $window;
    this.o = options;

    if (typeof options.afterSetup === 'function') {
      options.afterSetup(this);
    }
  }

  /**
   * recalculates size and position variables, everything except the scroll position.
   */
  refresh() {
    const $window = this.$w;
    const options = this.o;

    options.dH = Parallax.dH;
    options.dW = Parallax.dW;

    const se = options.scrollingElement;

    if (se && se !== document) {
      options.dH = se.scrollHeight;
      options.dW = se.scrollWidth;
    }

    // when not initialized yet.
    if (!options) {
      return;
    }

    // find out aspect ratio for the first time
    if (!options.aspectRatio) {

      (function ($s, options) {
        // iterate through all children and find out the boundings
        let top = 0, bottom = 0, left = 0, right = 0;
        // when there are no children, the slider itself is an image
        if ($s.children().each(function () {
            const $e = $(this);
            const off = $e.offset();
            const eBottom = off.top + $e.outerHeight();
            const eRight = off.left + $e.outerWidth();

            top = off.top < top ? off.top : top;
            left = off.left < left ? off.left : left;
            bottom = eBottom > bottom ? eBottom : bottom;
            right = eRight > right ? eRight : right;
          }).length === 0) {
          options.aspectRatio = $s[0].naturalWidth / ($s[0].naturalHeight || 1);
        }
        else {

          const offset = $s.offset();
          // not sure if thats correctbut  bottom - top - offset.top yielded in wrong results
          const contentHeight = bottom - Math.max(top, offset.top);
          const contentWidth = right - Math.max(left, offset.left);

          // aspectRatio is 0 when contentWidth is 0 and therefore recalculated until there is some width
          options.aspectRatio = contentWidth / (contentHeight || 1);
        }
      })(this.$s, options);
    }
    const aspect = options.aspectRatio || 1;

    options.boxWidth = $window.outerWidth();
    options.boxHeight = $window.outerHeight() + options.bleed * 2;
    options.boxOffsetTop = $window.offset().top - options.bleed;
    options.boxOffsetLeft = $window.offset().left;
    options.boxOffsetBottom = options.boxOffsetTop + options.boxHeight;

    const winHeight = Parallax.wH;
    const docHeight = Parallax.dH;
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

    if (typeof options.afterRefresh === 'function') {
      options.afterRefresh(this);
    }
  }

  /**
   * renders the slider at the correct position relative to the scroll position
   */
  render() {
    const options = this.o;

    const scrollTop = Parallax.sT;
    const scrollLeft = Parallax.sL;
    const overScroll = options.overScrollFix ? Parallax.overScroll : 0;
    const scrollBottom = scrollTop + Parallax.wH;

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

    if (typeof options.afterRender === 'function') {
      options.afterRender(this);
    }
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
      for (let i = 0; i < Parallax.iList.length; i++) {
        if (Parallax.iList[i] === this) {
          Parallax.iList.splice(i, 1);
        }
      }

      // append slider back to old parent if exists
      if (this.o.formerParent) {
        this.$s.prop('style', this.o.formerStyles);
        this.o.formerParent.append(this.$s);
      }
    }

    if (Parallax.iList.length === 0) {
      $(window).off('scroll.px.parallax resize.px.parallax load.px.parallax');
      Parallax.isSet = false;
    }

    if (typeof this.o.afterDestroy === 'function') {
      this.o.afterDestroy(this);
    }
  }

  /////////////////////
  // Static Methods //
  ///////////////////

  /**
   * initializes the library and all necessary variables shared among all parallax instances
   */
  static init() {
    if (Parallax.isSet) {
      return;
    }

    /** @type jQuery*/
    const $se = $(Parallax.scrollingElement || document);
    /** @type jQuery*/
    const $win = $(window);

    /** @type jQuery*/
    const $sw = $(Parallax.scrollingElement || window);

    function loadDimensions() {
      Parallax.wH = $win.height();
      Parallax.wW = $win.width();
      Parallax.dH = $se[0].scrollHeight || $se.height();
      Parallax.dW = $se[0].scrollWidth || $se.width();
    }

    function loadScrollPosition() {
      const winScrollTop = $sw.scrollTop();
      const scrollTopMax = Parallax.dH - Parallax.wH;
      const scrollLeftMax = Parallax.dW - Parallax.wW;
      Parallax.sT = Math.max(0, Math.min(scrollTopMax, winScrollTop));
      Parallax.sL = Math.max(0, Math.min(scrollLeftMax, $sw.scrollLeft()));
      Parallax.overScroll = Math.max(winScrollTop - scrollTopMax, Math.min(winScrollTop, 0));
    }

    $win.on('resize.px.parallax load.px.parallax', function () {
      loadDimensions();
      Parallax.update(true);
    });

    loadDimensions();

    Parallax.isSet = true;

    let lastPosition = -1;
    (function loop() {
      const yoffset = $sw.scrollTop();
      if (lastPosition !== yoffset) {   // Avoid overcalculations
        lastPosition = yoffset;
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
    if (refresh) {
      $.each(Parallax.iList, function () { this.refresh(); });
    }
    $.each(Parallax.iList, function () { this.render(); });
  }
}

Parallax.DEFAULTS = {
  src: null,
  speed: .2,
  bleed: 0,
  zIndex: -100,
  posX: 'center',
  posY: 'center',
  overScrollFix: false,
  excludeAgents: /(iPod|iPhone|iPad|Android)/,
  aspectRatio: null,
  // jquery selectors
  sliderSelector: '>.parallax-slider',
  mirrorSelector: 'body',
  scrollingSelector: null,
  // callback functions:
  afterRefresh: null,
  afterRender: null,
  afterSetup: null,
  afterDestroy: null,
};

Parallax.AUTOINIT = true;

///////////////////////
// Global variables //
/////////////////////

/**
 * scroll top position
 * @type {number}
 */
Parallax.sT = 0;
/**
 * scroll left position
 * @type {number}
 */
Parallax.sL = 0;
/**
 * window height
 * @type {number}
 */
Parallax.wH = 0;
/**
 * window width
 * @type {number}
 */
Parallax.wW = 0;
/**
 * document height
 * @type {number}
 */
Parallax.dH = 1 << 30;
/**
 * document width
 * @type {number}
 */
Parallax.dW = 1 << 30;
/**
 * all instances
 * @type {Array}
 */
Parallax.iList = [];
/**
 * flag for global setup
 * @type {boolean}
 */
Parallax.isSet = false;

/**
 * call auto initialization. This can be supresst by setting the static Parallax.AUTOINIT parameter to false
 */
$(() => {
  if (Parallax.AUTOINIT) {
    $('[data-parallax]').parallax();
  }
});

generatePlugin('parallax', Parallax);
