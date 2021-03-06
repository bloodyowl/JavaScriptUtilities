/*
 * Plugin Name: AJAX
 * Version: 1.0.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/*
new jsuAJAX({
    url: 'index.html',
    method: 'GET',
    callback: function(response){alert('response');},
    data: 'ajax=1&test=abc'
});
 */

var jsuAJAX = function(args) {
    var xmlHttpReq = false,
        self = this;

    /* Tests */
    if (!args.url) {
        return false;
    }
    if (!args.method) {
        args.method = 'GET';
    }
    args.method = args.method.toUpperCase();

    if (!args.callback) {
        args.callback = function() {};
    }
    if (!args.data) {
        args.data = '';
    }
    if (typeof args.data == 'object') {
        var ndata = '';
        for (var i in args.data) {
            if (ndata !== '') {
                ndata += '&';
            }
            ndata += i + '=' + args.data[i];
        }
        args.data = ndata;
    }

    /* XHR Object */
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }

    /* Opening request */
    self.xmlHttpReq.open(args.method, args.url, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    self.xmlHttpReq.onreadystatechange = function() {
        /* Callback when complete */
        if (self.xmlHttpReq.readyState == 4) {
            args.callback(self.xmlHttpReq.responseText);
        }
    };

    /* Sending request */
    self.xmlHttpReq.send(args.data);

};

/*---*/

/*
 * Plugin Name: Vanilla-JS Arrays
 * Version: 1.0.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Array contains
---------------------------------------------------------- */

Array.contains = function(needle, haystack) {
    var i = 0,
        length = haystack.length;

    for (; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
};

if (!Array.prototype.contains) {
    Array.prototype.contains = function(needle) {
        return Array.contains(needle, this);
    };
}

/* ----------------------------------------------------------
  Array each
---------------------------------------------------------- */

Array.each = function(arrayToParse, callback) {
    var i = 0,
        length = arrayToParse.length;
    for (; i < length; i++) {
        callback(arrayToParse[i]);
    }
};

if (!Array.prototype.each) {
    Array.prototype.each = function(callback) {
        Array.each(this, callback);
    };
}

/*---*/

/*
 * Plugin Name: Vanilla-JS Canvas
 * Version: 2.2.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

var dkJSUCanvas = function(canvas, args) {
    var self = this;

    // Set Vars
    self.canvas = canvas;
    self.args = args || {};
    self.canvParent = self.canvas.parentNode;
    self.coverParent = self.args.coverParent || false;

    var __construct = function() {
        self.setCanvasSize();
        self.setEvents();

        // Set canvas
        self.context = self.canvas.getContext("2d");
    };

    /* ----------------------------------------------------------
      Cover Media
    ---------------------------------------------------------- */

    // Cover Video
    self.coverVideo = function(video) {

        self.video = video || self.getChildIf('VIDEO');
        if (!self.video) {
            return;
        }

        // Obtain dimensions
        self.dim = self.getCoverDimensions(self.video);

        self.video.addEventListener('play', function() {
            self.drawVideo();
        });

    };

    self.drawVideo = function() {

        // Draw video
        self.context.drawImage(self.video, self.dim.left, self.dim.top, self.dim.width, self.dim.height);

        // Test if video is paused
        if (self.video.paused || self.video.ended) {
            return false;
        }

        // Launch next frame
        requestAnimFrame(function() {
            self.drawVideo();
        });
    };

    // Cover Image
    self.coverImage = function(image) {

        image = image || self.getChildIf('IMG');
        if (!image) {
            return;
        }

        // Obtain dimensions
        var dim = self.getCoverDimensions(image);

        // Draw image
        self.context.drawImage(image, dim.left, dim.top, dim.width, dim.height);

    };

    /* ----------------------------------------------------------
      Events
    ---------------------------------------------------------- */

    self.setEvents = function() {
        if (self.coverParent) {
            window.addEventListener('resize', function() {
                self.setCanvasSize();
                self.dim = self.getCoverDimensions(self.video);
            }, true);
        }
    };

    /* ----------------------------------------------------------
      Utilities
    ---------------------------------------------------------- */

    self.setCanvasSize = function(cover) {
        self.cH = self.canvas.clientHeight;
        self.cW = self.canvas.clientWidth;

        if (self.coverParent) {
            self.cH = self.canvParent.offsetHeight;
            self.cW = self.canvParent.offsetWidth;
        }

        self.cRatio = self.cH / self.cW;
        self.canvas.height = self.cH;
        self.canvas.width = self.cW;
    };

    self.getChildIf = function(tagName) {
        // Test if canvas has a child, with a img tagName.
        if (!canvas.children[0] || canvas.children[0].tagName != tagName) {
            return false;
        }
        return canvas.children[0];
    };

    // Get Cover dimensions for an element
    self.getCoverDimensions = function(image) {
        // Get Image size
        var iReturn = {
            left: 0,
            top: 0,
            width: 10,
            height: 10
        },
            iH = image.height || 9,
            iW = image.width || 16,
            iRatio = iH / iW;

        // Get image position
        if (self.cRatio < iRatio) {
            iReturn.width = self.cW;
            iReturn.height = iReturn.width * iRatio;
            iReturn.top = 0 - (iReturn.height - self.cH) / 2;
        }
        else {
            iReturn.height = self.cH;
            iReturn.width = iReturn.height / iRatio;
            iReturn.left = 0 - (iReturn.width - self.cW) / 2;
        }

        return iReturn;

    };

    __construct();

};

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 40);
    };
})();

/*---*/

/*
 * Plugin Name: Vanilla-JS Classes
 * Version: 1.0.3
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Get class names
---------------------------------------------------------- */

Element.getClassNames = function(element) {
    var classNames = [],
        elementClassName = element.className;
    if (elementClassName !== '') {
        elementClassName = elementClassName.replace(/\s+/g, ' ');
        classNames = elementClassName.split(' ');
    }
    return classNames;
};

/* ----------------------------------------------------------
  Test if element has a class
---------------------------------------------------------- */

Element.hasClass = function(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    return Array.contains(className, Element.getClassNames(element));
};

/* ----------------------------------------------------------
  Add a class
---------------------------------------------------------- */

Element.addClass = function(element, className) {
    if (element.classList) {
        element.classList.add(className);
        return;
    }
    if (!Element.hasClass(element, className)) {
        var elementClasses = Element.getClassNames(element);
        elementClasses.push(className);
        element.className = elementClasses.join(' ');
    }
};

/* ----------------------------------------------------------
  Remove a class
---------------------------------------------------------- */

Element.removeClass = function(element, className) {
    if (element.classList) {
        element.classList.remove(className);
        return;
    }
    var elementClasses = Element.getClassNames(element);
    var newElementClasses = [];
    var i = 0,
        arLength = elementClasses.length;
    for (; i < arLength; i++) {
        if (elementClasses[i] !== className) {
            newElementClasses.push(elementClasses[i]);
        }
    }
    element.className = newElementClasses.join(' ');
};

/* ----------------------------------------------------------
  Toggle a class
---------------------------------------------------------- */

Element.toggleClass = function(element, className) {
    if (!Element.hasClass(element, className)) {
        Element.addClass(element, className);
    }
    else {
        Element.removeClass(element, className);
    }
};

/*---*/

/*
 * Plugin Name: Vanilla-JS Common
 * Version: 1.4.3
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* Tests
-------------------------- */

var dkJSUTests = {
    canvas: function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    },
    localStorage: function() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        }
        catch (e) {
            return false;
        }
    },
    offline: function() {
        return !!window.applicationCache;
    },
    touch: function() {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    },
};

/* Trim
-------------------------- */

String.trim = function(text) {
    return text.replace(/^\s+|\s+$/g, "");
};

/* Console log fix
-------------------------- */

if (typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

/* Callback on image load
-------------------------- */

var callOnImgLoad = function(url, callback) {
    // Create a new image
    var img = new Image();

    // Trigger callback on load
    img.onload = function() {
        callback();
    };

    // Set image load
    img.src = url;
};

/* Get BODY Scroll Top
-------------------------- */

var getBodyScrollTop = function() {
    return document.documentElement.scrollTop || document.body.scrollTop;
};

/* Get Window Inner Height
-------------------------- */

var getWindowInnerHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

/* Get Element Offset
-------------------------- */

var getElementOffset = function(el) {
    var clientRect = el.getBoundingClientRect(),
        top =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0,
        left =
            window.pageXOffset ||
            document.documentElement.scrollLeft ||
            document.body.scrollLeft ||
            0;

    return {
        left: clientRect.top + left,
        top: clientRect.top + top
    };
};

/*---*/

/*
 * Plugin Name: Vanilla-JS Cookies
 * Version: 1.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* Many thanks to http://www.quirksmode.org/js/cookies.html */

/* ----------------------------------------------------------
  Set Cookie
---------------------------------------------------------- */

var setCookie = function(name, value, expiration) {
    var cookie_value = name + '=' + value + ';';

    /* Expiration */
    if (expiration) {
        var date = new Date();
        date.setTime(date.getTime() + (expiration * 24 * 60 * 60 * 1000));
        cookie_value = cookie_value + "expires=" + date.toGMTString() + ';';
    }

    document.cookie = cookie_value + 'path=/';

};

/* ----------------------------------------------------------
  Get Cookie
---------------------------------------------------------- */

var getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
};

/* ----------------------------------------------------------
  Delete Cookie
---------------------------------------------------------- */

var deleteCookie = function(name) {
    setCookie(name, '', -1);
};

/*---*/

/*
 * Plugin Name: Vanilla-JS Elements
 * Version: 1.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Hide
---------------------------------------------------------- */

Element.hide = function(element) {
    element.style.display = 'none';
};

/* ----------------------------------------------------------
  Show
---------------------------------------------------------- */

Element.show = function(element) {
    element.style.display = '';
};

/* ----------------------------------------------------------
  Toggle
---------------------------------------------------------- */

Element.toggleDisplay = function(element) {
    var els = element.style;
    if (els.display === 'none') {
        Element.show(element);
    }
    else {
        Element.hide(element);
    }
};

/*---*/

/*
 * Plugin Name: Vanilla-JS Events
 * Version: 1.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Domready
---------------------------------------------------------- */

/* From the amazing Dustin Diaz : http://www.dustindiaz.com/smallest-domready-ever */
// "!document.body" check ensures that IE fires domReady correctly
window.domReady = function(func) {
    if (/in/.test(document.readyState) || !document.body) {
        setTimeout(function() {
            window.domReady(func);
        }, 9);
    }
    else {
        func();
    }
};

/* ----------------------------------------------------------
  Add Event
---------------------------------------------------------- */

window.addEvent = function(el, eventName, callback) {
    if (el.addEventListener) {
        el.addEventListener(eventName, callback, false);
    }
    else if (el.attachEvent) {
        el.attachEvent("on" + eventName, function(e) {
            return callback.call(el, e);
        });
    }
};

window.eventPreventDefault = function(e) {
    return (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
};

/*---*/

/*
 * Plugin Name: Vanilla-JS Selectors
 * Version: 1.0.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  $$_ : Get multiple elements
---------------------------------------------------------- */

var $$_ = function(selector) {
    var idMatch = /^\#([a-z0-9_-]+)$/,
        classMatch = /^\.([a-z0-9_-]+)$/,
        tagMatch = /^([a-z]+)$/;

    // If selector looks like an ID, uses $_ for performance
    if (selector.match(idMatch)) {
        return [document.getElementById(selector)];
    }

    // If selector looks like a CSS Class, uses $_ for performance
    if (selector.match(classMatch)) {
        return document.getElementsByClassName(selector);
    }

    // If selector matches a tag elements, uses getElementsByTagName for performance
    if (selector.match(tagMatch)) {
        return document.getElementsByTagName(selector);
    }

    // If Query Selector exists, use it
    if ("querySelectorAll" in document) {
        return document.querySelectorAll(selector);
    }

    return [];
};

/* ----------------------------------------------------------
  $_ : Get Element
---------------------------------------------------------- */

var $_ = function(id) {
    return document.getElementById(id);
};