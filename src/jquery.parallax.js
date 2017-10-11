/*!
 * parallax.js v2.0.0 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2017 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */
import $ from 'jquery';
import generatePlugin from './generate-plugin';

class Parallax {
  constructor(element, options) {
    this.$element = $(element);
    this.options = options;
  }
}

Parallax.DEFAULTS = {
  speed: 1,
};

generatePlugin('parallax', Parallax);