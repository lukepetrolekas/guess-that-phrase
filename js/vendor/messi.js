/*
 * jQuery Messi Plugin 1.3
 * http://marcosesperon.es/apps/messi/
 *
 * Copyright 2012, Marcos Esperón
 * http://marcosesperon.es
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
function Messi(e, t) {
    var n = this;
    n.options = jQuery.extend({}, Messi.prototype.options, t || {});
    n.messi = jQuery(n.template);
    n.setContent(e);
    if (n.options.title == null) {
        jQuery(".messi-titlebox", n.messi).remove()
    } else {
        jQuery(".messi-title", n.messi).append(n.options.title);
        if (n.options.buttons.length === 0 && !n.options.autoclose) {
            if (n.options.closeButton) {
                var r = jQuery('<span class="messi-closebtn"></span>');
                r.bind("click", function () {
                    n.hide()
                });
                jQuery(".messi-titlebox", this.messi).prepend(r)
            }
        }
        if (n.options.titleClass != null) jQuery(".messi-titlebox", this.messi).addClass(n.options.titleClass)
    } if (n.options.width != null) jQuery(".messi-box", n.messi).css("width", n.options.width);
    if (n.options.buttons.length > 0) {
        for (var i = 0; i < n.options.buttons.length; i++) {
            var s = n.options.buttons[i]["class"] ? n.options.buttons[i]["class"] : "";
            var o = jQuery('<div class="btnbox"><button class="btn ' + s + '" href="#">' + n.options.buttons[i].label + "</button></div>").data("value", n.options.buttons[i].val);
            o.bind("click", function () {
                var e = jQuery.data(this, "value");
                var t = n.options.callback != null ? function () {
                    n.options.callback(e)
                } : null;
                n.hide(t)
            });
            jQuery(".messi-actions", this.messi).append(o)
        }
    } else {
        jQuery(".messi-footbox", this.messi).remove()
    } if (n.options.buttons.length === 0 && n.options.title == null && !n.options.autoclose) {
        if (n.options.closeButton) {
            var r = jQuery('<span class="messi-closebtn"></span>');
            r.bind("click", function () {
                n.hide()
            });
            jQuery(".messi-content", this.messi).prepend(r)
        }
    }
    n.modal = n.options.modal ? jQuery('<div class="messi-modal"></div>').css({
        opacity: n.options.modalOpacity,
        width: jQuery(document).width(),
        height: jQuery(document).height(),
        "z-index": n.options.zIndex + jQuery(".messi").length
    }).appendTo(document.body) : null;
    if (n.options.show) n.show();
    jQuery(window).bind("resize", function () {
        n.resize()
    });
    if (n.options.autoclose != null) {
        setTimeout(function (e) {
            e.hide()
        }, n.options.autoclose, this)
    }
    return n
}
Messi.prototype = {
    options: {
        autoclose: null,
        buttons: [],
        callback: null,
        center: true,
        closeButton: true,
        height: "auto",
        title: null,
        titleClass: null,
        modal: false,
        modalOpacity: .2,
        padding: "10px",
        show: true,
        unload: true,
        viewport: {
            top: "0px",
            left: "0px"
        },
        width: "500px",
        zIndex: 99999
    },
    template: '<div class="messi"><div class="messi-box"><div class="messi-wrapper"><div class="messi-titlebox"><span class="messi-title"></span></div><div class="messi-content"></div><div class="messi-footbox"><div class="messi-actions"></div></div></div></div></div>',
    content: "<div></div>",
    visible: false,
    setContent: function (e) {
        jQuery(".messi-content", this.messi).css({
            padding: this.options.padding,
            height: this.options.height
        }).empty().append(e)
    },
    viewport: function () {
        return {
            top: (jQuery(window).height() - this.messi.height()) / 2 + jQuery(window).scrollTop() + "px",
            left: (jQuery(window).width() - this.messi.width()) / 2 + jQuery(window).scrollLeft() + "px"
        }
    },
    show: function () {
        if (this.visible) return;
        if (this.options.modal && this.modal != null) this.modal.show();
        this.messi.appendTo(document.body);
        if (this.options.center) this.options.viewport = this.viewport(jQuery(".messi-box", this.messi));
        this.messi.css({
            top: this.options.viewport.top,
            left: this.options.viewport.left,
            "z-index": this.options.zIndex + jQuery(".messi").length
        }).show().animate({
            opacity: 1
        }, 300);
        this.visible = true
    },
    hide: function (e) {
        /////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// BEGIN MODIFIED CODE ////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        
        // if there is a form inside the Messi message, we should process it
        if (($("form").length == 1) && ($("form").attr("id") == "phrase_input")){

            // let's store the phrases and their associated hints
            for (var count = 1; count <= GTP.ruleset.ROUNDS; count++) {

                // Parsley check
                var parsleyValidateResult = $('#phrase'+count).parsley().isValid();
                if ((typeof parsleyValidateResult == "boolean" 
                        && parsleyValidateResult == false) || 
                    (typeof parsleyValidateResult == "object"
                        && parsleyValidateResult.length != 0)) {
                    return;
                }

                // it looks like our phrase passes the Parsley validation 
                // let's sanitize the phrases and hints...
                var phrase = document.forms["phrase_input"]["phrase"+count].value;
                phrase = phrase.toUpperCase();
                phrase = phrase.trim();

                var hint = document.forms["phrase_input"]["hint"+count].value;
                hint = hint.toUpperCase();
                hint = hint.trim();

                // ... and add them to our arrays
                phrases.push(phrase);
                hints.push(hint);
            }
        }

        // if there is a form inside the Messi message, we should process it
        if (($("form").length == 1) && ($("form").attr("id") == "player_name_input_form")){

            // let's store the phrases and their associated hints
            for (var count = 1; count <= GTP.ruleset.PLAYERS; count++) {

                // let's sanitize the phrases and hints...
                var player = document.forms["player_name_input_form"]["player"+count].value;
                player = player.trim();

                // ... and add them to our arrays
                scorebd.setPlayerName(count-1, player);
            }
        }

        /////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////// END MODIFIED CODE /////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        if (!this.visible) return;
        var t = this;
        this.messi.animate({
            opacity: 0
        }, 300, function () {
            if (t.options.modal && t.modal != null) t.modal.remove();
            t.messi.css({
                display: "none"
            }).remove();
            t.visible = false;
            if (e) e.call();
            if (t.options.unload) t.unload()
        });
        return this
    },
    resize: function () {
        if (this.options.modal) {
            jQuery(".messi-modal").css({
                width: jQuery(document).width(),
                height: jQuery(document).height()
            })
        }
        if (this.options.center) {
            this.options.viewport = this.viewport(jQuery(".messi-box", this.messi));
            this.messi.css({
                top: this.options.viewport.top,
                left: this.options.viewport.left
            })
        }
    },
    toggle: function () {
        this[this.visible ? "hide" : "show"]();
        return this
    },
    unload: function () {
        if (this.visible) this.hide();
        jQuery(window).unbind("resize", function () {
            this.resize()
        });
        this.messi.remove()
    }
};
jQuery.extend(Messi, {
    alert: function (e, t, n) {
        var r = [{
            id: "ok",
            label: "OK",
            val: "OK"
        }];
        n = jQuery.extend({
            closeButton: false,
            buttons: r,
            callback: function () {}
        }, n || {}, {
            show: true,
            unload: true,
            callback: t
        });
        return new Messi(e, n)
    },
    ask: function (e, t, n) {
        var r = [{
            id: "yes",
            label: "Yes",
            val: "Y",
            "class": "btn-success"
        }, {
            id: "no",
            label: "No",
            val: "N",
            "class": "btn-danger"
        }];
        n = jQuery.extend({
            closeButton: false,
            modal: true,
            buttons: r,
            callback: function () {}
        }, n || {}, {
            show: true,
            unload: true,
            callback: t
        });
        return new Messi(e, n)
    },
    img: function (e, t) {
        var n = new Image;
        jQuery(n).load(function () {
            var e = {
                width: jQuery(window).width() - 50,
                height: jQuery(window).height() - 50
            };
            var r = this.width > e.width || this.height > e.height ? Math.min(e.width / this.width, e.height / this.height) : 1;
            jQuery(n).css({
                width: this.width * r,
                height: this.height * r
            });
            t = jQuery.extend(t || {}, {
                show: true,
                unload: true,
                closeButton: true,
                width: this.width * r,
                height: this.height * r,
                padding: 0
            });
            new Messi(n, t)
        }).error(function () {
            console.log("Error loading " + e)
        }).attr("src", e)
    },
    load: function (e, t) {
        t = jQuery.extend(t || {}, {
            show: true,
            unload: true,
            params: {}
        });
        var n = {
            url: e,
            data: t.params,
            dataType: "html",
            cache: false,
            error: function (e, t, n) {
                console.log(e.responseText)
            },
            success: function (e) {
                new Messi(e, t)
            }
        };
        jQuery.ajax(n)
    }
});