/*
 * Plugin Name: Slider
 * Version: 0.2
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Slider may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Slider
---------------------------------------------------------- */

/*
 * jQuery('.selector').dkJSUSlider();
 */

if (!jQuery.fn.dkJSUSlider) {
    (function($, window, document) {
        // Main Class
        var dkJSUSlider = {
            canSlide: 1,
            defaultSettings: {
                currentSlide: 0,
                nbSlides: 0,
                transition: function(oldSlide, newSlide, nb, self) {
                    newSlide.css({
                        'opacity': 0,
                        'z-index': 2
                    }).animate({
                        'opacity': 1
                    }, 300);
                    setTimeout(function() {
                        oldSlide.css({
                            'z-index': 0
                        });
                        newSlide.css({
                            'z-index': 1
                        });
                        // Authorizing a new slide
                        self.canSlide = 1;
                    }, 300);
                }
            },
            settings: {},
            init: function(el, settings) {
                this.slider = el;
                this.getSettings(settings);
                this.setSlides();
                this.setElements();
                this.setEvents();
                // Set Slide 0
                this.slides.eq(0).css({
                    'z-index': 1
                });
            },
            // Obtaining user settings
            getSettings: function(settings) {
                if (typeof settings != 'object') {
                    settings = {};
                }
                this.settings = $.extend(true, {}, this.defaultSettings, settings);
            },
            // Setting slides
            setSlides: function() {
                this.slides = this.slider.children();
                this.settings.nbSlides = this.slides.length;
                this.slides.each(function() {
                    jQuery(this).addClass('dk-jsu-slide');
                });
            },
            // Creating & setting elements
            setElements: function() {
                var self = this,
                    settings = this.settings;

                // Wrapper
                this.slider.wrap(jQuery('<div class="dk-jsu-slider-wrapper"></div>'));
                this.wrapper = this.slider.parent();

                // Style slider
                this.slider.css({
                    'position': 'relative'
                });

                // Style slides
                this.slides.css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'height': '100%',
                    'width': '100%',
                    'z-index': 0
                });
            },
            gotoSlide: function(nb) {
                var self = this,
                    settings = this.settings,
                    oldNb = this.settings.currentSlide;

                if (this.canSlide !== 1 || nb == oldNb) {
                    return 0;
                }
                if (nb === 'prev') {
                    nb = settings.currentSlide - 1;
                }

                if (nb === 'next') {
                    nb = settings.currentSlide + 1;
                }

                if (nb < 0) {
                    nb = settings.nbSlides - 1;
                }

                if (nb >= settings.nbSlides) {
                    nb = 0;
                }

                this.settings.currentSlide = nb;
                oldSlide = this.slides.eq(oldNb);
                newSlide = this.slides.eq(nb);

                if (typeof this.settings.transition == 'function') {
                    this.settings.transition(oldSlide, newSlide, nb, this);
                }
                else {
                    oldSlide.css({
                        'z-index': 0
                    });

                    newSlide.css({
                        'z-index': 1
                    });
                }

            },
            // Setting events
            setEvents: function() {
                var self = this,
                    settings = this.settings;
                this.slides.on('click', function(e) {
                    self.gotoSlide('next');
                });

                self.slider.on('prevslide', function() {
                    self.gotoSlide('prev');
                });
                self.slider.on('nextslide', function() {
                    self.gotoSlide('next');
                });
            }
        };
        // Using the dkJSUSlider class as a jQuery plugin
        $.fn.dkJSUSlider = function(settings) {
            this.each(function() {
                var $this = $(this),
                    dataPlugin = 'plugin_dkjsuslider';
                // Handling duplicate calls
                if (!$this.hasClass(dataPlugin)) {
                    $.extend(true, {}, dkJSUSlider).init($this, settings);
                    $this.addClass(dataPlugin);
                }
            });
            return this;
        };
    })(jQuery, window, document);
}