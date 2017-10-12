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
  let instanceName = `__${pluginName}`;
  let old = $.fn[pluginName];

  $.fn[pluginName] = function (option) {
    return this.each(function () {
      const $this = $(this);
      let instance = $this.data(instanceName);

      if (!instance && option !== 'destroy') {
        const options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);
        $this.data(instanceName, (instance = new className(this, options)));
      }
      else if (typeof instance.configure === 'function'){
        instance.configure(options);
      }

      if (typeof option === 'string') {
        if (option === 'destroy') {
          instance.destroy();
          $this.data(instanceName, false);
        } else {
          instance[option]();
        }
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