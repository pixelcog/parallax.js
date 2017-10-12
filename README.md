jquery.parallax.js v2
===========

Warning: This branch is still in alpha and should not be used on production servers! It should, however, be stable enough already, so please feel free to check it out and let us know if you find some issues! 

## Installation
please clone or download the repository and check the dist folder for the necessary files.

NPM, Yarn, Bower as well as CDN support will be added for the release version.

## Usage

#### Auto-init
If not disabled, the library automatically calls itself on all elements with a `data-parallax` attribute with the default parameters like so:

```javascript
// this is called automatically:
if(Parallax.AUTOINIT) {
  $('[data-parallax]').parallax();
}
// if you don't previously set  
Parallax.AUTOINIT = false;
```

####Init
Basically, you can call the `parallax()` function on any jquery selector. 
The selected elements either need to have a `data-src` attribute or a child element which is matched by the `sliderSelector` query (see options).
#### Defaults
The default values, which are used for `.parallax()` (and merged with an optional options parameter), look as follows:

```javascript
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
  // callback functions:
  afterRefresh: null,
  afterRender: null,
  afterSetup: null,
  afterDestroy: null,
};
```

These defaults can be changed easily, e.g.:
```javascript
Parallax.DEFAULTS.speed = -.2;
Parallax.DEFAULTS.afreRefresh = (instance) => { doSomethingWith(instance); };
```

#### Data Attributes 
Data Attributes can be used for quick an easy setup when no complex solutions are required.

```html
<div class="some-class" data-src="some-img.jpg" data-pos-x="left" data-parallax>
```

All options can be used as attributes. "Kebab-case" and the `data-` prefix 
have to be used instead of CamelCase in the JavaScript options.
(e.g. `aspectRatio` gets `data-aspect-ratio`)

Important: Please note, that the `<div>` above will be used as the so called parallax-window and needs to have a minimum-height and transparency.

Adding the following CSS or similar will be necessary:

```css
.some-class {
  min-height: 50vh;
  background: transparent;
}
``` 

#### Manual-init

If you don't use autoinit or need more control over the instances, you can manually initialize parallax.js and pass options via an options object

```javascript
$('.any-selector-you-like-but-this-is-called-window').parallax({
  speed: .3,
  afterRender: doSomething,
});
```

#### Destroy

Each instance can be destroyed by calling `.parallax('destroy')` on the element (window).

```javascript
$('.any-selector-you-like-but-this-is-called-window').parallax('destroy');
```

## Options and Attributes
The following options can be used:

|Name|Attribute|Default|Description
|---|---|---|---
|src|data-src|null| path to an image
|speed|data-speed|0.2| float which is used to calculate the speed. <br> Values from -1 to 1 are most useful.
|bleed|data-bleed|0| the number of pixels used as "bleed" above and below the slide. <br> This causes an overlap and can be used to fix scrolling issues on some browsers. <br>A value of 50 is sufficient in most cases.   
|zIndex|data-z-index|-100| the z-index of the parallax mirror
|posX|data-pos-x|'center'| number in px, 'left' or 'right' is used to calculate the x-offset. <br> Only effective when the aspect ratio of the content **smaller** than the aspect ratio of the window. <br> i.e. the content **height is higher** in relation to the window      
|posY|data-pos-y|'center'| number in px, 'top' or 'bottom' is used to calculate the y-offset. <br> Only effective when the aspect ratio of the content **larger** than the aspect ratio of the window. <br> i.e. the content **width is wider** relation to the window
|overScrollFix|data-over-scroll-fix|false| If true, will freeze the parallax effect when "over scrolling" in browsers like Safari to prevent unexpected gaps caused by negative scroll positions.
|excludeAgents|data-exclude-agents| /(iPod&#124;iPhone&#124;<br>iPad&#124;Android)/ | regular expression, when matched with the user agent, the parallax effect is not applied. The image is set as background when data-src is used. 
|aspectRatio|data-aspect-ratio|null (automatic)| the aspect ratio which should be utilized for the content.  
|sliderSelector|data-slider-selector|'>.parallax-slider'| the jquery selector for the slider `$currentElement.find(options.sliderSelector);`
|mirrorSelector|data-mirror-selector|'body'| the jquery selector for the container where the mirror is prepended `$mirror.prependTo($(options.mirrorSelector));`
|afterRefresh|data-after-refresh|null| callback which is called after refresh
|afterRender|data-after-render|null| callback which is called after render
|afterSetup|data-after-setup|null| callback which is called after setup
|afterDestroy|data-after-destroy|null| callback which is called after destroy


## Migration from v1.x
v2.x has been redesigned from ground up to improve maintainability, compatibility and performance. 

The most important changes:
 - options have been simplified and reduced while increasing functionality
 - variables and option names have been shortened to decrease the footprint
 - changed option and attribute names:
   - `imageSrc` is now `src`
   - `naturalWidth` and `naturalHeight` have been replaced by `aspectRatio` which is mostly calculated automatically now
   - `positionX` and `positionY` renamed to `posX` and `posY`
   - `position` option has been removed, use `posX` and `posY` instead
   - `iosFix` and `androidFix` have been replaced with `excludeAgents`, which is now a regular expression
   - `mirrorContainer` has been replaced by the more flexible `mirrorSelector` which is a jQuery selector. 
 - all options can also be used as data attributes (e.g. `mirrorSelector` gets `data-mirror-selector`)
 - smaller file size but higher performance, better stability and more functionality
    
## Examples

```html
<div class="my-parallax-window">
  <div class="my-parallax-slider">
    <img src="some-image.jpg"/>
    <p>This content and the image will move when scrolling</p>
  </div>
  <div class="some-optional-fixed-content">
    <p>This content will stay in place</p>
  </div>
</div>
```

```javascript
$('.my-parallax-window').parallax({
  speed: -.2,
  sliderSelector: '>.my-parallax-slider',
})
```

## Change log

#### v2.0.0-beta 
Most important changes include the following:
 - npm devDependencies to setup build environment
 - ES6 modules are used 
 - Webpack is used for the build process
 - tbc