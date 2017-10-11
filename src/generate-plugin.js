import $ from 'jquery';

/**
 * Generate a jQuery plugin
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin');
 */
export default function generatePlugin(pluginName, className, shortHand = false) {
  let dataName = `__${pluginName}`;
  let old = $.fn[pluginName];

  $.fn[pluginName] = function (option) {
    return this.each(function () {
      let $this = $(this);
      let data = $this.data(dataName);
      let options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);

      if (!data) {
        $this.data(dataName, (data = new className(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      }
    });
  };

  // - Short hand
  if (shortHand) {
    $[pluginName] = (options) => $({})[pluginName](options);
  }

  // - No conflict
  $.fn[pluginName].noConflict = () => $.fn[pluginName] = old;
}