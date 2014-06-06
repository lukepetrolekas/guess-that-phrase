// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 2.0, July 8th, 2011
// by Stefan Gabos

// remember to change every instance of "pluginName" to the name of your plugin!
// the semicolon at the beginning is there on purpose in order to protect the integrity 
// of your scripts when mixed with incomplete objects, arrays, etc.
;(function($) {

    // we need attach the plugin to jQuery's namespace or otherwise it would not be
    // available outside this function's scope
    // "el" should be a jQuery object or a collection of jQuery objects as returned by
    // jQuery's selector engine
    $.WHEEL = function(canvasCtx, wheelAng, options) {

        // plugin's default options
        // this is private property and is accessible only from inside the plugin
        var defaults = {
             size: 600,
            radius: 290,
            slices: [
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null},
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null},
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null},
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null},
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null},
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null},
                {value: 100, alt: "", color: '#cc0000', formatting: null, callback: null},
                {value: 100, alt: "", color: '#00cc00', formatting: null, callback: null},
                {value: 100, alt: "", color: '#0000cc', formatting: null, callback: null},
                {value: -1, alt: "BANKRUPT", color: '#000000', formatting: bankruptFormat, callback: null}
            ],
            lineHeight: 22,
            innerLineWidth: 1,
            innerCircleFill: '#ffffff',
            innerCircleStroke: '#000000',
            outerLineWidth: 4,
            outerCircleStroke: '#000000',
            rotations: 25.1327412287, //Math.PI * 8
            spinDuration: 600,
            ///////////////////////////////////////////////////////////
            /////////////// INTERNAL VARS /////////////////////////////
            ///////////////////////////////////////////////////////////

            REFRESH_RATE: 15,
            
            currency: '$',

            // if your plugin is event-driven, you may provide callback capabilities 
            // for its events. call these functions before or after events of your 
            // plugin, so that users may "hook" custom functions to those particular 
            // events without altering the plugin's code
            onSomeEvent: function() {}

        }

        ///////////////////////////////////////////////////////////
        ////////// WHEEL VARIABLES ////////////////////////////////
        ///////////////////////////////////////////////////////////

        var canvasContext = null;
        var wheelSpinTimer = null;

        var isSpinning = false;
        var spinDuration = 0;
        var countTime = 0;

        var wheelAngle = 0;
        var spinRandomFactor = 0;

        // to avoid confusions, use "plugin" to reference the
        // current instance of the  object
        var plugin = this;

        // this will hold the merged default, and user-provided options
        // plugin's properties will be accessible like:
        // plugin.settings.propertyName from inside the plugin or
        // myplugin.settings.propertyName from outside the plugin
        // where "myplugin" is an instance of the plugin
        plugin.settings = {}

        // the "constructor" method that gets called when the object is created
        // this is a private method, it can be called only from inside the plugin
        var init = function() {

            // the plugin's final properties are the merged default and 
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);

            // code goes here
            
            canvasContext = canvasCtx;
            wheelAngle = wheelAng;
            
            plugin.draw(canvasContext, wheelAngle);

        }

        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // myplugin.publicMethod(arg1, arg2, ... argn) from outside the plugin
        // where "myplugin" is an instance of the plugin
        
        plugin.onTimerTick = function() {
                countTime += plugin.settings.REFRESH_RATE;

                if (countTime >= spinDuration) {
                    isSpinning = false;
                    wheelSpinTimer.stop();

                    //Simplify the wheel angle after each spin
                    while (wheelAngle >= Math.PI * 2) {
                        wheelAngle -= Math.PI * 2;
                    }
                }
                else {
                    wheelAngle = easeOutCubic(countTime, 0, 1, spinDuration) * 
                            plugin.settings.rotations * spinRandomFactor;
                }

                plugin.draw(canvasContext, wheelAngle);
            };
            
            plugin.spin = function() {
                
                if (wheelSpinTimer == null) { //Initialize timer first time
                    wheelSpinTimer = $.timer(plugin.onTimerTick);
                    wheelSpinTimer.set({time: plugin.settings.REFRESH_RATE, autostart: false});
                }

                if (!isSpinning) {
                    isSpinning = true;
                    spinDuration = plugin.settings.spinDuration;
                    countTime = 0;

                    spinRandomFactor = 0.90 + 0.1 * Math.random();

                    wheelSpinTimer.play();
                    
                 
                }
            };
            
            plugin.draw = function(context, angleOffset) {
                plugin.clear(context);
                plugin.drawSlices(context, angleOffset);
                plugin.drawCircles(context);
                plugin.drawPointer(context);
            };
            plugin.clear = function(context) {
                context.clearRect(0, 0, context.width, context.height);
            };
            plugin.drawSlices = function(context, angleOffset) {
                context.lineWidth = 1;
                context.strokeStyle = '#000000';
                context.textBaseline = "middle";
                context.textAlign = "center";
                context.font = "1.4em Arial";

                sliceAngle = (2 * Math.PI) / plugin.settings.slices.length;

                for (var i = 0; i < plugin.settings.slices.length; i++) {
                    plugin.drawSlice(context, i, angleOffset + sliceAngle * i, sliceAngle);
                }
            };
            plugin.drawSlice = function(context, index, angle, sliceAngle) {
                context.save();
                context.beginPath();

                context.moveTo(plugin.settings.size / 2, plugin.settings.size / 2);
                context.arc(plugin.settings.size / 2, plugin.settings.size / 2, plugin.settings.radius + plugin.settings.outerLineWidth / 2, angle, angle + sliceAngle, false); // Draw a arc around the edge
                context.lineTo(plugin.settings.size / 2, plugin.settings.size / 2);
                context.closePath();

                context.fillStyle = plugin.settings.slices[index].color;
                context.fill();
                context.stroke();

                // Draw the text verticaly
                context.translate(plugin.settings.size / 2, plugin.settings.size / 2);
                context.rotate((angle + angle + sliceAngle) / 2);
                context.translate(0.85 * plugin.settings.radius, 0);
                context.rotate(Math.PI / 2);

                context.fillStyle = '#000000';

                var str = null;
                if (plugin.settings.slices[index].alt.length == 0) {
                    str = plugin.settings.currency + plugin.settings.slices[index].value.toString();
                } else {
                    str = plugin.settings.slices[index].alt;
                }

                if (plugin.settings.slices[index].formatting != null)
                    plugin.settings.slices[index].formatting(context);

                for (var i = 0; i < str.length; i++) {
                    context.fillText(str.charAt(i), 0, plugin.settings.lineHeight * i);
                }

                context.restore();
            };
            plugin.drawCircles = function(context) {
                //Draw inner circle to conceal Moire pattern
                context.beginPath();
                context.arc(plugin.settings.size / 2, plugin.settings.size / 2, 20, 0, 2 * Math.PI, false);
                context.closePath();

                context.fillStyle = plugin.settings.innerCircleFill;
                context.strokeStyle = plugin.settings.innerCircleStroke;
                context.fill();
                context.stroke();

                // Draw outer circle to conceal jaggy edges
                // TODO: This circle aliases pretty bad.
                context.beginPath();
                context.arc(plugin.settings.size / 2, plugin.settings.size / 2, plugin.settings.radius, 0, 2 * Math.PI, false);
                context.closePath();

                context.lineWidth = plugin.settings.outerLineWidth;
                context.strokeStyle = plugin.settings.outerCircleStroke;
                context.stroke();
            };
            plugin.drawPointer = function(context) {

                context.lineWidth = 2;
                context.strokeStyle = '#000000';
                context.fileStyle = '#ffffff';

                context.beginPath();

                context.moveTo(plugin.settings.size / 2, 40);
                context.lineTo(plugin.settings.size / 2 - 10, 0);
                context.lineTo(plugin.settings.size / 2 + 10, 0);
                context.closePath();

                context.stroke();
                context.fill();
            };
        

        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)

        var bankruptFormat = function(context) {
            context.lineWidth = 1;
            context.fillStyle = '#FFFFFF';
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.font = "1em Arial";
        };

        var easeOutCubic = function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
        };

        // call the "constructor" method
        init();

    }

})(jQuery);