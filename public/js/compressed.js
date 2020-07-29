function init() {
    if (document.body) {
        var e = document.body,
            t = document.documentElement,
            i = window.innerHeight,
            n = e.scrollHeight;
        if (((root = document.compatMode.indexOf("CSS") >= 0 ? t : e), (activeElement = e), (initdone = !0), top != self)) frame = !0;
        else if (n > i && (e.offsetHeight <= i || t.offsetHeight <= i)) {
            var o = !1,
                r = function () {
                    o ||
                    t.scrollHeight == document.height ||
                    ((o = !0),
                        setTimeout(function () {
                            (t.style.height = document.height + "px"), (o = !1);
                        }, 500));
                };
            if (((t.style.height = ""), setTimeout(r, 10), addEvent("DOMNodeInserted", r), addEvent("DOMNodeRemoved", r), root.offsetHeight <= i)) {
                var s = document.createElement("div");
                (s.style.clear = "both"), e.appendChild(s);
            }
        }
        if (document.URL.indexOf("mail.google.com") > -1) {
            var a = document.createElement("style");
            (a.innerHTML = ".iu { visibility: hidden }"), (document.getElementsByTagName("head")[0] || t).appendChild(a);
        }
        fixedback || disabled || ((e.style.backgroundAttachment = "scroll"), (t.style.backgroundAttachment = "scroll"));
    }
}

function scrollArray(e, t, i, n) {
    if ((n || (n = 1e3), directionCheck(t, i), acceleration)) {
        var o = +new Date() - lastScroll;
        if (o < accelDelta) {
            var r = (1 + 30 / o) / 2;
            r > 1 && ((r = Math.min(r, accelMax)), (t *= r), (i *= r));
        }
        lastScroll = +new Date();
    }
    if ((que.push({
        x: t,
        y: i,
        lastX: t < 0 ? 0.99 : -0.99,
        lastY: i < 0 ? 0.99 : -0.99,
        start: +new Date()
    }), !pending)) {
        var s = e === document.body,
            a = function () {
                for (var o = +new Date(), r = 0, l = 0, c = 0; c < que.length; c++) {
                    var u = que[c],
                        d = o - u.start,
                        p = d >= animtime,
                        h = p ? 1 : d / animtime;
                    pulseAlgorithm && (h = pulse(h));
                    var f = (u.x * h - u.lastX) >> 0,
                        m = (u.y * h - u.lastY) >> 0;
                    (r += f), (l += m), (u.lastX += f), (u.lastY += m), p && (que.splice(c, 1), c--);
                }
                s ? window.scrollBy(r, l) : (r && (e.scrollLeft += r), l && (e.scrollTop += l)), t || i || (que = []), que.length ? requestFrame(a, e, n / framerate + 1) : (pending = !1);
            };
        requestFrame(a, e, 0), (pending = !0);
    }
}

function wheel(e) {
    initdone || init();
    var t = e.target,
        i = overflowingAncestor(t);
    if (!i || e.defaultPrevented || isNodeName(activeElement, "embed") || (isNodeName(t, "embed") && /\.pdf/i.test(t.src))) return !0;
    var n = e.wheelDeltaX || 0,
        o = e.wheelDeltaY || 0;
    n || o || (o = e.wheelDelta || 0), Math.abs(n) > 1.2 && (n *= stepsize / 120), Math.abs(o) > 1.2 && (o *= stepsize / 120), scrollArray(i, -n, -o), e.preventDefault();
}

function keydown(e) {
    var t = e.target,
        i = e.ctrlKey || e.altKey || e.metaKey || (e.shiftKey && e.keyCode !== key.spacebar);
    if (/input|textarea|select|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || i) return !0;
    if (isNodeName(t, "button") && e.keyCode === key.spacebar) return !0;
    var n = 0,
        o = 0,
        r = overflowingAncestor(activeElement),
        s = r.clientHeight;
    switch ((r == document.body && (s = window.innerHeight), e.keyCode)) {
        case key.up:
            o = -arrowscroll;
            break;
        case key.down:
            o = arrowscroll;
            break;
        case key.spacebar:
            o = -(e.shiftKey ? 1 : -1) * s * 0.9;
            break;
        case key.pageup:
            o = 0.9 * -s;
            break;
        case key.pagedown:
            o = 0.9 * s;
            break;
        case key.home:
            o = -r.scrollTop;
            break;
        case key.end:
            var a = r.scrollHeight - r.scrollTop - s;
            o = a > 0 ? a + 10 : 0;
            break;
        case key.left:
            n = -arrowscroll;
            break;
        case key.right:
            n = arrowscroll;
            break;
        default:
            return !0;
    }
    scrollArray(r, n, o), e.preventDefault();
}

function mousedown(e) {
    activeElement = e.target;
}

function setCache(e, t) {
    for (var i = e.length; i--;) cache[uniqueID(e[i])] = t;
    return t;
}

function overflowingAncestor(e) {
    var t = [],
        i = root.scrollHeight;
    do {
        var n = cache[uniqueID(e)];
        if (n) return setCache(t, n);
        if ((t.push(e), i === e.scrollHeight)) {
            if (!frame || root.clientHeight + 10 < i) return setCache(t, document.body);
        } else if (e.clientHeight + 10 < e.scrollHeight && ((overflow = getComputedStyle(e, "").getPropertyValue("overflow-y")), "scroll" === overflow || "auto" === overflow)) return setCache(t, e);
    } while ((e = e.parentNode));
}

function addEvent(e, t, i) {
    window.addEventListener(e, t, i || !1);
}

function removeEvent(e, t, i) {
    window.removeEventListener(e, t, i || !1);
}

function isNodeName(e, t) {
    return (e.nodeName || "").toLowerCase() === t.toLowerCase();
}

function directionCheck(e, t) {
    (e = e > 0 ? 1 : -1), (t = t > 0 ? 1 : -1), (direction.x === e && direction.y === t) || ((direction.x = e), (direction.y = t), (que = []), (lastScroll = 0));
}

function pulse_(e) {
    var t, i;
    return (e *= pulseScale) < 1 ? (t = e - (1 - Math.exp(-e))) : ((e -= 1), (t = (i = Math.exp(-1)) + (1 - Math.exp(-e)) * (1 - i))), t * pulseNormalize;
}

function pulse(e) {
    return e >= 1 ? 1 : e <= 0 ? 0 : (1 == pulseNormalize && (pulseNormalize /= pulse_(1)), pulse_(e));
}

function initOutdoor() {
    "use strict";

    function a() {
        $(" .fullheight-carousel .item").css({height: $(".fullheight-carousel").outerHeight(!0)}),
            $(".hero-slider .item").css({height: $(".hero-slider").outerHeight(!0)}),
            $(".slideshow-item .item").css({height: $(".slideshow-item ").outerHeight(!0)}),
            $("#content-sidebar").css({top: $("header").outerHeight(!0)}),
            $(".cdc").css({"margin-top": (-1 * $(".cdc").height()) / 2 + "px"});
        var e = $(window).height(),
            t = $("header").outerHeight(),
            i = $("footer").outerHeight(),
            n = $(".port-subtitle-holder").outerHeight();
        $(".p_horizontal_wrap").css("height", e - t - i),
            $(" #portfolio_horizontal_container .portfolio_item img , .port-desc-holder").css({height: $(".p_horizontal_wrap").outerHeight(!0) - n}),
            $(".mm").css({"padding-top": $("header").outerHeight(!0)});
    }

    function d() {
        var e = document.querySelectorAll(".intense");
        Intense(e);
    }

    function n() {
        if ($(".gallery-items").length) {
            var e = $(".gallery-items").isotope({
                singleMode: !0,
                columnWidth: ".grid-sizer, .grid-sizer-second, .grid-sizer-three",
                itemSelector: ".gallery-item, .gallery-item-second, .gallery-item-three",
                transformsEnabled: !0,
                transitionDuration: "700ms",
            });
            e.imagesLoaded(function () {
                e.isotope("layout");
            }),
                $(".gallery-filters").on("click", "a.gallery-filter", function (t) {
                    t.preventDefault();
                    var i = $(this).attr("data-filter");
                    return e.isotope({filter: i}), $(".gallery-filters a.gallery-filter").removeClass("gallery-filter-active"), $(this).addClass("gallery-filter-active"), !1;
                }),
                e.isotope("on", "layoutComplete", function (e, t) {
                    var i = t.length;
                    $(".num-album").html(i);
                });
        }
        var t = {
            touchbehavior: !0,
            cursoropacitymax: 1,
            cursorborderradius: "0",
            background: "#eee",
            cursorwidth: "10px",
            cursorborder: "0px",
            cursorcolor: "#292929",
            autohidemode: !1,
            bouncescroll: !1,
            scrollspeed: 120,
            mousescrollstep: 90,
            grabcursorenabled: !0,
            horizrailenabled: !0,
            preservenativescrolling: !0,
            cursordragontouch: !0,
            railpadding: {top: -15, right: 0, left: 0, bottom: 0},
        };
        $(".p_horizontal_wrap").niceScroll(t);
        var i = $("#portfolio_horizontal_container");
        i.imagesLoaded(function (e, n, o) {
            $(window).width() < 768
                ? (i.isotope({ itemSelector: ".portfolio_item", layoutMode: "packery", packery: { isHorizontal: !1, gutter: 0 }, resizable: !0, transformsEnabled: !0, transitionDuration: "700ms" }),
                    i.isotope("layout"),
                $(".p_horizontal_wrap").getNiceScroll() && $(".p_horizontal_wrap").getNiceScroll().remove())
                : (i.isotope({ itemSelector: ".portfolio_item", layoutMode: "packery", packery: { isHorizontal: !0, gutter: 0 }, resizable: !0, transformsEnabled: !0, transitionDuration: "700ms" }),
                    i.isotope("layout"),
                    $(".p_horizontal_wrap").niceScroll(t)),
                $(".gallery-filters").on("click", "a", function (e) {
                    e.preventDefault();
                    var t = $(this).attr("data-filter");
                    i.isotope({ filter: t }), $(".gallery-filters a").removeClass("gallery-filter_active"), $(this).addClass("gallery-filter_active");
                }),
                i.isotope("on", "layoutComplete", function (e, t) {
                    var i = t.length;
                    $(".num-album").html(i);
                });
        });
    }

    function showHidDes() {
        $(".show-hid-content").removeClass("ishid"), $(".hidden-column").animate({
            left: "50px",
            opacity: 1
        }, 500), $(".anim-holder").animate({left: "450px"}, 500);
    }

    function hideHidDes() {
        $(".show-hid-content").addClass("ishid"), $(".hidden-column").animate({
            left: "-450px",
            opacity: 0
        }, 500), $(".anim-holder").animate({left: "0"}, 500);
    }

    function initGalleryhorizontal() {
        var e = $(window).height(),
            t = $("header").outerHeight(),
            i = $("footer").outerHeight();
        $("#gallery_horizontal")
            .find("img")
            .css("height", e - t - i),
        gR.find(".owl-stage-outer").length && (gR.trigger("destroy.owl.carousel"), gR.find(".horizontal_item").unwrap()),
        w.width() > 1036 &&
        gR.owlCarousel({
            autoWidth: !0,
            margin: 10,
            items: 3,
            smartSpeed: 1300,
            loop: !0,
            nav: !1,
            dots: !1,
            onInitialized: function () {
                gR.find(".owl-stage").css({height: e - t - i, overflow: "hidden"});
            },
        });
    }

    function number(e, t, i, n) {
        if (n)
            var o = 0,
                r = parseInt(n / e),
                s = setInterval(function () {
                    o - 1 < e ? i.html(o) : (i.html(t), clearInterval(s)), o++;
                }, r);
        else i.html(t);
    }

    function stats(e) {
        $(".stats .num").each(function () {
            var t = $(this);
            number(t.attr("data-num"), t.attr("data-content"), t, e);
        });
    }

    function hideShare() {
        $(".show-share").addClass("isShare"),
            $(".share-container a").each(function (e) {
                var t = $(this);
                setTimeout(function () {
                    t.animate({opacity: 0}, 500);
                }, 120 * e);
            }),
            setTimeout(function () {
                $(".share-container ").removeClass("visshare");
            }, 400);
    }

    function showShare() {
        $(".show-share").removeClass("isShare"),
            $(".share-container ").addClass("visshare"),
            setTimeout(function () {
                $(".share-container a").each(function (e) {
                    var t = $(this);
                    setTimeout(function () {
                        t.animate({opacity: 1}, 500);
                    }, 120 * e);
                });
            }, 400);
    }

    function showMenu() {
        nb.removeClass("vis-m"), nh.slideDown(500);
    }

    function hideMenu() {
        nb.addClass("vis-m"), nh.slideUp(500);
    }

    $(window).load(function () {
        $(".loader").fadeOut(500, function () {
            $("#main").animate({opacity: "1"});
        }),
            initgalheight();
    }),
        initgalheight(),
        $(".hero-title , .team-social , .srtp ul , .slide-title , .scroll-page-nav , .count-folio").addClass("cdc"),
        a(),
        $(window).resize(function () {
            a();
        }),
        $(".show-hidden-info").on("click", function () {
            $(this).toggleClass("vhi"), $(this).closest(".resume-box").find(".hidden-info").slideToggle(500);
        }),
        d();
    var e = $("#horizontal-slider").data("mwc"),
        ec = $("#horizontal-slider").data("mwa"),
        f = new Swiper("#horizontal-slider", {
            speed: 1200,
            loop: !1,
            preventLinks: !0,
            grabCursor: !0,
            mousewheelControl: e,
            mode: "horizontal",
            pagination: ".pagination",
            paginationClickable: !0,
            autoplay: ec
        });
    $(".hor a.arrow-left").on("click", function (e) {
        e.preventDefault(), f.swipePrev();
    }),
        $(".hor a.arrow-right").on("click", function (e) {
            e.preventDefault(), f.swipeNext();
        }),
        $(".image-popup").magnificPopup({
            type: "image",
            closeOnContentClick: !1,
            removalDelay: 600,
            mainClass: "my-mfp-slide-bottom",
            image: {verticalFit: !1}
        }),
        $(".popup-youtube, .popup-vimeo , .show-map").magnificPopup({
            disableOn: 700,
            type: "iframe",
            removalDelay: 600,
            mainClass: "my-mfp-slide-bottom"
        }),
        $(".popup-gallery").magnificPopup({
            delegate: "a",
            type: "image",
            fixedContentPos: !0,
            fixedBgPos: !0,
            tLoading: "Wczytywanie zdjęcia #%curr%...",
            removalDelay: 600,
            closeBtnInside: !0,
            zoom: {enabled: !0, duration: 700},
            gallery: {enabled: !0, navigateByImgClick: !0, preload: [0, 1]},
            image: {tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'},
        }),
        $(".hide-column").bind("click", function () {
            $(".not-vis-column").animate({right: "-100%"}, 500);
        }),
        $(".show-info").bind("click", function () {
            $(".not-vis-column").animate({right: "0"}, 500);
        });
    var b = $(".full-width");
    b.owlCarousel({navigation: !1, slideSpeed: 500, singleItem: !0, pagination: !0}),
        $(".fullwidth-slider-holder a.next-slide").on("click", function () {
            $(this).closest(".fullwidth-slider-holder").find(b).trigger("owl.next");
        }),
        $(".fullwidth-slider-holder  a.prev-slide").on("click", function () {
            $(this).closest(".fullwidth-slider-holder").find(b).trigger("owl.prev");
        });
    var heroslides = $(".hero-slider"),
        synksldes = $(".hero-slider.synkslider");
    heroslides.each(function (index) {
        var auttime = eval($(this).data("attime")),
            rtlt = eval($(this).data("rtlt"));
        $(this).owlCarousel({
            items: 1,
            loop: !0,
            margin: 0,
            autoplay: !0,
            autoplayTimeout: auttime,
            autoplayHoverPause: !1,
            autoplaySpeed: 1600,
            rtl: rtlt
        });
    }),
        synksldes.on("change.owl.carousel", function (e) {
            synkslider2.trigger("to.owl.carousel", [e.item.index, 10, !0]);
        });
    var auttime2 = $(".hero-text").data("attime"),
        synkslider2 = $(".hero-text");
    synkslider2.owlCarousel({
        loop: !0,
        margin: 0,
        nav: !1,
        items: 1,
        dots: !1,
        animateOut: "fadeOut",
        startPosition: 1,
        autoHeight: !0,
        autoplay: !0,
        autoplayTimeout: auttime2,
        autoplayHoverPause: !1,
        autoplaySpeed: 1600
    });
    var customSlider = $(".custom-slider");
    customSlider.owlCarousel({loop: !0, margin: 0, nav: !1, items: 1}),
        $(".custom-slider-holder a.next-slide").on("click", function () {
            $(this).closest(".custom-slider-holder").find(customSlider).trigger("next.owl.carousel");
        }),
        $(".custom-slider-holder a.prev-slide").on("click", function () {
            $(this).closest(".custom-slider-holder").find(customSlider).trigger("prev.owl.carousel");
        });
    var slsl = $(".slideshow-item");
    slsl.owlCarousel({
        loop: !0,
        margin: 0,
        nav: !1,
        items: 1,
        animateOut: "fadeOut",
        animateIn: "fadeIn",
        autoplay: !0,
        autoplayTimeout: 4e3,
        autoplayHoverPause: !1,
        autoplaySpeed: 3600
    });
    var testiSlider = $(".testimonials-slider");
    testiSlider.owlCarousel({loop: !0, margin: 0, nav: !1, items: 1, dots: !0}),
        $(".testimonials-slider-holder a.next-slide").on("click", function () {
            $(this).closest(".testimonials-slider-holder").find(testiSlider).trigger("next.owl.carousel");
        }),
        $(".testimonials-slider-holder a.prev-slide").on("click", function () {
            $(this).closest(".testimonials-slider-holder").find(testiSlider).trigger("prev.owl.carousel");
        }),
        $(".servicses-holder li").hover(function () {
            var e = $(this).data("bgscr");
            $(".bg-ser").css("background-image", "url(" + e + ")");
        }),
        $(".scroll-page-nav  ul").singlePageNav({
            filter: ":not(.external)",
            updateHash: !1,
            offset: 70,
            threshold: 120,
            speed: 1200,
            currentClass: "act-link"
        });
    var j = $(".portfolio_item , .gallery-item").length;
    $(".all-album , .num-album").html(j),
        n(),
        $(window).load(function () {
            n();
        }),
        $(".portfolio_item a").on("click", function () {
            var e = $(this).attr("href");
            return (window.location.href = e), !1;
        }),
        $(".filter-button").on("click", function () {
            $(".hid-filter").slideToggle(500), $(".filter-button i").toggleClass("roticon");
        }),
        $("#contactform").submit(function () {
            var e = $(this).attr("action");
            return (
                $("#message").slideUp(750, function () {
                    $("#message").hide(),
                        $("#submit").attr("disabled", "disabled"),
                        $.post(e, {
                            name: $("#name").val(),
                            email: $("#email").val(),
                            comments: $("#comments").val()
                        }, function (e) {
                            (document.getElementById("message").innerHTML = e), $("#message").slideDown("slow"), $("#submit").removeAttr("disabled"), null != e.match("success") && $("#contactform").slideDown("slow");
                        });
                }),
                    !1
            );
        }),
        $("#contactform input, #contactform textarea").keyup(function () {
            $("#message").slideUp(1500);
        }),
        $(".show-hid-content").on("click", function () {
            $(this).hasClass("ishid") ? showHidDes() : hideHidDes();
        }),
        $(window).scroll(function () {
            $(this).scrollTop() > 300 ? $(".to-top").addClass("vistotop") : $(".to-top").removeClass("vistotop");
        }),
        $(".to-top").on("click", function () {
            $("html, body").animate({scrollTop: 0}, "slow");
        }),
        $(".custom-scroll-link").on("click", function () {
            if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") || location.hostname == this.hostname) {
                var e = $(this.hash);
                if ((e = e.length ? e : $("[name=" + this.hash.slice(1) + "]")).length) return $("html,body").animate({scrollTop: e.offset().top - 70}, {
                    queue: !1,
                    duration: 1200,
                    easing: "easeInOutExpo"
                }), !1;
            }
        }),
        $(".fix-box").scrollToFixed({marginTop: 90, minWidth: 1036});
    var gR = $(".gallery_horizontal"),
        w = $(window);
    gR.length &&
    (initGalleryhorizontal(),
        w.on("resize.destroyhorizontal", function () {
            setTimeout(initGalleryhorizontal, 150);
        })),
        gR.on("mousewheel", ".owl-stage", function (e) {
            e.deltaY < 0 ? gR.trigger("next.owl") : gR.trigger("prev.owl"), e.preventDefault();
        }),
        $(".resize-carousel-holder a.next-slide").on("click", function () {
            $(this).closest(".resize-carousel-holder").find(gR).trigger("next.owl.carousel");
        }),
        $(".resize-carousel-holder a.prev-slide").on("click", function () {
            $(this).closest(".resize-carousel-holder").find(gR).trigger("prev.owl.carousel");
        }),
        $(".team-box").hover(
            function () {
                $(this).find("ul.team-social").fadeIn(),
                    $(this)
                        .find(".team-social a")
                        .each(function (e) {
                            var t = $(this);
                            setTimeout(function () {
                                t.animate({opacity: 1, top: "0"}, 400);
                            }, 150 * e);
                        });
            },
            function () {
                $(this)
                    .find(".team-social a")
                    .each(function (e) {
                        var t = $(this);
                        setTimeout(function () {
                            t.animate({opacity: 0, top: "50px"}, 400);
                        }, 150 * e);
                    }),
                    setTimeout(function () {
                        $(this).find("ul.team-social").fadeOut();
                    }, 150);
            }
        );
    var $i = 1;
    $(document.body).on("appear", ".stats", function (e) {
        1 === $i && stats(2600), $i++;
    }),
        $(".animaper").appear();
    var l = $(".background-video").data("vid"),
        m = $(".background-video").data("mv");
    $(".background-video").YTPlayer({
        fitToBackground: !0,
        videoId: l,
        pauseOnScroll: !0,
        mute: m,
        callback: function () {
            $(".background-video").data("ytPlayer").player;
        },
    });
    var shs = eval($(".share-container").attr("data-share"));
    $(".share-container").share({networks: shs}),
        $(".show-share").on("click", function (e) {
            e.preventDefault(), $(".show-share").hasClass("isShare") ? showShare() : hideShare();
        });
    var nb = $(".nav-button"),
        nh = $(".nav-holder"),
        an = $(".nav-holder ,.nav-button ");
    nb.on("click", function () {
        $(this).hasClass("vis-m") ? showMenu() : hideMenu();
    });
}

function initparallax() {
    var e = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return e.Android() || e.BlackBerry() || e.iOS() || e.Opera() || e.Windows();
        },
    };
    if (((trueMobile = e.any()), null == trueMobile)) {
        var t = $(".content");
        t.find("[data-top-bottom]").length > 0 &&
        t.waitForImages(function () {
            (s = skrollr.init()),
                s.destroy(),
                skrollr.init({
                    forceHeight: !1,
                    easing: "outCubic",
                    mobileCheck: function () {
                        return !1;
                    },
                });
        });
    }
    trueMobile && $(".background-video").remove();
}

function initgalheight() {
    var e = $(window).height(),
        t = $("header").outerHeight(),
        i = $("footer").outerHeight(),
        n = $(".port-subtitle-holder").outerHeight();
    $(".p_horizontal_wrap").css("height", e - t - i), $(" #portfolio_horizontal_container .portfolio_item img , .port-desc-holder").css({height: $(".p_horizontal_wrap").outerHeight(!0) - n});
}

!(function (e, t) {
    "object" == typeof module && "object" == typeof module.exports
        ? (module.exports = e.document
        ? t(e, !0)
        : function (e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return t(e);
        })
        : t(e);
})("undefined" != typeof window ? window : this, function (e, t) {
    function i(e) {
        var t = e.length,
            i = G.type(e);
        return "function" !== i && !G.isWindow(e) && (!(1 !== e.nodeType || !t) || "array" === i || 0 === t || ("number" == typeof t && t > 0 && t - 1 in e));
    }

    function n(e, t, i) {
        if (G.isFunction(t))
            return G.grep(e, function (e, n) {
                return !!t.call(e, n, e) !== i;
            });
        if (t.nodeType)
            return G.grep(e, function (e) {
                return (e === t) !== i;
            });
        if ("string" == typeof t) {
            if (ie.test(t)) return G.filter(t, e, i);
            t = G.filter(t, e);
        }
        return G.grep(e, function (e) {
            return j.call(t, e) >= 0 !== i;
        });
    }

    function o(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType;) ;
        return e;
    }

    function r() {
        X.removeEventListener("DOMContentLoaded", r, !1), e.removeEventListener("load", r, !1), G.ready();
    }

    function s() {
        Object.defineProperty((this.cache = {}), 0, {
            get: function () {
                return {};
            },
        }),
            (this.expando = G.expando + s.uid++);
    }

    function a(e, t, i) {
        var n;
        if (void 0 === i && 1 === e.nodeType)
            if (((n = "data-" + t.replace(fe, "-$1").toLowerCase()), "string" == typeof (i = e.getAttribute(n)))) {
                try {
                    i = "true" === i || ("false" !== i && ("null" === i ? null : +i + "" === i ? +i : he.test(i) ? G.parseJSON(i) : i));
                } catch (e) {
                }
                pe.set(e, t, i);
            } else i = void 0;
        return i;
    }

    function l() {
        return !0;
    }

    function c() {
        return !1;
    }

    function u() {
        try {
            return X.activeElement;
        } catch (e) {
        }
    }

    function d(e, t) {
        return G.nodeName(e, "table") && G.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e;
    }

    function p(e) {
        return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
    }

    function h(e) {
        var t = Me.exec(e.type);
        return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
    }

    function f(e, t) {
        for (var i = 0, n = e.length; n > i; i++) de.set(e[i], "globalEval", !t || de.get(t[i], "globalEval"));
    }

    function m(e, t) {
        var i, n, o, r, s, a, l, c;
        if (1 === t.nodeType) {
            if (de.hasData(e) && ((r = de.access(e)), (s = de.set(t, r)), (c = r.events))) for (o in (delete s.handle, (s.events = {}), c)) for (i = 0, n = c[o].length; n > i; i++) G.event.add(t, o, c[o][i]);
            pe.hasData(e) && ((a = pe.access(e)), (l = G.extend({}, a)), pe.set(t, l));
        }
    }

    function g(e, t) {
        var i = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || (t && G.nodeName(e, t)) ? G.merge([e], i) : i;
    }

    function v(e, t) {
        var i = t.nodeName.toLowerCase();
        "input" === i && ye.test(e.type) ? (t.checked = e.checked) : ("input" === i || "textarea" === i) && (t.defaultValue = e.defaultValue);
    }

    function y(t, i) {
        var n,
            o = G(i.createElement(t)).appendTo(i.body),
            r = e.getDefaultComputedStyle && (n = e.getDefaultComputedStyle(o[0])) ? n.display : G.css(o[0], "display");
        return o.detach(), r;
    }

    function w(e) {
        var t = X,
            i = Oe[e];
        return (
            i || (("none" !== (i = y(e, t)) && i) || ((t = (De = (De || G("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentDocument).write(), t.close(), (i = y(e, t)), De.detach()), (Oe[e] = i)), i
        );
    }

    function x(e, t, i) {
        var n,
            o,
            r,
            s,
            a = e.style;
        return (
            (i = i || Ne(e)) && (s = i.getPropertyValue(t) || i[t]),
            i &&
            ("" !== s || G.contains(e.ownerDocument, e) || (s = G.style(e, t)),
            $e.test(s) && Ae.test(t) && ((n = a.width), (o = a.minWidth), (r = a.maxWidth), (a.minWidth = a.maxWidth = a.width = s), (s = i.width), (a.width = n), (a.minWidth = o), (a.maxWidth = r))),
                void 0 !== s ? s + "" : s
        );
    }

    function b(e, t) {
        return {
            get: function () {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments);
            },
        };
    }

    function T(e, t) {
        if (t in e) return t;
        for (var i = t[0].toUpperCase() + t.slice(1), n = t, o = Be.length; o--;) if ((t = Be[o] + i) in e) return t;
        return n;
    }

    function S(e, t, i) {
        var n = Fe.exec(t);
        return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : t;
    }

    function C(e, t, i, n, o) {
        for (var r = i === (n ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; 4 > r; r += 2)
            "margin" === i && (s += G.css(e, i + ge[r], !0, o)),
                n
                    ? ("content" === i && (s -= G.css(e, "padding" + ge[r], !0, o)), "margin" !== i && (s -= G.css(e, "border" + ge[r] + "Width", !0, o)))
                    : ((s += G.css(e, "padding" + ge[r], !0, o)), "padding" !== i && (s += G.css(e, "border" + ge[r] + "Width", !0, o)));
        return s;
    }

    function E(e, t, i) {
        var n = !0,
            o = "width" === t ? e.offsetWidth : e.offsetHeight,
            r = Ne(e),
            s = "border-box" === G.css(e, "boxSizing", !1, r);
        if (0 >= o || null == o) {
            if (((0 > (o = x(e, t, r)) || null == o) && (o = e.style[t]), $e.test(o))) return o;
            (n = s && (Y.boxSizingReliable() || o === e.style[t])), (o = parseFloat(o) || 0);
        }
        return o + C(e, t, i || (s ? "border" : "content"), n, r) + "px";
    }

    function k(e, t) {
        for (var i, n, o, r = [], s = 0, a = e.length; a > s; s++)
            (n = e[s]).style &&
            ((r[s] = de.get(n, "olddisplay")),
                (i = n.style.display),
                t
                    ? (r[s] || "none" !== i || (n.style.display = ""), "" === n.style.display && ve(n) && (r[s] = de.access(n, "olddisplay", w(n.nodeName))))
                    : ((o = ve(n)), ("none" === i && o) || de.set(n, "olddisplay", o ? i : G.css(n, "display"))));
        for (s = 0; a > s; s++) (n = e[s]).style && ((t && "none" !== n.style.display && "" !== n.style.display) || (n.style.display = t ? r[s] || "" : "none"));
        return e;
    }

    function _(e, t, i, n, o) {
        return new _.prototype.init(e, t, i, n, o);
    }

    function z() {
        return (
            setTimeout(function () {
                qe = void 0;
            }),
                (qe = G.now())
        );
    }

    function L(e, t) {
        var i,
            n = 0,
            o = {height: e};
        for (t = t ? 1 : 0; 4 > n; n += 2 - t) o["margin" + (i = ge[n])] = o["padding" + i] = e;
        return t && (o.opacity = o.width = e), o;
    }

    function M(e, t, i) {
        for (var n, o = (Qe[t] || []).concat(Qe["*"]), r = 0, s = o.length; s > r; r++) if ((n = o[r].call(i, t, e))) return n;
    }

    function I(e, t, i) {
        var n,
            o,
            r = 0,
            s = Ue.length,
            a = G.Deferred().always(function () {
                delete l.elem;
            }),
            l = function () {
                if (o) return !1;
                for (var t = qe || z(), i = Math.max(0, c.startTime + c.duration - t), n = 1 - (i / c.duration || 0), r = 0, s = c.tweens.length; s > r; r++) c.tweens[r].run(n);
                return a.notifyWith(e, [c, n, i]), 1 > n && s ? i : (a.resolveWith(e, [c]), !1);
            },
            c = a.promise({
                elem: e,
                props: G.extend({}, t),
                opts: G.extend(!0, {specialEasing: {}}, i),
                originalProperties: t,
                originalOptions: i,
                startTime: qe || z(),
                duration: i.duration,
                tweens: [],
                createTween: function (t, i) {
                    var n = G.Tween(e, c.opts, t, i, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(n), n;
                },
                stop: function (t) {
                    var i = 0,
                        n = t ? c.tweens.length : 0;
                    if (o) return this;
                    for (o = !0; n > i; i++) c.tweens[i].run(1);
                    return t ? a.resolveWith(e, [c, t]) : a.rejectWith(e, [c, t]), this;
                },
            }),
            u = c.props;
        for (
            (function (e, t) {
                var i, n, o, r, s;
                for (i in e)
                    if (((o = t[(n = G.camelCase(i))]), (r = e[i]), G.isArray(r) && ((o = r[1]), (r = e[i] = r[0])), i !== n && ((e[n] = r), delete e[i]), (s = G.cssHooks[n]) && ("expand" in s)))
                        for (i in ((r = s.expand(r)), delete e[n], r)) (i in e) || ((e[i] = r[i]), (t[i] = o));
                    else t[n] = o;
            })(u, c.opts.specialEasing);
            s > r;
            r++
        )
            if ((n = Ue[r].call(c, e, u, c.opts))) return n;
        return (
            G.map(u, M, c),
            G.isFunction(c.opts.start) && c.opts.start.call(e, c),
                G.fx.timer(G.extend(l, {elem: e, anim: c, queue: c.opts.queue})),
                c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
        );
    }

    function P(e) {
        return function (t, i) {
            "string" != typeof t && ((i = t), (t = "*"));
            var n,
                o = 0,
                r = t.toLowerCase().match(le) || [];
            if (G.isFunction(i)) for (; (n = r[o++]);) "+" === n[0] ? ((n = n.slice(1) || "*"), (e[n] = e[n] || []).unshift(i)) : (e[n] = e[n] || []).push(i);
        };
    }

    function D(e, t, i, n) {
        function o(a) {
            var l;
            return (
                (r[a] = !0),
                    G.each(e[a] || [], function (e, a) {
                        var c = a(t, i, n);
                        return "string" != typeof c || s || r[c] ? (s ? !(l = c) : void 0) : (t.dataTypes.unshift(c), o(c), !1);
                    }),
                    l
            );
        }

        var r = {},
            s = e === dt;
        return o(t.dataTypes[0]) || (!r["*"] && o("*"));
    }

    function O(e, t) {
        var i,
            n,
            o = G.ajaxSettings.flatOptions || {};
        for (i in t) void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
        return n && G.extend(!0, e, n), e;
    }

    function A(e, t, i, n) {
        var o;
        if (G.isArray(t))
            G.each(t, function (t, o) {
                i || gt.test(e) ? n(e, o) : A(e + "[" + ("object" == typeof o ? t : "") + "]", o, i, n);
            });
        else if (i || "object" !== G.type(t)) n(e, t);
        else for (o in t) A(e + "[" + o + "]", t[o], i, n);
    }

    function $(e) {
        return G.isWindow(e) ? e : 9 === e.nodeType && e.defaultView;
    }

    var N = [],
        R = N.slice,
        F = N.concat,
        H = N.push,
        j = N.indexOf,
        W = {},
        B = W.toString,
        q = W.hasOwnProperty,
        Y = {},
        X = e.document,
        V = "2.1.3",
        G = function (e, t) {
            return new G.fn.init(e, t);
        },
        U = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        Q = /^-ms-/,
        Z = /-([\da-z])/gi,
        K = function (e, t) {
            return t.toUpperCase();
        };
    (G.fn = G.prototype = {
        jquery: V,
        constructor: G,
        selector: "",
        length: 0,
        toArray: function () {
            return R.call(this);
        },
        get: function (e) {
            return null != e ? (0 > e ? this[e + this.length] : this[e]) : R.call(this);
        },
        pushStack: function (e) {
            var t = G.merge(this.constructor(), e);
            return (t.prevObject = this), (t.context = this.context), t;
        },
        each: function (e, t) {
            return G.each(this, e, t);
        },
        map: function (e) {
            return this.pushStack(
                G.map(this, function (t, i) {
                    return e.call(t, i, t);
                })
            );
        },
        slice: function () {
            return this.pushStack(R.apply(this, arguments));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        eq: function (e) {
            var t = this.length,
                i = +e + (0 > e ? t : 0);
            return this.pushStack(i >= 0 && t > i ? [this[i]] : []);
        },
        end: function () {
            return this.prevObject || this.constructor(null);
        },
        push: H,
        sort: N.sort,
        splice: N.splice,
    }),
        (G.extend = G.fn.extend = function () {
            var e,
                t,
                i,
                n,
                o,
                r,
                s = arguments[0] || {},
                a = 1,
                l = arguments.length,
                c = !1;
            for ("boolean" == typeof s && ((c = s), (s = arguments[a] || {}), a++), "object" == typeof s || G.isFunction(s) || (s = {}), a === l && ((s = this), a--); l > a; a++)
                if (null != (e = arguments[a]))
                    for (t in e)
                        (i = s[t]),
                        s !== (n = e[t]) &&
                        (c && n && (G.isPlainObject(n) || (o = G.isArray(n))) ? (o ? ((o = !1), (r = i && G.isArray(i) ? i : [])) : (r = i && G.isPlainObject(i) ? i : {}), (s[t] = G.extend(c, r, n))) : void 0 !== n && (s[t] = n));
            return s;
        }),
        G.extend({
            expando: "jQuery" + (V + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function (e) {
                throw new Error(e);
            },
            noop: function () {
            },
            isFunction: function (e) {
                return "function" === G.type(e);
            },
            isArray: Array.isArray,
            isWindow: function (e) {
                return null != e && e === e.window;
            },
            isNumeric: function (e) {
                return !G.isArray(e) && e - parseFloat(e) + 1 >= 0;
            },
            isPlainObject: function (e) {
                return !("object" !== G.type(e) || e.nodeType || G.isWindow(e) || (e.constructor && !q.call(e.constructor.prototype, "isPrototypeOf")));
            },
            isEmptyObject: function (e) {
                var t;
                for (t in e) return !1;
                return !0;
            },
            type: function (e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? W[B.call(e)] || "object" : typeof e;
            },
            globalEval: function (e) {
                var t,
                    i = eval;
                (e = G.trim(e)) && (1 === e.indexOf("use strict") ? (((t = X.createElement("script")).text = e), X.head.appendChild(t).parentNode.removeChild(t)) : i(e));
            },
            camelCase: function (e) {
                return e.replace(Q, "ms-").replace(Z, K);
            },
            nodeName: function (e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
            },
            each: function (e, t, n) {
                var o = 0,
                    r = e.length,
                    s = i(e);
                if (n) {
                    if (s) for (; r > o && !1 !== t.apply(e[o], n); o++) ;
                    else for (o in e) if (!1 === t.apply(e[o], n)) break;
                } else if (s) for (; r > o && !1 !== t.call(e[o], o, e[o]); o++) ;
                else for (o in e) if (!1 === t.call(e[o], o, e[o])) break;
                return e;
            },
            trim: function (e) {
                return null == e ? "" : (e + "").replace(U, "");
            },
            makeArray: function (e, t) {
                var n = t || [];
                return null != e && (i(Object(e)) ? G.merge(n, "string" == typeof e ? [e] : e) : H.call(n, e)), n;
            },
            inArray: function (e, t, i) {
                return null == t ? -1 : j.call(t, e, i);
            },
            merge: function (e, t) {
                for (var i = +t.length, n = 0, o = e.length; i > n; n++) e[o++] = t[n];
                return (e.length = o), e;
            },
            grep: function (e, t, i) {
                for (var n = [], o = 0, r = e.length, s = !i; r > o; o++) !t(e[o], o) !== s && n.push(e[o]);
                return n;
            },
            map: function (e, t, n) {
                var o,
                    r = 0,
                    s = e.length,
                    a = [];
                if (i(e)) for (; s > r; r++) null != (o = t(e[r], r, n)) && a.push(o);
                else for (r in e) null != (o = t(e[r], r, n)) && a.push(o);
                return F.apply([], a);
            },
            guid: 1,
            proxy: function (e, t) {
                var i, n, o;
                return (
                    "string" == typeof t && ((i = e[t]), (t = e), (e = i)),
                        G.isFunction(e)
                            ? ((n = R.call(arguments, 2)),
                                ((o = function () {
                                    return e.apply(t || this, n.concat(R.call(arguments)));
                                }).guid = e.guid = e.guid || G.guid++),
                                o)
                            : void 0
                );
            },
            now: Date.now,
            support: Y,
        }),
        G.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
            W["[object " + t + "]"] = t.toLowerCase();
        });
    var J = (function (e) {
        function t(e, t, i, n) {
            var o, r, s, a, l, c, d, h, f, m;
            if (((t ? t.ownerDocument || t : F) !== I && M(t), (i = i || []), (a = (t = t || I).nodeType), "string" != typeof e || !e || (1 !== a && 9 !== a && 11 !== a))) return i;
            if (!n && D) {
                if (11 !== a && (o = ve.exec(e)))
                    if ((s = o[1])) {
                        if (9 === a) {
                            if (!(r = t.getElementById(s)) || !r.parentNode) return i;
                            if (r.id === s) return i.push(r), i;
                        } else if (t.ownerDocument && (r = t.ownerDocument.getElementById(s)) && N(t, r) && r.id === s) return i.push(r), i;
                    } else {
                        if (o[2]) return Z.apply(i, t.getElementsByTagName(e)), i;
                        if ((s = o[3]) && x.getElementsByClassName) return Z.apply(i, t.getElementsByClassName(s)), i;
                    }
                if (x.qsa && (!O || !O.test(e))) {
                    if (((h = d = R), (f = t), (m = 1 !== a && e), 1 === a && "object" !== t.nodeName.toLowerCase())) {
                        for (c = C(e), (d = t.getAttribute("id")) ? (h = d.replace(we, "\\$&")) : t.setAttribute("id", h), h = "[id='" + h + "'] ", l = c.length; l--;) c[l] = h + p(c[l]);
                        (f = (ye.test(e) && u(t.parentNode)) || t), (m = c.join(","));
                    }
                    if (m)
                        try {
                            return Z.apply(i, f.querySelectorAll(m)), i;
                        } catch (e) {
                        } finally {
                            d || t.removeAttribute("id");
                        }
                }
            }
            return k(e.replace(ae, "$1"), t, i, n);
        }

        function i() {
            var e = [];
            return function t(i, n) {
                return e.push(i + " ") > b.cacheLength && delete t[e.shift()], (t[i + " "] = n);
            };
        }

        function n(e) {
            return (e[R] = !0), e;
        }

        function o(e) {
            var t = I.createElement("div");
            try {
                return !!e(t);
            } catch (e) {
                return !1;
            } finally {
                t.parentNode && t.parentNode.removeChild(t), (t = null);
            }
        }

        function r(e, t) {
            for (var i = e.split("|"), n = e.length; n--;) b.attrHandle[i[n]] = t;
        }

        function s(e, t) {
            var i = t && e,
                n = i && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || X) - (~e.sourceIndex || X);
            if (n) return n;
            if (i) for (; (i = i.nextSibling);) if (i === t) return -1;
            return e ? 1 : -1;
        }

        function a(e) {
            return function (t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e;
            };
        }

        function l(e) {
            return function (t) {
                var i = t.nodeName.toLowerCase();
                return ("input" === i || "button" === i) && t.type === e;
            };
        }

        function c(e) {
            return n(function (t) {
                return (
                    (t = +t),
                        n(function (i, n) {
                            for (var o, r = e([], i.length, t), s = r.length; s--;) i[(o = r[s])] && (i[o] = !(n[o] = i[o]));
                        })
                );
            });
        }

        function u(e) {
            return e && void 0 !== e.getElementsByTagName && e;
        }

        function d() {
        }

        function p(e) {
            for (var t = 0, i = e.length, n = ""; i > t; t++) n += e[t].value;
            return n;
        }

        function h(e, t, i) {
            var n = t.dir,
                o = i && "parentNode" === n,
                r = j++;
            return t.first
                ? function (t, i, r) {
                    for (; (t = t[n]);) if (1 === t.nodeType || o) return e(t, i, r);
                }
                : function (t, i, s) {
                    var a,
                        l,
                        c = [H, r];
                    if (s) {
                        for (; (t = t[n]);) if ((1 === t.nodeType || o) && e(t, i, s)) return !0;
                    } else
                        for (; (t = t[n]);)
                            if (1 === t.nodeType || o) {
                                if ((a = (l = t[R] || (t[R] = {}))[n]) && a[0] === H && a[1] === r) return (c[2] = a[2]);
                                if (((l[n] = c), (c[2] = e(t, i, s)))) return !0;
                            }
                };
        }

        function f(e) {
            return e.length > 1
                ? function (t, i, n) {
                    for (var o = e.length; o--;) if (!e[o](t, i, n)) return !1;
                    return !0;
                }
                : e[0];
        }

        function m(e, t, i, n, o) {
            for (var r, s = [], a = 0, l = e.length, c = null != t; l > a; a++) (r = e[a]) && (!i || i(r, n, o)) && (s.push(r), c && t.push(a));
            return s;
        }

        function g(e, i, o, r, s, a) {
            return (
                r && !r[R] && (r = g(r)),
                s && !s[R] && (s = g(s, a)),
                    n(function (n, a, l, c) {
                        var u,
                            d,
                            p,
                            h = [],
                            f = [],
                            g = a.length,
                            v =
                                n ||
                                (function (e, i, n) {
                                    for (var o = 0, r = i.length; r > o; o++) t(e, i[o], n);
                                    return n;
                                })(i || "*", l.nodeType ? [l] : l, []),
                            y = !e || (!n && i) ? v : m(v, h, e, l, c),
                            w = o ? (s || (n ? e : g || r) ? [] : a) : y;
                        if ((o && o(y, w, l, c), r)) for (u = m(w, f), r(u, [], l, c), d = u.length; d--;) (p = u[d]) && (w[f[d]] = !(y[f[d]] = p));
                        if (n) {
                            if (s || e) {
                                if (s) {
                                    for (u = [], d = w.length; d--;) (p = w[d]) && u.push((y[d] = p));
                                    s(null, (w = []), u, c);
                                }
                                for (d = w.length; d--;) (p = w[d]) && (u = s ? J(n, p) : h[d]) > -1 && (n[u] = !(a[u] = p));
                            }
                        } else (w = m(w === a ? w.splice(g, w.length) : w)), s ? s(null, a, w, c) : Z.apply(a, w);
                    })
            );
        }

        function v(e) {
            for (
                var t,
                    i,
                    n,
                    o = e.length,
                    r = b.relative[e[0].type],
                    s = r || b.relative[" "],
                    a = r ? 1 : 0,
                    l = h(
                        function (e) {
                            return e === t;
                        },
                        s,
                        !0
                    ),
                    c = h(
                        function (e) {
                            return J(t, e) > -1;
                        },
                        s,
                        !0
                    ),
                    u = [
                        function (e, i, n) {
                            var o = (!r && (n || i !== _)) || ((t = i).nodeType ? l(e, i, n) : c(e, i, n));
                            return (t = null), o;
                        },
                    ];
                o > a;
                a++
            )
                if ((i = b.relative[e[a].type])) u = [h(f(u), i)];
                else {
                    if ((i = b.filter[e[a].type].apply(null, e[a].matches))[R]) {
                        for (n = ++a; o > n && !b.relative[e[n].type]; n++) ;
                        return g(a > 1 && f(u), a > 1 && p(e.slice(0, a - 1).concat({value: " " === e[a - 2].type ? "*" : ""})).replace(ae, "$1"), i, n > a && v(e.slice(a, n)), o > n && v((e = e.slice(n))), o > n && p(e));
                    }
                    u.push(i);
                }
            return f(u);
        }

        function y(e, i) {
            var o = i.length > 0,
                r = e.length > 0,
                s = function (n, s, a, l, c) {
                    var u,
                        d,
                        p,
                        h = 0,
                        f = "0",
                        g = n && [],
                        v = [],
                        y = _,
                        w = n || (r && b.find.TAG("*", c)),
                        x = (H += null == y ? 1 : Math.random() || 0.1),
                        T = w.length;
                    for (c && (_ = s !== I && s); f !== T && null != (u = w[f]); f++) {
                        if (r && u) {
                            for (d = 0; (p = e[d++]);)
                                if (p(u, s, a)) {
                                    l.push(u);
                                    break;
                                }
                            c && (H = x);
                        }
                        o && ((u = !p && u) && h--, n && g.push(u));
                    }
                    if (((h += f), o && f !== h)) {
                        for (d = 0; (p = i[d++]);) p(g, v, s, a);
                        if (n) {
                            if (h > 0) for (; f--;) g[f] || v[f] || (v[f] = U.call(l));
                            v = m(v);
                        }
                        Z.apply(l, v), c && !n && v.length > 0 && h + i.length > 1 && t.uniqueSort(l);
                    }
                    return c && ((H = x), (_ = y)), g;
                };
            return o ? n(s) : s;
        }

        var w,
            x,
            b,
            T,
            S,
            C,
            E,
            k,
            _,
            z,
            L,
            M,
            I,
            P,
            D,
            O,
            A,
            $,
            N,
            R = "sizzle" + 1 * new Date(),
            F = e.document,
            H = 0,
            j = 0,
            W = i(),
            B = i(),
            q = i(),
            Y = function (e, t) {
                return e === t && (L = !0), 0;
            },
            X = 1 << 31,
            V = {}.hasOwnProperty,
            G = [],
            U = G.pop,
            Q = G.push,
            Z = G.push,
            K = G.slice,
            J = function (e, t) {
                for (var i = 0, n = e.length; n > i; i++) if (e[i] === t) return i;
                return -1;
            },
            ee = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            te = "[\\x20\\t\\r\\n\\f]",
            ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            ne = ie.replace("w", "w#"),
            oe = "\\[" + te + "*(" + ie + ")(?:" + te + "*([*^$|!~]?=)" + te + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ne + "))|)" + te + "*\\]",
            re = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)",
            se = new RegExp(te + "+", "g"),
            ae = new RegExp("^" + te + "+|((?:^|[^\\\\])(?:\\\\.)*)" + te + "+$", "g"),
            le = new RegExp("^" + te + "*," + te + "*"),
            ce = new RegExp("^" + te + "*([>+~]|" + te + ")" + te + "*"),
            ue = new RegExp("=" + te + "*([^\\]'\"]*?)" + te + "*\\]", "g"),
            de = new RegExp(re),
            pe = new RegExp("^" + ne + "$"),
            he = {
                ID: new RegExp("^#(" + ie + ")"),
                CLASS: new RegExp("^\\.(" + ie + ")"),
                TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + oe),
                PSEUDO: new RegExp("^" + re),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + te + "*(even|odd|(([+-]|)(\\d*)n|)" + te + "*(?:([+-]|)" + te + "*(\\d+)|))" + te + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + ee + ")$", "i"),
                needsContext: new RegExp("^" + te + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + te + "*((?:-\\d)?\\d*)" + te + "*\\)|)(?=[^-]|$)", "i"),
            },
            fe = /^(?:input|select|textarea|button)$/i,
            me = /^h\d$/i,
            ge = /^[^{]+\{\s*\[native \w/,
            ve = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ye = /[+~]/,
            we = /'|\\/g,
            xe = new RegExp("\\\\([\\da-f]{1,6}" + te + "?|(" + te + ")|.)", "ig"),
            be = function (e, t, i) {
                var n = "0x" + t - 65536;
                return n != n || i ? t : 0 > n ? String.fromCharCode(n + 65536) : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320);
            },
            Te = function () {
                M();
            };
        try {
            Z.apply((G = K.call(F.childNodes)), F.childNodes), G[F.childNodes.length].nodeType;
        } catch (e) {
            Z = {
                apply: G.length
                    ? function (e, t) {
                        Q.apply(e, K.call(t));
                    }
                    : function (e, t) {
                        for (var i = e.length, n = 0; (e[i++] = t[n++]);) ;
                        e.length = i - 1;
                    },
            };
        }
        for (w in ((x = t.support = {}),
            (S = t.isXML = function (e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName;
            }),
            (M = t.setDocument = function (e) {
                var t,
                    i,
                    n = e ? e.ownerDocument || e : F;
                return n !== I && 9 === n.nodeType && n.documentElement
                    ? ((I = n),
                        (P = n.documentElement),
                    (i = n.defaultView) && i !== i.top && (i.addEventListener ? i.addEventListener("unload", Te, !1) : i.attachEvent && i.attachEvent("onunload", Te)),
                        (D = !S(n)),
                        (x.attributes = o(function (e) {
                            return (e.className = "i"), !e.getAttribute("className");
                        })),
                        (x.getElementsByTagName = o(function (e) {
                            return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length;
                        })),
                        (x.getElementsByClassName = ge.test(n.getElementsByClassName)),
                        (x.getById = o(function (e) {
                            return (P.appendChild(e).id = R), !n.getElementsByName || !n.getElementsByName(R).length;
                        })),
                        x.getById
                            ? ((b.find.ID = function (e, t) {
                                if (void 0 !== t.getElementById && D) {
                                    var i = t.getElementById(e);
                                    return i && i.parentNode ? [i] : [];
                                }
                            }),
                                (b.filter.ID = function (e) {
                                    var t = e.replace(xe, be);
                                    return function (e) {
                                        return e.getAttribute("id") === t;
                                    };
                                }))
                            : (delete b.find.ID,
                                (b.filter.ID = function (e) {
                                    var t = e.replace(xe, be);
                                    return function (e) {
                                        var i = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                                        return i && i.value === t;
                                    };
                                })),
                        (b.find.TAG = x.getElementsByTagName
                            ? function (e, t) {
                                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0;
                            }
                            : function (e, t) {
                                var i,
                                    n = [],
                                    o = 0,
                                    r = t.getElementsByTagName(e);
                                if ("*" === e) {
                                    for (; (i = r[o++]);) 1 === i.nodeType && n.push(i);
                                    return n;
                                }
                                return r;
                            }),
                        (b.find.CLASS =
                            x.getElementsByClassName &&
                            function (e, t) {
                                return D ? t.getElementsByClassName(e) : void 0;
                            }),
                        (A = []),
                        (O = []),
                    (x.qsa = ge.test(n.querySelectorAll)) &&
                    (o(function (e) {
                        (P.appendChild(e).innerHTML = "<a id='" + R + "'></a><select id='" + R + "-\f]' msallowcapture=''><option selected=''></option></select>"),
                        e.querySelectorAll("[msallowcapture^='']").length && O.push("[*^$]=" + te + "*(?:''|\"\")"),
                        e.querySelectorAll("[selected]").length || O.push("\\[" + te + "*(?:value|" + ee + ")"),
                        e.querySelectorAll("[id~=" + R + "-]").length || O.push("~="),
                        e.querySelectorAll(":checked").length || O.push(":checked"),
                        e.querySelectorAll("a#" + R + "+*").length || O.push(".#.+[+~]");
                    }),
                        o(function (e) {
                            var t = n.createElement("input");
                            t.setAttribute("type", "hidden"),
                                e.appendChild(t).setAttribute("name", "D"),
                            e.querySelectorAll("[name=d]").length && O.push("name" + te + "*[*^$|!~]?="),
                            e.querySelectorAll(":enabled").length || O.push(":enabled", ":disabled"),
                                e.querySelectorAll("*,:x"),
                                O.push(",.*:");
                        })),
                    (x.matchesSelector = ge.test(($ = P.matches || P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector))) &&
                    o(function (e) {
                        (x.disconnectedMatch = $.call(e, "div")), $.call(e, "[s!='']:x"), A.push("!=", re);
                    }),
                        (O = O.length && new RegExp(O.join("|"))),
                        (A = A.length && new RegExp(A.join("|"))),
                        (t = ge.test(P.compareDocumentPosition)),
                        (N =
                            t || ge.test(P.contains)
                                ? function (e, t) {
                                    var i = 9 === e.nodeType ? e.documentElement : e,
                                        n = t && t.parentNode;
                                    return e === n || !(!n || 1 !== n.nodeType || !(i.contains ? i.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)));
                                }
                                : function (e, t) {
                                    if (t) for (; (t = t.parentNode);) if (t === e) return !0;
                                    return !1;
                                }),
                        (Y = t
                            ? function (e, t) {
                                if (e === t) return (L = !0), 0;
                                var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                                return (
                                    i ||
                                    (1 & (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || (!x.sortDetached && t.compareDocumentPosition(e) === i)
                                        ? e === n || (e.ownerDocument === F && N(F, e))
                                            ? -1
                                            : t === n || (t.ownerDocument === F && N(F, t))
                                                ? 1
                                                : z
                                                    ? J(z, e) - J(z, t)
                                                    : 0
                                        : 4 & i
                                            ? -1
                                            : 1)
                                );
                            }
                            : function (e, t) {
                                if (e === t) return (L = !0), 0;
                                var i,
                                    o = 0,
                                    r = e.parentNode,
                                    a = t.parentNode,
                                    l = [e],
                                    c = [t];
                                if (!r || !a) return e === n ? -1 : t === n ? 1 : r ? -1 : a ? 1 : z ? J(z, e) - J(z, t) : 0;
                                if (r === a) return s(e, t);
                                for (i = e; (i = i.parentNode);) l.unshift(i);
                                for (i = t; (i = i.parentNode);) c.unshift(i);
                                for (; l[o] === c[o];) o++;
                                return o ? s(l[o], c[o]) : l[o] === F ? -1 : c[o] === F ? 1 : 0;
                            }),
                        n)
                    : I;
            }),
            (t.matches = function (e, i) {
                return t(e, null, null, i);
            }),
            (t.matchesSelector = function (e, i) {
                if (((e.ownerDocument || e) !== I && M(e), (i = i.replace(ue, "='$1']")), !(!x.matchesSelector || !D || (A && A.test(i)) || (O && O.test(i)))))
                    try {
                        var n = $.call(e, i);
                        if (n || x.disconnectedMatch || (e.document && 11 !== e.document.nodeType)) return n;
                    } catch (e) {
                    }
                return t(i, I, null, [e]).length > 0;
            }),
            (t.contains = function (e, t) {
                return (e.ownerDocument || e) !== I && M(e), N(e, t);
            }),
            (t.attr = function (e, t) {
                (e.ownerDocument || e) !== I && M(e);
                var i = b.attrHandle[t.toLowerCase()],
                    n = i && V.call(b.attrHandle, t.toLowerCase()) ? i(e, t, !D) : void 0;
                return void 0 !== n ? n : x.attributes || !D ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null;
            }),
            (t.error = function (e) {
                throw new Error("Syntax error, unrecognized expression: " + e);
            }),
            (t.uniqueSort = function (e) {
                var t,
                    i = [],
                    n = 0,
                    o = 0;
                if (((L = !x.detectDuplicates), (z = !x.sortStable && e.slice(0)), e.sort(Y), L)) {
                    for (; (t = e[o++]);) t === e[o] && (n = i.push(o));
                    for (; n--;) e.splice(i[n], 1);
                }
                return (z = null), e;
            }),
            (T = t.getText = function (e) {
                var t,
                    i = "",
                    n = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) i += T(e);
                    } else if (3 === o || 4 === o) return e.nodeValue;
                } else for (; (t = e[n++]);) i += T(t);
                return i;
            }),
            ((b = t.selectors = {
                cacheLength: 50,
                createPseudo: n,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {dir: "parentNode", first: !0},
                    " ": {dir: "parentNode"},
                    "+": {dir: "previousSibling", first: !0},
                    "~": {dir: "previousSibling"}
                },
                preFilter: {
                    ATTR: function (e) {
                        return (e[1] = e[1].replace(xe, be)), (e[3] = (e[3] || e[4] || e[5] || "").replace(xe, be)), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
                    },
                    CHILD: function (e) {
                        return (
                            (e[1] = e[1].toLowerCase()),
                                "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), (e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3]))), (e[5] = +(e[7] + e[8] || "odd" === e[3]))) : e[3] && t.error(e[0]),
                                e
                        );
                    },
                    PSEUDO: function (e) {
                        var t,
                            i = !e[6] && e[2];
                        return he.CHILD.test(e[0])
                            ? null
                            : (e[3] ? (e[2] = e[4] || e[5] || "") : i && de.test(i) && (t = C(i, !0)) && (t = i.indexOf(")", i.length - t) - i.length) && ((e[0] = e[0].slice(0, t)), (e[2] = i.slice(0, t))), e.slice(0, 3));
                    },
                },
                filter: {
                    TAG: function (e) {
                        var t = e.replace(xe, be).toLowerCase();
                        return "*" === e
                            ? function () {
                                return !0;
                            }
                            : function (e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t;
                            };
                    },
                    CLASS: function (e) {
                        var t = W[e + " "];
                        return (
                            t ||
                            ((t = new RegExp("(^|" + te + ")" + e + "(" + te + "|$)")) &&
                                W(e, function (e) {
                                    return t.test(("string" == typeof e.className && e.className) || (void 0 !== e.getAttribute && e.getAttribute("class")) || "");
                                }))
                        );
                    },
                    ATTR: function (e, i, n) {
                        return function (o) {
                            var r = t.attr(o, e);
                            return null == r
                                ? "!=" === i
                                : !i ||
                                ((r += ""),
                                    "=" === i
                                        ? r === n
                                        : "!=" === i
                                        ? r !== n
                                        : "^=" === i
                                            ? n && 0 === r.indexOf(n)
                                            : "*=" === i
                                                ? n && r.indexOf(n) > -1
                                                : "$=" === i
                                                    ? n && r.slice(-n.length) === n
                                                    : "~=" === i
                                                        ? (" " + r.replace(se, " ") + " ").indexOf(n) > -1
                                                        : "|=" === i && (r === n || r.slice(0, n.length + 1) === n + "-"));
                        };
                    },
                    CHILD: function (e, t, i, n, o) {
                        var r = "nth" !== e.slice(0, 3),
                            s = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === n && 0 === o
                            ? function (e) {
                                return !!e.parentNode;
                            }
                            : function (t, i, l) {
                                var c,
                                    u,
                                    d,
                                    p,
                                    h,
                                    f,
                                    m = r !== s ? "nextSibling" : "previousSibling",
                                    g = t.parentNode,
                                    v = a && t.nodeName.toLowerCase(),
                                    y = !l && !a;
                                if (g) {
                                    if (r) {
                                        for (; m;) {
                                            for (d = t; (d = d[m]);) if (a ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                                            f = m = "only" === e && !f && "nextSibling";
                                        }
                                        return !0;
                                    }
                                    if (((f = [s ? g.firstChild : g.lastChild]), s && y)) {
                                        for (h = (c = (u = g[R] || (g[R] = {}))[e] || [])[0] === H && c[1], p = c[0] === H && c[2], d = h && g.childNodes[h]; (d = (++h && d && d[m]) || (p = h = 0) || f.pop());)
                                            if (1 === d.nodeType && ++p && d === t) {
                                                u[e] = [H, h, p];
                                                break;
                                            }
                                    } else if (y && (c = (t[R] || (t[R] = {}))[e]) && c[0] === H) p = c[1];
                                    else for (; (d = (++h && d && d[m]) || (p = h = 0) || f.pop()) && ((a ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++p || (y && ((d[R] || (d[R] = {}))[e] = [H, p]), d !== t));) ;
                                    return (p -= o) === n || (p % n == 0 && p / n >= 0);
                                }
                            };
                    },
                    PSEUDO: function (e, i) {
                        var o,
                            r = b.pseudos[e] || b.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return r[R]
                            ? r(i)
                            : r.length > 1
                                ? ((o = [e, e, "", i]),
                                    b.setFilters.hasOwnProperty(e.toLowerCase())
                                        ? n(function (e, t) {
                                            for (var n, o = r(e, i), s = o.length; s--;) e[(n = J(e, o[s]))] = !(t[n] = o[s]);
                                        })
                                        : function (e) {
                                            return r(e, 0, o);
                                        })
                                : r;
                    },
                },
                pseudos: {
                    not: n(function (e) {
                        var t = [],
                            i = [],
                            o = E(e.replace(ae, "$1"));
                        return o[R]
                            ? n(function (e, t, i, n) {
                                for (var r, s = o(e, null, n, []), a = e.length; a--;) (r = s[a]) && (e[a] = !(t[a] = r));
                            })
                            : function (e, n, r) {
                                return (t[0] = e), o(t, null, r, i), (t[0] = null), !i.pop();
                            };
                    }),
                    has: n(function (e) {
                        return function (i) {
                            return t(e, i).length > 0;
                        };
                    }),
                    contains: n(function (e) {
                        return (
                            (e = e.replace(xe, be)),
                                function (t) {
                                    return (t.textContent || t.innerText || T(t)).indexOf(e) > -1;
                                }
                        );
                    }),
                    lang: n(function (e) {
                        return (
                            pe.test(e || "") || t.error("unsupported lang: " + e),
                                (e = e.replace(xe, be).toLowerCase()),
                                function (t) {
                                    var i;
                                    do {
                                        if ((i = D ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))) return (i = i.toLowerCase()) === e || 0 === i.indexOf(e + "-");
                                    } while ((t = t.parentNode) && 1 === t.nodeType);
                                    return !1;
                                }
                        );
                    }),
                    target: function (t) {
                        var i = e.location && e.location.hash;
                        return i && i.slice(1) === t.id;
                    },
                    root: function (e) {
                        return e === P;
                    },
                    focus: function (e) {
                        return e === I.activeElement && (!I.hasFocus || I.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
                    },
                    enabled: function (e) {
                        return !1 === e.disabled;
                    },
                    disabled: function (e) {
                        return !0 === e.disabled;
                    },
                    checked: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return ("input" === t && !!e.checked) || ("option" === t && !!e.selected);
                    },
                    selected: function (e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
                    },
                    empty: function (e) {
                        for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeType < 6) return !1;
                        return !0;
                    },
                    parent: function (e) {
                        return !b.pseudos.empty(e);
                    },
                    header: function (e) {
                        return me.test(e.nodeName);
                    },
                    input: function (e) {
                        return fe.test(e.nodeName);
                    },
                    button: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return ("input" === t && "button" === e.type) || "button" === t;
                    },
                    text: function (e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase());
                    },
                    first: c(function () {
                        return [0];
                    }),
                    last: c(function (e, t) {
                        return [t - 1];
                    }),
                    eq: c(function (e, t, i) {
                        return [0 > i ? i + t : i];
                    }),
                    even: c(function (e, t) {
                        for (var i = 0; t > i; i += 2) e.push(i);
                        return e;
                    }),
                    odd: c(function (e, t) {
                        for (var i = 1; t > i; i += 2) e.push(i);
                        return e;
                    }),
                    lt: c(function (e, t, i) {
                        for (var n = 0 > i ? i + t : i; --n >= 0;) e.push(n);
                        return e;
                    }),
                    gt: c(function (e, t, i) {
                        for (var n = 0 > i ? i + t : i; ++n < t;) e.push(n);
                        return e;
                    }),
                },
            }).pseudos.nth = b.pseudos.eq),
            {radio: !0, checkbox: !0, file: !0, password: !0, image: !0}))
            b.pseudos[w] = a(w);
        for (w in {submit: !0, reset: !0}) b.pseudos[w] = l(w);
        return (
            (d.prototype = b.filters = b.pseudos),
                (b.setFilters = new d()),
                (C = t.tokenize = function (e, i) {
                    var n,
                        o,
                        r,
                        s,
                        a,
                        l,
                        c,
                        u = B[e + " "];
                    if (u) return i ? 0 : u.slice(0);
                    for (a = e, l = [], c = b.preFilter; a;) {
                        for (s in ((!n || (o = le.exec(a))) && (o && (a = a.slice(o[0].length) || a), l.push((r = []))),
                            (n = !1),
                        (o = ce.exec(a)) && ((n = o.shift()), r.push({
                            value: n,
                            type: o[0].replace(ae, " ")
                        }), (a = a.slice(n.length))),
                            b.filter))
                            !(o = he[s].exec(a)) || (c[s] && !(o = c[s](o))) || ((n = o.shift()), r.push({
                                value: n,
                                type: s,
                                matches: o
                            }), (a = a.slice(n.length)));
                        if (!n) break;
                    }
                    return i ? a.length : a ? t.error(e) : B(e, l).slice(0);
                }),
                (E = t.compile = function (e, t) {
                    var i,
                        n = [],
                        o = [],
                        r = q[e + " "];
                    if (!r) {
                        for (t || (t = C(e)), i = t.length; i--;) (r = v(t[i]))[R] ? n.push(r) : o.push(r);
                        (r = q(e, y(o, n))).selector = e;
                    }
                    return r;
                }),
                (k = t.select = function (e, t, i, n) {
                    var o,
                        r,
                        s,
                        a,
                        l,
                        c = "function" == typeof e && e,
                        d = !n && C((e = c.selector || e));
                    if (((i = i || []), 1 === d.length)) {
                        if ((r = d[0] = d[0].slice(0)).length > 2 && "ID" === (s = r[0]).type && x.getById && 9 === t.nodeType && D && b.relative[r[1].type]) {
                            if (!(t = (b.find.ID(s.matches[0].replace(xe, be), t) || [])[0])) return i;
                            c && (t = t.parentNode), (e = e.slice(r.shift().value.length));
                        }
                        for (o = he.needsContext.test(e) ? 0 : r.length; o-- && ((s = r[o]), !b.relative[(a = s.type)]);)
                            if ((l = b.find[a]) && (n = l(s.matches[0].replace(xe, be), (ye.test(r[0].type) && u(t.parentNode)) || t))) {
                                if ((r.splice(o, 1), !(e = n.length && p(r)))) return Z.apply(i, n), i;
                                break;
                            }
                    }
                    return (c || E(e, d))(n, t, !D, i, (ye.test(e) && u(t.parentNode)) || t), i;
                }),
                (x.sortStable = R.split("").sort(Y).join("") === R),
                (x.detectDuplicates = !!L),
                M(),
                (x.sortDetached = o(function (e) {
                    return 1 & e.compareDocumentPosition(I.createElement("div"));
                })),
            o(function (e) {
                return (e.innerHTML = "<a href='#'></a>"), "#" === e.firstChild.getAttribute("href");
            }) ||
            r("type|href|height|width", function (e, t, i) {
                return i ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
            }),
            (x.attributes &&
                o(function (e) {
                    return (e.innerHTML = "<input/>"), e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
                })) ||
            r("value", function (e, t, i) {
                return i || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue;
            }),
            o(function (e) {
                return null == e.getAttribute("disabled");
            }) ||
            r(ee, function (e, t, i) {
                var n;
                return i ? void 0 : !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null;
            }),
                t
        );
    })(e);
    (G.find = J), (G.expr = J.selectors), (G.expr[":"] = G.expr.pseudos), (G.unique = J.uniqueSort), (G.text = J.getText), (G.isXMLDoc = J.isXML), (G.contains = J.contains);
    var ee = G.expr.match.needsContext,
        te = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        ie = /^.[^:#\[\.,]*$/;
    (G.filter = function (e, t, i) {
        var n = t[0];
        return (
            i && (e = ":not(" + e + ")"),
                1 === t.length && 1 === n.nodeType
                    ? G.find.matchesSelector(n, e)
                    ? [n]
                    : []
                    : G.find.matches(
                    e,
                    G.grep(t, function (e) {
                        return 1 === e.nodeType;
                    })
                    )
        );
    }),
        G.fn.extend({
            find: function (e) {
                var t,
                    i = this.length,
                    n = [],
                    o = this;
                if ("string" != typeof e)
                    return this.pushStack(
                        G(e).filter(function () {
                            for (t = 0; i > t; t++) if (G.contains(o[t], this)) return !0;
                        })
                    );
                for (t = 0; i > t; t++) G.find(e, o[t], n);
                return ((n = this.pushStack(i > 1 ? G.unique(n) : n)).selector = this.selector ? this.selector + " " + e : e), n;
            },
            filter: function (e) {
                return this.pushStack(n(this, e || [], !1));
            },
            not: function (e) {
                return this.pushStack(n(this, e || [], !0));
            },
            is: function (e) {
                return !!n(this, "string" == typeof e && ee.test(e) ? G(e) : e || [], !1).length;
            },
        });
    var ne,
        oe = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    ((G.fn.init = function (e, t) {
        var i, n;
        if (!e) return this;
        if ("string" == typeof e) {
            if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : oe.exec(e)) || (!i[1] && t)) return !t || t.jquery ? (t || ne).find(e) : this.constructor(t).find(e);
            if (i[1]) {
                if (((t = t instanceof G ? t[0] : t), G.merge(this, G.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : X, !0)), te.test(i[1]) && G.isPlainObject(t)))
                    for (i in t) G.isFunction(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                return this;
            }
            return (n = X.getElementById(i[2])) && n.parentNode && ((this.length = 1), (this[0] = n)), (this.context = X), (this.selector = e), this;
        }
        return e.nodeType
            ? ((this.context = this[0] = e), (this.length = 1), this)
            : G.isFunction(e)
                ? void 0 !== ne.ready
                    ? ne.ready(e)
                    : e(G)
                : (void 0 !== e.selector && ((this.selector = e.selector), (this.context = e.context)), G.makeArray(e, this));
    }).prototype = G.fn),
        (ne = G(X));
    var re = /^(?:parents|prev(?:Until|All))/,
        se = {children: !0, contents: !0, next: !0, prev: !0};
    G.extend({
        dir: function (e, t, i) {
            for (var n = [], o = void 0 !== i; (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (o && G(e).is(i)) break;
                    n.push(e);
                }
            return n;
        },
        sibling: function (e, t) {
            for (var i = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && i.push(e);
            return i;
        },
    }),
        G.fn.extend({
            has: function (e) {
                var t = G(e, this),
                    i = t.length;
                return this.filter(function () {
                    for (var e = 0; i > e; e++) if (G.contains(this, t[e])) return !0;
                });
            },
            closest: function (e, t) {
                for (var i, n = 0, o = this.length, r = [], s = ee.test(e) || "string" != typeof e ? G(e, t || this.context) : 0; o > n; n++)
                    for (i = this[n]; i && i !== t; i = i.parentNode)
                        if (i.nodeType < 11 && (s ? s.index(i) > -1 : 1 === i.nodeType && G.find.matchesSelector(i, e))) {
                            r.push(i);
                            break;
                        }
                return this.pushStack(r.length > 1 ? G.unique(r) : r);
            },
            index: function (e) {
                return e ? ("string" == typeof e ? j.call(G(e), this[0]) : j.call(this, e.jquery ? e[0] : e)) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            },
            add: function (e, t) {
                return this.pushStack(G.unique(G.merge(this.get(), G(e, t))));
            },
            addBack: function (e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
            },
        }),
        G.each(
            {
                parent: function (e) {
                    var t = e.parentNode;
                    return t && 11 !== t.nodeType ? t : null;
                },
                parents: function (e) {
                    return G.dir(e, "parentNode");
                },
                parentsUntil: function (e, t, i) {
                    return G.dir(e, "parentNode", i);
                },
                next: function (e) {
                    return o(e, "nextSibling");
                },
                prev: function (e) {
                    return o(e, "previousSibling");
                },
                nextAll: function (e) {
                    return G.dir(e, "nextSibling");
                },
                prevAll: function (e) {
                    return G.dir(e, "previousSibling");
                },
                nextUntil: function (e, t, i) {
                    return G.dir(e, "nextSibling", i);
                },
                prevUntil: function (e, t, i) {
                    return G.dir(e, "previousSibling", i);
                },
                siblings: function (e) {
                    return G.sibling((e.parentNode || {}).firstChild, e);
                },
                children: function (e) {
                    return G.sibling(e.firstChild);
                },
                contents: function (e) {
                    return e.contentDocument || G.merge([], e.childNodes);
                },
            },
            function (e, t) {
                G.fn[e] = function (i, n) {
                    var o = G.map(this, t, i);
                    return "Until" !== e.slice(-5) && (n = i), n && "string" == typeof n && (o = G.filter(n, o)), this.length > 1 && (se[e] || G.unique(o), re.test(e) && o.reverse()), this.pushStack(o);
                };
            }
        );
    var ae,
        le = /\S+/g,
        ce = {};
    (G.Callbacks = function (e) {
        e =
            "string" == typeof e
                ? ce[e] ||
                (function (e) {
                    var t = (ce[e] = {});
                    return (
                        G.each(e.match(le) || [], function (e, i) {
                            t[i] = !0;
                        }),
                            t
                    );
                })(e)
                : G.extend({}, e);
        var t,
            i,
            n,
            o,
            r,
            s,
            a = [],
            l = !e.once && [],
            c = function (d) {
                for (t = e.memory && d, i = !0, s = o || 0, o = 0, r = a.length, n = !0; a && r > s; s++)
                    if (!1 === a[s].apply(d[0], d[1]) && e.stopOnFalse) {
                        t = !1;
                        break;
                    }
                (n = !1), a && (l ? l.length && c(l.shift()) : t ? (a = []) : u.disable());
            },
            u = {
                add: function () {
                    if (a) {
                        var i = a.length;
                        !(function t(i) {
                            G.each(i, function (i, n) {
                                var o = G.type(n);
                                "function" === o ? (e.unique && u.has(n)) || a.push(n) : n && n.length && "string" !== o && t(n);
                            });
                        })(arguments),
                            n ? (r = a.length) : t && ((o = i), c(t));
                    }
                    return this;
                },
                remove: function () {
                    return (
                        a &&
                        G.each(arguments, function (e, t) {
                            for (var i; (i = G.inArray(t, a, i)) > -1;) a.splice(i, 1), n && (r >= i && r--, s >= i && s--);
                        }),
                            this
                    );
                },
                has: function (e) {
                    return e ? G.inArray(e, a) > -1 : !(!a || !a.length);
                },
                empty: function () {
                    return (a = []), (r = 0), this;
                },
                disable: function () {
                    return (a = l = t = void 0), this;
                },
                disabled: function () {
                    return !a;
                },
                lock: function () {
                    return (l = void 0), t || u.disable(), this;
                },
                locked: function () {
                    return !l;
                },
                fireWith: function (e, t) {
                    return !a || (i && !l) || ((t = [e, (t = t || []).slice ? t.slice() : t]), n ? l.push(t) : c(t)), this;
                },
                fire: function () {
                    return u.fireWith(this, arguments), this;
                },
                fired: function () {
                    return !!i;
                },
            };
        return u;
    }),
        G.extend({
            Deferred: function (e) {
                var t = [
                        ["resolve", "done", G.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", G.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", G.Callbacks("memory")],
                    ],
                    i = "pending",
                    n = {
                        state: function () {
                            return i;
                        },
                        always: function () {
                            return o.done(arguments).fail(arguments), this;
                        },
                        then: function () {
                            var e = arguments;
                            return G.Deferred(function (i) {
                                G.each(t, function (t, r) {
                                    var s = G.isFunction(e[t]) && e[t];
                                    o[r[1]](function () {
                                        var e = s && s.apply(this, arguments);
                                        e && G.isFunction(e.promise) ? e.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[r[0] + "With"](this === n ? i.promise() : this, s ? [e] : arguments);
                                    });
                                }),
                                    (e = null);
                            }).promise();
                        },
                        promise: function (e) {
                            return null != e ? G.extend(e, n) : n;
                        },
                    },
                    o = {};
                return (
                    (n.pipe = n.then),
                        G.each(t, function (e, r) {
                            var s = r[2],
                                a = r[3];
                            (n[r[1]] = s.add),
                            a &&
                            s.add(
                                function () {
                                    i = a;
                                },
                                t[1 ^ e][2].disable,
                                t[2][2].lock
                            ),
                                (o[r[0]] = function () {
                                    return o[r[0] + "With"](this === o ? n : this, arguments), this;
                                }),
                                (o[r[0] + "With"] = s.fireWith);
                        }),
                        n.promise(o),
                    e && e.call(o, o),
                        o
                );
            },
            when: function (e) {
                var t,
                    i,
                    n,
                    o = 0,
                    r = R.call(arguments),
                    s = r.length,
                    a = 1 !== s || (e && G.isFunction(e.promise)) ? s : 0,
                    l = 1 === a ? e : G.Deferred(),
                    c = function (e, i, n) {
                        return function (o) {
                            (i[e] = this), (n[e] = arguments.length > 1 ? R.call(arguments) : o), n === t ? l.notifyWith(i, n) : --a || l.resolveWith(i, n);
                        };
                    };
                if (s > 1) for (t = new Array(s), i = new Array(s), n = new Array(s); s > o; o++) r[o] && G.isFunction(r[o].promise) ? r[o].promise().done(c(o, n, r)).fail(l.reject).progress(c(o, i, t)) : --a;
                return a || l.resolveWith(n, r), l.promise();
            },
        }),
        (G.fn.ready = function (e) {
            return G.ready.promise().done(e), this;
        }),
        G.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function (e) {
                e ? G.readyWait++ : G.ready(!0);
            },
            ready: function (e) {
                (!0 === e ? --G.readyWait : G.isReady) || ((G.isReady = !0), (!0 !== e && --G.readyWait > 0) || (ae.resolveWith(X, [G]), G.fn.triggerHandler && (G(X).triggerHandler("ready"), G(X).off("ready"))));
            },
        }),
        (G.ready.promise = function (t) {
            return ae || ((ae = G.Deferred()), "complete" === X.readyState ? setTimeout(G.ready) : (X.addEventListener("DOMContentLoaded", r, !1), e.addEventListener("load", r, !1))), ae.promise(t);
        }),
        G.ready.promise();
    var ue = (G.access = function (e, t, i, n, o, r, s) {
        var a = 0,
            l = e.length,
            c = null == i;
        if ("object" === G.type(i)) for (a in ((o = !0), i)) G.access(e, t, a, i[a], !0, r, s);
        else if (
            void 0 !== n &&
            ((o = !0),
            G.isFunction(n) || (s = !0),
            c &&
            (s
                ? (t.call(e, n), (t = null))
                : ((c = t),
                    (t = function (e, t, i) {
                        return c.call(G(e), i);
                    }))),
                t)
        )
            for (; l > a; a++) t(e[a], i, s ? n : n.call(e[a], a, t(e[a], i)));
        return o ? e : c ? t.call(e) : l ? t(e[0], i) : r;
    });
    (G.acceptData = function (e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    }),
        (s.uid = 1),
        (s.accepts = G.acceptData),
        (s.prototype = {
            key: function (e) {
                if (!s.accepts(e)) return 0;
                var t = {},
                    i = e[this.expando];
                if (!i) {
                    i = s.uid++;
                    try {
                        (t[this.expando] = {value: i}), Object.defineProperties(e, t);
                    } catch (n) {
                        (t[this.expando] = i), G.extend(e, t);
                    }
                }
                return this.cache[i] || (this.cache[i] = {}), i;
            },
            set: function (e, t, i) {
                var n,
                    o = this.key(e),
                    r = this.cache[o];
                if ("string" == typeof t) r[t] = i;
                else if (G.isEmptyObject(r)) G.extend(this.cache[o], t);
                else for (n in t) r[n] = t[n];
                return r;
            },
            get: function (e, t) {
                var i = this.cache[this.key(e)];
                return void 0 === t ? i : i[t];
            },
            access: function (e, t, i) {
                var n;
                return void 0 === t || (t && "string" == typeof t && void 0 === i) ? (void 0 !== (n = this.get(e, t)) ? n : this.get(e, G.camelCase(t))) : (this.set(e, t, i), void 0 !== i ? i : t);
            },
            remove: function (e, t) {
                var i,
                    n,
                    o,
                    r = this.key(e),
                    s = this.cache[r];
                if (void 0 === t) this.cache[r] = {};
                else {
                    G.isArray(t) ? (n = t.concat(t.map(G.camelCase))) : ((o = G.camelCase(t)), t in s ? (n = [t, o]) : (n = (n = o) in s ? [n] : n.match(le) || [])), (i = n.length);
                    for (; i--;) delete s[n[i]];
                }
            },
            hasData: function (e) {
                return !G.isEmptyObject(this.cache[e[this.expando]] || {});
            },
            discard: function (e) {
                e[this.expando] && delete this.cache[e[this.expando]];
            },
        });
    var de = new s(),
        pe = new s(),
        he = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        fe = /([A-Z])/g;
    G.extend({
        hasData: function (e) {
            return pe.hasData(e) || de.hasData(e);
        },
        data: function (e, t, i) {
            return pe.access(e, t, i);
        },
        removeData: function (e, t) {
            pe.remove(e, t);
        },
        _data: function (e, t, i) {
            return de.access(e, t, i);
        },
        _removeData: function (e, t) {
            de.remove(e, t);
        },
    }),
        G.fn.extend({
            data: function (e, t) {
                var i,
                    n,
                    o,
                    r = this[0],
                    s = r && r.attributes;
                if (void 0 === e) {
                    if (this.length && ((o = pe.get(r)), 1 === r.nodeType && !de.get(r, "hasDataAttrs"))) {
                        for (i = s.length; i--;) s[i] && 0 === (n = s[i].name).indexOf("data-") && ((n = G.camelCase(n.slice(5))), a(r, n, o[n]));
                        de.set(r, "hasDataAttrs", !0);
                    }
                    return o;
                }
                return "object" == typeof e
                    ? this.each(function () {
                        pe.set(this, e);
                    })
                    : ue(
                        this,
                        function (t) {
                            var i,
                                n = G.camelCase(e);
                            if (r && void 0 === t) {
                                if (void 0 !== (i = pe.get(r, e))) return i;
                                if (void 0 !== (i = pe.get(r, n))) return i;
                                if (void 0 !== (i = a(r, n, void 0))) return i;
                            } else
                                this.each(function () {
                                    var i = pe.get(this, n);
                                    pe.set(this, n, t), -1 !== e.indexOf("-") && void 0 !== i && pe.set(this, e, t);
                                });
                        },
                        null,
                        t,
                        arguments.length > 1,
                        null,
                        !0
                    );
            },
            removeData: function (e) {
                return this.each(function () {
                    pe.remove(this, e);
                });
            },
        }),
        G.extend({
            queue: function (e, t, i) {
                var n;
                return e ? ((t = (t || "fx") + "queue"), (n = de.get(e, t)), i && (!n || G.isArray(i) ? (n = de.access(e, t, G.makeArray(i))) : n.push(i)), n || []) : void 0;
            },
            dequeue: function (e, t) {
                t = t || "fx";
                var i = G.queue(e, t),
                    n = i.length,
                    o = i.shift(),
                    r = G._queueHooks(e, t);
                "inprogress" === o && ((o = i.shift()), n--),
                o &&
                ("fx" === t && i.unshift("inprogress"),
                    delete r.stop,
                    o.call(
                        e,
                        function () {
                            G.dequeue(e, t);
                        },
                        r
                    )),
                !n && r && r.empty.fire();
            },
            _queueHooks: function (e, t) {
                var i = t + "queueHooks";
                return (
                    de.get(e, i) ||
                    de.access(e, i, {
                        empty: G.Callbacks("once memory").add(function () {
                            de.remove(e, [t + "queue", i]);
                        }),
                    })
                );
            },
        }),
        G.fn.extend({
            queue: function (e, t) {
                var i = 2;
                return (
                    "string" != typeof e && ((t = e), (e = "fx"), i--),
                        arguments.length < i
                            ? G.queue(this[0], e)
                            : void 0 === t
                            ? this
                            : this.each(function () {
                                var i = G.queue(this, e, t);
                                G._queueHooks(this, e), "fx" === e && "inprogress" !== i[0] && G.dequeue(this, e);
                            })
                );
            },
            dequeue: function (e) {
                return this.each(function () {
                    G.dequeue(this, e);
                });
            },
            clearQueue: function (e) {
                return this.queue(e || "fx", []);
            },
            promise: function (e, t) {
                var i,
                    n = 1,
                    o = G.Deferred(),
                    r = this,
                    s = this.length,
                    a = function () {
                        --n || o.resolveWith(r, [r]);
                    };
                for ("string" != typeof e && ((t = e), (e = void 0)), e = e || "fx"; s--;) (i = de.get(r[s], e + "queueHooks")) && i.empty && (n++, i.empty.add(a));
                return a(), o.promise(t);
            },
        });
    var me = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ge = ["Top", "Right", "Bottom", "Left"],
        ve = function (e, t) {
            return (e = t || e), "none" === G.css(e, "display") || !G.contains(e.ownerDocument, e);
        },
        ye = /^(?:checkbox|radio)$/i;
    !(function () {
        var e = X.createDocumentFragment().appendChild(X.createElement("div")),
            t = X.createElement("input");
        t.setAttribute("type", "radio"),
            t.setAttribute("checked", "checked"),
            t.setAttribute("name", "t"),
            e.appendChild(t),
            (Y.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked),
            (e.innerHTML = "<textarea>x</textarea>"),
            (Y.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue);
    })();
    var we = "undefined";
    Y.focusinBubbles = "onfocusin" in e;
    var xe = /^key/,
        be = /^(?:mouse|pointer|contextmenu)|click/,
        Te = /^(?:focusinfocus|focusoutblur)$/,
        Se = /^([^.]*)(?:\.(.+)|)$/;
    (G.event = {
        global: {},
        add: function (e, t, i, n, o) {
            var r,
                s,
                a,
                l,
                c,
                u,
                d,
                p,
                h,
                f,
                m,
                g = de.get(e);
            if (g)
                for (
                    i.handler && ((i = (r = i).handler), (o = r.selector)),
                    i.guid || (i.guid = G.guid++),
                    (l = g.events) || (l = g.events = {}),
                    (s = g.handle) ||
                    (s = g.handle = function (t) {
                        return typeof G !== we && G.event.triggered !== t.type ? G.event.dispatch.apply(e, arguments) : void 0;
                    }),
                        c = (t = (t || "").match(le) || [""]).length;
                    c--;
                )
                    (h = m = (a = Se.exec(t[c]) || [])[1]),
                        (f = (a[2] || "").split(".").sort()),
                    h &&
                    ((d = G.event.special[h] || {}),
                        (h = (o ? d.delegateType : d.bindType) || h),
                        (d = G.event.special[h] || {}),
                        (u = G.extend({
                            type: h,
                            origType: m,
                            data: n,
                            handler: i,
                            guid: i.guid,
                            selector: o,
                            needsContext: o && G.expr.match.needsContext.test(o),
                            namespace: f.join(".")
                        }, r)),
                    (p = l[h]) || (((p = l[h] = []).delegateCount = 0), (d.setup && !1 !== d.setup.call(e, n, f, s)) || (e.addEventListener && e.addEventListener(h, s, !1))),
                    d.add && (d.add.call(e, u), u.handler.guid || (u.handler.guid = i.guid)),
                        o ? p.splice(p.delegateCount++, 0, u) : p.push(u),
                        (G.event.global[h] = !0));
        },
        remove: function (e, t, i, n, o) {
            var r,
                s,
                a,
                l,
                c,
                u,
                d,
                p,
                h,
                f,
                m,
                g = de.hasData(e) && de.get(e);
            if (g && (l = g.events)) {
                for (c = (t = (t || "").match(le) || [""]).length; c--;)
                    if (((h = m = (a = Se.exec(t[c]) || [])[1]), (f = (a[2] || "").split(".").sort()), h)) {
                        for (d = G.event.special[h] || {}, p = l[(h = (n ? d.delegateType : d.bindType) || h)] || [], a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = r = p.length; r--;)
                            (u = p[r]),
                            (!o && m !== u.origType) ||
                            (i && i.guid !== u.guid) ||
                            (a && !a.test(u.namespace)) ||
                            (n && n !== u.selector && ("**" !== n || !u.selector)) ||
                            (p.splice(r, 1), u.selector && p.delegateCount--, d.remove && d.remove.call(e, u));
                        s && !p.length && ((d.teardown && !1 !== d.teardown.call(e, f, g.handle)) || G.removeEvent(e, h, g.handle), delete l[h]);
                    } else for (h in l) G.event.remove(e, h + t[c], i, n, !0);
                G.isEmptyObject(l) && (delete g.handle, de.remove(e, "events"));
            }
        },
        trigger: function (t, i, n, o) {
            var r,
                s,
                a,
                l,
                c,
                u,
                d,
                p = [n || X],
                h = q.call(t, "type") ? t.type : t,
                f = q.call(t, "namespace") ? t.namespace.split(".") : [];
            if (
                ((s = a = n = n || X),
                3 !== n.nodeType &&
                8 !== n.nodeType &&
                !Te.test(h + G.event.triggered) &&
                (h.indexOf(".") >= 0 && ((f = h.split(".")), (h = f.shift()), f.sort()),
                    (c = h.indexOf(":") < 0 && "on" + h),
                    ((t = t[G.expando] ? t : new G.Event(h, "object" == typeof t && t)).isTrigger = o ? 2 : 3),
                    (t.namespace = f.join(".")),
                    (t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null),
                    (t.result = void 0),
                t.target || (t.target = n),
                    (i = null == i ? [t] : G.makeArray(i, [t])),
                    (d = G.event.special[h] || {}),
                o || !d.trigger || !1 !== d.trigger.apply(n, i)))
            ) {
                if (!o && !d.noBubble && !G.isWindow(n)) {
                    for (l = d.delegateType || h, Te.test(l + h) || (s = s.parentNode); s; s = s.parentNode) p.push(s), (a = s);
                    a === (n.ownerDocument || X) && p.push(a.defaultView || a.parentWindow || e);
                }
                for (r = 0; (s = p[r++]) && !t.isPropagationStopped();)
                    (t.type = r > 1 ? l : d.bindType || h),
                    (u = (de.get(s, "events") || {})[t.type] && de.get(s, "handle")) && u.apply(s, i),
                    (u = c && s[c]) && u.apply && G.acceptData(s) && ((t.result = u.apply(s, i)), !1 === t.result && t.preventDefault());
                return (
                    (t.type = h),
                    o ||
                    t.isDefaultPrevented() ||
                    (d._default && !1 !== d._default.apply(p.pop(), i)) ||
                    !G.acceptData(n) ||
                    (c && G.isFunction(n[h]) && !G.isWindow(n) && ((a = n[c]) && (n[c] = null), (G.event.triggered = h), n[h](), (G.event.triggered = void 0), a && (n[c] = a))),
                        t.result
                );
            }
        },
        dispatch: function (e) {
            e = G.event.fix(e);
            var t,
                i,
                n,
                o,
                r,
                s = [],
                a = R.call(arguments),
                l = (de.get(this, "events") || {})[e.type] || [],
                c = G.event.special[e.type] || {};
            if (((a[0] = e), (e.delegateTarget = this), !c.preDispatch || !1 !== c.preDispatch.call(this, e))) {
                for (s = G.event.handlers.call(this, e, l), t = 0; (o = s[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = o.elem, i = 0; (r = o.handlers[i++]) && !e.isImmediatePropagationStopped();)
                        (!e.namespace_re || e.namespace_re.test(r.namespace)) &&
                        ((e.handleObj = r), (e.data = r.data), void 0 !== (n = ((G.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, a)) && !1 === (e.result = n) && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result;
            }
        },
        handlers: function (e, t) {
            var i,
                n,
                o,
                r,
                s = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && (!e.button || "click" !== e.type))
                for (; l !== this; l = l.parentNode || this)
                    if (!0 !== l.disabled || "click" !== e.type) {
                        for (n = [], i = 0; a > i; i++) void 0 === n[(o = (r = t[i]).selector + " ")] && (n[o] = r.needsContext ? G(o, this).index(l) >= 0 : G.find(o, this, null, [l]).length), n[o] && n.push(r);
                        n.length && s.push({elem: l, handlers: n});
                    }
            return a < t.length && s.push({elem: this, handlers: t.slice(a)}), s;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e;
            },
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, t) {
                var i,
                    n,
                    o,
                    r = t.button;
                return (
                    null == e.pageX &&
                    null != t.clientX &&
                    ((n = (i = e.target.ownerDocument || X).documentElement),
                        (o = i.body),
                        (e.pageX = t.clientX + ((n && n.scrollLeft) || (o && o.scrollLeft) || 0) - ((n && n.clientLeft) || (o && o.clientLeft) || 0)),
                        (e.pageY = t.clientY + ((n && n.scrollTop) || (o && o.scrollTop) || 0) - ((n && n.clientTop) || (o && o.clientTop) || 0))),
                    e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0),
                        e
                );
            },
        },
        fix: function (e) {
            if (e[G.expando]) return e;
            var t,
                i,
                n,
                o = e.type,
                r = e,
                s = this.fixHooks[o];
            for (s || (this.fixHooks[o] = s = be.test(o) ? this.mouseHooks : xe.test(o) ? this.keyHooks : {}), n = s.props ? this.props.concat(s.props) : this.props, e = new G.Event(r), t = n.length; t--;) e[(i = n[t])] = r[i];
            return e.target || (e.target = X), 3 === e.target.nodeType && (e.target = e.target.parentNode), s.filter ? s.filter(e, r) : e;
        },
        special: {
            load: {noBubble: !0},
            focus: {
                trigger: function () {
                    return this !== u() && this.focus ? (this.focus(), !1) : void 0;
                },
                delegateType: "focusin",
            },
            blur: {
                trigger: function () {
                    return this === u() && this.blur ? (this.blur(), !1) : void 0;
                },
                delegateType: "focusout",
            },
            click: {
                trigger: function () {
                    return "checkbox" === this.type && this.click && G.nodeName(this, "input") ? (this.click(), !1) : void 0;
                },
                _default: function (e) {
                    return G.nodeName(e.target, "a");
                },
            },
            beforeunload: {
                postDispatch: function (e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result);
                },
            },
        },
        simulate: function (e, t, i, n) {
            var o = G.extend(new G.Event(), i, {type: e, isSimulated: !0, originalEvent: {}});
            n ? G.event.trigger(o, null, t) : G.event.dispatch.call(t, o), o.isDefaultPrevented() && i.preventDefault();
        },
    }),
        (G.removeEvent = function (e, t, i) {
            e.removeEventListener && e.removeEventListener(t, i, !1);
        }),
        (G.Event = function (e, t) {
            return this instanceof G.Event
                ? (e && e.type ? ((this.originalEvent = e), (this.type = e.type), (this.isDefaultPrevented = e.defaultPrevented || (void 0 === e.defaultPrevented && !1 === e.returnValue) ? l : c)) : (this.type = e),
                t && G.extend(this, t),
                    (this.timeStamp = (e && e.timeStamp) || G.now()),
                    void (this[G.expando] = !0))
                : new G.Event(e, t);
        }),
        (G.Event.prototype = {
            isDefaultPrevented: c,
            isPropagationStopped: c,
            isImmediatePropagationStopped: c,
            preventDefault: function () {
                var e = this.originalEvent;
                (this.isDefaultPrevented = l), e && e.preventDefault && e.preventDefault();
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                (this.isPropagationStopped = l), e && e.stopPropagation && e.stopPropagation();
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                (this.isImmediatePropagationStopped = l), e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation();
            },
        }),
        G.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function (e, t) {
            G.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function (e) {
                    var i,
                        n = e.relatedTarget,
                        o = e.handleObj;
                    return (!n || (n !== this && !G.contains(this, n))) && ((e.type = o.origType), (i = o.handler.apply(this, arguments)), (e.type = t)), i;
                },
            };
        }),
    Y.focusinBubbles ||
    G.each({focus: "focusin", blur: "focusout"}, function (e, t) {
        var i = function (e) {
            G.event.simulate(t, e.target, G.event.fix(e), !0);
        };
        G.event.special[t] = {
            setup: function () {
                var n = this.ownerDocument || this,
                    o = de.access(n, t);
                o || n.addEventListener(e, i, !0), de.access(n, t, (o || 0) + 1);
            },
            teardown: function () {
                var n = this.ownerDocument || this,
                    o = de.access(n, t) - 1;
                o ? de.access(n, t, o) : (n.removeEventListener(e, i, !0), de.remove(n, t));
            },
        };
    }),
        G.fn.extend({
            on: function (e, t, i, n, o) {
                var r, s;
                if ("object" == typeof e) {
                    for (s in ("string" != typeof t && ((i = i || t), (t = void 0)), e)) this.on(s, t, i, e[s], o);
                    return this;
                }
                if ((null == i && null == n ? ((n = t), (i = t = void 0)) : null == n && ("string" == typeof t ? ((n = i), (i = void 0)) : ((n = i), (i = t), (t = void 0))), !1 === n)) n = c;
                else if (!n) return this;
                return (
                    1 === o &&
                    ((r = n),
                        ((n = function (e) {
                            return G().off(e), r.apply(this, arguments);
                        }).guid = r.guid || (r.guid = G.guid++))),
                        this.each(function () {
                            G.event.add(this, e, n, i, t);
                        })
                );
            },
            one: function (e, t, i, n) {
                return this.on(e, t, i, n, 1);
            },
            off: function (e, t, i) {
                var n, o;
                if (e && e.preventDefault && e.handleObj) return (n = e.handleObj), G(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), this;
                if ("object" == typeof e) {
                    for (o in e) this.off(o, t, e[o]);
                    return this;
                }
                return (
                    (!1 === t || "function" == typeof t) && ((i = t), (t = void 0)),
                    !1 === i && (i = c),
                        this.each(function () {
                            G.event.remove(this, e, i, t);
                        })
                );
            },
            trigger: function (e, t) {
                return this.each(function () {
                    G.event.trigger(e, t, this);
                });
            },
            triggerHandler: function (e, t) {
                var i = this[0];
                return i ? G.event.trigger(e, t, i, !0) : void 0;
            },
        });
    var Ce = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Ee = /<([\w:]+)/,
        ke = /<|&#?\w+;/,
        _e = /<(?:script|style|link)/i,
        ze = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Le = /^$|\/(?:java|ecma)script/i,
        Me = /^true\/(.*)/,
        Ie = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Pe = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""],
        };
    (Pe.optgroup = Pe.option),
        (Pe.tbody = Pe.tfoot = Pe.colgroup = Pe.caption = Pe.thead),
        (Pe.th = Pe.td),
        G.extend({
            clone: function (e, t, i) {
                var n,
                    o,
                    r,
                    s,
                    a = e.cloneNode(!0),
                    l = G.contains(e.ownerDocument, e);
                if (!(Y.noCloneChecked || (1 !== e.nodeType && 11 !== e.nodeType) || G.isXMLDoc(e))) for (s = g(a), n = 0, o = (r = g(e)).length; o > n; n++) v(r[n], s[n]);
                if (t)
                    if (i) for (r = r || g(e), s = s || g(a), n = 0, o = r.length; o > n; n++) m(r[n], s[n]);
                    else m(e, a);
                return (s = g(a, "script")).length > 0 && f(s, !l && g(e, "script")), a;
            },
            buildFragment: function (e, t, i, n) {
                for (var o, r, s, a, l, c, u = t.createDocumentFragment(), d = [], p = 0, h = e.length; h > p; p++)
                    if ((o = e[p]) || 0 === o)
                        if ("object" === G.type(o)) G.merge(d, o.nodeType ? [o] : o);
                        else if (ke.test(o)) {
                            for (r = r || u.appendChild(t.createElement("div")), s = (Ee.exec(o) || ["", ""])[1].toLowerCase(), a = Pe[s] || Pe._default, r.innerHTML = a[1] + o.replace(Ce, "<$1></$2>") + a[2], c = a[0]; c--;)
                                r = r.lastChild;
                            G.merge(d, r.childNodes), ((r = u.firstChild).textContent = "");
                        } else d.push(t.createTextNode(o));
                for (u.textContent = "", p = 0; (o = d[p++]);)
                    if ((!n || -1 === G.inArray(o, n)) && ((l = G.contains(o.ownerDocument, o)), (r = g(u.appendChild(o), "script")), l && f(r), i)) for (c = 0; (o = r[c++]);) Le.test(o.type || "") && i.push(o);
                return u;
            },
            cleanData: function (e) {
                for (var t, i, n, o, r = G.event.special, s = 0; void 0 !== (i = e[s]); s++) {
                    if (G.acceptData(i) && (o = i[de.expando]) && (t = de.cache[o])) {
                        if (t.events) for (n in t.events) r[n] ? G.event.remove(i, n) : G.removeEvent(i, n, t.handle);
                        de.cache[o] && delete de.cache[o];
                    }
                    delete pe.cache[i[pe.expando]];
                }
            },
        }),
        G.fn.extend({
            text: function (e) {
                return ue(
                    this,
                    function (e) {
                        return void 0 === e
                            ? G.text(this)
                            : this.empty().each(function () {
                                (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e);
                            });
                    },
                    null,
                    e,
                    arguments.length
                );
            },
            append: function () {
                return this.domManip(arguments, function (e) {
                    (1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType) || d(this, e).appendChild(e);
                });
            },
            prepend: function () {
                return this.domManip(arguments, function (e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = d(this, e);
                        t.insertBefore(e, t.firstChild);
                    }
                });
            },
            before: function () {
                return this.domManip(arguments, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this);
                });
            },
            after: function () {
                return this.domManip(arguments, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                });
            },
            remove: function (e, t) {
                for (var i, n = e ? G.filter(e, this) : this, o = 0; null != (i = n[o]); o++)
                    t || 1 !== i.nodeType || G.cleanData(g(i)), i.parentNode && (t && G.contains(i.ownerDocument, i) && f(g(i, "script")), i.parentNode.removeChild(i));
                return this;
            },
            empty: function () {
                for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (G.cleanData(g(e, !1)), (e.textContent = ""));
                return this;
            },
            clone: function (e, t) {
                return (
                    (e = null != e && e),
                        (t = null == t ? e : t),
                        this.map(function () {
                            return G.clone(this, e, t);
                        })
                );
            },
            html: function (e) {
                return ue(
                    this,
                    function (e) {
                        var t = this[0] || {},
                            i = 0,
                            n = this.length;
                        if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                        if ("string" == typeof e && !_e.test(e) && !Pe[(Ee.exec(e) || ["", ""])[1].toLowerCase()]) {
                            e = e.replace(Ce, "<$1></$2>");
                            try {
                                for (; n > i; i++) 1 === (t = this[i] || {}).nodeType && (G.cleanData(g(t, !1)), (t.innerHTML = e));
                                t = 0;
                            } catch (e) {
                            }
                        }
                        t && this.empty().append(e);
                    },
                    null,
                    e,
                    arguments.length
                );
            },
            replaceWith: function () {
                var e = arguments[0];
                return (
                    this.domManip(arguments, function (t) {
                        (e = this.parentNode), G.cleanData(g(this)), e && e.replaceChild(t, this);
                    }),
                        e && (e.length || e.nodeType) ? this : this.remove()
                );
            },
            detach: function (e) {
                return this.remove(e, !0);
            },
            domManip: function (e, t) {
                e = F.apply([], e);
                var i,
                    n,
                    o,
                    r,
                    s,
                    a,
                    l = 0,
                    c = this.length,
                    u = this,
                    d = c - 1,
                    f = e[0],
                    m = G.isFunction(f);
                if (m || (c > 1 && "string" == typeof f && !Y.checkClone && ze.test(f)))
                    return this.each(function (i) {
                        var n = u.eq(i);
                        m && (e[0] = f.call(this, i, n.html())), n.domManip(e, t);
                    });
                if (c && ((n = (i = G.buildFragment(e, this[0].ownerDocument, !1, this)).firstChild), 1 === i.childNodes.length && (i = n), n)) {
                    for (r = (o = G.map(g(i, "script"), p)).length; c > l; l++) (s = i), l !== d && ((s = G.clone(s, !0, !0)), r && G.merge(o, g(s, "script"))), t.call(this[l], s, l);
                    if (r)
                        for (a = o[o.length - 1].ownerDocument, G.map(o, h), l = 0; r > l; l++)
                            (s = o[l]), Le.test(s.type || "") && !de.access(s, "globalEval") && G.contains(a, s) && (s.src ? G._evalUrl && G._evalUrl(s.src) : G.globalEval(s.textContent.replace(Ie, "")));
                }
                return this;
            },
        }),
        G.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function (e, t) {
            G.fn[e] = function (e) {
                for (var i, n = [], o = G(e), r = o.length - 1, s = 0; r >= s; s++) (i = s === r ? this : this.clone(!0)), G(o[s])[t](i), H.apply(n, i.get());
                return this.pushStack(n);
            };
        });
    var De,
        Oe = {},
        Ae = /^margin/,
        $e = new RegExp("^(" + me + ")(?!px)[a-z%]+$", "i"),
        Ne = function (t) {
            return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null);
        };
    !(function () {
        function t() {
            (s.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute"), (s.innerHTML = ""), o.appendChild(r);
            var t = e.getComputedStyle(s, null);
            (i = "1%" !== t.top), (n = "4px" === t.width), o.removeChild(r);
        }

        var i,
            n,
            o = X.documentElement,
            r = X.createElement("div"),
            s = X.createElement("div");
        s.style &&
        ((s.style.backgroundClip = "content-box"),
            (s.cloneNode(!0).style.backgroundClip = ""),
            (Y.clearCloneStyle = "content-box" === s.style.backgroundClip),
            (r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute"),
            r.appendChild(s),
        e.getComputedStyle &&
        G.extend(Y, {
            pixelPosition: function () {
                return t(), i;
            },
            boxSizingReliable: function () {
                return null == n && t(), n;
            },
            reliableMarginRight: function () {
                var t,
                    i = s.appendChild(X.createElement("div"));
                return (
                    (i.style.cssText = s.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
                        (i.style.marginRight = i.style.width = "0"),
                        (s.style.width = "1px"),
                        o.appendChild(r),
                        (t = !parseFloat(e.getComputedStyle(i, null).marginRight)),
                        o.removeChild(r),
                        s.removeChild(i),
                        t
                );
            },
        }));
    })(),
        (G.swap = function (e, t, i, n) {
            var o,
                r,
                s = {};
            for (r in t) (s[r] = e.style[r]), (e.style[r] = t[r]);
            for (r in ((o = i.apply(e, n || [])), t)) e.style[r] = s[r];
            return o;
        });
    var Re = /^(none|table(?!-c[ea]).+)/,
        Fe = new RegExp("^(" + me + ")(.*)$", "i"),
        He = new RegExp("^([+-])=(" + me + ")", "i"),
        je = {position: "absolute", visibility: "hidden", display: "block"},
        We = {letterSpacing: "0", fontWeight: "400"},
        Be = ["Webkit", "O", "Moz", "ms"];
    G.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var i = x(e, "opacity");
                        return "" === i ? "1" : i;
                    }
                },
            },
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {float: "cssFloat"},
        style: function (e, t, i, n) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o,
                    r,
                    s,
                    a = G.camelCase(t),
                    l = e.style;
                return (
                    (t = G.cssProps[a] || (G.cssProps[a] = T(l, a))),
                        (s = G.cssHooks[t] || G.cssHooks[a]),
                        void 0 === i
                            ? s && "get" in s && void 0 !== (o = s.get(e, !1, n))
                            ? o
                            : l[t]
                            : ("string" === (r = typeof i) && (o = He.exec(i)) && ((i = (o[1] + 1) * o[2] + parseFloat(G.css(e, t))), (r = "number")),
                                void (
                                    null != i &&
                                    i == i &&
                                    ("number" !== r || G.cssNumber[a] || (i += "px"), Y.clearCloneStyle || "" !== i || 0 !== t.indexOf("background") || (l[t] = "inherit"), (s && "set" in s && void 0 === (i = s.set(e, i, n))) || (l[t] = i))
                                ))
                );
            }
        },
        css: function (e, t, i, n) {
            var o,
                r,
                s,
                a = G.camelCase(t);
            return (
                (t = G.cssProps[a] || (G.cssProps[a] = T(e.style, a))),
                (s = G.cssHooks[t] || G.cssHooks[a]) && "get" in s && (o = s.get(e, !0, i)),
                void 0 === o && (o = x(e, t, n)),
                "normal" === o && t in We && (o = We[t]),
                    "" === i || i ? ((r = parseFloat(o)), !0 === i || G.isNumeric(r) ? r || 0 : o) : o
            );
        },
    }),
        G.each(["height", "width"], function (e, t) {
            G.cssHooks[t] = {
                get: function (e, i, n) {
                    return i
                        ? Re.test(G.css(e, "display")) && 0 === e.offsetWidth
                            ? G.swap(e, je, function () {
                                return E(e, t, n);
                            })
                            : E(e, t, n)
                        : void 0;
                },
                set: function (e, i, n) {
                    var o = n && Ne(e);
                    return S(0, i, n ? C(e, t, n, "border-box" === G.css(e, "boxSizing", !1, o), o) : 0);
                },
            };
        }),
        (G.cssHooks.marginRight = b(Y.reliableMarginRight, function (e, t) {
            return t ? G.swap(e, {display: "inline-block"}, x, [e, "marginRight"]) : void 0;
        })),
        G.each({margin: "", padding: "", border: "Width"}, function (e, t) {
            (G.cssHooks[e + t] = {
                expand: function (i) {
                    for (var n = 0, o = {}, r = "string" == typeof i ? i.split(" ") : [i]; 4 > n; n++) o[e + ge[n] + t] = r[n] || r[n - 2] || r[0];
                    return o;
                },
            }),
            Ae.test(e) || (G.cssHooks[e + t].set = S);
        }),
        G.fn.extend({
            css: function (e, t) {
                return ue(
                    this,
                    function (e, t, i) {
                        var n,
                            o,
                            r = {},
                            s = 0;
                        if (G.isArray(t)) {
                            for (n = Ne(e), o = t.length; o > s; s++) r[t[s]] = G.css(e, t[s], !1, n);
                            return r;
                        }
                        return void 0 !== i ? G.style(e, t, i) : G.css(e, t);
                    },
                    e,
                    t,
                    arguments.length > 1
                );
            },
            show: function () {
                return k(this, !0);
            },
            hide: function () {
                return k(this);
            },
            toggle: function (e) {
                return "boolean" == typeof e
                    ? e
                        ? this.show()
                        : this.hide()
                    : this.each(function () {
                        ve(this) ? G(this).show() : G(this).hide();
                    });
            },
        }),
        (G.Tween = _),
        (_.prototype = {
            constructor: _,
            init: function (e, t, i, n, o, r) {
                (this.elem = e), (this.prop = i), (this.easing = o || "swing"), (this.options = t), (this.start = this.now = this.cur()), (this.end = n), (this.unit = r || (G.cssNumber[i] ? "" : "px"));
            },
            cur: function () {
                var e = _.propHooks[this.prop];
                return e && e.get ? e.get(this) : _.propHooks._default.get(this);
            },
            run: function (e) {
                var t,
                    i = _.propHooks[this.prop];
                return (
                    (this.pos = t = this.options.duration ? G.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e),
                        (this.now = (this.end - this.start) * t + this.start),
                    this.options.step && this.options.step.call(this.elem, this.now, this),
                        i && i.set ? i.set(this) : _.propHooks._default.set(this),
                        this
                );
            },
        }),
        (_.prototype.init.prototype = _.prototype),
        (_.propHooks = {
            _default: {
                get: function (e) {
                    var t;
                    return null == e.elem[e.prop] || (e.elem.style && null != e.elem.style[e.prop]) ? ((t = G.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0) : e.elem[e.prop];
                },
                set: function (e) {
                    G.fx.step[e.prop] ? G.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[G.cssProps[e.prop]] || G.cssHooks[e.prop]) ? G.style(e.elem, e.prop, e.now + e.unit) : (e.elem[e.prop] = e.now);
                },
            },
        }),
        (_.propHooks.scrollTop = _.propHooks.scrollLeft = {
            set: function (e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
            },
        }),
        (G.easing = {
            linear: function (e) {
                return e;
            },
            swing: function (e) {
                return 0.5 - Math.cos(e * Math.PI) / 2;
            },
        }),
        (G.fx = _.prototype.init),
        (G.fx.step = {});
    var qe,
        Ye,
        Xe = /^(?:toggle|show|hide)$/,
        Ve = new RegExp("^(?:([+-])=|)(" + me + ")([a-z%]*)$", "i"),
        Ge = /queueHooks$/,
        Ue = [
            function (e, t, i) {
                var n,
                    o,
                    r,
                    s,
                    a,
                    l,
                    c,
                    u = this,
                    d = {},
                    p = e.style,
                    h = e.nodeType && ve(e),
                    f = de.get(e, "fxshow");
                for (n in (i.queue ||
                (null == (a = G._queueHooks(e, "fx")).unqueued &&
                ((a.unqueued = 0),
                    (l = a.empty.fire),
                    (a.empty.fire = function () {
                        a.unqueued || l();
                    })),
                    a.unqueued++,
                    u.always(function () {
                        u.always(function () {
                            a.unqueued--, G.queue(e, "fx").length || a.empty.fire();
                        });
                    })),
                1 === e.nodeType &&
                ("height" in t || "width" in t) &&
                ((i.overflow = [p.overflow, p.overflowX, p.overflowY]), "inline" === ("none" === (c = G.css(e, "display")) ? de.get(e, "olddisplay") || w(e.nodeName) : c) && "none" === G.css(e, "float") && (p.display = "inline-block")),
                i.overflow &&
                ((p.overflow = "hidden"),
                    u.always(function () {
                        (p.overflow = i.overflow[0]), (p.overflowX = i.overflow[1]), (p.overflowY = i.overflow[2]);
                    })),
                    t))
                    if (((o = t[n]), Xe.exec(o))) {
                        if ((delete t[n], (r = r || "toggle" === o), o === (h ? "hide" : "show"))) {
                            if ("show" !== o || !f || void 0 === f[n]) continue;
                            h = !0;
                        }
                        d[n] = (f && f[n]) || G.style(e, n);
                    } else c = void 0;
                if (G.isEmptyObject(d)) "inline" === ("none" === c ? w(e.nodeName) : c) && (p.display = c);
                else
                    for (n in (f ? "hidden" in f && (h = f.hidden) : (f = de.access(e, "fxshow", {})),
                    r && (f.hidden = !h),
                        h
                            ? G(e).show()
                            : u.done(function () {
                                G(e).hide();
                            }),
                        u.done(function () {
                            var t;
                            for (t in (de.remove(e, "fxshow"), d)) G.style(e, t, d[t]);
                        }),
                        d))
                        (s = M(h ? f[n] : 0, n, u)), n in f || ((f[n] = s.start), h && ((s.end = s.start), (s.start = "width" === n || "height" === n ? 1 : 0)));
            },
        ],
        Qe = {
            "*": [
                function (e, t) {
                    var i = this.createTween(e, t),
                        n = i.cur(),
                        o = Ve.exec(t),
                        r = (o && o[3]) || (G.cssNumber[e] ? "" : "px"),
                        s = (G.cssNumber[e] || ("px" !== r && +n)) && Ve.exec(G.css(i.elem, e)),
                        a = 1,
                        l = 20;
                    if (s && s[3] !== r) {
                        (r = r || s[3]), (o = o || []), (s = +n || 1);
                        do {
                            (s /= a = a || ".5"), G.style(i.elem, e, s + r);
                        } while (a !== (a = i.cur() / n) && 1 !== a && --l);
                    }
                    return o && ((s = i.start = +s || +n || 0), (i.unit = r), (i.end = o[1] ? s + (o[1] + 1) * o[2] : +o[2])), i;
                },
            ],
        };
    (G.Animation = G.extend(I, {
        tweener: function (e, t) {
            G.isFunction(e) ? ((t = e), (e = ["*"])) : (e = e.split(" "));
            for (var i, n = 0, o = e.length; o > n; n++) (i = e[n]), (Qe[i] = Qe[i] || []), Qe[i].unshift(t);
        },
        prefilter: function (e, t) {
            t ? Ue.unshift(e) : Ue.push(e);
        },
    })),
        (G.speed = function (e, t, i) {
            var n = e && "object" == typeof e ? G.extend({}, e) : {
                complete: i || (!i && t) || (G.isFunction(e) && e),
                duration: e,
                easing: (i && t) || (t && !G.isFunction(t) && t)
            };
            return (
                (n.duration = G.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in G.fx.speeds ? G.fx.speeds[n.duration] : G.fx.speeds._default),
                (null == n.queue || !0 === n.queue) && (n.queue = "fx"),
                    (n.old = n.complete),
                    (n.complete = function () {
                        G.isFunction(n.old) && n.old.call(this), n.queue && G.dequeue(this, n.queue);
                    }),
                    n
            );
        }),
        G.fn.extend({
            fadeTo: function (e, t, i, n) {
                return this.filter(ve).css("opacity", 0).show().end().animate({opacity: t}, e, i, n);
            },
            animate: function (e, t, i, n) {
                var o = G.isEmptyObject(e),
                    r = G.speed(t, i, n),
                    s = function () {
                        var t = I(this, G.extend({}, e), r);
                        (o || de.get(this, "finish")) && t.stop(!0);
                    };
                return (s.finish = s), o || !1 === r.queue ? this.each(s) : this.queue(r.queue, s);
            },
            stop: function (e, t, i) {
                var n = function (e) {
                    var t = e.stop;
                    delete e.stop, t(i);
                };
                return (
                    "string" != typeof e && ((i = t), (t = e), (e = void 0)),
                    t && !1 !== e && this.queue(e || "fx", []),
                        this.each(function () {
                            var t = !0,
                                o = null != e && e + "queueHooks",
                                r = G.timers,
                                s = de.get(this);
                            if (o) s[o] && s[o].stop && n(s[o]);
                            else for (o in s) s[o] && s[o].stop && Ge.test(o) && n(s[o]);
                            for (o = r.length; o--;) r[o].elem !== this || (null != e && r[o].queue !== e) || (r[o].anim.stop(i), (t = !1), r.splice(o, 1));
                            (t || !i) && G.dequeue(this, e);
                        })
                );
            },
            finish: function (e) {
                return (
                    !1 !== e && (e = e || "fx"),
                        this.each(function () {
                            var t,
                                i = de.get(this),
                                n = i[e + "queue"],
                                o = i[e + "queueHooks"],
                                r = G.timers,
                                s = n ? n.length : 0;
                            for (i.finish = !0, G.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0), r.splice(t, 1));
                            for (t = 0; s > t; t++) n[t] && n[t].finish && n[t].finish.call(this);
                            delete i.finish;
                        })
                );
            },
        }),
        G.each(["toggle", "show", "hide"], function (e, t) {
            var i = G.fn[t];
            G.fn[t] = function (e, n, o) {
                return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(L(t, !0), e, n, o);
            };
        }),
        G.each({
            slideDown: L("show"),
            slideUp: L("hide"),
            slideToggle: L("toggle"),
            fadeIn: {opacity: "show"},
            fadeOut: {opacity: "hide"},
            fadeToggle: {opacity: "toggle"}
        }, function (e, t) {
            G.fn[e] = function (e, i, n) {
                return this.animate(t, e, i, n);
            };
        }),
        (G.timers = []),
        (G.fx.tick = function () {
            var e,
                t = 0,
                i = G.timers;
            for (qe = G.now(); t < i.length; t++) (e = i[t])() || i[t] !== e || i.splice(t--, 1);
            i.length || G.fx.stop(), (qe = void 0);
        }),
        (G.fx.timer = function (e) {
            G.timers.push(e), e() ? G.fx.start() : G.timers.pop();
        }),
        (G.fx.interval = 13),
        (G.fx.start = function () {
            Ye || (Ye = setInterval(G.fx.tick, G.fx.interval));
        }),
        (G.fx.stop = function () {
            clearInterval(Ye), (Ye = null);
        }),
        (G.fx.speeds = {slow: 600, fast: 200, _default: 400}),
        (G.fn.delay = function (e, t) {
            return (
                (e = (G.fx && G.fx.speeds[e]) || e),
                    (t = t || "fx"),
                    this.queue(t, function (t, i) {
                        var n = setTimeout(t, e);
                        i.stop = function () {
                            clearTimeout(n);
                        };
                    })
            );
        }),
        (function () {
            var e = X.createElement("input"),
                t = X.createElement("select"),
                i = t.appendChild(X.createElement("option"));
            (e.type = "checkbox"),
                (Y.checkOn = "" !== e.value),
                (Y.optSelected = i.selected),
                (t.disabled = !0),
                (Y.optDisabled = !i.disabled),
                ((e = X.createElement("input")).value = "t"),
                (e.type = "radio"),
                (Y.radioValue = "t" === e.value);
        })();
    var Ze,
        Ke = G.expr.attrHandle;
    G.fn.extend({
        attr: function (e, t) {
            return ue(this, G.attr, e, t, arguments.length > 1);
        },
        removeAttr: function (e) {
            return this.each(function () {
                G.removeAttr(this, e);
            });
        },
    }),
        G.extend({
            attr: function (e, t, i) {
                var n,
                    o,
                    r = e.nodeType;
                if (e && 3 !== r && 8 !== r && 2 !== r)
                    return typeof e.getAttribute === we
                        ? G.prop(e, t, i)
                        : ((1 === r && G.isXMLDoc(e)) || ((t = t.toLowerCase()), (n = G.attrHooks[t] || (G.expr.match.bool.test(t) ? Ze : void 0))),
                            void 0 === i
                                ? n && "get" in n && null !== (o = n.get(e, t))
                                ? o
                                : null == (o = G.find.attr(e, t))
                                    ? void 0
                                    : o
                                : null !== i
                                ? n && "set" in n && void 0 !== (o = n.set(e, i, t))
                                    ? o
                                    : (e.setAttribute(t, i + ""), i)
                                : void G.removeAttr(e, t));
            },
            removeAttr: function (e, t) {
                var i,
                    n,
                    o = 0,
                    r = t && t.match(le);
                if (r && 1 === e.nodeType) for (; (i = r[o++]);) (n = G.propFix[i] || i), G.expr.match.bool.test(i) && (e[n] = !1), e.removeAttribute(i);
            },
            attrHooks: {
                type: {
                    set: function (e, t) {
                        if (!Y.radioValue && "radio" === t && G.nodeName(e, "input")) {
                            var i = e.value;
                            return e.setAttribute("type", t), i && (e.value = i), t;
                        }
                    },
                },
            },
        }),
        (Ze = {
            set: function (e, t, i) {
                return !1 === t ? G.removeAttr(e, i) : e.setAttribute(i, i), i;
            },
        }),
        G.each(G.expr.match.bool.source.match(/\w+/g), function (e, t) {
            var i = Ke[t] || G.find.attr;
            Ke[t] = function (e, t, n) {
                var o, r;
                return n || ((r = Ke[t]), (Ke[t] = o), (o = null != i(e, t, n) ? t.toLowerCase() : null), (Ke[t] = r)), o;
            };
        });
    var Je = /^(?:input|select|textarea|button)$/i;
    G.fn.extend({
        prop: function (e, t) {
            return ue(this, G.prop, e, t, arguments.length > 1);
        },
        removeProp: function (e) {
            return this.each(function () {
                delete this[G.propFix[e] || e];
            });
        },
    }),
        G.extend({
            propFix: {for: "htmlFor", class: "className"},
            prop: function (e, t, i) {
                var n,
                    o,
                    r = e.nodeType;
                if (e && 3 !== r && 8 !== r && 2 !== r)
                    return (
                        (1 !== r || !G.isXMLDoc(e)) && ((t = G.propFix[t] || t), (o = G.propHooks[t])),
                            void 0 !== i ? (o && "set" in o && void 0 !== (n = o.set(e, i, t)) ? n : (e[t] = i)) : o && "get" in o && null !== (n = o.get(e, t)) ? n : e[t]
                    );
            },
            propHooks: {
                tabIndex: {
                    get: function (e) {
                        return e.hasAttribute("tabindex") || Je.test(e.nodeName) || e.href ? e.tabIndex : -1;
                    },
                },
            },
        }),
    Y.optSelected ||
    (G.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null;
        },
    }),
        G.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
            G.propFix[this.toLowerCase()] = this;
        });
    var et = /[\t\r\n\f]/g;
    G.fn.extend({
        addClass: function (e) {
            var t,
                i,
                n,
                o,
                r,
                s,
                a = "string" == typeof e && e,
                l = 0,
                c = this.length;
            if (G.isFunction(e))
                return this.each(function (t) {
                    G(this).addClass(e.call(this, t, this.className));
                });
            if (a)
                for (t = (e || "").match(le) || []; c > l; l++)
                    if ((n = 1 === (i = this[l]).nodeType && (i.className ? (" " + i.className + " ").replace(et, " ") : " "))) {
                        for (r = 0; (o = t[r++]);) n.indexOf(" " + o + " ") < 0 && (n += o + " ");
                        (s = G.trim(n)), i.className !== s && (i.className = s);
                    }
            return this;
        },
        removeClass: function (e) {
            var t,
                i,
                n,
                o,
                r,
                s,
                a = 0 === arguments.length || ("string" == typeof e && e),
                l = 0,
                c = this.length;
            if (G.isFunction(e))
                return this.each(function (t) {
                    G(this).removeClass(e.call(this, t, this.className));
                });
            if (a)
                for (t = (e || "").match(le) || []; c > l; l++)
                    if ((n = 1 === (i = this[l]).nodeType && (i.className ? (" " + i.className + " ").replace(et, " ") : ""))) {
                        for (r = 0; (o = t[r++]);) for (; n.indexOf(" " + o + " ") >= 0;) n = n.replace(" " + o + " ", " ");
                        (s = e ? G.trim(n) : ""), i.className !== s && (i.className = s);
                    }
            return this;
        },
        toggleClass: function (e, t) {
            var i = typeof e;
            return "boolean" == typeof t && "string" === i
                ? t
                    ? this.addClass(e)
                    : this.removeClass(e)
                : this.each(
                    G.isFunction(e)
                        ? function (i) {
                            G(this).toggleClass(e.call(this, i, this.className, t), t);
                        }
                        : function () {
                            if ("string" === i) for (var t, n = 0, o = G(this), r = e.match(le) || []; (t = r[n++]);) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                            else (i === we || "boolean" === i) && (this.className && de.set(this, "__className__", this.className), (this.className = this.className || !1 === e ? "" : de.get(this, "__className__") || ""));
                        }
                );
        },
        hasClass: function (e) {
            for (var t = " " + e + " ", i = 0, n = this.length; n > i; i++) if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(et, " ").indexOf(t) >= 0) return !0;
            return !1;
        },
    });
    var tt = /\r/g;
    G.fn.extend({
        val: function (e) {
            var t,
                i,
                n,
                o = this[0];
            return arguments.length
                ? ((n = G.isFunction(e)),
                    this.each(function (i) {
                        var o;
                        1 === this.nodeType &&
                        (null == (o = n ? e.call(this, i, G(this).val()) : e)
                            ? (o = "")
                            : "number" == typeof o
                                ? (o += "")
                                : G.isArray(o) &&
                                (o = G.map(o, function (e) {
                                    return null == e ? "" : e + "";
                                })),
                        ((t = G.valHooks[this.type] || G.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, o, "value")) || (this.value = o));
                    }))
                : o
                    ? (t = G.valHooks[o.type] || G.valHooks[o.nodeName.toLowerCase()]) && "get" in t && void 0 !== (i = t.get(o, "value"))
                        ? i
                        : "string" == typeof (i = o.value)
                            ? i.replace(tt, "")
                            : null == i
                                ? ""
                                : i
                    : void 0;
        },
    }),
        G.extend({
            valHooks: {
                option: {
                    get: function (e) {
                        var t = G.find.attr(e, "value");
                        return null != t ? t : G.trim(G.text(e));
                    },
                },
                select: {
                    get: function (e) {
                        for (var t, i, n = e.options, o = e.selectedIndex, r = "select-one" === e.type || 0 > o, s = r ? null : [], a = r ? o + 1 : n.length, l = 0 > o ? a : r ? o : 0; a > l; l++)
                            if (!((!(i = n[l]).selected && l !== o) || (Y.optDisabled ? i.disabled : null !== i.getAttribute("disabled")) || (i.parentNode.disabled && G.nodeName(i.parentNode, "optgroup")))) {
                                if (((t = G(i).val()), r)) return t;
                                s.push(t);
                            }
                        return s;
                    },
                    set: function (e, t) {
                        for (var i, n, o = e.options, r = G.makeArray(t), s = o.length; s--;) ((n = o[s]).selected = G.inArray(n.value, r) >= 0) && (i = !0);
                        return i || (e.selectedIndex = -1), r;
                    },
                },
            },
        }),
        G.each(["radio", "checkbox"], function () {
            (G.valHooks[this] = {
                set: function (e, t) {
                    return G.isArray(t) ? (e.checked = G.inArray(G(e).val(), t) >= 0) : void 0;
                },
            }),
            Y.checkOn ||
            (G.valHooks[this].get = function (e) {
                return null === e.getAttribute("value") ? "on" : e.value;
            });
        }),
        G.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (
            e,
            t
        ) {
            G.fn[t] = function (e, i) {
                return arguments.length > 0 ? this.on(t, null, e, i) : this.trigger(t);
            };
        }),
        G.fn.extend({
            hover: function (e, t) {
                return this.mouseenter(e).mouseleave(t || e);
            },
            bind: function (e, t, i) {
                return this.on(e, null, t, i);
            },
            unbind: function (e, t) {
                return this.off(e, null, t);
            },
            delegate: function (e, t, i, n) {
                return this.on(t, e, i, n);
            },
            undelegate: function (e, t, i) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i);
            },
        });
    var it = G.now(),
        nt = /\?/;
    (G.parseJSON = function (e) {
        return JSON.parse(e + "");
    }),
        (G.parseXML = function (e) {
            var t;
            if (!e || "string" != typeof e) return null;
            try {
                t = new DOMParser().parseFromString(e, "text/xml");
            } catch (e) {
                t = void 0;
            }
            return (!t || t.getElementsByTagName("parsererror").length) && G.error("Invalid XML: " + e), t;
        });
    var ot = /#.*$/,
        rt = /([?&])_=[^&]*/,
        st = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        at = /^(?:GET|HEAD)$/,
        lt = /^\/\//,
        ct = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        ut = {},
        dt = {},
        pt = "*/".concat("*"),
        ht = e.location.href,
        ft = ct.exec(ht.toLowerCase()) || [];
    G.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ht,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ft[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": pt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
            converters: {"* text": String, "text html": !0, "text json": G.parseJSON, "text xml": G.parseXML},
            flatOptions: {url: !0, context: !0},
        },
        ajaxSetup: function (e, t) {
            return t ? O(O(e, G.ajaxSettings), t) : O(G.ajaxSettings, e);
        },
        ajaxPrefilter: P(ut),
        ajaxTransport: P(dt),
        ajax: function (e, t) {
            function i(e, t, i, s) {
                var l,
                    u,
                    v,
                    y,
                    x,
                    T = t;
                2 !== w &&
                ((w = 2),
                a && clearTimeout(a),
                    (n = void 0),
                    (r = s || ""),
                    (b.readyState = e > 0 ? 4 : 0),
                    (l = (e >= 200 && 300 > e) || 304 === e),
                i &&
                (y = (function (e, t, i) {
                    for (var n, o, r, s, a = e.contents, l = e.dataTypes; "*" === l[0];) l.shift(), void 0 === n && (n = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (n)
                        for (o in a)
                            if (a[o] && a[o].test(n)) {
                                l.unshift(o);
                                break;
                            }
                    if (l[0] in i) r = l[0];
                    else {
                        for (o in i) {
                            if (!l[0] || e.converters[o + " " + l[0]]) {
                                r = o;
                                break;
                            }
                            s || (s = o);
                        }
                        r = r || s;
                    }
                    return r ? (r !== l[0] && l.unshift(r), i[r]) : void 0;
                })(d, b, i)),
                    (y = (function (e, t, i, n) {
                        var o,
                            r,
                            s,
                            a,
                            l,
                            c = {},
                            u = e.dataTypes.slice();
                        if (u[1]) for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
                        for (r = u.shift(); r;)
                            if ((e.responseFields[r] && (i[e.responseFields[r]] = t), !l && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)), (l = r), (r = u.shift())))
                                if ("*" === r) r = l;
                                else if ("*" !== l && l !== r) {
                                    if (!(s = c[l + " " + r] || c["* " + r]))
                                        for (o in c)
                                            if ((a = o.split(" "))[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                                                !0 === s ? (s = c[o]) : !0 !== c[o] && ((r = a[0]), u.unshift(a[1]));
                                                break;
                                            }
                                    if (!0 !== s)
                                        if (s && e.throws) t = s(t);
                                        else
                                            try {
                                                t = s(t);
                                            } catch (e) {
                                                return {
                                                    state: "parsererror",
                                                    error: s ? e : "No conversion from " + l + " to " + r
                                                };
                                            }
                                }
                        return {state: "success", data: t};
                    })(d, y, b, l)),
                    l
                        ? (d.ifModified && ((x = b.getResponseHeader("Last-Modified")) && (G.lastModified[o] = x), (x = b.getResponseHeader("etag")) && (G.etag[o] = x)),
                            204 === e || "HEAD" === d.type ? (T = "nocontent") : 304 === e ? (T = "notmodified") : ((T = y.state), (u = y.data), (l = !(v = y.error))))
                        : ((v = T), (e || !T) && ((T = "error"), 0 > e && (e = 0))),
                    (b.status = e),
                    (b.statusText = (t || T) + ""),
                    l ? f.resolveWith(p, [u, T, b]) : f.rejectWith(p, [b, T, v]),
                    b.statusCode(g),
                    (g = void 0),
                c && h.trigger(l ? "ajaxSuccess" : "ajaxError", [b, d, l ? u : v]),
                    m.fireWith(p, [b, T]),
                c && (h.trigger("ajaxComplete", [b, d]), --G.active || G.event.trigger("ajaxStop")));
            }

            "object" == typeof e && ((t = e), (e = void 0)), (t = t || {});
            var n,
                o,
                r,
                s,
                a,
                l,
                c,
                u,
                d = G.ajaxSetup({}, t),
                p = d.context || d,
                h = d.context && (p.nodeType || p.jquery) ? G(p) : G.event,
                f = G.Deferred(),
                m = G.Callbacks("once memory"),
                g = d.statusCode || {},
                v = {},
                y = {},
                w = 0,
                x = "canceled",
                b = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (2 === w) {
                            if (!s) for (s = {}; (t = st.exec(r));) s[t[1].toLowerCase()] = t[2];
                            t = s[e.toLowerCase()];
                        }
                        return null == t ? null : t;
                    },
                    getAllResponseHeaders: function () {
                        return 2 === w ? r : null;
                    },
                    setRequestHeader: function (e, t) {
                        var i = e.toLowerCase();
                        return w || ((e = y[i] = y[i] || e), (v[e] = t)), this;
                    },
                    overrideMimeType: function (e) {
                        return w || (d.mimeType = e), this;
                    },
                    statusCode: function (e) {
                        var t;
                        if (e)
                            if (2 > w) for (t in e) g[t] = [g[t], e[t]];
                            else b.always(e[b.status]);
                        return this;
                    },
                    abort: function (e) {
                        var t = e || x;
                        return n && n.abort(t), i(0, t), this;
                    },
                };
            if (
                ((f.promise(b).complete = m.add),
                    (b.success = b.done),
                    (b.error = b.fail),
                    (d.url = ((e || d.url || ht) + "").replace(ot, "").replace(lt, ft[1] + "//")),
                    (d.type = t.method || t.type || d.method || d.type),
                    (d.dataTypes = G.trim(d.dataType || "*")
                        .toLowerCase()
                        .match(le) || [""]),
                null == d.crossDomain && ((l = ct.exec(d.url.toLowerCase())), (d.crossDomain = !(!l || (l[1] === ft[1] && l[2] === ft[2] && (l[3] || ("http:" === l[1] ? "80" : "443")) === (ft[3] || ("http:" === ft[1] ? "80" : "443")))))),
                d.data && d.processData && "string" != typeof d.data && (d.data = G.param(d.data, d.traditional)),
                    D(ut, d, t, b),
                2 === w)
            )
                return b;
            for (u in ((c = G.event && d.global) && 0 == G.active++ && G.event.trigger("ajaxStart"),
                (d.type = d.type.toUpperCase()),
                (d.hasContent = !at.test(d.type)),
                (o = d.url),
            d.hasContent || (d.data && ((o = d.url += (nt.test(o) ? "&" : "?") + d.data), delete d.data), !1 === d.cache && (d.url = rt.test(o) ? o.replace(rt, "$1_=" + it++) : o + (nt.test(o) ? "&" : "?") + "_=" + it++)),
            d.ifModified && (G.lastModified[o] && b.setRequestHeader("If-Modified-Since", G.lastModified[o]), G.etag[o] && b.setRequestHeader("If-None-Match", G.etag[o])),
            ((d.data && d.hasContent && !1 !== d.contentType) || t.contentType) && b.setRequestHeader("Content-Type", d.contentType),
                b.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + pt + "; q=0.01" : "") : d.accepts["*"]),
                d.headers))
                b.setRequestHeader(u, d.headers[u]);
            if (d.beforeSend && (!1 === d.beforeSend.call(p, b, d) || 2 === w)) return b.abort();
            for (u in ((x = "abort"), {success: 1, error: 1, complete: 1})) b[u](d[u]);
            if ((n = D(dt, d, t, b))) {
                (b.readyState = 1),
                c && h.trigger("ajaxSend", [b, d]),
                d.async &&
                d.timeout > 0 &&
                (a = setTimeout(function () {
                    b.abort("timeout");
                }, d.timeout));
                try {
                    (w = 1), n.send(v, i);
                } catch (e) {
                    if (!(2 > w)) throw e;
                    i(-1, e);
                }
            } else i(-1, "No Transport");
            return b;
        },
        getJSON: function (e, t, i) {
            return G.get(e, t, i, "json");
        },
        getScript: function (e, t) {
            return G.get(e, void 0, t, "script");
        },
    }),
        G.each(["get", "post"], function (e, t) {
            G[t] = function (e, i, n, o) {
                return G.isFunction(i) && ((o = o || n), (n = i), (i = void 0)), G.ajax({
                    url: e,
                    type: t,
                    dataType: o,
                    data: i,
                    success: n
                });
            };
        }),
        (G._evalUrl = function (e) {
            return G.ajax({url: e, type: "GET", dataType: "script", async: !1, global: !1, throws: !0});
        }),
        G.fn.extend({
            wrapAll: function (e) {
                var t;
                return G.isFunction(e)
                    ? this.each(function (t) {
                        G(this).wrapAll(e.call(this, t));
                    })
                    : (this[0] &&
                    ((t = G(e, this[0].ownerDocument).eq(0).clone(!0)),
                    this[0].parentNode && t.insertBefore(this[0]),
                        t
                            .map(function () {
                                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                                return e;
                            })
                            .append(this)),
                        this);
            },
            wrapInner: function (e) {
                return this.each(
                    G.isFunction(e)
                        ? function (t) {
                            G(this).wrapInner(e.call(this, t));
                        }
                        : function () {
                            var t = G(this),
                                i = t.contents();
                            i.length ? i.wrapAll(e) : t.append(e);
                        }
                );
            },
            wrap: function (e) {
                var t = G.isFunction(e);
                return this.each(function (i) {
                    G(this).wrapAll(t ? e.call(this, i) : e);
                });
            },
            unwrap: function () {
                return this.parent()
                    .each(function () {
                        G.nodeName(this, "body") || G(this).replaceWith(this.childNodes);
                    })
                    .end();
            },
        }),
        (G.expr.filters.hidden = function (e) {
            return e.offsetWidth <= 0 && e.offsetHeight <= 0;
        }),
        (G.expr.filters.visible = function (e) {
            return !G.expr.filters.hidden(e);
        });
    var mt = /%20/g,
        gt = /\[\]$/,
        vt = /\r?\n/g,
        yt = /^(?:submit|button|image|reset|file)$/i,
        wt = /^(?:input|select|textarea|keygen)/i;
    (G.param = function (e, t) {
        var i,
            n = [],
            o = function (e, t) {
                (t = G.isFunction(t) ? t() : null == t ? "" : t), (n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t));
            };
        if ((void 0 === t && (t = G.ajaxSettings && G.ajaxSettings.traditional), G.isArray(e) || (e.jquery && !G.isPlainObject(e))))
            G.each(e, function () {
                o(this.name, this.value);
            });
        else for (i in e) A(i, e[i], t, o);
        return n.join("&").replace(mt, "+");
    }),
        G.fn.extend({
            serialize: function () {
                return G.param(this.serializeArray());
            },
            serializeArray: function () {
                return this.map(function () {
                    var e = G.prop(this, "elements");
                    return e ? G.makeArray(e) : this;
                })
                    .filter(function () {
                        var e = this.type;
                        return this.name && !G(this).is(":disabled") && wt.test(this.nodeName) && !yt.test(e) && (this.checked || !ye.test(e));
                    })
                    .map(function (e, t) {
                        var i = G(this).val();
                        return null == i
                            ? null
                            : G.isArray(i)
                                ? G.map(i, function (e) {
                                    return {name: t.name, value: e.replace(vt, "\r\n")};
                                })
                                : {name: t.name, value: i.replace(vt, "\r\n")};
                    })
                    .get();
            },
        }),
        (G.ajaxSettings.xhr = function () {
            try {
                return new XMLHttpRequest();
            } catch (e) {
            }
        });
    var xt = 0,
        bt = {},
        Tt = {0: 200, 1223: 204},
        St = G.ajaxSettings.xhr();
    e.attachEvent &&
    e.attachEvent("onunload", function () {
        for (var e in bt) bt[e]();
    }),
        (Y.cors = !!St && "withCredentials" in St),
        (Y.ajax = St = !!St),
        G.ajaxTransport(function (e) {
            var t;
            return Y.cors || (St && !e.crossDomain)
                ? {
                    send: function (i, n) {
                        var o,
                            r = e.xhr(),
                            s = ++xt;
                        if ((r.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)) for (o in e.xhrFields) r[o] = e.xhrFields[o];
                        for (o in (e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType), e.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"), i)) r.setRequestHeader(o, i[o]);
                        (t = function (e) {
                            return function () {
                                t &&
                                (delete bt[s],
                                    (t = r.onload = r.onerror = null),
                                    "abort" === e
                                        ? r.abort()
                                        : "error" === e
                                        ? n(r.status, r.statusText)
                                        : n(Tt[r.status] || r.status, r.statusText, "string" == typeof r.responseText ? {text: r.responseText} : void 0, r.getAllResponseHeaders()));
                            };
                        }),
                            (r.onload = t()),
                            (r.onerror = t("error")),
                            (t = bt[s] = t("abort"));
                        try {
                            r.send((e.hasContent && e.data) || null);
                        } catch (e) {
                            if (t) throw e;
                        }
                    },
                    abort: function () {
                        t && t();
                    },
                }
                : void 0;
        }),
        G.ajaxSetup({
            accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
            contents: {script: /(?:java|ecma)script/},
            converters: {
                "text script": function (e) {
                    return G.globalEval(e), e;
                },
            },
        }),
        G.ajaxPrefilter("script", function (e) {
            void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
        }),
        G.ajaxTransport("script", function (e) {
            var t, i;
            if (e.crossDomain)
                return {
                    send: function (n, o) {
                        (t = G("<script>")
                            .prop({async: !0, charset: e.scriptCharset, src: e.url})
                            .on(
                                "load error",
                                (i = function (e) {
                                    t.remove(), (i = null), e && o("error" === e.type ? 404 : 200, e.type);
                                })
                            )),
                            X.head.appendChild(t[0]);
                    },
                    abort: function () {
                        i && i();
                    },
                };
        });
    var Ct = [],
        Et = /(=)\?(?=&|$)|\?\?/;
    G.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = Ct.pop() || G.expando + "_" + it++;
            return (this[e] = !0), e;
        },
    }),
        G.ajaxPrefilter("json jsonp", function (t, i, n) {
            var o,
                r,
                s,
                a = !1 !== t.jsonp && (Et.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Et.test(t.data) && "data");
            return a || "jsonp" === t.dataTypes[0]
                ? ((o = t.jsonpCallback = G.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback),
                    a ? (t[a] = t[a].replace(Et, "$1" + o)) : !1 !== t.jsonp && (t.url += (nt.test(t.url) ? "&" : "?") + t.jsonp + "=" + o),
                    (t.converters["script json"] = function () {
                        return s || G.error(o + " was not called"), s[0];
                    }),
                    (t.dataTypes[0] = "json"),
                    (r = e[o]),
                    (e[o] = function () {
                        s = arguments;
                    }),
                    n.always(function () {
                        (e[o] = r), t[o] && ((t.jsonpCallback = i.jsonpCallback), Ct.push(o)), s && G.isFunction(r) && r(s[0]), (s = r = void 0);
                    }),
                    "script")
                : void 0;
        }),
        (G.parseHTML = function (e, t, i) {
            if (!e || "string" != typeof e) return null;
            "boolean" == typeof t && ((i = t), (t = !1)), (t = t || X);
            var n = te.exec(e),
                o = !i && [];
            return n ? [t.createElement(n[1])] : ((n = G.buildFragment([e], t, o)), o && o.length && G(o).remove(), G.merge([], n.childNodes));
        });
    var kt = G.fn.load;
    (G.fn.load = function (e, t, i) {
        if ("string" != typeof e && kt) return kt.apply(this, arguments);
        var n,
            o,
            r,
            s = this,
            a = e.indexOf(" ");
        return (
            a >= 0 && ((n = G.trim(e.slice(a))), (e = e.slice(0, a))),
                G.isFunction(t) ? ((i = t), (t = void 0)) : t && "object" == typeof t && (o = "POST"),
            s.length > 0 &&
            G.ajax({url: e, type: o, dataType: "html", data: t})
                .done(function (e) {
                    (r = arguments), s.html(n ? G("<div>").append(G.parseHTML(e)).find(n) : e);
                })
                .complete(
                    i &&
                    function (e, t) {
                        s.each(i, r || [e.responseText, t, e]);
                    }
                ),
                this
        );
    }),
        G.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
            G.fn[t] = function (e) {
                return this.on(t, e);
            };
        }),
        (G.expr.filters.animated = function (e) {
            return G.grep(G.timers, function (t) {
                return e === t.elem;
            }).length;
        });
    var _t = e.document.documentElement;
    (G.offset = {
        setOffset: function (e, t, i) {
            var n,
                o,
                r,
                s,
                a,
                l,
                c = G.css(e, "position"),
                u = G(e),
                d = {};
            "static" === c && (e.style.position = "relative"),
                (a = u.offset()),
                (r = G.css(e, "top")),
                (l = G.css(e, "left")),
                ("absolute" === c || "fixed" === c) && (r + l).indexOf("auto") > -1 ? ((s = (n = u.position()).top), (o = n.left)) : ((s = parseFloat(r) || 0), (o = parseFloat(l) || 0)),
            G.isFunction(t) && (t = t.call(e, i, a)),
            null != t.top && (d.top = t.top - a.top + s),
            null != t.left && (d.left = t.left - a.left + o),
                "using" in t ? t.using.call(e, d) : u.css(d);
        },
    }),
        G.fn.extend({
            offset: function (e) {
                if (arguments.length)
                    return void 0 === e
                        ? this
                        : this.each(function (t) {
                            G.offset.setOffset(this, e, t);
                        });
                var t,
                    i,
                    n = this[0],
                    o = {top: 0, left: 0},
                    r = n && n.ownerDocument;
                return r
                    ? ((t = r.documentElement),
                        G.contains(t, n) ? (typeof n.getBoundingClientRect !== we && (o = n.getBoundingClientRect()), (i = $(r)), {
                            top: o.top + i.pageYOffset - t.clientTop,
                            left: o.left + i.pageXOffset - t.clientLeft
                        }) : o)
                    : void 0;
            },
            position: function () {
                if (this[0]) {
                    var e,
                        t,
                        i = this[0],
                        n = {top: 0, left: 0};
                    return (
                        "fixed" === G.css(i, "position")
                            ? (t = i.getBoundingClientRect())
                            : ((e = this.offsetParent()), (t = this.offset()), G.nodeName(e[0], "html") || (n = e.offset()), (n.top += G.css(e[0], "borderTopWidth", !0)), (n.left += G.css(e[0], "borderLeftWidth", !0))),
                            {
                                top: t.top - n.top - G.css(i, "marginTop", !0),
                                left: t.left - n.left - G.css(i, "marginLeft", !0)
                            }
                    );
                }
            },
            offsetParent: function () {
                return this.map(function () {
                    for (var e = this.offsetParent || _t; e && !G.nodeName(e, "html") && "static" === G.css(e, "position");) e = e.offsetParent;
                    return e || _t;
                });
            },
        }),
        G.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (t, i) {
            var n = "pageYOffset" === i;
            G.fn[t] = function (o) {
                return ue(
                    this,
                    function (t, o, r) {
                        var s = $(t);
                        return void 0 === r ? (s ? s[i] : t[o]) : void (s ? s.scrollTo(n ? e.pageXOffset : r, n ? r : e.pageYOffset) : (t[o] = r));
                    },
                    t,
                    o,
                    arguments.length,
                    null
                );
            };
        }),
        G.each(["top", "left"], function (e, t) {
            G.cssHooks[t] = b(Y.pixelPosition, function (e, i) {
                return i ? ((i = x(e, t)), $e.test(i) ? G(e).position()[t] + "px" : i) : void 0;
            });
        }),
        G.each({Height: "height", Width: "width"}, function (e, t) {
            G.each({padding: "inner" + e, content: t, "": "outer" + e}, function (i, n) {
                G.fn[n] = function (n, o) {
                    var r = arguments.length && (i || "boolean" != typeof n),
                        s = i || (!0 === n || !0 === o ? "margin" : "border");
                    return ue(
                        this,
                        function (t, i, n) {
                            var o;
                            return G.isWindow(t)
                                ? t.document.documentElement["client" + e]
                                : 9 === t.nodeType
                                    ? ((o = t.documentElement), Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e]))
                                    : void 0 === n
                                        ? G.css(t, i, s)
                                        : G.style(t, i, n, s);
                        },
                        t,
                        r ? n : void 0,
                        r,
                        null
                    );
                };
            });
        }),
        (G.fn.size = function () {
            return this.length;
        }),
        (G.fn.andSelf = G.fn.addBack),
    "function" == typeof define &&
    define.amd &&
    define("jquery", [], function () {
        return G;
    });
    var zt = e.jQuery,
        Lt = e.$;
    return (
        (G.noConflict = function (t) {
            return e.$ === G && (e.$ = Lt), t && e.jQuery === G && (e.jQuery = zt), G;
        }),
        typeof t === we && (e.jQuery = e.$ = G),
            G
    );
}),
    (window.Modernizr = (function (e, t, i) {
        function n(e, t) {
            return typeof e === t;
        }

        function o(e, t) {
            return !!~("" + e).indexOf(t);
        }

        function r(e, t) {
            for (var n in e) {
                var r = e[n];
                if (!o(r, "-") && h[r] !== i) return "pfx" != t || r;
            }
            return !1;
        }

        function s(e, t, o) {
            for (var r in e) {
                var s = t[e[r]];
                if (s !== i) return !1 === o ? e[r] : n(s, "function") ? s.bind(o || t) : s;
            }
            return !1;
        }

        function a(e, t, i) {
            var o = e.charAt(0).toUpperCase() + e.slice(1),
                a = (e + " " + m.join(o + " ") + o).split(" ");
            return n(t, "string") || n(t, "undefined") ? r(a, t) : s((a = (e + " " + g.join(o + " ") + o).split(" ")), t, i);
        }

        var l,
            c,
            u = {},
            d = t.documentElement,
            p = t.createElement("modernizr"),
            h = p.style,
            f = "Webkit Moz O ms",
            m = f.split(" "),
            g = f.toLowerCase().split(" "),
            v = {},
            y = [],
            w = y.slice,
            x = {}.hasOwnProperty;
        for (var b in ((c =
            n(x, "undefined") || n(x.call, "undefined")
                ? function (e, t) {
                    return t in e && n(e.constructor.prototype[t], "undefined");
                }
                : function (e, t) {
                    return x.call(e, t);
                }),
        Function.prototype.bind ||
        (Function.prototype.bind = function (e) {
            var t = this;
            if ("function" != typeof t) throw new TypeError();
            var i = w.call(arguments, 1),
                n = function () {
                    if (this instanceof n) {
                        var o = function () {
                        };
                        o.prototype = t.prototype;
                        var r = new o(),
                            s = t.apply(r, i.concat(w.call(arguments)));
                        return Object(s) === s ? s : r;
                    }
                    return t.apply(e, i.concat(w.call(arguments)));
                };
            return n;
        }),
            (v.csstransitions = function () {
                return a("transition");
            }),
            v))
            c(v, b) && ((l = b.toLowerCase()), (u[l] = v[b]()), y.push((u[l] ? "" : "no-") + l));
        return (
            (u.addTest = function (e, t) {
                if ("object" == typeof e) for (var n in e) c(e, n) && u.addTest(n, e[n]);
                else {
                    if (((e = e.toLowerCase()), u[e] !== i)) return u;
                    (t = "function" == typeof t ? t() : t), (d.className += " " + (t ? "" : "no-") + e), (u[e] = t);
                }
                return u;
            }),
                (function (e) {
                    h.cssText = e;
                })(""),
                (p = null),
                (function (e, t) {
                    function i() {
                        var e = m.elements;
                        return "string" == typeof e ? e.split(" ") : e;
                    }

                    function n(e) {
                        var t = f[e[p]];
                        return t || ((t = {}), h++, (e[p] = h), (f[h] = t)), t;
                    }

                    function o(e, i, o) {
                        return (
                            i || (i = t),
                                l
                                    ? i.createElement(e)
                                    : (o || (o = n(i)), (r = o.cache[e] ? o.cache[e].cloneNode() : d.test(e) ? (o.cache[e] = o.createElem(e)).cloneNode() : o.createElem(e)).canHaveChildren && !u.test(e) ? o.frag.appendChild(r) : r)
                        );
                        var r;
                    }

                    function r(e, t) {
                        t.cache || ((t.cache = {}), (t.createElem = e.createElement), (t.createFrag = e.createDocumentFragment), (t.frag = t.createFrag())),
                            (e.createElement = function (i) {
                                return m.shivMethods ? o(i, e, t) : t.createElem(i);
                            }),
                            (e.createDocumentFragment = Function(
                                "h,f",
                                "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" +
                                i()
                                    .join()
                                    .replace(/\w+/g, function (e) {
                                        return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")';
                                    }) +
                                ");return n}"
                            )(m, t.frag));
                    }

                    function s(e) {
                        e || (e = t);
                        var i = n(e);
                        return (
                            m.shivCSS &&
                            !a &&
                            !i.hasCSS &&
                            (i.hasCSS = !!(function (e, t) {
                                var i = e.createElement("p"),
                                    n = e.getElementsByTagName("head")[0] || e.documentElement;
                                return (i.innerHTML = "x<style>" + t + "</style>"), n.insertBefore(i.lastChild, n.firstChild);
                            })(e, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),
                            l || r(e, i),
                                e
                        );
                    }

                    var a,
                        l,
                        c = e.html5 || {},
                        u = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                        d = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                        p = "_html5shiv",
                        h = 0,
                        f = {};
                    !(function () {
                        try {
                            var e = t.createElement("a");
                            (e.innerHTML = "<xyz></xyz>"),
                                (a = "hidden" in e),
                                (l =
                                    1 == e.childNodes.length ||
                                    (function () {
                                        t.createElement("a");
                                        var e = t.createDocumentFragment();
                                        return void 0 === e.cloneNode || void 0 === e.createDocumentFragment || void 0 === e.createElement;
                                    })());
                        } catch (e) {
                            (a = !0), (l = !0);
                        }
                    })();
                    var m = {
                        elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
                        shivCSS: !1 !== c.shivCSS,
                        supportsUnknownElements: l,
                        shivMethods: !1 !== c.shivMethods,
                        type: "default",
                        shivDocument: s,
                        createElement: o,
                        createDocumentFragment: function (e, o) {
                            if ((e || (e = t), l)) return e.createDocumentFragment();
                            for (var r = (o = o || n(e)).frag.cloneNode(), s = 0, a = i(), c = a.length; s < c; s++) r.createElement(a[s]);
                            return r;
                        },
                    };
                    (e.html5 = m), s(t);
                })(this, t),
                (u._version = "2.6.2"),
                (u._domPrefixes = g),
                (u._cssomPrefixes = m),
                (u.testProp = function (e) {
                    return r([e]);
                }),
                (u.testAllProps = a),
                (d.className = d.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + " js " + y.join(" ")),
                u
        );
    })(0, this.document)),
    (function (e, t, i) {
        function n(e) {
            return "[object Function]" == g.call(e);
        }

        function o(e) {
            return "string" == typeof e;
        }

        function r() {
        }

        function s(e) {
            return !e || "loaded" == e || "complete" == e || "uninitialized" == e;
        }

        function a() {
            var e = v.shift();
            (y = 1),
                e
                    ? e.t
                    ? f(function () {
                        ("c" == e.t ? p.injectCss : p.injectJs)(e.s, 0, e.a, e.x, e.e, 1);
                    }, 0)
                    : (e(), a())
                    : (y = 0);
        }

        function l(e, i, n, o, r, l, c) {
            function u(t) {
                if (!h && s(d.readyState) && ((w.r = h = 1), !y && a(), (d.onload = d.onreadystatechange = null), t))
                    for (var n in ("img" != e &&
                    f(function () {
                        b.removeChild(d);
                    }, 50),
                        k[i]))
                        k[i].hasOwnProperty(n) && k[i][n].onload();
            }

            c = c || p.errorTimeout;
            var d = t.createElement(e),
                h = 0,
                g = 0,
                w = {t: n, s: i, e: r, a: l, x: c};
            1 === k[i] && ((g = 1), (k[i] = [])),
                "object" == e ? (d.data = i) : ((d.src = i), (d.type = e)),
                (d.width = d.height = "0"),
                (d.onerror = d.onload = d.onreadystatechange = function () {
                    u.call(this, g);
                }),
                v.splice(o, 0, w),
            "img" != e && (g || 2 === k[i] ? (b.insertBefore(d, x ? null : m), f(u, c)) : k[i].push(d));
        }

        function c(e, t, i, n, r) {
            return (y = 0), (t = t || "j"), o(e) ? l("c" == t ? S : T, e, t, this.i++, i, n, r) : (v.splice(this.i++, 0, e), 1 == v.length && a()), this;
        }

        function u() {
            var e = p;
            return (e.loader = {load: c, i: 0}), e;
        }

        var d,
            p,
            h = t.documentElement,
            f = e.setTimeout,
            m = t.getElementsByTagName("script")[0],
            g = {}.toString,
            v = [],
            y = 0,
            w = "MozAppearance" in h.style,
            x = w && !!t.createRange().compareNode,
            b = x ? h : m.parentNode,
            T = ((h = e.opera && "[object Opera]" == g.call(e.opera)), (h = !!t.attachEvent && !h), w ? "object" : h ? "script" : "img"),
            S = h ? "script" : T,
            C =
                Array.isArray ||
                function (e) {
                    return "[object Array]" == g.call(e);
                },
            E = [],
            k = {},
            _ = {
                timeout: function (e, t) {
                    return t.length && (e.timeout = t[0]), e;
                },
            };
        ((p = function (e) {
            function t(e, t, o, r, s) {
                var a = (function (e) {
                        e = e.split("!");
                        var t,
                            i,
                            n,
                            o = E.length,
                            r = e.pop(),
                            s = e.length;
                        for (r = {
                            url: r,
                            origUrl: r,
                            prefixes: e
                        }, i = 0; i < s; i++) (n = e[i].split("=")), (t = _[n.shift()]) && (r = t(r, n));
                        for (i = 0; i < o; i++) r = E[i](r);
                        return r;
                    })(e),
                    l = a.autoCallback;
                a.url.split(".").pop().split("?").shift(),
                a.bypass ||
                (t && (t = n(t) ? t : t[e] || t[r] || t[e.split("/").pop().split("?")[0]]),
                    a.instead
                        ? a.instead(e, t, o, r, s)
                        : (k[a.url] ? (a.noexec = !0) : (k[a.url] = 1),
                            o.load(a.url, a.forceCSS || (!a.forceJS && "css" == a.url.split(".").pop().split("?").shift()) ? "c" : i, a.noexec, a.attrs, a.timeout),
                        (n(t) || n(l)) &&
                        o.load(function () {
                            u(), t && t(a.origUrl, s, r), l && l(a.origUrl, s, r), (k[a.url] = 2);
                        })));
            }

            function s(e, i) {
                function s(e, r) {
                    if (e) {
                        if (o(e))
                            r ||
                            (d = function () {
                                var e = [].slice.call(arguments);
                                p.apply(this, e), h();
                            }),
                                t(e, d, i, 0, c);
                        else if (Object(e) === e)
                            for (l in ((a = (function () {
                                var t,
                                    i = 0;
                                for (t in e) e.hasOwnProperty(t) && i++;
                                return i;
                            })()),
                                e))
                                e.hasOwnProperty(l) &&
                                (!r &&
                                !--a &&
                                (n(d)
                                    ? (d = function () {
                                        var e = [].slice.call(arguments);
                                        p.apply(this, e), h();
                                    })
                                    : (d[l] = (function (e) {
                                        return function () {
                                            var t = [].slice.call(arguments);
                                            e && e.apply(this, t), h();
                                        };
                                    })(p[l]))),
                                    t(e[l], d, i, l, c));
                    } else !r && h();
                }

                var a,
                    l,
                    c = !!e.test,
                    u = e.load || e.both,
                    d = e.callback || r,
                    p = d,
                    h = e.complete || r;
                s(c ? e.yep : e.nope, !!u), u && s(u);
            }

            var a,
                l,
                c = this.yepnope.loader;
            if (o(e)) t(e, 0, c, 0);
            else if (C(e)) for (a = 0; a < e.length; a++) o((l = e[a])) ? t(l, 0, c, 0) : C(l) ? p(l) : Object(l) === l && s(l, c);
            else Object(e) === e && s(e, c);
        }).addPrefix = function (e, t) {
            _[e] = t;
        }),
            (p.addFilter = function (e) {
                E.push(e);
            }),
            (p.errorTimeout = 1e4),
        null == t.readyState &&
        t.addEventListener &&
        ((t.readyState = "loading"),
            t.addEventListener(
                "DOMContentLoaded",
                (d = function () {
                    t.removeEventListener("DOMContentLoaded", d, 0), (t.readyState = "complete");
                }),
                0
            )),
            (e.yepnope = u()),
            (e.yepnope.executeStack = a),
            (e.yepnope.injectJs = function (e, i, n, o, l, c) {
                var u,
                    d,
                    h = t.createElement("script");
                o = o || p.errorTimeout;
                for (d in ((h.src = e), n)) h.setAttribute(d, n[d]);
                (i = c ? a : i || r),
                    (h.onreadystatechange = h.onload = function () {
                        !u && s(h.readyState) && ((u = 1), i(), (h.onload = h.onreadystatechange = null));
                    }),
                    f(function () {
                        u || ((u = 1), i(1));
                    }, o),
                    l ? h.onload() : m.parentNode.insertBefore(h, m);
            }),
            (e.yepnope.injectCss = function (e, i, n, o, s, l) {
                var c;
                (o = t.createElement("link")), (i = l ? a : i || r);
                for (c in ((o.href = e), (o.rel = "stylesheet"), (o.type = "text/css"), n)) o.setAttribute(c, n[c]);
                s || (m.parentNode.insertBefore(o, m), f(i, 0));
            });
    })(this, document),
    (Modernizr.load = function () {
        yepnope.apply(window, [].slice.call(arguments, 0));
    }),
    (jQuery.easing.jswing = jQuery.easing.swing),
    jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function (e, t, i, n, o) {
            return jQuery.easing[jQuery.easing.def](e, t, i, n, o);
        },
        easeInQuad: function (e, t, i, n, o) {
            return n * (t /= o) * t + i;
        },
        easeOutQuad: function (e, t, i, n, o) {
            return -n * (t /= o) * (t - 2) + i;
        },
        easeInOutQuad: function (e, t, i, n, o) {
            return (t /= o / 2) < 1 ? (n / 2) * t * t + i : (-n / 2) * (--t * (t - 2) - 1) + i;
        },
        easeInCubic: function (e, t, i, n, o) {
            return n * (t /= o) * t * t + i;
        },
        easeOutCubic: function (e, t, i, n, o) {
            return n * ((t = t / o - 1) * t * t + 1) + i;
        },
        easeInOutCubic: function (e, t, i, n, o) {
            return (t /= o / 2) < 1 ? (n / 2) * t * t * t + i : (n / 2) * ((t -= 2) * t * t + 2) + i;
        },
        easeInQuart: function (e, t, i, n, o) {
            return n * (t /= o) * t * t * t + i;
        },
        easeOutQuart: function (e, t, i, n, o) {
            return -n * ((t = t / o - 1) * t * t * t - 1) + i;
        },
        easeInOutQuart: function (e, t, i, n, o) {
            return (t /= o / 2) < 1 ? (n / 2) * t * t * t * t + i : (-n / 2) * ((t -= 2) * t * t * t - 2) + i;
        },
        easeInQuint: function (e, t, i, n, o) {
            return n * (t /= o) * t * t * t * t + i;
        },
        easeOutQuint: function (e, t, i, n, o) {
            return n * ((t = t / o - 1) * t * t * t * t + 1) + i;
        },
        easeInOutQuint: function (e, t, i, n, o) {
            return (t /= o / 2) < 1 ? (n / 2) * t * t * t * t * t + i : (n / 2) * ((t -= 2) * t * t * t * t + 2) + i;
        },
        easeInSine: function (e, t, i, n, o) {
            return -n * Math.cos((t / o) * (Math.PI / 2)) + n + i;
        },
        easeOutSine: function (e, t, i, n, o) {
            return n * Math.sin((t / o) * (Math.PI / 2)) + i;
        },
        easeInOutSine: function (e, t, i, n, o) {
            return (-n / 2) * (Math.cos((Math.PI * t) / o) - 1) + i;
        },
        easeInExpo: function (e, t, i, n, o) {
            return 0 == t ? i : n * Math.pow(2, 10 * (t / o - 1)) + i;
        },
        easeOutExpo: function (e, t, i, n, o) {
            return t == o ? i + n : n * (1 - Math.pow(2, (-10 * t) / o)) + i;
        },
        easeInOutExpo: function (e, t, i, n, o) {
            return 0 == t ? i : t == o ? i + n : (t /= o / 2) < 1 ? (n / 2) * Math.pow(2, 10 * (t - 1)) + i : (n / 2) * (2 - Math.pow(2, -10 * --t)) + i;
        },
        easeInCirc: function (e, t, i, n, o) {
            return -n * (Math.sqrt(1 - (t /= o) * t) - 1) + i;
        },
        easeOutCirc: function (e, t, i, n, o) {
            return n * Math.sqrt(1 - (t = t / o - 1) * t) + i;
        },
        easeInOutCirc: function (e, t, i, n, o) {
            return (t /= o / 2) < 1 ? (-n / 2) * (Math.sqrt(1 - t * t) - 1) + i : (n / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + i;
        },
        easeInElastic: function (e, t, i, n, o) {
            var r = 1.70158,
                s = 0,
                a = n;
            if (0 == t) return i;
            if (1 == (t /= o)) return i + n;
            if ((s || (s = 0.3 * o), a < Math.abs(n))) {
                a = n;
                r = s / 4;
            } else r = (s / (2 * Math.PI)) * Math.asin(n / a);
            return -a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * o - r) * (2 * Math.PI)) / s) + i;
        },
        easeOutElastic: function (e, t, i, n, o) {
            var r = 1.70158,
                s = 0,
                a = n;
            if (0 == t) return i;
            if (1 == (t /= o)) return i + n;
            if ((s || (s = 0.3 * o), a < Math.abs(n))) {
                a = n;
                r = s / 4;
            } else r = (s / (2 * Math.PI)) * Math.asin(n / a);
            return a * Math.pow(2, -10 * t) * Math.sin(((t * o - r) * (2 * Math.PI)) / s) + n + i;
        },
        easeInOutElastic: function (e, t, i, n, o) {
            var r = 1.70158,
                s = 0,
                a = n;
            if (0 == t) return i;
            if (2 == (t /= o / 2)) return i + n;
            if ((s || (s = o * (0.3 * 1.5)), a < Math.abs(n))) {
                a = n;
                r = s / 4;
            } else r = (s / (2 * Math.PI)) * Math.asin(n / a);
            return t < 1 ? a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * o - r) * (2 * Math.PI)) / s) * -0.5 + i : a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * o - r) * (2 * Math.PI)) / s) * 0.5 + n + i;
        },
        easeInBack: function (e, t, i, n, o, r) {
            return null == r && (r = 1.70158), n * (t /= o) * t * ((r + 1) * t - r) + i;
        },
        easeOutBack: function (e, t, i, n, o, r) {
            return null == r && (r = 1.70158), n * ((t = t / o - 1) * t * ((r + 1) * t + r) + 1) + i;
        },
        easeInOutBack: function (e, t, i, n, o, r) {
            return null == r && (r = 1.70158), (t /= o / 2) < 1 ? (n / 2) * (t * t * ((1 + (r *= 1.525)) * t - r)) + i : (n / 2) * ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) + i;
        },
        easeInBounce: function (e, t, i, n, o) {
            return n - jQuery.easing.easeOutBounce(e, o - t, 0, n, o) + i;
        },
        easeOutBounce: function (e, t, i, n, o) {
            return (t /= o) < 1 / 2.75
                ? n * (7.5625 * t * t) + i
                : t < 2 / 2.75
                    ? n * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + i
                    : t < 2.5 / 2.75
                        ? n * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + i
                        : n * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + i;
        },
        easeInOutBounce: function (e, t, i, n, o) {
            return t < o / 2 ? 0.5 * jQuery.easing.easeInBounce(e, 2 * t, 0, n, o) + i : 0.5 * jQuery.easing.easeOutBounce(e, 2 * t - o, 0, n, o) + 0.5 * n + i;
        },
    });
var framerate = 250,
    animtime = 1200,
    stepsize = 130,
    pulseAlgorithm = !0,
    pulseScale = 8,
    pulseNormalize = 1,
    acceleration = !0,
    accelDelta = 10,
    accelMax = 1,
    keyboardsupport = !0,
    disableKeyboard = !1,
    arrowscroll = 50,
    exclude = "",
    disabled = !1,
    frame = !1,
    direction = {x: 0, y: 0},
    initdone = !1,
    fixedback = !0,
    root = document.documentElement,
    activeElement,
    key = {left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36},
    que = [],
    pending = !1,
    lastScroll = +new Date(),
    cache = {};
setInterval(function () {
    cache = {};
}, 1e4);
var uniqueID = (function () {
        var e = 0;
        return function (t) {
            return t.uniqueID || (t.uniqueID = e++);
        };
    })(),
    requestFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (e, t, i) {
            window.setTimeout(e, i || 1e3 / 60);
        };
addEvent("mousedown", mousedown, {passive: !1}),
    addEvent("mousewheel", wheel, {passive: !1}),
    addEvent("load", init),
    (function (e) {
        function t() {
        }

        function i(e) {
            function i(t) {
                t.prototype.option ||
                (t.prototype.option = function (t) {
                    e.isPlainObject(t) && (this.options = e.extend(!0, this.options, t));
                });
            }

            function o(t, i) {
                e.fn[t] = function (o) {
                    if ("string" == typeof o) {
                        for (var s = n.call(arguments, 1), a = 0, l = this.length; l > a; a++) {
                            var c = this[a],
                                u = e.data(c, t);
                            if (u)
                                if (e.isFunction(u[o]) && "_" !== o.charAt(0)) {
                                    var d = u[o].apply(u, s);
                                    if (void 0 !== d) return d;
                                } else r("no such method '" + o + "' for " + t + " instance");
                            else r("cannot call methods on " + t + " prior to initialization; attempted to call '" + o + "'");
                        }
                        return this;
                    }
                    return this.each(function () {
                        var n = e.data(this, t);
                        n ? (n.option(o), n._init()) : ((n = new i(this, o)), e.data(this, t, n));
                    });
                };
            }

            if (e) {
                var r =
                    "undefined" == typeof console
                        ? t
                        : function (e) {
                            console.error(e);
                        };
                return (
                    (e.bridget = function (e, t) {
                        i(t), o(e, t);
                    }),
                        e.bridget
                );
            }
        }

        var n = Array.prototype.slice;
        "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], i) : i(e.jQuery);
    })(window),
    (function (e) {
        function t(t) {
            var i = e.event;
            return (i.target = i.target || i.srcElement || t), i;
        }

        var i = document.documentElement,
            n = function () {
            };
        i.addEventListener
            ? (n = function (e, t, i) {
                e.addEventListener(t, i, !1);
            })
            : i.attachEvent &&
            (n = function (e, i, n) {
                (e[i + n] = n.handleEvent
                    ? function () {
                        var i = t(e);
                        n.handleEvent.call(n, i);
                    }
                    : function () {
                        var i = t(e);
                        n.call(e, i);
                    }),
                    e.attachEvent("on" + i, e[i + n]);
            });
        var o = function () {
        };
        i.removeEventListener
            ? (o = function (e, t, i) {
                e.removeEventListener(t, i, !1);
            })
            : i.detachEvent &&
            (o = function (e, t, i) {
                e.detachEvent("on" + t, e[t + i]);
                try {
                    delete e[t + i];
                } catch (n) {
                    e[t + i] = void 0;
                }
            });
        var r = {bind: n, unbind: o};
        "function" == typeof define && define.amd ? define("eventie/eventie", r) : "object" == typeof exports ? (module.exports = r) : (e.eventie = r);
    })(this),
    (function (e) {
        function t(e) {
            "function" == typeof e && (t.isReady ? e() : r.push(e));
        }

        function i(e) {
            var i = "readystatechange" === e.type && "complete" !== o.readyState;
            if (!t.isReady && !i) {
                t.isReady = !0;
                for (var n = 0, s = r.length; s > n; n++) {
                    (0, r[n])();
                }
            }
        }

        function n(n) {
            return n.bind(o, "DOMContentLoaded", i), n.bind(o, "readystatechange", i), n.bind(e, "load", i), t;
        }

        var o = e.document,
            r = [];
        (t.isReady = !1), "function" == typeof define && define.amd ? ((t.isReady = "function" == typeof requirejs), define("doc-ready/doc-ready", ["eventie/eventie"], n)) : (e.docReady = n(e.eventie));
    })(this),
    function () {
        function e() {
        }

        function t(e, t) {
            for (var i = e.length; i--;) if (e[i].listener === t) return i;
            return -1;
        }

        function i(e) {
            return function () {
                return this[e].apply(this, arguments);
            };
        }

        var n = e.prototype,
            o = this,
            r = o.EventEmitter;
        (n.getListeners = function (e) {
            var t,
                i,
                n = this._getEvents();
            if (e instanceof RegExp) for (i in ((t = {}), n)) n.hasOwnProperty(i) && e.test(i) && (t[i] = n[i]);
            else t = n[e] || (n[e] = []);
            return t;
        }),
            (n.flattenListeners = function (e) {
                var t,
                    i = [];
                for (t = 0; e.length > t; t += 1) i.push(e[t].listener);
                return i;
            }),
            (n.getListenersAsObject = function (e) {
                var t,
                    i = this.getListeners(e);
                return i instanceof Array && ((t = {})[e] = i), t || i;
            }),
            (n.addListener = function (e, i) {
                var n,
                    o = this.getListenersAsObject(e),
                    r = "object" == typeof i;
                for (n in o) o.hasOwnProperty(n) && -1 === t(o[n], i) && o[n].push(r ? i : {listener: i, once: !1});
                return this;
            }),
            (n.on = i("addListener")),
            (n.addOnceListener = function (e, t) {
                return this.addListener(e, {listener: t, once: !0});
            }),
            (n.once = i("addOnceListener")),
            (n.defineEvent = function (e) {
                return this.getListeners(e), this;
            }),
            (n.defineEvents = function (e) {
                for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
                return this;
            }),
            (n.removeListener = function (e, i) {
                var n,
                    o,
                    r = this.getListenersAsObject(e);
                for (o in r) r.hasOwnProperty(o) && -1 !== (n = t(r[o], i)) && r[o].splice(n, 1);
                return this;
            }),
            (n.off = i("removeListener")),
            (n.addListeners = function (e, t) {
                return this.manipulateListeners(!1, e, t);
            }),
            (n.removeListeners = function (e, t) {
                return this.manipulateListeners(!0, e, t);
            }),
            (n.manipulateListeners = function (e, t, i) {
                var n,
                    o,
                    r = e ? this.removeListener : this.addListener,
                    s = e ? this.removeListeners : this.addListeners;
                if ("object" != typeof t || t instanceof RegExp) for (n = i.length; n--;) r.call(this, t, i[n]);
                else for (n in t) t.hasOwnProperty(n) && (o = t[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
                return this;
            }),
            (n.removeEvent = function (e) {
                var t,
                    i = typeof e,
                    n = this._getEvents();
                if ("string" === i) delete n[e];
                else if (e instanceof RegExp) for (t in n) n.hasOwnProperty(t) && e.test(t) && delete n[t];
                else delete this._events;
                return this;
            }),
            (n.removeAllListeners = i("removeEvent")),
            (n.emitEvent = function (e, t) {
                var i,
                    n,
                    o,
                    r = this.getListenersAsObject(e);
                for (o in r)
                    if (r.hasOwnProperty(o)) for (n = r[o].length; n--;) !0 === (i = r[o][n]).once && this.removeListener(e, i.listener), i.listener.apply(this, t || []) === this._getOnceReturnValue() && this.removeListener(e, i.listener);
                return this;
            }),
            (n.trigger = i("emitEvent")),
            (n.emit = function (e) {
                var t = Array.prototype.slice.call(arguments, 1);
                return this.emitEvent(e, t);
            }),
            (n.setOnceReturnValue = function (e) {
                return (this._onceReturnValue = e), this;
            }),
            (n._getOnceReturnValue = function () {
                return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue;
            }),
            (n._getEvents = function () {
                return this._events || (this._events = {});
            }),
            (e.noConflict = function () {
                return (o.EventEmitter = r), e;
            }),
            "function" == typeof define && define.amd
                ? define("eventEmitter/EventEmitter", [], function () {
                    return e;
                })
                : "object" == typeof module && module.exports
                ? (module.exports = e)
                : (this.EventEmitter = e);
    }.call(this),
    (function (e) {
        function t(e) {
            if (e) {
                if ("string" == typeof n[e]) return e;
                e = e.charAt(0).toUpperCase() + e.slice(1);
                for (var t, o = 0, r = i.length; r > o; o++) if (((t = i[o] + e), "string" == typeof n[t])) return t;
            }
        }

        var i = "Webkit Moz ms Ms O".split(" "),
            n = document.documentElement.style;
        "function" == typeof define && define.amd
            ? define("get-style-property/get-style-property", [], function () {
                return t;
            })
            : "object" == typeof exports
            ? (module.exports = t)
            : (e.getStyleProperty = t);
    })(window),
    (function (e) {
        function t(e) {
            var t = parseFloat(e);
            return -1 === e.indexOf("%") && !isNaN(t) && t;
        }

        function i(e) {
            function i(e, t) {
                if (n || -1 === t.indexOf("%")) return t;
                var i = e.style,
                    o = i.left,
                    r = e.runtimeStyle,
                    s = r && r.left;
                return s && (r.left = e.currentStyle.left), (i.left = t), (t = i.pixelLeft), (i.left = o), s && (r.left = s), t;
            }

            var s,
                a = e("boxSizing");
            return (
                (function () {
                    if (a) {
                        var e = document.createElement("div");
                        (e.style.width = "200px"), (e.style.padding = "1px 2px 3px 4px"), (e.style.borderStyle = "solid"), (e.style.borderWidth = "1px 2px 3px 4px"), (e.style[a] = "border-box");
                        var i = document.body || document.documentElement;
                        i.appendChild(e);
                        var n = o(e);
                        (s = 200 === t(n.width)), i.removeChild(e);
                    }
                })(),
                    function (e) {
                        if (("string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType)) {
                            var n = o(e);
                            if ("none" === n.display)
                                return (function () {
                                    for (var e = {
                                        width: 0,
                                        height: 0,
                                        innerWidth: 0,
                                        innerHeight: 0,
                                        outerWidth: 0,
                                        outerHeight: 0
                                    }, t = 0, i = r.length; i > t; t++) e[r[t]] = 0;
                                    return e;
                                })();
                            var l = {};
                            (l.width = e.offsetWidth), (l.height = e.offsetHeight);
                            for (var c = (l.isBorderBox = !(!a || !n[a] || "border-box" !== n[a])), u = 0, d = r.length; d > u; u++) {
                                var p = r[u],
                                    h = n[p];
                                h = i(e, h);
                                var f = parseFloat(h);
                                l[p] = isNaN(f) ? 0 : f;
                            }
                            var m = l.paddingLeft + l.paddingRight,
                                g = l.paddingTop + l.paddingBottom,
                                v = l.marginLeft + l.marginRight,
                                y = l.marginTop + l.marginBottom,
                                w = l.borderLeftWidth + l.borderRightWidth,
                                x = l.borderTopWidth + l.borderBottomWidth,
                                b = c && s,
                                T = t(n.width);
                            !1 !== T && (l.width = T + (b ? 0 : m + w));
                            var S = t(n.height);
                            return !1 !== S && (l.height = S + (b ? 0 : g + x)), (l.innerWidth = l.width - (m + w)), (l.innerHeight = l.height - (g + x)), (l.outerWidth = l.width + v), (l.outerHeight = l.height + y), l;
                        }
                    }
            );
        }

        var n = e.getComputedStyle,
            o = n
                ? function (e) {
                    return n(e, null);
                }
                : function (e) {
                    return e.currentStyle;
                },
            r = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "function" == typeof define && define.amd
            ? define("get-size/get-size", ["get-style-property/get-style-property"], i)
            : "object" == typeof exports
            ? (module.exports = i(require("get-style-property")))
            : (e.getSize = i(e.getStyleProperty));
    })(window),
    (function (e, t) {
        function i(e, t) {
            return e[r](t);
        }

        function n(e) {
            e.parentNode || document.createDocumentFragment().appendChild(e);
        }

        var o,
            r = (function () {
                if (t.matchesSelector) return "matchesSelector";
                for (var e = ["webkit", "moz", "ms", "o"], i = 0, n = e.length; n > i; i++) {
                    var o = e[i] + "MatchesSelector";
                    if (t[o]) return o;
                }
            })();
        if (r) {
            var s = i(document.createElement("div"), "div");
            o = s
                ? i
                : function (e, t) {
                    return n(e), i(e, t);
                };
        } else
            o = function (e, t) {
                n(e);
                for (var i = e.parentNode.querySelectorAll(t), o = 0, r = i.length; r > o; o++) if (i[o] === e) return !0;
                return !1;
            };
        "function" == typeof define && define.amd
            ? define("matches-selector/matches-selector", [], function () {
                return o;
            })
            : (window.matchesSelector = o);
    })(0, Element.prototype),
    (function (e) {
        function t(e, t, i) {
            function o(e, t) {
                e && ((this.element = e), (this.layout = t), (this.position = {x: 0, y: 0}), this._create());
            }

            var r = i("transition"),
                s = i("transform"),
                a = r && s,
                l = !!i("perspective"),
                c = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[r],
                u = ["transform", "transition", "transitionDuration", "transitionProperty"],
                d = (function () {
                    for (var e = {}, t = 0, n = u.length; n > t; t++) {
                        var o = u[t],
                            r = i(o);
                        r && r !== o && (e[o] = r);
                    }
                    return e;
                })();
            (function (e, t) {
                for (var i in t) e[i] = t[i];
            })(o.prototype, e.prototype),
                (o.prototype._create = function () {
                    (this._transn = {ingProperties: {}, clean: {}, onEnd: {}}), this.css({position: "absolute"});
                }),
                (o.prototype.handleEvent = function (e) {
                    var t = "on" + e.type;
                    this[t] && this[t](e);
                }),
                (o.prototype.getSize = function () {
                    this.size = t(this.element);
                }),
                (o.prototype.css = function (e) {
                    var t = this.element.style;
                    for (var i in e) {
                        t[d[i] || i] = e[i];
                    }
                }),
                (o.prototype.getPosition = function () {
                    var e = n(this.element),
                        t = this.layout.options,
                        i = t.isOriginLeft,
                        o = t.isOriginTop,
                        r = parseInt(e[i ? "left" : "right"], 10),
                        s = parseInt(e[o ? "top" : "bottom"], 10);
                    (r = isNaN(r) ? 0 : r), (s = isNaN(s) ? 0 : s);
                    var a = this.layout.size;
                    (r -= i ? a.paddingLeft : a.paddingRight), (s -= o ? a.paddingTop : a.paddingBottom), (this.position.x = r), (this.position.y = s);
                }),
                (o.prototype.layoutPosition = function () {
                    var e = this.layout.size,
                        t = this.layout.options,
                        i = {};
                    t.isOriginLeft ? ((i.left = this.position.x + e.paddingLeft + "px"), (i.right = "")) : ((i.right = this.position.x + e.paddingRight + "px"), (i.left = "")),
                        t.isOriginTop ? ((i.top = this.position.y + e.paddingTop + "px"), (i.bottom = "")) : ((i.bottom = this.position.y + e.paddingBottom + "px"), (i.top = "")),
                        this.css(i),
                        this.emitEvent("layout", [this]);
                });
            var p = l
                ? function (e, t) {
                    return "translate3d(" + e + "px, " + t + "px, 0)";
                }
                : function (e, t) {
                    return "translate(" + e + "px, " + t + "px)";
                };
            (o.prototype._transitionTo = function (e, t) {
                this.getPosition();
                var i = this.position.x,
                    n = this.position.y,
                    o = parseInt(e, 10),
                    r = parseInt(t, 10),
                    s = o === this.position.x && r === this.position.y;
                if ((this.setPosition(e, t), !s || this.isTransitioning)) {
                    var a = e - i,
                        l = t - n,
                        c = {},
                        u = this.layout.options;
                    (a = u.isOriginLeft ? a : -a), (l = u.isOriginTop ? l : -l), (c.transform = p(a, l)), this.transition({
                        to: c,
                        onTransitionEnd: {transform: this.layoutPosition},
                        isCleaning: !0
                    });
                } else this.layoutPosition();
            }),
                (o.prototype.goTo = function (e, t) {
                    this.setPosition(e, t), this.layoutPosition();
                }),
                (o.prototype.moveTo = a ? o.prototype._transitionTo : o.prototype.goTo),
                (o.prototype.setPosition = function (e, t) {
                    (this.position.x = parseInt(e, 10)), (this.position.y = parseInt(t, 10));
                }),
                (o.prototype._nonTransition = function (e) {
                    for (var t in (this.css(e.to), e.isCleaning && this._removeStyles(e.to), e.onTransitionEnd)) e.onTransitionEnd[t].call(this);
                }),
                (o.prototype._transition = function (e) {
                    if (parseFloat(this.layout.options.transitionDuration)) {
                        var t = this._transn;
                        for (var i in e.onTransitionEnd) t.onEnd[i] = e.onTransitionEnd[i];
                        for (i in e.to) (t.ingProperties[i] = !0), e.isCleaning && (t.clean[i] = !0);
                        if (e.from) {
                            this.css(e.from);
                            this.element.offsetHeight;
                            null;
                        }
                        this.enableTransition(e.to), this.css(e.to), (this.isTransitioning = !0);
                    } else this._nonTransition(e);
                });
            var h =
                s &&
                (function (e) {
                    return e.replace(/([A-Z])/g, function (e) {
                        return "-" + e.toLowerCase();
                    });
                })(s) + ",opacity";
            (o.prototype.enableTransition = function () {
                this.isTransitioning || (this.css({
                    transitionProperty: h,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(c, this, !1));
            }),
                (o.prototype.transition = o.prototype[r ? "_transition" : "_nonTransition"]),
                (o.prototype.onwebkitTransitionEnd = function (e) {
                    this.ontransitionend(e);
                }),
                (o.prototype.onotransitionend = function (e) {
                    this.ontransitionend(e);
                });
            var f = {"-webkit-transform": "transform", "-moz-transform": "transform", "-o-transform": "transform"};
            (o.prototype.ontransitionend = function (e) {
                if (e.target === this.element) {
                    var t = this._transn,
                        i = f[e.propertyName] || e.propertyName;
                    if (
                        (delete t.ingProperties[i],
                        (function (e) {
                            for (var t in e) return !1;
                            return !0;
                        })(t.ingProperties) && this.disableTransition(),
                        i in t.clean && ((this.element.style[e.propertyName] = ""), delete t.clean[i]),
                        i in t.onEnd)
                    )
                        t.onEnd[i].call(this), delete t.onEnd[i];
                    this.emitEvent("transitionEnd", [this]);
                }
            }),
                (o.prototype.disableTransition = function () {
                    this.removeTransitionStyles(), this.element.removeEventListener(c, this, !1), (this.isTransitioning = !1);
                }),
                (o.prototype._removeStyles = function (e) {
                    var t = {};
                    for (var i in e) t[i] = "";
                    this.css(t);
                });
            var m = {transitionProperty: "", transitionDuration: ""};
            return (
                (o.prototype.removeTransitionStyles = function () {
                    this.css(m);
                }),
                    (o.prototype.removeElem = function () {
                        this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this]);
                    }),
                    (o.prototype.remove = function () {
                        if (r && parseFloat(this.layout.options.transitionDuration)) {
                            var e = this;
                            this.on("transitionEnd", function () {
                                return e.removeElem(), !0;
                            }),
                                this.hide();
                        } else this.removeElem();
                    }),
                    (o.prototype.reveal = function () {
                        delete this.isHidden, this.css({display: ""});
                        var e = this.layout.options;
                        this.transition({from: e.hiddenStyle, to: e.visibleStyle, isCleaning: !0});
                    }),
                    (o.prototype.hide = function () {
                        (this.isHidden = !0), this.css({display: ""});
                        var e = this.layout.options;
                        this.transition({
                            from: e.visibleStyle,
                            to: e.hiddenStyle,
                            isCleaning: !0,
                            onTransitionEnd: {
                                opacity: function () {
                                    this.isHidden && this.css({display: "none"});
                                },
                            },
                        });
                    }),
                    (o.prototype.destroy = function () {
                        this.css({
                            position: "",
                            left: "",
                            right: "",
                            top: "",
                            bottom: "",
                            transition: "",
                            transform: ""
                        });
                    }),
                    o
            );
        }

        var i = e.getComputedStyle,
            n = i
                ? function (e) {
                    return i(e, null);
                }
                : function (e) {
                    return e.currentStyle;
                };
        "function" == typeof define && define.amd
            ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property"], t)
            : ((e.Outlayer = {}), (e.Outlayer.Item = t(e.EventEmitter, e.getSize, e.getStyleProperty)));
    })(window),
    (function (e) {
        function t(e, t) {
            for (var i in t) e[i] = t[i];
            return e;
        }

        function i(e) {
            var t = [];
            if (
                (function (e) {
                    return "[object Array]" === c.call(e);
                })(e)
            )
                t = e;
            else if (e && "number" == typeof e.length) for (var i = 0, n = e.length; n > i; i++) t.push(e[i]);
            else t.push(e);
            return t;
        }

        function n(e, t) {
            var i = d(t, e);
            -1 !== i && t.splice(i, 1);
        }

        function o(o, c, d, p, h, f) {
            function m(e, i) {
                if (("string" == typeof e && (e = r.querySelector(e)), e && u(e))) {
                    (this.element = e), (this.options = t({}, this.constructor.defaults)), this.option(i);
                    var n = ++g;
                    (this.element.outlayerGUID = n), (v[n] = this), this._create(), this.options.isInitLayout && this.layout();
                } else s && s.error("Bad " + this.constructor.namespace + " element: " + e);
            }

            var g = 0,
                v = {};
            return (
                (m.namespace = "outlayer"),
                    (m.Item = f),
                    (m.defaults = {
                        containerStyle: {position: "relative"},
                        isInitLayout: !0,
                        isOriginLeft: !0,
                        isOriginTop: !0,
                        isResizeBound: !0,
                        isResizingContainer: !0,
                        transitionDuration: "0.4s",
                        hiddenStyle: {opacity: 0, transform: "scale(0.001)"},
                        visibleStyle: {opacity: 1, transform: "scale(1)"},
                    }),
                    t(m.prototype, d.prototype),
                    (m.prototype.option = function (e) {
                        t(this.options, e);
                    }),
                    (m.prototype._create = function () {
                        this.reloadItems(), (this.stamps = []), this.stamp(this.options.stamp), t(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize();
                    }),
                    (m.prototype.reloadItems = function () {
                        this.items = this._itemize(this.element.children);
                    }),
                    (m.prototype._itemize = function (e) {
                        for (var t = this._filterFindItemElements(e), i = this.constructor.Item, n = [], o = 0, r = t.length; r > o; o++) {
                            var s = new i(t[o], this);
                            n.push(s);
                        }
                        return n;
                    }),
                    (m.prototype._filterFindItemElements = function (e) {
                        e = i(e);
                        for (var t = this.options.itemSelector, n = [], o = 0, r = e.length; r > o; o++) {
                            var s = e[o];
                            if (u(s))
                                if (t) {
                                    h(s, t) && n.push(s);
                                    for (var a = s.querySelectorAll(t), l = 0, c = a.length; c > l; l++) n.push(a[l]);
                                } else n.push(s);
                        }
                        return n;
                    }),
                    (m.prototype.getItemElements = function () {
                        for (var e = [], t = 0, i = this.items.length; i > t; t++) e.push(this.items[t].element);
                        return e;
                    }),
                    (m.prototype.layout = function () {
                        this._resetLayout(), this._manageStamps();
                        var e = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                        this.layoutItems(this.items, e), (this._isLayoutInited = !0);
                    }),
                    (m.prototype._init = m.prototype.layout),
                    (m.prototype._resetLayout = function () {
                        this.getSize();
                    }),
                    (m.prototype.getSize = function () {
                        this.size = p(this.element);
                    }),
                    (m.prototype._getMeasurement = function (e, t) {
                        var i,
                            n = this.options[e];
                        n ? ("string" == typeof n ? (i = this.element.querySelector(n)) : u(n) && (i = n), (this[e] = i ? p(i)[t] : n)) : (this[e] = 0);
                    }),
                    (m.prototype.layoutItems = function (e, t) {
                        (e = this._getItemsForLayout(e)), this._layoutItems(e, t), this._postLayout();
                    }),
                    (m.prototype._getItemsForLayout = function (e) {
                        for (var t = [], i = 0, n = e.length; n > i; i++) {
                            var o = e[i];
                            o.isIgnored || t.push(o);
                        }
                        return t;
                    }),
                    (m.prototype._layoutItems = function (e, t) {
                        function i() {
                            n.emitEvent("layoutComplete", [n, e]);
                        }

                        var n = this;
                        if (e && e.length) {
                            this._itemsOn(e, "layout", i);
                            for (var o = [], r = 0, s = e.length; s > r; r++) {
                                var a = e[r],
                                    l = this._getItemLayoutPosition(a);
                                (l.item = a), (l.isInstant = t || a.isLayoutInstant), o.push(l);
                            }
                            this._processLayoutQueue(o);
                        } else i();
                    }),
                    (m.prototype._getItemLayoutPosition = function () {
                        return {x: 0, y: 0};
                    }),
                    (m.prototype._processLayoutQueue = function (e) {
                        for (var t = 0, i = e.length; i > t; t++) {
                            var n = e[t];
                            this._positionItem(n.item, n.x, n.y, n.isInstant);
                        }
                    }),
                    (m.prototype._positionItem = function (e, t, i, n) {
                        n ? e.goTo(t, i) : e.moveTo(t, i);
                    }),
                    (m.prototype._postLayout = function () {
                        this.resizeContainer();
                    }),
                    (m.prototype.resizeContainer = function () {
                        if (this.options.isResizingContainer) {
                            var e = this._getContainerSize();
                            e && (this._setContainerMeasure(e.width, !0), this._setContainerMeasure(e.height, !1));
                        }
                    }),
                    (m.prototype._getContainerSize = l),
                    (m.prototype._setContainerMeasure = function (e, t) {
                        if (void 0 !== e) {
                            var i = this.size;
                            i.isBorderBox && (e += t ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth),
                                (e = Math.max(e, 0)),
                                (this.element.style[t ? "width" : "height"] = e + "px");
                        }
                    }),
                    (m.prototype._itemsOn = function (e, t, i) {
                        function n() {
                            return ++o === r && i.call(s), !0;
                        }

                        for (var o = 0, r = e.length, s = this, a = 0, l = e.length; l > a; a++) {
                            e[a].on(t, n);
                        }
                    }),
                    (m.prototype.ignore = function (e) {
                        var t = this.getItem(e);
                        t && (t.isIgnored = !0);
                    }),
                    (m.prototype.unignore = function (e) {
                        var t = this.getItem(e);
                        t && delete t.isIgnored;
                    }),
                    (m.prototype.stamp = function (e) {
                        if ((e = this._find(e))) {
                            this.stamps = this.stamps.concat(e);
                            for (var t = 0, i = e.length; i > t; t++) {
                                var n = e[t];
                                this.ignore(n);
                            }
                        }
                    }),
                    (m.prototype.unstamp = function (e) {
                        if ((e = this._find(e)))
                            for (var t = 0, i = e.length; i > t; t++) {
                                var o = e[t];
                                n(o, this.stamps), this.unignore(o);
                            }
                    }),
                    (m.prototype._find = function (e) {
                        return e ? ("string" == typeof e && (e = this.element.querySelectorAll(e)), (e = i(e))) : void 0;
                    }),
                    (m.prototype._manageStamps = function () {
                        if (this.stamps && this.stamps.length) {
                            this._getBoundingRect();
                            for (var e = 0, t = this.stamps.length; t > e; e++) {
                                var i = this.stamps[e];
                                this._manageStamp(i);
                            }
                        }
                    }),
                    (m.prototype._getBoundingRect = function () {
                        var e = this.element.getBoundingClientRect(),
                            t = this.size;
                        this._boundingRect = {
                            left: e.left + t.paddingLeft + t.borderLeftWidth,
                            top: e.top + t.paddingTop + t.borderTopWidth,
                            right: e.right - (t.paddingRight + t.borderRightWidth),
                            bottom: e.bottom - (t.paddingBottom + t.borderBottomWidth),
                        };
                    }),
                    (m.prototype._manageStamp = l),
                    (m.prototype._getElementOffset = function (e) {
                        var t = e.getBoundingClientRect(),
                            i = this._boundingRect,
                            n = p(e);
                        return {
                            left: t.left - i.left - n.marginLeft,
                            top: t.top - i.top - n.marginTop,
                            right: i.right - t.right - n.marginRight,
                            bottom: i.bottom - t.bottom - n.marginBottom
                        };
                    }),
                    (m.prototype.handleEvent = function (e) {
                        var t = "on" + e.type;
                        this[t] && this[t](e);
                    }),
                    (m.prototype.bindResize = function () {
                        this.isResizeBound || (o.bind(e, "resize", this), (this.isResizeBound = !0));
                    }),
                    (m.prototype.unbindResize = function () {
                        this.isResizeBound && o.unbind(e, "resize", this), (this.isResizeBound = !1);
                    }),
                    (m.prototype.onresize = function () {
                        this.resizeTimeout && clearTimeout(this.resizeTimeout);
                        var e = this;
                        this.resizeTimeout = setTimeout(function () {
                            e.resize(), delete e.resizeTimeout;
                        }, 100);
                    }),
                    (m.prototype.resize = function () {
                        this.isResizeBound && this.needsResizeLayout() && this.layout();
                    }),
                    (m.prototype.needsResizeLayout = function () {
                        var e = p(this.element);
                        return this.size && e && e.innerWidth !== this.size.innerWidth;
                    }),
                    (m.prototype.addItems = function (e) {
                        var t = this._itemize(e);
                        return t.length && (this.items = this.items.concat(t)), t;
                    }),
                    (m.prototype.appended = function (e) {
                        var t = this.addItems(e);
                        t.length && (this.layoutItems(t, !0), this.reveal(t));
                    }),
                    (m.prototype.prepended = function (e) {
                        var t = this._itemize(e);
                        if (t.length) {
                            var i = this.items.slice(0);
                            (this.items = t.concat(i)), this._resetLayout(), this._manageStamps(), this.layoutItems(t, !0), this.reveal(t), this.layoutItems(i);
                        }
                    }),
                    (m.prototype.reveal = function (e) {
                        var t = e && e.length;
                        if (t)
                            for (var i = 0; t > i; i++) {
                                e[i].reveal();
                            }
                    }),
                    (m.prototype.hide = function (e) {
                        var t = e && e.length;
                        if (t)
                            for (var i = 0; t > i; i++) {
                                e[i].hide();
                            }
                    }),
                    (m.prototype.getItem = function (e) {
                        for (var t = 0, i = this.items.length; i > t; t++) {
                            var n = this.items[t];
                            if (n.element === e) return n;
                        }
                    }),
                    (m.prototype.getItems = function (e) {
                        if (e && e.length) {
                            for (var t = [], i = 0, n = e.length; n > i; i++) {
                                var o = e[i],
                                    r = this.getItem(o);
                                r && t.push(r);
                            }
                            return t;
                        }
                    }),
                    (m.prototype.remove = function (e) {
                        e = i(e);
                        var t = this.getItems(e);
                        if (t && t.length) {
                            this._itemsOn(t, "remove", function () {
                                this.emitEvent("removeComplete", [this, t]);
                            });
                            for (var o = 0, r = t.length; r > o; o++) {
                                var s = t[o];
                                s.remove(), n(s, this.items);
                            }
                        }
                    }),
                    (m.prototype.destroy = function () {
                        var e = this.element.style;
                        (e.height = ""), (e.position = ""), (e.width = "");
                        for (var t = 0, i = this.items.length; i > t; t++) {
                            this.items[t].destroy();
                        }
                        this.unbindResize(), delete this.element.outlayerGUID, a && a.removeData(this.element, this.constructor.namespace);
                    }),
                    (m.data = function (e) {
                        var t = e && e.outlayerGUID;
                        return t && v[t];
                    }),
                    (m.create = function (e, i) {
                        function n() {
                            m.apply(this, arguments);
                        }

                        return (
                            Object.create ? (n.prototype = Object.create(m.prototype)) : t(n.prototype, m.prototype),
                                (n.prototype.constructor = n),
                                (n.defaults = t({}, m.defaults)),
                                t(n.defaults, i),
                                (n.prototype.settings = {}),
                                (n.namespace = e),
                                (n.data = m.data),
                                (n.Item = function () {
                                    f.apply(this, arguments);
                                }),
                                (n.Item.prototype = new f()),
                                c(function () {
                                    for (
                                        var t = (function (e) {
                                                return e
                                                    .replace(/(.)([A-Z])/g, function (e, t, i) {
                                                        return t + "-" + i;
                                                    })
                                                    .toLowerCase();
                                            })(e),
                                            i = r.querySelectorAll(".js-" + t),
                                            o = "data-" + t + "-options",
                                            l = 0,
                                            c = i.length;
                                        c > l;
                                        l++
                                    ) {
                                        var u,
                                            d = i[l],
                                            p = d.getAttribute(o);
                                        try {
                                            u = p && JSON.parse(p);
                                        } catch (e) {
                                            s && s.error("Error parsing " + o + " on " + d.nodeName.toLowerCase() + (d.id ? "#" + d.id : "") + ": " + e);
                                            continue;
                                        }
                                        var h = new n(d, u);
                                        a && a.data(d, e, h);
                                    }
                                }),
                            a && a.bridget && a.bridget(e, n),
                                n
                        );
                    }),
                    (m.Item = f),
                    m
            );
        }

        var r = e.document,
            s = e.console,
            a = e.jQuery,
            l = function () {
            },
            c = Object.prototype.toString,
            u =
                "object" == typeof HTMLElement
                    ? function (e) {
                        return e instanceof HTMLElement;
                    }
                    : function (e) {
                        return e && "object" == typeof e && 1 === e.nodeType && "string" == typeof e.nodeName;
                    },
            d = Array.prototype.indexOf
                ? function (e, t) {
                    return e.indexOf(t);
                }
                : function (e, t) {
                    for (var i = 0, n = e.length; n > i; i++) if (e[i] === t) return i;
                    return -1;
                };
        "function" == typeof define && define.amd
            ? define("outlayer/outlayer", ["eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item"], o)
            : (e.Outlayer = o(e.eventie, e.docReady, e.EventEmitter, e.getSize, e.matchesSelector, e.Outlayer.Item));
    })(window),
    (function (e) {
        function t(e) {
            function t() {
                e.Item.apply(this, arguments);
            }

            (t.prototype = new e.Item()),
                (t.prototype._create = function () {
                    (this.id = this.layout.itemGUID++), e.Item.prototype._create.call(this), (this.sortData = {});
                }),
                (t.prototype.updateSortData = function () {
                    if (!this.isIgnored) {
                        (this.sortData.id = this.id), (this.sortData["original-order"] = this.id), (this.sortData.random = Math.random());
                        var e = this.layout.options.getSortData,
                            t = this.layout._sorters;
                        for (var i in e) {
                            var n = t[i];
                            this.sortData[i] = n(this.element, this);
                        }
                    }
                });
            var i = t.prototype.destroy;
            return (
                (t.prototype.destroy = function () {
                    i.apply(this, arguments), this.css({display: ""});
                }),
                    t
            );
        }

        "function" == typeof define && define.amd ? define("isotope/js/item", ["outlayer/outlayer"], t) : ((e.Isotope = e.Isotope || {}), (e.Isotope.Item = t(e.Outlayer)));
    })(window),
    (function (e) {
        function t(e, t) {
            function i(e) {
                (this.isotope = e), e && ((this.options = e.options[this.namespace]), (this.element = e.element), (this.items = e.filteredItems), (this.size = e.size));
            }

            return (
                (function () {
                    function e(e) {
                        return function () {
                            return t.prototype[e].apply(this.isotope, arguments);
                        };
                    }

                    for (var n = ["_resetLayout", "_getItemLayoutPosition", "_manageStamp", "_getContainerSize", "_getElementOffset", "needsResizeLayout"], o = 0, r = n.length; r > o; o++) {
                        var s = n[o];
                        i.prototype[s] = e(s);
                    }
                })(),
                    (i.prototype.needsVerticalResizeLayout = function () {
                        var t = e(this.isotope.element);
                        return this.isotope.size && t && t.innerHeight !== this.isotope.size.innerHeight;
                    }),
                    (i.prototype._getMeasurement = function () {
                        this.isotope._getMeasurement.apply(this, arguments);
                    }),
                    (i.prototype.getColumnWidth = function () {
                        this.getSegmentSize("column", "Width");
                    }),
                    (i.prototype.getRowHeight = function () {
                        this.getSegmentSize("row", "Height");
                    }),
                    (i.prototype.getSegmentSize = function (e, t) {
                        var i = e + t,
                            n = "outer" + t;
                        if ((this._getMeasurement(i, n), !this[i])) {
                            var o = this.getFirstItemSize();
                            this[i] = (o && o[n]) || this.isotope.size["inner" + t];
                        }
                    }),
                    (i.prototype.getFirstItemSize = function () {
                        var t = this.isotope.filteredItems[0];
                        return t && t.element && e(t.element);
                    }),
                    (i.prototype.layout = function () {
                        this.isotope.layout.apply(this.isotope, arguments);
                    }),
                    (i.prototype.getSize = function () {
                        this.isotope.getSize(), (this.size = this.isotope.size);
                    }),
                    (i.modes = {}),
                    (i.create = function (e, t) {
                        function n() {
                            i.apply(this, arguments);
                        }

                        return (n.prototype = new i()), t && (n.options = t), (n.prototype.namespace = e), (i.modes[e] = n), n;
                    }),
                    i
            );
        }

        "function" == typeof define && define.amd ? define("isotope/js/layout-mode", ["get-size/get-size", "outlayer/outlayer"], t) : ((e.Isotope = e.Isotope || {}), (e.Isotope.LayoutMode = t(e.getSize, e.Outlayer)));
    })(window),
    (function (e) {
        function t(e, t) {
            var n = e.create("masonry");
            return (
                (n.prototype._resetLayout = function () {
                    this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
                    var e = this.cols;
                    for (this.colYs = []; e--;) this.colYs.push(0);
                    this.maxY = 0;
                }),
                    (n.prototype.measureColumns = function () {
                        if ((this.getContainerWidth(), !this.columnWidth)) {
                            var e = this.items[0],
                                i = e && e.element;
                            this.columnWidth = (i && t(i).outerWidth) || this.containerWidth;
                        }
                        (this.columnWidth += this.gutter), (this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth)), (this.cols = Math.max(this.cols, 1));
                    }),
                    (n.prototype.getContainerWidth = function () {
                        var e = this.options.isFitWidth ? this.element.parentNode : this.element,
                            i = t(e);
                        this.containerWidth = i && i.innerWidth;
                    }),
                    (n.prototype._getItemLayoutPosition = function (e) {
                        e.getSize();
                        var t = e.size.outerWidth % this.columnWidth,
                            n = Math[t && 1 > t ? "round" : "ceil"](e.size.outerWidth / this.columnWidth);
                        n = Math.min(n, this.cols);
                        for (var o = this._getColGroup(n), r = Math.min.apply(Math, o), s = i(o, r), a = {
                            x: this.columnWidth * s,
                            y: r
                        }, l = r + e.size.outerHeight, c = this.cols + 1 - o.length, u = 0; c > u; u++) this.colYs[s + u] = l;
                        return a;
                    }),
                    (n.prototype._getColGroup = function (e) {
                        if (2 > e) return this.colYs;
                        for (var t = [], i = this.cols + 1 - e, n = 0; i > n; n++) {
                            var o = this.colYs.slice(n, n + e);
                            t[n] = Math.max.apply(Math, o);
                        }
                        return t;
                    }),
                    (n.prototype._manageStamp = function (e) {
                        var i = t(e),
                            n = this._getElementOffset(e),
                            o = this.options.isOriginLeft ? n.left : n.right,
                            r = o + i.outerWidth,
                            s = Math.floor(o / this.columnWidth);
                        s = Math.max(0, s);
                        var a = Math.floor(r / this.columnWidth);
                        (a -= r % this.columnWidth ? 0 : 1), (a = Math.min(this.cols - 1, a));
                        for (var l = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, c = s; a >= c; c++) this.colYs[c] = Math.max(l, this.colYs[c]);
                    }),
                    (n.prototype._getContainerSize = function () {
                        this.maxY = Math.max.apply(Math, this.colYs);
                        var e = {height: this.maxY};
                        return this.options.isFitWidth && (e.width = this._getContainerFitWidth()), e;
                    }),
                    (n.prototype._getContainerFitWidth = function () {
                        for (var e = 0, t = this.cols; --t && 0 === this.colYs[t];) e++;
                        return (this.cols - e) * this.columnWidth - this.gutter;
                    }),
                    (n.prototype.needsResizeLayout = function () {
                        var e = this.containerWidth;
                        return this.getContainerWidth(), e !== this.containerWidth;
                    }),
                    n
            );
        }

        var i = Array.prototype.indexOf
            ? function (e, t) {
                return e.indexOf(t);
            }
            : function (e, t) {
                for (var i = 0, n = e.length; n > i; i++) {
                    if (e[i] === t) return i;
                }
                return -1;
            };
        "function" == typeof define && define.amd ? define("masonry/masonry", ["outlayer/outlayer", "get-size/get-size"], t) : (e.Masonry = t(e.Outlayer, e.getSize));
    })(window),
    (function (e) {
        function t(e, t) {
            var i = e.create("masonry"),
                n = i.prototype._getElementOffset,
                o = i.prototype.layout,
                r = i.prototype._getMeasurement;
            (function (e, t) {
                for (var i in t) e[i] = t[i];
            })(i.prototype, t.prototype),
                (i.prototype._getElementOffset = n),
                (i.prototype.layout = o),
                (i.prototype._getMeasurement = r);
            var s = i.prototype.measureColumns;
            i.prototype.measureColumns = function () {
                (this.items = this.isotope.filteredItems), s.call(this);
            };
            var a = i.prototype._manageStamp;
            return (
                (i.prototype._manageStamp = function () {
                    (this.options.isOriginLeft = this.isotope.options.isOriginLeft), (this.options.isOriginTop = this.isotope.options.isOriginTop), a.apply(this, arguments);
                }),
                    i
            );
        }

        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/masonry", ["../layout-mode", "masonry/masonry"], t) : t(e.Isotope.LayoutMode, e.Masonry);
    })(window),
    (function (e) {
        function t(e) {
            var t = e.create("fitRows");
            return (
                (t.prototype._resetLayout = function () {
                    (this.x = 0), (this.y = 0), (this.maxY = 0);
                }),
                    (t.prototype._getItemLayoutPosition = function (e) {
                        e.getSize(), 0 !== this.x && e.size.outerWidth + this.x > this.isotope.size.innerWidth && ((this.x = 0), (this.y = this.maxY));
                        var t = {x: this.x, y: this.y};
                        return (this.maxY = Math.max(this.maxY, this.y + e.size.outerHeight)), (this.x += e.size.outerWidth), t;
                    }),
                    (t.prototype._getContainerSize = function () {
                        return {height: this.maxY};
                    }),
                    t
            );
        }

        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/fit-rows", ["../layout-mode"], t) : t(e.Isotope.LayoutMode);
    })(window),
    (function (e) {
        function t(e) {
            var t = e.create("vertical", {horizontalAlignment: 0});
            return (
                (t.prototype._resetLayout = function () {
                    this.y = 0;
                }),
                    (t.prototype._getItemLayoutPosition = function (e) {
                        e.getSize();
                        var t = (this.isotope.size.innerWidth - e.size.outerWidth) * this.options.horizontalAlignment,
                            i = this.y;
                        return (this.y += e.size.outerHeight), {x: t, y: i};
                    }),
                    (t.prototype._getContainerSize = function () {
                        return {height: this.y};
                    }),
                    t
            );
        }

        "function" == typeof define && define.amd ? define("isotope/js/layout-modes/vertical", ["../layout-mode"], t) : t(e.Isotope.LayoutMode);
    })(window),
    (function (e) {
        function t(e) {
            var t = [];
            if (
                (function (e) {
                    return "[object Array]" === a.call(e);
                })(e)
            )
                t = e;
            else if (e && "number" == typeof e.length) for (var i = 0, n = e.length; n > i; i++) t.push(e[i]);
            else t.push(e);
            return t;
        }

        function i(e, t) {
            var i = l(t, e);
            -1 !== i && t.splice(i, 1);
        }

        function n(e, n, a, l, c) {
            var u = e.create("isotope", {layoutMode: "masonry", isJQueryFiltering: !0, sortAscending: !0});
            (u.Item = l),
                (u.LayoutMode = c),
                (u.prototype._create = function () {
                    for (var t in ((this.itemGUID = 0), (this._sorters = {}), this._getSorters(), e.prototype._create.call(this), (this.modes = {}), (this.filteredItems = this.items), (this.sortHistory = ["original-order"]), c.modes))
                        this._initLayoutMode(t);
                }),
                (u.prototype.reloadItems = function () {
                    (this.itemGUID = 0), e.prototype.reloadItems.call(this);
                }),
                (u.prototype._itemize = function () {
                    for (var t = e.prototype._itemize.apply(this, arguments), i = 0, n = t.length; n > i; i++) {
                        t[i].id = this.itemGUID++;
                    }
                    return this._updateItemsSortData(t), t;
                }),
                (u.prototype._initLayoutMode = function (e) {
                    var t = c.modes[e],
                        i = this.options[e] || {};
                    (this.options[e] = t.options
                        ? (function (e, t) {
                            for (var i in t) e[i] = t[i];
                            return e;
                        })(t.options, i)
                        : i),
                        (this.modes[e] = new t(this));
                }),
                (u.prototype.layout = function () {
                    return !this._isLayoutInited && this.options.isInitLayout ? void this.arrange() : void this._layout();
                }),
                (u.prototype._layout = function () {
                    var e = this._getIsInstant();
                    this._resetLayout(), this._manageStamps(), this.layoutItems(this.filteredItems, e), (this._isLayoutInited = !0);
                }),
                (u.prototype.arrange = function (e) {
                    this.option(e), this._getIsInstant(), (this.filteredItems = this._filter(this.items)), this._sort(), this._layout();
                }),
                (u.prototype._init = u.prototype.arrange),
                (u.prototype._getIsInstant = function () {
                    var e = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                    return (this._isInstant = e), e;
                }),
                (u.prototype._filter = function (e) {
                    function t() {
                        d.reveal(o), d.hide(r);
                    }

                    var i = this.options.filter;
                    i = i || "*";
                    for (var n = [], o = [], r = [], s = this._getFilterTest(i), a = 0, l = e.length; l > a; a++) {
                        var c = e[a];
                        if (!c.isIgnored) {
                            var u = s(c);
                            u && n.push(c), u && c.isHidden ? o.push(c) : u || c.isHidden || r.push(c);
                        }
                    }
                    var d = this;
                    return this._isInstant ? this._noTransition(t) : t(), n;
                }),
                (u.prototype._getFilterTest = function (e) {
                    return o && this.options.isJQueryFiltering
                        ? function (t) {
                            return o(t.element).is(e);
                        }
                        : "function" == typeof e
                            ? function (t) {
                                return e(t.element);
                            }
                            : function (t) {
                                return a(t.element, e);
                            };
                }),
                (u.prototype.updateSortData = function (e) {
                    this._getSorters(), (e = t(e));
                    var i = this.getItems(e);
                    (i = i.length ? i : this.items), this._updateItemsSortData(i);
                }),
                (u.prototype._getSorters = function () {
                    var e = this.options.getSortData;
                    for (var t in e) {
                        var i = e[t];
                        this._sorters[t] = d(i);
                    }
                }),
                (u.prototype._updateItemsSortData = function (e) {
                    for (var t = 0, i = e.length; i > t; t++) {
                        e[t].updateSortData();
                    }
                });
            var d = (function () {
                return function (e) {
                    if ("string" != typeof e) return e;
                    var t = r(e).split(" "),
                        i = t[0],
                        n = i.match(/^\[(.+)\]$/),
                        o = (function (e, t) {
                            return e
                                ? function (t) {
                                    return t.getAttribute(e);
                                }
                                : function (e) {
                                    var i = e.querySelector(t);
                                    return i && s(i);
                                };
                        })(n && n[1], i),
                        a = u.sortDataParsers[t[1]];
                    return a
                        ? function (e) {
                            return e && a(o(e));
                        }
                        : function (e) {
                            return e && o(e);
                        };
                };
            })();
            (u.sortDataParsers = {
                parseInt: function (e) {
                    return parseInt(e, 10);
                },
                parseFloat: function (e) {
                    return parseFloat(e);
                },
            }),
                (u.prototype._sort = function () {
                    var e = this.options.sortBy;
                    if (e) {
                        var t = (function (e, t) {
                            return function (i, n) {
                                for (var o = 0, r = e.length; r > o; o++) {
                                    var s = e[o],
                                        a = i.sortData[s],
                                        l = n.sortData[s];
                                    if (a > l || l > a) return (a > l ? 1 : -1) * ((void 0 !== t[s] ? t[s] : t) ? 1 : -1);
                                }
                                return 0;
                            };
                        })([].concat.apply(e, this.sortHistory), this.options.sortAscending);
                        this.filteredItems.sort(t), e !== this.sortHistory[0] && this.sortHistory.unshift(e);
                    }
                }),
                (u.prototype._mode = function () {
                    var e = this.options.layoutMode,
                        t = this.modes[e];
                    if (!t) throw Error("No layout mode: " + e);
                    return (t.options = this.options[e]), t;
                }),
                (u.prototype._resetLayout = function () {
                    e.prototype._resetLayout.call(this), this._mode()._resetLayout();
                }),
                (u.prototype._getItemLayoutPosition = function (e) {
                    return this._mode()._getItemLayoutPosition(e);
                }),
                (u.prototype._manageStamp = function (e) {
                    this._mode()._manageStamp(e);
                }),
                (u.prototype._getContainerSize = function () {
                    return this._mode()._getContainerSize();
                }),
                (u.prototype.needsResizeLayout = function () {
                    return this._mode().needsResizeLayout();
                }),
                (u.prototype.appended = function (e) {
                    var t = this.addItems(e);
                    if (t.length) {
                        var i = this._filterRevealAdded(t);
                        this.filteredItems = this.filteredItems.concat(i);
                    }
                }),
                (u.prototype.prepended = function (e) {
                    var t = this._itemize(e);
                    if (t.length) {
                        var i = this.items.slice(0);
                        (this.items = t.concat(i)), this._resetLayout(), this._manageStamps();
                        var n = this._filterRevealAdded(t);
                        this.layoutItems(i), (this.filteredItems = n.concat(this.filteredItems));
                    }
                }),
                (u.prototype._filterRevealAdded = function (e) {
                    var t = this._noTransition(function () {
                        return this._filter(e);
                    });
                    return this.layoutItems(t, !0), this.reveal(t), e;
                }),
                (u.prototype.insert = function (e) {
                    var t = this.addItems(e);
                    if (t.length) {
                        var i,
                            n,
                            o = t.length;
                        for (i = 0; o > i; i++) (n = t[i]), this.element.appendChild(n.element);
                        var r = this._filter(t);
                        for (
                            this._noTransition(function () {
                                this.hide(r);
                            }),
                                i = 0;
                            o > i;
                            i++
                        )
                            t[i].isLayoutInstant = !0;
                        for (this.arrange(), i = 0; o > i; i++) delete t[i].isLayoutInstant;
                        this.reveal(r);
                    }
                });
            var p = u.prototype.remove;
            return (
                (u.prototype.remove = function (e) {
                    e = t(e);
                    var n = this.getItems(e);
                    if ((p.call(this, e), n && n.length))
                        for (var o = 0, r = n.length; r > o; o++) {
                            i(n[o], this.filteredItems);
                        }
                }),
                    (u.prototype.shuffle = function () {
                        for (var e = 0, t = this.items.length; t > e; e++) {
                            this.items[e].sortData.random = Math.random();
                        }
                        (this.options.sortBy = "random"), this._sort(), this._layout();
                    }),
                    (u.prototype._noTransition = function (e) {
                        var t = this.options.transitionDuration;
                        this.options.transitionDuration = 0;
                        var i = e.call(this);
                        return (this.options.transitionDuration = t), i;
                    }),
                    (u.prototype.getFilteredItemElements = function () {
                        for (var e = [], t = 0, i = this.filteredItems.length; i > t; t++) e.push(this.filteredItems[t].element);
                        return e;
                    }),
                    u
            );
        }

        var o = e.jQuery,
            r = String.prototype.trim
                ? function (e) {
                    return e.trim();
                }
                : function (e) {
                    return e.replace(/^\s+|\s+$/g, "");
                },
            s = document.documentElement.textContent
                ? function (e) {
                    return e.textContent;
                }
                : function (e) {
                    return e.innerText;
                },
            a = Object.prototype.toString,
            l = Array.prototype.indexOf
                ? function (e, t) {
                    return e.indexOf(t);
                }
                : function (e, t) {
                    for (var i = 0, n = e.length; n > i; i++) if (e[i] === t) return i;
                    return -1;
                };
        "function" == typeof define && define.amd
            ? define([
                "outlayer/outlayer",
                "get-size/get-size",
                "matches-selector/matches-selector",
                "isotope/js/item",
                "isotope/js/layout-mode",
                "isotope/js/layout-modes/masonry",
                "isotope/js/layout-modes/fit-rows",
                "isotope/js/layout-modes/vertical",
            ], n)
            : (e.Isotope = n(e.Outlayer, e.getSize, e.matchesSelector, e.Isotope.Item, e.Isotope.LayoutMode));
    })(window),
    function () {
        function e() {
        }

        function t(e, t) {
            for (var i = e.length; i--;) if (e[i].listener === t) return i;
            return -1;
        }

        function i(e) {
            return function () {
                return this[e].apply(this, arguments);
            };
        }

        var n = e.prototype,
            o = this,
            r = o.EventEmitter;
        (n.getListeners = function (e) {
            var t,
                i,
                n = this._getEvents();
            if ("object" == typeof e) for (i in ((t = {}), n)) n.hasOwnProperty(i) && e.test(i) && (t[i] = n[i]);
            else t = n[e] || (n[e] = []);
            return t;
        }),
            (n.flattenListeners = function (e) {
                var t,
                    i = [];
                for (t = 0; e.length > t; t += 1) i.push(e[t].listener);
                return i;
            }),
            (n.getListenersAsObject = function (e) {
                var t,
                    i = this.getListeners(e);
                return i instanceof Array && ((t = {})[e] = i), t || i;
            }),
            (n.addListener = function (e, i) {
                var n,
                    o = this.getListenersAsObject(e),
                    r = "object" == typeof i;
                for (n in o) o.hasOwnProperty(n) && -1 === t(o[n], i) && o[n].push(r ? i : {listener: i, once: !1});
                return this;
            }),
            (n.on = i("addListener")),
            (n.addOnceListener = function (e, t) {
                return this.addListener(e, {listener: t, once: !0});
            }),
            (n.once = i("addOnceListener")),
            (n.defineEvent = function (e) {
                return this.getListeners(e), this;
            }),
            (n.defineEvents = function (e) {
                for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
                return this;
            }),
            (n.removeListener = function (e, i) {
                var n,
                    o,
                    r = this.getListenersAsObject(e);
                for (o in r) r.hasOwnProperty(o) && -1 !== (n = t(r[o], i)) && r[o].splice(n, 1);
                return this;
            }),
            (n.off = i("removeListener")),
            (n.addListeners = function (e, t) {
                return this.manipulateListeners(!1, e, t);
            }),
            (n.removeListeners = function (e, t) {
                return this.manipulateListeners(!0, e, t);
            }),
            (n.manipulateListeners = function (e, t, i) {
                var n,
                    o,
                    r = e ? this.removeListener : this.addListener,
                    s = e ? this.removeListeners : this.addListeners;
                if ("object" != typeof t || t instanceof RegExp) for (n = i.length; n--;) r.call(this, t, i[n]);
                else for (n in t) t.hasOwnProperty(n) && (o = t[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
                return this;
            }),
            (n.removeEvent = function (e) {
                var t,
                    i = typeof e,
                    n = this._getEvents();
                if ("string" === i) delete n[e];
                else if ("object" === i) for (t in n) n.hasOwnProperty(t) && e.test(t) && delete n[t];
                else delete this._events;
                return this;
            }),
            (n.removeAllListeners = i("removeEvent")),
            (n.emitEvent = function (e, t) {
                var i,
                    n,
                    o,
                    r = this.getListenersAsObject(e);
                for (o in r)
                    if (r.hasOwnProperty(o)) for (n = r[o].length; n--;) !0 === (i = r[o][n]).once && this.removeListener(e, i.listener), i.listener.apply(this, t || []) === this._getOnceReturnValue() && this.removeListener(e, i.listener);
                return this;
            }),
            (n.trigger = i("emitEvent")),
            (n.emit = function (e) {
                var t = Array.prototype.slice.call(arguments, 1);
                return this.emitEvent(e, t);
            }),
            (n.setOnceReturnValue = function (e) {
                return (this._onceReturnValue = e), this;
            }),
            (n._getOnceReturnValue = function () {
                return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue;
            }),
            (n._getEvents = function () {
                return this._events || (this._events = {});
            }),
            (e.noConflict = function () {
                return (o.EventEmitter = r), e;
            }),
            "function" == typeof define && define.amd
                ? define("eventEmitter/EventEmitter", [], function () {
                    return e;
                })
                : "object" == typeof module && module.exports
                ? (module.exports = e)
                : (this.EventEmitter = e);
    }.call(this),
    (function (e) {
        function t(t) {
            var i = e.event;
            return (i.target = i.target || i.srcElement || t), i;
        }

        var i = document.documentElement,
            n = function () {
            };
        i.addEventListener
            ? (n = function (e, t, i) {
                e.addEventListener(t, i, !1);
            })
            : i.attachEvent &&
            (n = function (e, i, n) {
                (e[i + n] = n.handleEvent
                    ? function () {
                        var i = t(e);
                        n.handleEvent.call(n, i);
                    }
                    : function () {
                        var i = t(e);
                        n.call(e, i);
                    }),
                    e.attachEvent("on" + i, e[i + n]);
            });
        var o = function () {
        };
        i.removeEventListener
            ? (o = function (e, t, i) {
                e.removeEventListener(t, i, !1);
            })
            : i.detachEvent &&
            (o = function (e, t, i) {
                e.detachEvent("on" + t, e[t + i]);
                try {
                    delete e[t + i];
                } catch (n) {
                    e[t + i] = void 0;
                }
            });
        var r = {bind: n, unbind: o};
        "function" == typeof define && define.amd ? define("eventie/eventie", r) : (e.eventie = r);
    })(this),
    (function (e, t) {
        "function" == typeof define && define.amd
            ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function (i, n) {
                return t(e, i, n);
            })
            : "object" == typeof exports
            ? (module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")))
            : (e.imagesLoaded = t(e, e.EventEmitter, e.eventie));
    })(window, function (e, t, i) {
        function n(e, t) {
            for (var i in t) e[i] = t[i];
            return e;
        }

        function o(e) {
            var t = [];
            if (
                (function (e) {
                    return "[object Array]" === d.call(e);
                })(e)
            )
                t = e;
            else if ("number" == typeof e.length) for (var i = 0, n = e.length; n > i; i++) t.push(e[i]);
            else t.push(e);
            return t;
        }

        function r(e, t, i) {
            if (!(this instanceof r)) return new r(e, t);
            "string" == typeof e && (e = document.querySelectorAll(e)),
                (this.elements = o(e)),
                (this.options = n({}, this.options)),
                "function" == typeof t ? (i = t) : n(this.options, t),
            i && this.on("always", i),
                this.getImages(),
            l && (this.jqDeferred = new l.Deferred());
            var s = this;
            setTimeout(function () {
                s.check();
            });
        }

        function s(e) {
            this.img = e;
        }

        function a(e) {
            (this.src = e), (p[e] = this);
        }

        var l = e.jQuery,
            c = e.console,
            u = void 0 !== c,
            d = Object.prototype.toString;
        (r.prototype = new t()),
            (r.prototype.options = {}),
            (r.prototype.getImages = function () {
                this.images = [];
                for (var e = 0, t = this.elements.length; t > e; e++) {
                    var i = this.elements[e];
                    "IMG" === i.nodeName && this.addImage(i);
                    var n = i.nodeType;
                    if (n && (1 === n || 9 === n || 11 === n))
                        for (var o = i.querySelectorAll("img"), r = 0, s = o.length; s > r; r++) {
                            var a = o[r];
                            this.addImage(a);
                        }
                }
            }),
            (r.prototype.addImage = function (e) {
                var t = new s(e);
                this.images.push(t);
            }),
            (r.prototype.check = function () {
                function e(e, o) {
                    return t.options.debug && u && c.log("confirm", e, o), t.progress(e), ++i === n && t.complete(), !0;
                }

                var t = this,
                    i = 0,
                    n = this.images.length;
                if (((this.hasAnyBroken = !1), n))
                    for (var o = 0; n > o; o++) {
                        var r = this.images[o];
                        r.on("confirm", e), r.check();
                    }
                else this.complete();
            }),
            (r.prototype.progress = function (e) {
                this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
                var t = this;
                setTimeout(function () {
                    t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e);
                });
            }),
            (r.prototype.complete = function () {
                var e = this.hasAnyBroken ? "fail" : "done";
                this.isComplete = !0;
                var t = this;
                setTimeout(function () {
                    if ((t.emit(e, t), t.emit("always", t), t.jqDeferred)) {
                        var i = t.hasAnyBroken ? "reject" : "resolve";
                        t.jqDeferred[i](t);
                    }
                });
            }),
        l &&
        (l.fn.imagesLoaded = function (e, t) {
            return new r(this, e, t).jqDeferred.promise(l(this));
        }),
            (s.prototype = new t()),
            (s.prototype.check = function () {
                var e = p[this.img.src] || new a(this.img.src);
                if (e.isConfirmed) this.confirm(e.isLoaded, "cached was confirmed");
                else if (this.img.complete && void 0 !== this.img.naturalWidth) this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
                else {
                    var t = this;
                    e.on("confirm", function (e, i) {
                        return t.confirm(e.isLoaded, i), !0;
                    }),
                        e.check();
                }
            }),
            (s.prototype.confirm = function (e, t) {
                (this.isLoaded = e), this.emit("confirm", this, t);
            });
        var p = {};
        return (
            (a.prototype = new t()),
                (a.prototype.check = function () {
                    if (!this.isChecked) {
                        var e = new Image();
                        i.bind(e, "load", this), i.bind(e, "error", this), (e.src = this.src), (this.isChecked = !0);
                    }
                }),
                (a.prototype.handleEvent = function (e) {
                    var t = "on" + e.type;
                    this[t] && this[t](e);
                }),
                (a.prototype.onload = function (e) {
                    this.confirm(!0, "onload"), this.unbindProxyEvents(e);
                }),
                (a.prototype.onerror = function (e) {
                    this.confirm(!1, "onerror"), this.unbindProxyEvents(e);
                }),
                (a.prototype.confirm = function (e, t) {
                    (this.isConfirmed = !0), (this.isLoaded = e), this.emit("confirm", this, t);
                }),
                (a.prototype.unbindProxyEvents = function (e) {
                    i.unbind(e.target, "load", this), i.unbind(e.target, "error", this);
                }),
                r
        );
    }),
    (function (e) {
        var t,
            i,
            n,
            o,
            r,
            s,
            a,
            l = "Close",
            c = "BeforeClose",
            u = "MarkupParse",
            d = "Open",
            p = "Change",
            h = "mfp",
            f = "." + h,
            m = "mfp-ready",
            g = "mfp-removing",
            v = "mfp-prevent-close",
            y = function () {
            },
            w = !!window.jQuery,
            x = e(window),
            b = function (e, i) {
                t.ev.on(h + e + f, i);
            },
            T = function (t, i, n, o) {
                var r = document.createElement("div");
                return (r.className = "mfp-" + t), n && (r.innerHTML = n), o ? i && i.appendChild(r) : ((r = e(r)), i && r.appendTo(i)), r;
            },
            S = function (i, n) {
                t.ev.triggerHandler(h + i, n), t.st.callbacks && ((i = i.charAt(0).toLowerCase() + i.slice(1)), t.st.callbacks[i] && t.st.callbacks[i].apply(t, e.isArray(n) ? n : [n]));
            },
            C = function (i) {
                return (i === a && t.currTemplate.closeBtn) || ((t.currTemplate.closeBtn = e(t.st.closeMarkup.replace("%title%", t.st.tClose))), (a = i)), t.currTemplate.closeBtn;
            },
            E = function () {
                e.magnificPopup.instance || ((t = new y()).init(), (e.magnificPopup.instance = t));
            };
        (y.prototype = {
            constructor: y,
            init: function () {
                var i = navigator.appVersion;
                (t.isIE7 = -1 !== i.indexOf("MSIE 7.")),
                    (t.isIE8 = -1 !== i.indexOf("MSIE 8.")),
                    (t.isLowIE = t.isIE7 || t.isIE8),
                    (t.isAndroid = /android/gi.test(i)),
                    (t.isIOS = /iphone|ipad|ipod/gi.test(i)),
                    (t.supportsTransition = (function () {
                        var e = document.createElement("p").style,
                            t = ["ms", "O", "Moz", "Webkit"];
                        if (void 0 !== e.transition) return !0;
                        for (; t.length;) if (t.pop() + "Transition" in e) return !0;
                        return !1;
                    })()),
                    (t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent)),
                    (o = e(document)),
                    (t.popupsCache = {});
            },
            open: function (i) {
                var r;
                if ((n || (n = e(document.body)), !1 === i.isObj)) {
                    (t.items = i.items.toArray()), (t.index = 0);
                    var a,
                        l = i.items;
                    for (r = 0; l.length > r; r++)
                        if (((a = l[r]).parsed && (a = a.el[0]), a === i.el[0])) {
                            t.index = r;
                            break;
                        }
                } else (t.items = e.isArray(i.items) ? i.items : [i.items]), (t.index = i.index || 0);
                if (!t.isOpen) {
                    (t.types = []),
                        (s = ""),
                        (t.ev = i.mainEl && i.mainEl.length ? i.mainEl.eq(0) : o),
                        i.key ? (t.popupsCache[i.key] || (t.popupsCache[i.key] = {}), (t.currTemplate = t.popupsCache[i.key])) : (t.currTemplate = {}),
                        (t.st = e.extend(!0, {}, e.magnificPopup.defaults, i)),
                        (t.fixedContentPos = "auto" === t.st.fixedContentPos ? !t.probablyMobile : t.st.fixedContentPos),
                    t.st.modal && ((t.st.closeOnContentClick = !1), (t.st.closeOnBgClick = !1), (t.st.showCloseBtn = !1), (t.st.enableEscapeKey = !1)),
                    t.bgOverlay ||
                    ((t.bgOverlay = T("bg").on("click" + f, function () {
                        t.close();
                    })),
                        (t.wrap = T("wrap")
                            .attr("tabindex", -1)
                            .on("click" + f, function (e) {
                                t._checkIfClose(e.target) && t.close();
                            })),
                        (t.container = T("container", t.wrap))),
                        (t.contentContainer = T("content")),
                    t.st.preloader && (t.preloader = T("preloader", t.container, t.st.tLoading));
                    var c = e.magnificPopup.modules;
                    for (r = 0; c.length > r; r++) {
                        var p = c[r];
                        (p = p.charAt(0).toUpperCase() + p.slice(1)), t["init" + p].call(t);
                    }
                    S("BeforeOpen"),
                    t.st.showCloseBtn &&
                    (t.st.closeBtnInside
                        ? (b(u, function (e, t, i, n) {
                            i.close_replaceWith = C(n.type);
                        }),
                            (s += " mfp-close-btn-in"))
                        : t.wrap.append(C())),
                    t.st.alignTop && (s += " mfp-align-top"),
                        t.fixedContentPos ? t.wrap.css({
                            overflow: t.st.overflowY,
                            overflowX: "hidden",
                            overflowY: t.st.overflowY
                        }) : t.wrap.css({top: x.scrollTop(), position: "absolute"}),
                    (!1 === t.st.fixedBgPos || ("auto" === t.st.fixedBgPos && !t.fixedContentPos)) && t.bgOverlay.css({
                        height: o.height(),
                        position: "absolute"
                    }),
                    t.st.enableEscapeKey &&
                    o.on("keyup" + f, function (e) {
                        27 === e.keyCode && t.close();
                    }),
                        x.on("resize" + f, function () {
                            t.updateSize();
                        }),
                    t.st.closeOnContentClick || (s += " mfp-auto-cursor"),
                    s && t.wrap.addClass(s);
                    var h = (t.wH = x.height()),
                        g = {};
                    if (t.fixedContentPos && t._hasScrollBar(h)) {
                        var v = t._getScrollbarSize();
                        v && (g.marginRight = v);
                    }
                    t.fixedContentPos && (t.isIE7 ? e("body, html").css("overflow", "hidden") : (g.overflow = "hidden"));
                    var y = t.st.mainClass;
                    return (
                        t.isIE7 && (y += " mfp-ie7"),
                        y && t._addClassToMFP(y),
                            t.updateItemHTML(),
                            S("BuildControls"),
                            e("html").css(g),
                            t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || n),
                            (t._lastFocusedEl = document.activeElement),
                            setTimeout(function () {
                                t.content ? (t._addClassToMFP(m), t._setFocus()) : t.bgOverlay.addClass(m), o.on("focusin" + f, t._onFocusIn);
                            }, 16),
                            (t.isOpen = !0),
                            t.updateSize(h),
                            S(d),
                            i
                    );
                }
                t.updateItemHTML();
            },
            close: function () {
                t.isOpen &&
                (S(c),
                    (t.isOpen = !1),
                    t.st.removalDelay && !t.isLowIE && t.supportsTransition
                        ? (t._addClassToMFP(g),
                            setTimeout(function () {
                                t._close();
                            }, t.st.removalDelay))
                        : t._close());
            },
            _close: function () {
                S(l);
                var i = g + " " + m + " ";
                if ((t.bgOverlay.detach(), t.wrap.detach(), t.container.empty(), t.st.mainClass && (i += t.st.mainClass + " "), t._removeClassFromMFP(i), t.fixedContentPos)) {
                    var n = {marginRight: ""};
                    t.isIE7 ? e("body, html").css("overflow", "") : (n.overflow = ""), e("html").css(n);
                }
                o.off("keyup.mfp focusin" + f),
                    t.ev.off(f),
                    t.wrap.attr("class", "mfp-wrap").removeAttr("style"),
                    t.bgOverlay.attr("class", "mfp-bg"),
                    t.container.attr("class", "mfp-container"),
                !t.st.showCloseBtn || (t.st.closeBtnInside && !0 !== t.currTemplate[t.currItem.type]) || (t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach()),
                t._lastFocusedEl && e(t._lastFocusedEl).focus(),
                    (t.currItem = null),
                    (t.content = null),
                    (t.currTemplate = null),
                    (t.prevHeight = 0),
                    S("AfterClose");
            },
            updateSize: function (e) {
                if (t.isIOS) {
                    var i = document.documentElement.clientWidth / window.innerWidth,
                        n = window.innerHeight * i;
                    t.wrap.css("height", n), (t.wH = n);
                } else t.wH = e || x.height();
                t.fixedContentPos || t.wrap.css("height", t.wH), S("Resize");
            },
            updateItemHTML: function () {
                var i = t.items[t.index];
                t.contentContainer.detach(), t.content && t.content.detach(), i.parsed || (i = t.parseEl(t.index));
                var n = i.type;
                if ((S("BeforeChange", [t.currItem ? t.currItem.type : "", n]), (t.currItem = i), !t.currTemplate[n])) {
                    var o = !!t.st[n] && t.st[n].markup;
                    S("FirstMarkupParse", o), (t.currTemplate[n] = !o || e(o));
                }
                r && r !== i.type && t.container.removeClass("mfp-" + r + "-holder");
                var s = t["get" + n.charAt(0).toUpperCase() + n.slice(1)](i, t.currTemplate[n]);
                t.appendContent(s, n), (i.preloaded = !0), S(p, i), (r = i.type), t.container.prepend(t.contentContainer), S("AfterChange");
            },
            appendContent: function (e, i) {
                (t.content = e),
                    e ? (t.st.showCloseBtn && t.st.closeBtnInside && !0 === t.currTemplate[i] ? t.content.find(".mfp-close").length || t.content.append(C()) : (t.content = e)) : (t.content = ""),
                    S("BeforeAppend"),
                    t.container.addClass("mfp-" + i + "-holder"),
                    t.contentContainer.append(t.content);
            },
            parseEl: function (i) {
                var n,
                    o = t.items[i];
                if ((o.tagName ? (o = {el: e(o)}) : ((n = o.type), (o = {data: o, src: o.src})), o.el)) {
                    for (var r = t.types, s = 0; r.length > s; s++)
                        if (o.el.hasClass("mfp-" + r[s])) {
                            n = r[s];
                            break;
                        }
                    (o.src = o.el.attr("data-mfp-src")), o.src || (o.src = o.el.attr("href"));
                }
                return (o.type = n || t.st.type || "inline"), (o.index = i), (o.parsed = !0), (t.items[i] = o), S("ElementParse", o), t.items[i];
            },
            addGroup: function (e, i) {
                var n = function (n) {
                    (n.mfpEl = this), t._openClick(n, e, i);
                };
                i || (i = {});
                var o = "click.magnificPopup";
                (i.mainEl = e), i.items ? ((i.isObj = !0), e.off(o).on(o, n)) : ((i.isObj = !1), i.delegate ? e.off(o).on(o, i.delegate, n) : ((i.items = e), e.off(o).on(o, n)));
            },
            _openClick: function (i, n, o) {
                if ((void 0 !== o.midClick ? o.midClick : e.magnificPopup.defaults.midClick) || (2 !== i.which && !i.ctrlKey && !i.metaKey)) {
                    var r = void 0 !== o.disableOn ? o.disableOn : e.magnificPopup.defaults.disableOn;
                    if (r)
                        if (e.isFunction(r)) {
                            if (!r.call(t)) return !0;
                        } else if (r > x.width()) return !0;
                    i.type && (i.preventDefault(), t.isOpen && i.stopPropagation()), (o.el = e(i.mfpEl)), o.delegate && (o.items = n.find(o.delegate)), t.open(o);
                }
            },
            updateStatus: function (e, n) {
                if (t.preloader) {
                    i !== e && t.container.removeClass("mfp-s-" + i), n || "loading" !== e || (n = t.st.tLoading);
                    var o = {status: e, text: n};
                    S("UpdateStatus", o),
                        (e = o.status),
                        (n = o.text),
                        t.preloader.html(n),
                        t.preloader.find("a").on("click", function (e) {
                            e.stopImmediatePropagation();
                        }),
                        t.container.addClass("mfp-s-" + e),
                        (i = e);
                }
            },
            _checkIfClose: function (i) {
                if (!e(i).hasClass(v)) {
                    var n = t.st.closeOnContentClick,
                        o = t.st.closeOnBgClick;
                    if (n && o) return !0;
                    if (!t.content || e(i).hasClass("mfp-close") || (t.preloader && i === t.preloader[0])) return !0;
                    if (i === t.content[0] || e.contains(t.content[0], i)) {
                        if (n) return !0;
                    } else if (o && e.contains(document, i)) return !0;
                    return !1;
                }
            },
            _addClassToMFP: function (e) {
                t.bgOverlay.addClass(e), t.wrap.addClass(e);
            },
            _removeClassFromMFP: function (e) {
                this.bgOverlay.removeClass(e), t.wrap.removeClass(e);
            },
            _hasScrollBar: function (e) {
                return (t.isIE7 ? o.height() : document.body.scrollHeight) > (e || x.height());
            },
            _setFocus: function () {
                (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus();
            },
            _onFocusIn: function (i) {
                return i.target === t.wrap[0] || e.contains(t.wrap[0], i.target) ? void 0 : (t._setFocus(), !1);
            },
            _parseMarkup: function (t, i, n) {
                var o;
                n.data && (i = e.extend(n.data, i)),
                    S(u, [t, i, n]),
                    e.each(i, function (e, i) {
                        if (void 0 === i || !1 === i) return !0;
                        if ((o = e.split("_")).length > 1) {
                            var n = t.find(f + "-" + o[0]);
                            if (n.length > 0) {
                                var r = o[1];
                                "replaceWith" === r ? n[0] !== i[0] && n.replaceWith(i) : "img" === r ? (n.is("img") ? n.attr("src", i) : n.replaceWith('<img src="' + i + '" class="' + n.attr("class") + '" />')) : n.attr(o[1], i);
                            }
                        } else t.find(f + "-" + e).html(i);
                    });
            },
            _getScrollbarSize: function () {
                if (void 0 === t.scrollbarSize) {
                    var e = document.createElement("div");
                    (e.id = "mfp-sbm"),
                        (e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;"),
                        document.body.appendChild(e),
                        (t.scrollbarSize = e.offsetWidth - e.clientWidth),
                        document.body.removeChild(e);
                }
                return t.scrollbarSize;
            },
        }),
            (e.magnificPopup = {
                instance: null,
                proto: y.prototype,
                modules: [],
                open: function (t, i) {
                    return E(), ((t = t ? e.extend(!0, {}, t) : {}).isObj = !0), (t.index = i || 0), this.instance.open(t);
                },
                close: function () {
                    return e.magnificPopup.instance && e.magnificPopup.instance.close();
                },
                registerModule: function (t, i) {
                    i.options && (e.magnificPopup.defaults[t] = i.options), e.extend(this.proto, i.proto), this.modules.push(t);
                },
                defaults: {
                    disableOn: 0,
                    key: null,
                    midClick: !1,
                    mainClass: "",
                    preloader: !0,
                    focus: "",
                    closeOnContentClick: !1,
                    closeOnBgClick: !0,
                    closeBtnInside: !0,
                    showCloseBtn: !0,
                    enableEscapeKey: !0,
                    modal: !1,
                    alignTop: !1,
                    removalDelay: 0,
                    prependTo: null,
                    fixedContentPos: "auto",
                    fixedBgPos: "auto",
                    overflowY: "auto",
                    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
                    tClose: "Zamknij (Esc)",
                    tLoading: "Wczytywanie...",
                },
            }),
            (e.fn.magnificPopup = function (i) {
                E();
                var n = e(this);
                if ("string" == typeof i)
                    if ("open" === i) {
                        var o,
                            r = w ? n.data("magnificPopup") : n[0].magnificPopup,
                            s = parseInt(arguments[1], 10) || 0;
                        r.items ? (o = r.items[s]) : ((o = n), r.delegate && (o = o.find(r.delegate)), (o = o.eq(s))), t._openClick({mfpEl: o}, n, r);
                    } else t.isOpen && t[i].apply(t, Array.prototype.slice.call(arguments, 1));
                else (i = e.extend(!0, {}, i)), w ? n.data("magnificPopup", i) : (n[0].magnificPopup = i), t.addGroup(n, i);
                return n;
            });
        var k,
            _,
            z,
            L = "inline",
            M = function () {
                z && (_.after(z.addClass(k)).detach(), (z = null));
            };
        e.magnificPopup.registerModule(L, {
            options: {hiddenClass: "hide", markup: "", tNotFound: "Content not found"},
            proto: {
                initInline: function () {
                    t.types.push(L),
                        b(l + "." + L, function () {
                            M();
                        });
                },
                getInline: function (i, n) {
                    if ((M(), i.src)) {
                        var o = t.st.inline,
                            r = e(i.src);
                        if (r.length) {
                            var s = r[0].parentNode;
                            s && s.tagName && (_ || ((k = o.hiddenClass), (_ = T(k)), (k = "mfp-" + k)), (z = r.after(_).detach().removeClass(k))), t.updateStatus("ready");
                        } else t.updateStatus("error", o.tNotFound), (r = e("<div>"));
                        return (i.inlineElement = r), r;
                    }
                    return t.updateStatus("ready"), t._parseMarkup(n, {}, i), n;
                },
            },
        });
        var I,
            P = "ajax",
            D = function () {
                I && n.removeClass(I);
            },
            O = function () {
                D(), t.req && t.req.abort();
            };
        e.magnificPopup.registerModule(P, {
            options: {
                settings: null,
                cursor: "mfp-ajax-cur",
                tError: '<a href="%url%">The content</a> could not be loaded.'
            },
            proto: {
                initAjax: function () {
                    t.types.push(P), (I = t.st.ajax.cursor), b(l + "." + P, O), b("BeforeChange." + P, O);
                },
                getAjax: function (i) {
                    I && n.addClass(I), t.updateStatus("loading");
                    var o = e.extend(
                        {
                            url: i.src,
                            success: function (n, o, r) {
                                var s = {data: n, xhr: r};
                                S("ParseAjax", s),
                                    t.appendContent(e(s.data), P),
                                    (i.finished = !0),
                                    D(),
                                    t._setFocus(),
                                    setTimeout(function () {
                                        t.wrap.addClass(m);
                                    }, 16),
                                    t.updateStatus("ready"),
                                    S("AjaxContentAdded");
                            },
                            error: function () {
                                D(), (i.finished = i.loadError = !0), t.updateStatus("error", t.st.ajax.tError.replace("%url%", i.src));
                            },
                        },
                        t.st.ajax.settings
                    );
                    return (t.req = e.ajax(o)), "";
                },
            },
        });
        var A,
            $ = function (i) {
                if (i.data && void 0 !== i.data.title) return i.data.title;
                var n = t.st.image.titleSrc;
                if (n) {
                    if (e.isFunction(n)) return n.call(t, i);
                    if (i.el) return i.el.attr(n) || "";
                }
                return "";
            };
        e.magnificPopup.registerModule("image", {
            options: {
                markup:
                    '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image</a> could not be loaded.',
            },
            proto: {
                initImage: function () {
                    var e = t.st.image,
                        i = ".image";
                    t.types.push("image"),
                        b(d + i, function () {
                            "image" === t.currItem.type && e.cursor && n.addClass(e.cursor);
                        }),
                        b(l + i, function () {
                            e.cursor && n.removeClass(e.cursor), x.off("resize" + f);
                        }),
                        b("Resize" + i, t.resizeImage),
                    t.isLowIE && b("AfterChange", t.resizeImage);
                },
                resizeImage: function () {
                    var e = t.currItem;
                    if (e && e.img && t.st.image.verticalFit) {
                        var i = 0;
                        t.isLowIE && (i = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", t.wH - i);
                    }
                },
                _onImageHasSize: function (e) {
                    e.img && ((e.hasSize = !0), A && clearInterval(A), (e.isCheckingImgSize = !1), S("ImageHasSize", e), e.imgHidden && (t.content && t.content.removeClass("mfp-loading"), (e.imgHidden = !1)));
                },
                findImageSize: function (e) {
                    var i = 0,
                        n = e.img[0],
                        o = function (r) {
                            A && clearInterval(A),
                                (A = setInterval(function () {
                                    return n.naturalWidth > 0 ? void t._onImageHasSize(e) : (i > 200 && clearInterval(A), void (3 === ++i ? o(10) : 40 === i ? o(50) : 100 === i && o(500)));
                                }, r));
                        };
                    o(1);
                },
                getImage: function (i, n) {
                    var o = 0,
                        r = function () {
                            i &&
                            (i.img[0].complete
                                ? (i.img.off(".mfploader"), i === t.currItem && (t._onImageHasSize(i), t.updateStatus("ready")), (i.hasSize = !0), (i.loaded = !0), S("ImageLoadComplete"))
                                : 200 > ++o
                                    ? setTimeout(r, 100)
                                    : s());
                        },
                        s = function () {
                            i && (i.img.off(".mfploader"), i === t.currItem && (t._onImageHasSize(i), t.updateStatus("error", a.tError.replace("%url%", i.src))), (i.hasSize = !0), (i.loaded = !0), (i.loadError = !0));
                        },
                        a = t.st.image,
                        l = n.find(".mfp-img");
                    if (l.length) {
                        var c = document.createElement("img");
                        (c.className = "mfp-img"),
                            (i.img = e(c).on("load.mfploader", r).on("error.mfploader", s)),
                            (c.src = i.src),
                        l.is("img") && (i.img = i.img.clone()),
                            (c = i.img[0]).naturalWidth > 0 ? (i.hasSize = !0) : c.width || (i.hasSize = !1);
                    }
                    return (
                        t._parseMarkup(n, {title: $(i), img_replaceWith: i.img}, i),
                            t.resizeImage(),
                            i.hasSize
                                ? (A && clearInterval(A), i.loadError ? (n.addClass("mfp-loading"), t.updateStatus("error", a.tError.replace("%url%", i.src))) : (n.removeClass("mfp-loading"), t.updateStatus("ready")), n)
                                : (t.updateStatus("loading"), (i.loading = !0), i.hasSize || ((i.imgHidden = !0), n.addClass("mfp-loading"), t.findImageSize(i)), n)
                    );
                },
            },
        });
        var N;
        e.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function (e) {
                    return e.is("img") ? e : e.find("img");
                },
            },
            proto: {
                initZoom: function () {
                    var e,
                        i = t.st.zoom,
                        n = ".zoom";
                    if (i.enabled && t.supportsTransition) {
                        var o,
                            r,
                            s = i.duration,
                            a = function (e) {
                                var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                    n = "all " + i.duration / 1e3 + "s " + i.easing,
                                    o = {
                                        position: "fixed",
                                        zIndex: 9999,
                                        left: 0,
                                        top: 0,
                                        "-webkit-backface-visibility": "hidden"
                                    },
                                    r = "transition";
                                return (o["-webkit-" + r] = o["-moz-" + r] = o["-o-" + r] = o[r] = n), t.css(o), t;
                            },
                            u = function () {
                                t.content.css("visibility", "visible");
                            };
                        b("BuildControls" + n, function () {
                            if (t._allowZoom()) {
                                if ((clearTimeout(o), t.content.css("visibility", "hidden"), !(e = t._getItemToZoom()))) return void u();
                                (r = a(e)).css(t._getOffset()),
                                    t.wrap.append(r),
                                    (o = setTimeout(function () {
                                        r.css(t._getOffset(!0)),
                                            (o = setTimeout(function () {
                                                u(),
                                                    setTimeout(function () {
                                                        r.remove(), (e = r = null), S("ZoomAnimationEnded");
                                                    }, 16);
                                            }, s));
                                    }, 16));
                            }
                        }),
                            b(c + n, function () {
                                if (t._allowZoom()) {
                                    if ((clearTimeout(o), (t.st.removalDelay = s), !e)) {
                                        if (!(e = t._getItemToZoom())) return;
                                        r = a(e);
                                    }
                                    r.css(t._getOffset(!0)),
                                        t.wrap.append(r),
                                        t.content.css("visibility", "hidden"),
                                        setTimeout(function () {
                                            r.css(t._getOffset());
                                        }, 16);
                                }
                            }),
                            b(l + n, function () {
                                t._allowZoom() && (u(), r && r.remove(), (e = null));
                            });
                    }
                },
                _allowZoom: function () {
                    return "image" === t.currItem.type;
                },
                _getItemToZoom: function () {
                    return !!t.currItem.hasSize && t.currItem.img;
                },
                _getOffset: function (i) {
                    var n,
                        o = (n = i ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem)).offset(),
                        r = parseInt(n.css("padding-top"), 10),
                        s = parseInt(n.css("padding-bottom"), 10);
                    o.top -= e(window).scrollTop() - r;
                    var a = {width: n.width(), height: (w ? n.innerHeight() : n[0].offsetHeight) - s - r};
                    return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N ? (a["-moz-transform"] = a.transform = "translate(" + o.left + "px," + o.top + "px)") : ((a.left = o.left), (a.top = o.top)), a;
                },
            },
        });
        var R = "iframe",
            F = function (e) {
                if (t.currTemplate[R]) {
                    var i = t.currTemplate[R].find("iframe");
                    i.length && (e || (i[0].src = "//about:blank"), t.isIE8 && i.css("display", e ? "block" : "none"));
                }
            };
        e.magnificPopup.registerModule(R, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: {index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1"},
                    vimeo: {index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1"},
                    gmaps: {index: "//maps.google.", src: "%id%&output=embed"},
                },
            },
            proto: {
                initIframe: function () {
                    t.types.push(R),
                        b("BeforeChange", function (e, t, i) {
                            t !== i && (t === R ? F() : i === R && F(!0));
                        }),
                        b(l + "." + R, function () {
                            F();
                        });
                },
                getIframe: function (i, n) {
                    var o = i.src,
                        r = t.st.iframe;
                    e.each(r.patterns, function () {
                        return o.indexOf(this.index) > -1 ? (this.id && (o = "string" == typeof this.id ? o.substr(o.lastIndexOf(this.id) + this.id.length, o.length) : this.id.call(this, o)), (o = this.src.replace("%id%", o)), !1) : void 0;
                    });
                    var s = {};
                    return r.srcAction && (s[r.srcAction] = o), t._parseMarkup(n, s, i), t.updateStatus("ready"), n;
                },
            },
        });
        var H = function (e) {
                var i = t.items.length;
                return e > i - 1 ? e - i : 0 > e ? i + e : e;
            },
            j = function (e, t, i) {
                return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, i);
            };
        e.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                preload: [0, 2],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%",
            },
            proto: {
                initGallery: function () {
                    var i = t.st.gallery,
                        n = ".mfp-gallery",
                        r = Boolean(e.fn.mfpFastClick);
                    return (
                        (t.direction = !0),
                        !(!i || !i.enabled) &&
                        ((s += " mfp-gallery"),
                            b(d + n, function () {
                                i.navigateByImgClick &&
                                t.wrap.on("click" + n, ".mfp-img", function () {
                                    return t.items.length > 1 ? (t.next(), !1) : void 0;
                                }),
                                    o.on("keydown" + n, function (e) {
                                        37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next();
                                    });
                            }),
                            b("UpdateStatus" + n, function (e, i) {
                                i.text && (i.text = j(i.text, t.currItem.index, t.items.length));
                            }),
                            b(u + n, function (e, n, o, r) {
                                var s = t.items.length;
                                o.counter = s > 1 ? j(i.tCounter, r.index, s) : "";
                            }),
                            b("BuildControls" + n, function () {
                                if (t.items.length > 1 && i.arrows && !t.arrowLeft) {
                                    var n = i.arrowMarkup,
                                        o = (t.arrowLeft = e(n.replace(/%title%/gi, i.tPrev).replace(/%dir%/gi, "left")).addClass(v)),
                                        s = (t.arrowRight = e(n.replace(/%title%/gi, i.tNext).replace(/%dir%/gi, "right")).addClass(v)),
                                        a = r ? "mfpFastClick" : "click";
                                    o[a](function () {
                                        t.prev();
                                    }),
                                        s[a](function () {
                                            t.next();
                                        }),
                                    t.isIE7 && (T("b", o[0], !1, !0), T("a", o[0], !1, !0), T("b", s[0], !1, !0), T("a", s[0], !1, !0)),
                                        t.container.append(o.add(s));
                                }
                            }),
                            b(p + n, function () {
                                t._preloadTimeout && clearTimeout(t._preloadTimeout),
                                    (t._preloadTimeout = setTimeout(function () {
                                        t.preloadNearbyImages(), (t._preloadTimeout = null);
                                    }, 16));
                            }),
                            void b(l + n, function () {
                                o.off(n), t.wrap.off("click" + n), t.arrowLeft && r && t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(), (t.arrowRight = t.arrowLeft = null);
                            }))
                    );
                },
                next: function () {
                    (t.direction = !0), (t.index = H(t.index + 1)), t.updateItemHTML();
                },
                prev: function () {
                    (t.direction = !1), (t.index = H(t.index - 1)), t.updateItemHTML();
                },
                goTo: function (e) {
                    (t.direction = e >= t.index), (t.index = e), t.updateItemHTML();
                },
                preloadNearbyImages: function () {
                    var e,
                        i = t.st.gallery.preload,
                        n = Math.min(i[0], t.items.length),
                        o = Math.min(i[1], t.items.length);
                    for (e = 1; (t.direction ? o : n) >= e; e++) t._preloadItem(t.index + e);
                    for (e = 1; (t.direction ? n : o) >= e; e++) t._preloadItem(t.index - e);
                },
                _preloadItem: function (i) {
                    if (((i = H(i)), !t.items[i].preloaded)) {
                        var n = t.items[i];
                        n.parsed || (n = t.parseEl(i)),
                            S("LazyLoad", n),
                        "image" === n.type &&
                        (n.img = e('<img class="mfp-img" />')
                            .on("load.mfploader", function () {
                                n.hasSize = !0;
                            })
                            .on("error.mfploader", function () {
                                (n.hasSize = !0), (n.loadError = !0), S("LazyLoadError", n);
                            })
                            .attr("src", n.src)),
                            (n.preloaded = !0);
                    }
                },
            },
        });
        var W = "retina";
        e.magnificPopup.registerModule(W, {
            options: {
                replaceSrc: function (e) {
                    return e.src.replace(/\.\w+$/, function (e) {
                        return "@2x" + e;
                    });
                },
                ratio: 1,
            },
            proto: {
                initRetina: function () {
                    if (window.devicePixelRatio > 1) {
                        var e = t.st.retina,
                            i = e.ratio;
                        (i = isNaN(i) ? i() : i) > 1 &&
                        (b("ImageHasSize." + W, function (e, t) {
                            t.img.css({"max-width": t.img[0].naturalWidth / i, width: "100%"});
                        }),
                            b("ElementParse." + W, function (t, n) {
                                n.src = e.replaceSrc(n, i);
                            }));
                    }
                },
            },
        }),
            (function () {
                var t = "ontouchstart" in window,
                    i = function () {
                        x.off("touchmove" + n + " touchend" + n);
                    },
                    n = ".mfpFastClick";
                (e.fn.mfpFastClick = function (o) {
                    return e(this).each(function () {
                        var r,
                            s,
                            a,
                            l,
                            c,
                            u,
                            d,
                            p = e(this);
                        t &&
                        p.on("touchstart" + n, function (e) {
                            (c = !1),
                                (d = 1),
                                (u = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0]),
                                (a = u.clientX),
                                (l = u.clientY),
                                x
                                    .on("touchmove" + n, function (e) {
                                        (u = e.originalEvent ? e.originalEvent.touches : e.touches), (d = u.length), (u = u[0]), (Math.abs(u.clientX - a) > 10 || Math.abs(u.clientY - l) > 10) && ((c = !0), i());
                                    })
                                    .on("touchend" + n, function (e) {
                                        i(),
                                        c ||
                                        d > 1 ||
                                        ((r = !0),
                                            e.preventDefault(),
                                            clearTimeout(s),
                                            (s = setTimeout(function () {
                                                r = !1;
                                            }, 1e3)),
                                            o());
                                    });
                        });
                        p.on("click" + n, function () {
                            r || o();
                        });
                    });
                }),
                    (e.fn.destroyMfpFastClick = function () {
                        e(this).off("touchstart" + n + " click" + n), t && x.off("touchmove" + n + " touchend" + n);
                    });
            })(),
            E();
    })(window.jQuery || window.Zepto),
"function" != typeof Object.create &&
(Object.create = function (e) {
    function t() {
    }

    return (t.prototype = e), new t();
}),
    (function (e, t, i, n) {
        function o(t, i) {
            (this.settings = null),
                (this.options = e.extend({}, o.Defaults, i)),
                (this.$element = e(t)),
                (this.drag = e.extend({}, a)),
                (this.state = e.extend({}, l)),
                (this.e = e.extend({}, c)),
                (this._plugins = {}),
                (this._supress = {}),
                (this._current = null),
                (this._speed = null),
                (this._coordinates = []),
                (this._breakpoint = null),
                (this._width = null),
                (this._items = []),
                (this._clones = []),
                (this._mergers = []),
                (this._invalidated = {}),
                (this._pipe = []),
                e.each(
                    o.Plugins,
                    e.proxy(function (e, t) {
                        this._plugins[e[0].toLowerCase() + e.slice(1)] = new t(this);
                    }, this)
                ),
                e.each(
                    o.Pipe,
                    e.proxy(function (t, i) {
                        this._pipe.push({filter: i.filter, run: e.proxy(i.run, this)});
                    }, this)
                ),
                this.setup(),
                this.initialize();
        }

        function r(e) {
            if (e.touches !== n) return {x: e.touches[0].pageX, y: e.touches[0].pageY};
            if (e.touches === n) {
                if (e.pageX !== n) return {x: e.pageX, y: e.pageY};
                if (e.pageX === n) return {x: e.clientX, y: e.clientY};
            }
        }

        function s(e) {
            var t,
                n,
                o = i.createElement("div"),
                r = e;
            for (t in r) if (((n = r[t]), void 0 !== o.style[n])) return (o = null), [n, t];
            return [!1];
        }

        var a, l, c;
        (a = {
            start: 0,
            startX: 0,
            startY: 0,
            current: 0,
            currentX: 0,
            currentY: 0,
            offsetX: 0,
            offsetY: 0,
            distance: null,
            startTime: 0,
            endTime: 0,
            updatedX: 0,
            targetEl: null
        }),
            (l = {isTouch: !1, isScrolling: !1, isSwiping: !1, direction: !1, inMotion: !1}),
            (c = {
                _onDragStart: null,
                _onDragMove: null,
                _onDragEnd: null,
                _transitionEnd: null,
                _resizer: null,
                _responsiveCall: null,
                _goToLoop: null,
                _checkVisibile: null
            }),
            (o.Defaults = {
                items: 3,
                loop: !1,
                center: !1,
                mouseDrag: !0,
                touchDrag: !0,
                pullDrag: !0,
                freeDrag: !1,
                margin: 0,
                stagePadding: 0,
                merge: !1,
                mergeFit: !0,
                autoWidth: !1,
                startPosition: 0,
                rtl: !1,
                smartSpeed: 250,
                fluidSpeed: !1,
                dragEndSpeed: !1,
                responsive: {},
                responsiveRefreshRate: 200,
                responsiveBaseElement: t,
                responsiveClass: !1,
                fallbackEasing: "swing",
                info: !1,
                nestedItemSelector: !1,
                itemElement: "div",
                stageElement: "div",
                themeClass: "owl-theme",
                baseClass: "owl-carousel",
                itemClass: "owl-item",
                centerClass: "center",
                activeClass: "active",
            }),
            (o.Width = {Default: "default", Inner: "inner", Outer: "outer"}),
            (o.Plugins = {}),
            (o.Pipe = [
                {
                    filter: ["width", "items", "settings"],
                    run: function (e) {
                        e.current = this._items && this._items[this.relative(this._current)];
                    },
                },
                {
                    filter: ["items", "settings"],
                    run: function () {
                        var e = this._clones;
                        (this.$stage.children(".cloned").length !== e.length || (!this.settings.loop && e.length > 0)) && (this.$stage.children(".cloned").remove(), (this._clones = []));
                    },
                },
                {
                    filter: ["items", "settings"],
                    run: function () {
                        var e,
                            t,
                            i = this._clones,
                            n = this._items,
                            o = this.settings.loop ? i.length - Math.max(2 * this.settings.items, 4) : 0;
                        for (e = 0, t = Math.abs(o / 2); e < t; e++)
                            o > 0
                                ? (this.$stage
                                    .children()
                                    .eq(n.length + i.length - 1)
                                    .remove(),
                                    i.pop(),
                                    this.$stage.children().eq(0).remove(),
                                    i.pop())
                                : (i.push(i.length / 2), this.$stage.append(n[i[i.length - 1]].clone().addClass("cloned")), i.push(n.length - 1 - (i.length - 1) / 2), this.$stage.prepend(n[i[i.length - 1]].clone().addClass("cloned")));
                    },
                },
                {
                    filter: ["width", "items", "settings"],
                    run: function () {
                        var e,
                            t,
                            i,
                            n = this.settings.rtl ? 1 : -1,
                            o = (this.width() / this.settings.items).toFixed(3),
                            r = 0;
                        for (this._coordinates = [], t = 0, i = this._clones.length + this._items.length; t < i; t++)
                            (e = this._mergers[this.relative(t)]),
                                (e = (this.settings.mergeFit && Math.min(e, this.settings.items)) || e),
                                (r += (this.settings.autoWidth ? this._items[this.relative(t)].width() + this.settings.margin : o * e) * n),
                                this._coordinates.push(r);
                    },
                },
                {
                    filter: ["width", "items", "settings"],
                    run: function () {
                        var t,
                            i,
                            n = (this.width() / this.settings.items).toFixed(3),
                            o = {
                                width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
                                "padding-left": this.settings.stagePadding || "",
                                "padding-right": this.settings.stagePadding || ""
                            };
                        if (
                            (this.$stage.css(o),
                                ((o = {width: this.settings.autoWidth ? "auto" : n - this.settings.margin})[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin),
                            !this.settings.autoWidth &&
                            e.grep(this._mergers, function (e) {
                                return e > 1;
                            }).length > 0)
                        )
                            for (t = 0, i = this._coordinates.length; t < i; t++) (o.width = Math.abs(this._coordinates[t]) - Math.abs(this._coordinates[t - 1] || 0) - this.settings.margin), this.$stage.children().eq(t).css(o);
                        else this.$stage.children().css(o);
                    },
                },
                {
                    filter: ["width", "items", "settings"],
                    run: function (e) {
                        e.current && this.reset(this.$stage.children().index(e.current));
                    },
                },
                {
                    filter: ["position"],
                    run: function () {
                        this.animate(this.coordinates(this._current));
                    },
                },
                {
                    filter: ["width", "position", "items", "settings"],
                    run: function () {
                        var e,
                            t,
                            i,
                            n,
                            o = this.settings.rtl ? 1 : -1,
                            r = 2 * this.settings.stagePadding,
                            s = this.coordinates(this.current()) + r,
                            a = s + this.width() * o,
                            l = [];
                        for (i = 0, n = this._coordinates.length; i < n; i++)
                            (e = this._coordinates[i - 1] || 0), (t = Math.abs(this._coordinates[i]) + r * o), ((this.op(e, "<=", s) && this.op(e, ">", a)) || (this.op(t, "<", s) && this.op(t, ">", a))) && l.push(i);
                        this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass),
                            this.$stage.children(":eq(" + l.join("), :eq(") + ")").addClass(this.settings.activeClass),
                        this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass));
                    },
                },
            ]),
            (o.prototype.initialize = function () {
                var t, i, o;
                if (
                    (this.trigger("initialize"),
                        this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl),
                        this.browserSupport(),
                    this.settings.autoWidth && !0 !== this.state.imagesLoaded) &&
                    ((t = this.$element.find("img")), (i = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : n), (o = this.$element.children(i).width()), t.length && o <= 0)
                )
                    return this.preloadAutoWidthImages(t), !1;
                this.$element.addClass("owl-loading"),
                    (this.$stage = e("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">')),
                    this.$element.append(this.$stage.parent()),
                    this.replace(this.$element.children().not(this.$stage.parent())),
                    (this._width = this.$element.width()),
                    this.refresh(),
                    this.$element.removeClass("owl-loading").addClass("owl-loaded"),
                    this.eventsCall(),
                    this.internalEvents(),
                    this.addTriggerableEvents(),
                    this.trigger("initialized");
            }),
            (o.prototype.setup = function () {
                var t = this.viewport(),
                    i = this.options.responsive,
                    n = -1,
                    o = null;
                i
                    ? (e.each(i, function (e) {
                        e <= t && e > n && (n = Number(e));
                    }),
                        delete (o = e.extend({}, this.options, i[n])).responsive,
                    o.responsiveClass &&
                    this.$element
                        .attr("class", function (e, t) {
                            return t.replace(/\b owl-responsive-\S+/g, "");
                        })
                        .addClass("owl-responsive-" + n))
                    : (o = e.extend({}, this.options)),
                (null !== this.settings && this._breakpoint === n) ||
                (this.trigger("change", {property: {name: "settings", value: o}}),
                    (this._breakpoint = n),
                    (this.settings = o),
                    this.invalidate("settings"),
                    this.trigger("changed", {property: {name: "settings", value: this.settings}}));
            }),
            (o.prototype.optionsLogic = function () {
                this.$element.toggleClass("owl-center", this.settings.center),
                this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1),
                this.settings.autoWidth && ((this.settings.stagePadding = !1), (this.settings.merge = !1));
            }),
            (o.prototype.prepare = function (t) {
                var i = this.trigger("prepare", {content: t});
                return (
                    i.data ||
                    (i.data = e("<" + this.settings.itemElement + "/>")
                        .addClass(this.settings.itemClass)
                        .append(t)),
                        this.trigger("prepared", {content: i.data}),
                        i.data
                );
            }),
            (o.prototype.update = function () {
                for (
                    var t = 0,
                        i = this._pipe.length,
                        n = e.proxy(function (e) {
                            return this[e];
                        }, this._invalidated),
                        o = {};
                    t < i;
                )
                    (this._invalidated.all || e.grep(this._pipe[t].filter, n).length > 0) && this._pipe[t].run(o), t++;
                this._invalidated = {};
            }),
            (o.prototype.width = function (e) {
                switch ((e = e || o.Width.Default)) {
                    case o.Width.Inner:
                    case o.Width.Outer:
                        return this._width;
                    default:
                        return this._width - 2 * this.settings.stagePadding + this.settings.margin;
                }
            }),
            (o.prototype.refresh = function () {
                if (0 === this._items.length) return !1;
                new Date().getTime(),
                    this.trigger("refresh"),
                    this.setup(),
                    this.optionsLogic(),
                    this.$stage.addClass("owl-refresh"),
                    this.update(),
                    this.$stage.removeClass("owl-refresh"),
                    (this.state.orientation = t.orientation),
                    this.watchVisibility(),
                    this.trigger("refreshed");
            }),
            (o.prototype.eventsCall = function () {
                (this.e._onDragStart = e.proxy(function (e) {
                    this.onDragStart(e);
                }, this)),
                    (this.e._onDragMove = e.proxy(function (e) {
                        this.onDragMove(e);
                    }, this)),
                    (this.e._onDragEnd = e.proxy(function (e) {
                        this.onDragEnd(e);
                    }, this)),
                    (this.e._onResize = e.proxy(function (e) {
                        this.onResize(e);
                    }, this)),
                    (this.e._transitionEnd = e.proxy(function (e) {
                        this.transitionEnd(e);
                    }, this)),
                    (this.e._preventClick = e.proxy(function (e) {
                        this.preventClick(e);
                    }, this));
            }),
            (o.prototype.onThrottledResize = function () {
                t.clearTimeout(this.resizeTimer), (this.resizeTimer = t.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate));
            }),
            (o.prototype.onResize = function () {
                return (
                    !!this._items.length &&
                    this._width !== this.$element.width() &&
                    !this.trigger("resize").isDefaultPrevented() &&
                    ((this._width = this.$element.width()), this.invalidate("width"), this.refresh(), void this.trigger("resized"))
                );
            }),
            (o.prototype.eventsRouter = function (e) {
                var t = e.type;
                "mousedown" === t || "touchstart" === t
                    ? this.onDragStart(e)
                    : "mousemove" === t || "touchmove" === t
                    ? this.onDragMove(e)
                    : "mouseup" === t || "touchend" === t
                        ? this.onDragEnd(e)
                        : "touchcancel" === t && this.onDragEnd(e);
            }),
            (o.prototype.internalEvents = function () {
                var i = ("ontouchstart" in t || navigator.msMaxTouchPoints, t.navigator.msPointerEnabled);
                this.settings.mouseDrag
                    ? (this.$stage.on(
                    "mousedown",
                    e.proxy(function (e) {
                        this.eventsRouter(e);
                    }, this)
                    ),
                        this.$stage.on("dragstart", function () {
                            return !1;
                        }),
                        (this.$stage.get(0).onselectstart = function () {
                            return !1;
                        }))
                    : this.$element.addClass("owl-text-select-on"),
                this.settings.touchDrag &&
                !i &&
                this.$stage.on(
                    "touchstart touchcancel",
                    e.proxy(function (e) {
                        this.eventsRouter(e);
                    }, this)
                ),
                this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1),
                !1 !== this.settings.responsive && this.on(t, "resize", e.proxy(this.onThrottledResize, this));
            }),
            (o.prototype.onDragStart = function (n) {
                var o, s, a, l;
                if (3 === (o = n.originalEvent || n || t.event).which || this.state.isTouch) return !1;
                if (
                    ("mousedown" === o.type && this.$stage.addClass("owl-grab"),
                        this.trigger("drag"),
                        (this.drag.startTime = new Date().getTime()),
                        this.speed(0),
                        (this.state.isTouch = !0),
                        (this.state.isScrolling = !1),
                        (this.state.isSwiping = !1),
                        (this.drag.distance = 0),
                        (s = r(o).x),
                        (a = r(o).y),
                        (this.drag.offsetX = this.$stage.position().left),
                        (this.drag.offsetY = this.$stage.position().top),
                    this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin),
                    this.state.inMotion && this.support3d)
                )
                    (l = this.getTransformProperty()), (this.drag.offsetX = l), this.animate(l), (this.state.inMotion = !0);
                else if (this.state.inMotion && !this.support3d) return (this.state.inMotion = !1), !1;
                (this.drag.startX = s - this.drag.offsetX),
                    (this.drag.startY = a - this.drag.offsetY),
                    (this.drag.start = s - this.drag.startX),
                    (this.drag.targetEl = o.target || o.srcElement),
                    (this.drag.updatedX = this.drag.start),
                ("IMG" !== this.drag.targetEl.tagName && "A" !== this.drag.targetEl.tagName) || (this.drag.targetEl.draggable = !1),
                    e(i).on(
                        "mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents",
                        e.proxy(function (e) {
                            this.eventsRouter(e);
                        }, this)
                    );
            }),
            (o.prototype.onDragMove = function (e) {
                var i, o, s, a, l, c;
                this.state.isTouch &&
                (this.state.isScrolling ||
                    ((o = r((i = e.originalEvent || e || t.event)).x),
                        (s = r(i).y),
                        (this.drag.currentX = o - this.drag.startX),
                        (this.drag.currentY = s - this.drag.startY),
                        (this.drag.distance = this.drag.currentX - this.drag.offsetX),
                        this.drag.distance < 0 ? (this.state.direction = this.settings.rtl ? "right" : "left") : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"),
                        this.settings.loop
                            ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction
                            ? (this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length))
                            : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) &&
                            "left" === this.state.direction &&
                            (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length))
                            : ((a = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum())),
                                (l = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum())),
                                (c = this.settings.pullDrag ? this.drag.distance / 5 : 0),
                                (this.drag.currentX = Math.max(Math.min(this.drag.currentX, a + c), l + c))),
                    (this.drag.distance > 8 || this.drag.distance < -8) && (i.preventDefault !== n ? i.preventDefault() : (i.returnValue = !1), (this.state.isSwiping = !0)),
                        (this.drag.updatedX = this.drag.currentX),
                    (this.drag.currentY > 16 || this.drag.currentY < -16) && !1 === this.state.isSwiping && ((this.state.isScrolling = !0), (this.drag.updatedX = this.drag.start)),
                        this.animate(this.drag.updatedX)));
            }),
            (o.prototype.onDragEnd = function (t) {
                var n, o;
                if (this.state.isTouch) {
                    if (
                        ("mouseup" === t.type && this.$stage.removeClass("owl-grab"),
                            this.trigger("dragged"),
                            this.drag.targetEl.removeAttribute("draggable"),
                            (this.state.isTouch = !1),
                            (this.state.isScrolling = !1),
                            (this.state.isSwiping = !1),
                        0 === this.drag.distance && !0 !== this.state.inMotion)
                    )
                        return (this.state.inMotion = !1), !1;
                    (this.drag.endTime = new Date().getTime()),
                        (n = this.drag.endTime - this.drag.startTime),
                    (Math.abs(this.drag.distance) > 3 || n > 300) && this.removeClick(this.drag.targetEl),
                        (o = this.closest(this.drag.updatedX)),
                        this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
                        this.current(o),
                        this.invalidate("position"),
                        this.update(),
                    this.settings.pullDrag || this.drag.updatedX !== this.coordinates(o) || this.transitionEnd(),
                        (this.drag.distance = 0),
                        e(i).off(".owl.dragEvents");
                }
            }),
            (o.prototype.removeClick = function (i) {
                (this.drag.targetEl = i),
                    e(i).on("click.preventClick", this.e._preventClick),
                    t.setTimeout(function () {
                        e(i).off("click.preventClick");
                    }, 300);
            }),
            (o.prototype.preventClick = function (t) {
                t.preventDefault ? t.preventDefault() : (t.returnValue = !1), t.stopPropagation && t.stopPropagation(), e(t.target).off("click.preventClick");
            }),
            (o.prototype.getTransformProperty = function () {
                var e;
                return !0 !== (16 === (e = (e = t.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform")).replace(/matrix(3d)?\(|\)/g, "").split(",")).length) ? e[4] : e[12];
            }),
            (o.prototype.closest = function (t) {
                var i = -1,
                    n = this.width(),
                    o = this.coordinates();
                return (
                    this.settings.freeDrag ||
                    e.each(
                        o,
                        e.proxy(function (e, r) {
                            return t > r - 30 && t < r + 30 ? (i = e) : this.op(t, "<", r) && this.op(t, ">", o[e + 1] || r - n) && (i = "left" === this.state.direction ? e + 1 : e), -1 === i;
                        }, this)
                    ),
                    this.settings.loop || (this.op(t, ">", o[this.minimum()]) ? (i = t = this.minimum()) : this.op(t, "<", o[this.maximum()]) && (i = t = this.maximum())),
                        i
                );
            }),
            (o.prototype.animate = function (t) {
                this.trigger("translate"),
                    (this.state.inMotion = this.speed() > 0),
                    this.support3d
                        ? this.$stage.css({
                            transform: "translate3d(" + t + "px,0px, 0px)",
                            transition: this.speed() / 1e3 + "s"
                        })
                        : this.state.isTouch
                        ? this.$stage.css({left: t + "px"})
                        : this.$stage.animate(
                            {left: t},
                            this.speed() / 1e3,
                            this.settings.fallbackEasing,
                            e.proxy(function () {
                                this.state.inMotion && this.transitionEnd();
                            }, this)
                        );
            }),
            (o.prototype.current = function (e) {
                if (e === n) return this._current;
                if (0 === this._items.length) return n;
                if (((e = this.normalize(e)), this._current !== e)) {
                    var t = this.trigger("change", {property: {name: "position", value: e}});
                    t.data !== n && (e = this.normalize(t.data)), (this._current = e), this.invalidate("position"), this.trigger("changed", {
                        property: {
                            name: "position",
                            value: this._current
                        }
                    });
                }
                return this._current;
            }),
            (o.prototype.invalidate = function (e) {
                this._invalidated[e] = !0;
            }),
            (o.prototype.reset = function (e) {
                (e = this.normalize(e)) !== n && ((this._speed = 0), (this._current = e), this.suppress(["translate", "translated"]), this.animate(this.coordinates(e)), this.release(["translate", "translated"]));
            }),
            (o.prototype.normalize = function (t, i) {
                var o = i ? this._items.length : this._items.length + this._clones.length;
                return !e.isNumeric(t) || o < 1 ? n : (t = this._clones.length ? ((t % o) + o) % o : Math.max(this.minimum(i), Math.min(this.maximum(i), t)));
            }),
            (o.prototype.relative = function (e) {
                return (e = this.normalize(e)), (e -= this._clones.length / 2), this.normalize(e, !0);
            }),
            (o.prototype.maximum = function (e) {
                var t,
                    i,
                    n,
                    o = 0,
                    r = this.settings;
                if (e) return this._items.length - 1;
                if (!r.loop && r.center) t = this._items.length - 1;
                else if (r.loop || r.center)
                    if (r.loop || r.center) t = this._items.length + r.items;
                    else {
                        if (!r.autoWidth && !r.merge) throw "Can not detect maximum absolute position.";
                        for (revert = r.rtl ? 1 : -1, i = this.$stage.width() - this.$element.width(); (n = this.coordinates(o)) && !(n * revert >= i);) t = ++o;
                    }
                else t = this._items.length - r.items;
                return t;
            }),
            (o.prototype.minimum = function (e) {
                return e ? 0 : this._clones.length / 2;
            }),
            (o.prototype.items = function (e) {
                return e === n ? this._items.slice() : ((e = this.normalize(e, !0)), this._items[e]);
            }),
            (o.prototype.mergers = function (e) {
                return e === n ? this._mergers.slice() : ((e = this.normalize(e, !0)), this._mergers[e]);
            }),
            (o.prototype.clones = function (t) {
                var i = this._clones.length / 2,
                    o = i + this._items.length,
                    r = function (e) {
                        return e % 2 == 0 ? o + e / 2 : i - (e + 1) / 2;
                    };
                return t === n
                    ? e.map(this._clones, function (e, t) {
                        return r(t);
                    })
                    : e.map(this._clones, function (e, i) {
                        return e === t ? r(i) : null;
                    });
            }),
            (o.prototype.speed = function (e) {
                return e !== n && (this._speed = e), this._speed;
            }),
            (o.prototype.coordinates = function (t) {
                var i = null;
                return t === n
                    ? e.map(
                        this._coordinates,
                        e.proxy(function (e, t) {
                            return this.coordinates(t);
                        }, this)
                    )
                    : (this.settings.center ? ((i = this._coordinates[t]), (i += ((this.width() - i + (this._coordinates[t - 1] || 0)) / 2) * (this.settings.rtl ? -1 : 1))) : (i = this._coordinates[t - 1] || 0), i);
            }),
            (o.prototype.duration = function (e, t, i) {
                return Math.min(Math.max(Math.abs(t - e), 1), 6) * Math.abs(i || this.settings.smartSpeed);
            }),
            (o.prototype.to = function (i, n) {
                if (this.settings.loop) {
                    var o = i - this.relative(this.current()),
                        r = this.current(),
                        s = this.current(),
                        a = this.current() + o,
                        l = s - a < 0,
                        c = this._clones.length + this._items.length;
                    a < this.settings.items && !1 === l ? ((r = s + this._items.length), this.reset(r)) : a >= c - this.settings.items && !0 === l && ((r = s - this._items.length), this.reset(r)),
                        t.clearTimeout(this.e._goToLoop),
                        (this.e._goToLoop = t.setTimeout(
                            e.proxy(function () {
                                this.speed(this.duration(this.current(), r + o, n)), this.current(r + o), this.update();
                            }, this),
                            30
                        ));
                } else this.speed(this.duration(this.current(), i, n)), this.current(i), this.update();
            }),
            (o.prototype.next = function (e) {
                (e = e || !1), this.to(this.relative(this.current()) + 1, e);
            }),
            (o.prototype.prev = function (e) {
                (e = e || !1), this.to(this.relative(this.current()) - 1, e);
            }),
            (o.prototype.transitionEnd = function (e) {
                return (e === n || (e.stopPropagation(), (e.target || e.srcElement || e.originalTarget) === this.$stage.get(0))) && ((this.state.inMotion = !1), void this.trigger("translated"));
            }),
            (o.prototype.viewport = function () {
                var n;
                if (this.options.responsiveBaseElement !== t) n = e(this.options.responsiveBaseElement).width();
                else if (t.innerWidth) n = t.innerWidth;
                else {
                    if (!i.documentElement || !i.documentElement.clientWidth) throw "Can not detect viewport width.";
                    n = i.documentElement.clientWidth;
                }
                return n;
            }),
            (o.prototype.replace = function (t) {
                this.$stage.empty(),
                    (this._items = []),
                t && (t = t instanceof jQuery ? t : e(t)),
                this.settings.nestedItemSelector && (t = t.find("." + this.settings.nestedItemSelector)),
                    t
                        .filter(function () {
                            return 1 === this.nodeType;
                        })
                        .each(
                            e.proxy(function (e, t) {
                                (t = this.prepare(t)), this.$stage.append(t), this._items.push(t), this._mergers.push(1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1);
                            }, this)
                        ),
                    this.reset(e.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0),
                    this.invalidate("items");
            }),
            (o.prototype.add = function (e, t) {
                (t = t === n ? this._items.length : this.normalize(t, !0)),
                    this.trigger("add", {content: e, position: t}),
                    0 === this._items.length || t === this._items.length
                        ? (this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1))
                        : (this._items[t].before(e), this._items.splice(t, 0, e), this._mergers.splice(t, 0, 1 * e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)),
                    this.invalidate("items"),
                    this.trigger("added", {content: e, position: t});
            }),
            (o.prototype.remove = function (e) {
                (e = this.normalize(e, !0)) !== n &&
                (this.trigger("remove", {content: this._items[e], position: e}),
                    this._items[e].remove(),
                    this._items.splice(e, 1),
                    this._mergers.splice(e, 1),
                    this.invalidate("items"),
                    this.trigger("removed", {content: null, position: e}));
            }),
            (o.prototype.addTriggerableEvents = function () {
                var t = e.proxy(function (t, i) {
                    return e.proxy(function (e) {
                        e.relatedTarget !== this && (this.suppress([i]), t.apply(this, [].slice.call(arguments, 1)), this.release([i]));
                    }, this);
                }, this);
                e.each(
                    {
                        next: this.next,
                        prev: this.prev,
                        to: this.to,
                        destroy: this.destroy,
                        refresh: this.refresh,
                        replace: this.replace,
                        add: this.add,
                        remove: this.remove
                    },
                    e.proxy(function (e, i) {
                        this.$element.on(e + ".owl.carousel", t(i, e + ".owl.carousel"));
                    }, this)
                );
            }),
            (o.prototype.watchVisibility = function () {
                function i(e) {
                    return e.offsetWidth > 0 && e.offsetHeight > 0;
                }

                i(this.$element.get(0)) ||
                (this.$element.addClass("owl-hidden"),
                    t.clearInterval(this.e._checkVisibile),
                    (this.e._checkVisibile = t.setInterval(
                        e.proxy(function () {
                            i(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), t.clearInterval(this.e._checkVisibile));
                        }, this),
                        500
                    )));
            }),
            (o.prototype.preloadAutoWidthImages = function (t) {
                var i, n, o, r;
                (i = 0),
                    (n = this),
                    t.each(function (s, a) {
                        (o = e(a)),
                            ((r = new Image()).onload = function () {
                                i++, o.attr("src", r.src), o.css("opacity", 1), i >= t.length && ((n.state.imagesLoaded = !0), n.initialize());
                            }),
                            (r.src = o.attr("src") || o.attr("data-src") || o.attr("data-src-retina"));
                    });
            }),
            (o.prototype.destroy = function () {
                for (var n in (this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass),
                !1 !== this.settings.responsive && e(t).off("resize.owl.carousel"),
                this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd),
                    this._plugins))
                    this._plugins[n].destroy();
                (this.settings.mouseDrag || this.settings.touchDrag) &&
                (this.$stage.off("mousedown touchstart touchcancel"),
                    e(i).off(".owl.dragEvents"),
                    (this.$stage.get(0).onselectstart = function () {
                    }),
                    this.$stage.off("dragstart", function () {
                        return !1;
                    })),
                    this.$element.off(".owl"),
                    this.$stage.children(".cloned").remove(),
                    (this.e = null),
                    this.$element.removeData("owlCarousel"),
                    this.$stage.children().contents().unwrap(),
                    this.$stage.children().unwrap(),
                    this.$stage.unwrap();
            }),
            (o.prototype.op = function (e, t, i) {
                var n = this.settings.rtl;
                switch (t) {
                    case "<":
                        return n ? e > i : e < i;
                    case ">":
                        return n ? e < i : e > i;
                    case ">=":
                        return n ? e <= i : e >= i;
                    case "<=":
                        return n ? e >= i : e <= i;
                }
            }),
            (o.prototype.on = function (e, t, i, n) {
                e.addEventListener ? e.addEventListener(t, i, n) : e.attachEvent && e.attachEvent("on" + t, i);
            }),
            (o.prototype.off = function (e, t, i, n) {
                e.removeEventListener ? e.removeEventListener(t, i, n) : e.detachEvent && e.detachEvent("on" + t, i);
            }),
            (o.prototype.trigger = function (t, i, n) {
                var o = {item: {count: this._items.length, index: this.current()}},
                    r = e.camelCase(
                        e
                            .grep(["on", t, n], function (e) {
                                return e;
                            })
                            .join("-")
                            .toLowerCase()
                    ),
                    s = e.Event([t, "owl", n || "carousel"].join(".").toLowerCase(), e.extend({relatedTarget: this}, o, i));
                return (
                    this._supress[t] ||
                    (e.each(this._plugins, function (e, t) {
                        t.onTrigger && t.onTrigger(s);
                    }),
                        this.$element.trigger(s),
                    this.settings && "function" == typeof this.settings[r] && this.settings[r].apply(this, s)),
                        s
                );
            }),
            (o.prototype.suppress = function (t) {
                e.each(
                    t,
                    e.proxy(function (e, t) {
                        this._supress[t] = !0;
                    }, this)
                );
            }),
            (o.prototype.release = function (t) {
                e.each(
                    t,
                    e.proxy(function (e, t) {
                        delete this._supress[t];
                    }, this)
                );
            }),
            (o.prototype.browserSupport = function () {
                if (((this.support3d = s(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0]), this.support3d)) {
                    this.transformVendor = s(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0];
                    (this.transitionEndVendor = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"][s(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]]),
                        (this.vendorName = this.transformVendor.replace(/Transform/i, "")),
                        (this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : "");
                }
                this.state.orientation = t.orientation;
            }),
            (e.fn.owlCarousel = function (t) {
                return this.each(function () {
                    e(this).data("owlCarousel") || e(this).data("owlCarousel", new o(this, t));
                });
            }),
            (e.fn.owlCarousel.Constructor = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        var o = function (t) {
            (this._core = t),
                (this._loaded = []),
                (this._handlers = {
                    "initialized.owl.carousel change.owl.carousel": e.proxy(function (t) {
                        if (t.namespace && this._core.settings && this._core.settings.lazyLoad && ((t.property && "position" == t.property.name) || "initialized" == t.type))
                            for (
                                var i = this._core.settings,
                                    n = (i.center && Math.ceil(i.items / 2)) || i.items,
                                    o = (i.center && -1 * n) || 0,
                                    r = ((t.property && t.property.value) || this._core.current()) + o,
                                    s = this._core.clones().length,
                                    a = e.proxy(function (e, t) {
                                        this.load(t);
                                    }, this);
                                o++ < n;
                            )
                                this.load(s / 2 + this._core.relative(r)), s && e.each(this._core.clones(this._core.relative(r++)), a);
                    }, this),
                }),
                (this._core.options = e.extend({}, o.Defaults, this._core.options)),
                this._core.$element.on(this._handlers);
        };
        (o.Defaults = {lazyLoad: !1}),
            (o.prototype.load = function (i) {
                var n = this._core.$stage.children().eq(i),
                    o = n && n.find(".owl-lazy");
                !o ||
                e.inArray(n.get(0), this._loaded) > -1 ||
                (o.each(
                    e.proxy(function (i, n) {
                        var o,
                            r = e(n),
                            s = (t.devicePixelRatio > 1 && r.attr("data-src-retina")) || r.attr("data-src");
                        this._core.trigger("load", {element: r, url: s}, "lazy"),
                            r.is("img")
                                ? r
                                    .one(
                                        "load.owl.lazy",
                                        e.proxy(function () {
                                            r.css("opacity", 1), this._core.trigger("loaded", {element: r, url: s}, "lazy");
                                        }, this)
                                    )
                                    .attr("src", s)
                                : (((o = new Image()).onload = e.proxy(function () {
                                    r.css({
                                        "background-image": "url(" + s + ")",
                                        opacity: "1"
                                    }), this._core.trigger("loaded", {element: r, url: s}, "lazy");
                                }, this)),
                                    (o.src = s));
                    }, this)
                ),
                    this._loaded.push(n.get(0)));
            }),
            (o.prototype.destroy = function () {
                var e, t;
                for (e in this.handlers) this._core.$element.off(e, this.handlers[e]);
                for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null);
            }),
            (e.fn.owlCarousel.Constructor.Plugins.Lazy = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        var o = function (t) {
            (this._core = t),
                (this._handlers = {
                    "initialized.owl.carousel": e.proxy(function () {
                        this._core.settings.autoHeight && this.update();
                    }, this),
                    "changed.owl.carousel": e.proxy(function (e) {
                        this._core.settings.autoHeight && "position" == e.property.name && this.update();
                    }, this),
                    "loaded.owl.lazy": e.proxy(function (e) {
                        this._core.settings.autoHeight && e.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update();
                    }, this),
                }),
                (this._core.options = e.extend({}, o.Defaults, this._core.options)),
                this._core.$element.on(this._handlers);
        };
        (o.Defaults = {autoHeight: !1, autoHeightClass: "owl-height"}),
            (o.prototype.update = function () {
                this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass);
            }),
            (o.prototype.destroy = function () {
                var e, t;
                for (e in this._handlers) this._core.$element.off(e, this._handlers[e]);
                for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null);
            }),
            (e.fn.owlCarousel.Constructor.Plugins.AutoHeight = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        var o = function (t) {
            (this._core = t),
                (this._videos = {}),
                (this._playing = null),
                (this._fullscreen = !1),
                (this._handlers = {
                    "resize.owl.carousel": e.proxy(function (e) {
                        this._core.settings.video && !this.isInFullScreen() && e.preventDefault();
                    }, this),
                    "refresh.owl.carousel changed.owl.carousel": e.proxy(function (e) {
                        this._playing && this.stop();
                    }, this),
                    "prepared.owl.carousel": e.proxy(function (t) {
                        var i = e(t.content).find(".owl-video");
                        i.length && (i.css("display", "none"), this.fetch(i, e(t.content)));
                    }, this),
                }),
                (this._core.options = e.extend({}, o.Defaults, this._core.options)),
                this._core.$element.on(this._handlers),
                this._core.$element.on(
                    "click.owl.video",
                    ".owl-video-play-icon",
                    e.proxy(function (e) {
                        this.play(e);
                    }, this)
                );
        };
        (o.Defaults = {video: !1, videoHeight: !1, videoWidth: !1}),
            (o.prototype.fetch = function (e, t) {
                var i = e.attr("data-vimeo-id") ? "vimeo" : "youtube",
                    n = e.attr("data-vimeo-id") || e.attr("data-youtube-id"),
                    o = e.attr("data-width") || this._core.settings.videoWidth,
                    r = e.attr("data-height") || this._core.settings.videoHeight,
                    s = e.attr("href");
                if (!s) throw new Error("Missing video URL.");
                if ((n = s.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu") > -1) i = "youtube";
                else {
                    if (!(n[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported.");
                    i = "vimeo";
                }
                (n = n[6]), (this._videos[s] = {
                    type: i,
                    id: n,
                    width: o,
                    height: r
                }), t.attr("data-video", s), this.thumbnail(e, this._videos[s]);
            }),
            (o.prototype.thumbnail = function (t, i) {
                var n,
                    o,
                    r = i.width && i.height ? 'style="width:' + i.width + "px;height:" + i.height + 'px;"' : "",
                    s = t.find("img"),
                    a = "src",
                    l = "",
                    c = this._core.settings,
                    u = function (e) {
                        '<div class="owl-video-play-icon"></div>',
                            (n = c.lazyLoad ? '<div class="owl-video-tn ' + l + '" ' + a + '="' + e + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + e + ')"></div>'),
                            t.after(n),
                            t.after('<div class="owl-video-play-icon"></div>');
                    };
                return (
                    t.wrap('<div class="owl-video-wrapper"' + r + "></div>"),
                    this._core.settings.lazyLoad && ((a = "data-src"), (l = "owl-lazy")),
                        s.length
                            ? (u(s.attr(a)), s.remove(), !1)
                            : void ("youtube" === i.type
                            ? ((o = "http://img.youtube.com/vi/" + i.id + "/hqdefault.jpg"), u(o))
                            : "vimeo" === i.type &&
                            e.ajax({
                                type: "GET",
                                url: "http://vimeo.com/api/v2/video/" + i.id + ".json",
                                jsonp: "callback",
                                dataType: "jsonp",
                                success: function (e) {
                                    (o = e[0].thumbnail_large), u(o);
                                },
                            }))
                );
            }),
            (o.prototype.stop = function () {
                this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), (this._playing = null);
            }),
            (o.prototype.play = function (t) {
                this._core.trigger("play", null, "video"), this._playing && this.stop();
                var i,
                    n,
                    o = e(t.target || t.srcElement),
                    r = o.closest("." + this._core.settings.itemClass),
                    s = this._videos[r.attr("data-video")],
                    a = s.width || "100%",
                    l = s.height || this._core.$stage.height();
                "youtube" === s.type
                    ? (i = '<iframe width="' + a + '" height="' + l + '" src="http://www.youtube.com/embed/' + s.id + "?autoplay=1&v=" + s.id + '" frameborder="0" allowfullscreen></iframe>')
                    : "vimeo" === s.type && (i = '<iframe src="http://player.vimeo.com/video/' + s.id + '?autoplay=1" width="' + a + '" height="' + l + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'),
                    r.addClass("owl-video-playing"),
                    (this._playing = r),
                    (n = e('<div style="height:' + l + "px; width:" + a + 'px" class="owl-video-frame">' + i + "</div>")),
                    o.after(n);
            }),
            (o.prototype.isInFullScreen = function () {
                var n = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
                return (
                    n && e(n).parent().hasClass("owl-video-frame") && (this._core.speed(0), (this._fullscreen = !0)),
                        !((n && this._fullscreen && this._playing) || (this._fullscreen ? ((this._fullscreen = !1), 1) : this._playing && this._core.state.orientation !== t.orientation && ((this._core.state.orientation = t.orientation), 1)))
                );
            }),
            (o.prototype.destroy = function () {
                var e, t;
                for (e in (this._core.$element.off("click.owl.video"), this._handlers)) this._core.$element.off(e, this._handlers[e]);
                for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null);
            }),
            (e.fn.owlCarousel.Constructor.Plugins.Video = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        var o = function (t) {
            (this.core = t),
                (this.core.options = e.extend({}, o.Defaults, this.core.options)),
                (this.swapping = !0),
                (this.previous = n),
                (this.next = n),
                (this.handlers = {
                    "change.owl.carousel": e.proxy(function (e) {
                        "position" == e.property.name && ((this.previous = this.core.current()), (this.next = e.property.value));
                    }, this),
                    "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": e.proxy(function (e) {
                        this.swapping = "translated" == e.type;
                    }, this),
                    "translate.owl.carousel": e.proxy(function (e) {
                        this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap();
                    }, this),
                }),
                this.core.$element.on(this.handlers);
        };
        (o.Defaults = {animateOut: !1, animateIn: !1}),
            (o.prototype.swap = function () {
                if (1 === this.core.settings.items && this.core.support3d) {
                    this.core.speed(0);
                    var t,
                        i = e.proxy(this.clear, this),
                        n = this.core.$stage.children().eq(this.previous),
                        o = this.core.$stage.children().eq(this.next),
                        r = this.core.settings.animateIn,
                        s = this.core.settings.animateOut;
                    this.core.current() !== this.previous &&
                    (s &&
                    ((t = this.core.coordinates(this.previous) - this.core.coordinates(this.next)),
                        n
                            .css({left: t + "px"})
                            .addClass("animated owl-animated-out")
                            .addClass(s)
                            .one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", i)),
                    r && o.addClass("animated owl-animated-in").addClass(r).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", i));
                }
            }),
            (o.prototype.clear = function (t) {
                e(t.target).css({left: ""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd();
            }),
            (o.prototype.destroy = function () {
                var e, t;
                for (e in this.handlers) this.core.$element.off(e, this.handlers[e]);
                for (t in Object.getOwnPropertyNames(this)) "function" != typeof this[t] && (this[t] = null);
            }),
            (e.fn.owlCarousel.Constructor.Plugins.Animate = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        var o = function (t) {
            (this.core = t),
                (this.core.options = e.extend({}, o.Defaults, this.core.options)),
                (this.handlers = {
                    "translated.owl.carousel refreshed.owl.carousel": e.proxy(function () {
                        this.autoplay();
                    }, this),
                    "play.owl.autoplay": e.proxy(function (e, t, i) {
                        this.play(t, i);
                    }, this),
                    "stop.owl.autoplay": e.proxy(function () {
                        this.stop();
                    }, this),
                    "mouseover.owl.autoplay": e.proxy(function () {
                        this.core.settings.autoplayHoverPause && this.pause();
                    }, this),
                    "mouseleave.owl.autoplay": e.proxy(function () {
                        this.core.settings.autoplayHoverPause && this.autoplay();
                    }, this),
                }),
                this.core.$element.on(this.handlers);
        };
        (o.Defaults = {autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1}),
            (o.prototype.autoplay = function () {
                this.core.settings.autoplay && !this.core.state.videoPlay
                    ? (t.clearInterval(this.interval),
                        (this.interval = t.setInterval(
                            e.proxy(function () {
                                this.play();
                            }, this),
                            this.core.settings.autoplayTimeout
                        )))
                    : t.clearInterval(this.interval);
            }),
            (o.prototype.play = function (e, n) {
                if (!0 !== i.hidden && !(this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion))
                    return !1 === this.core.settings.autoplay ? void t.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed);
            }),
            (o.prototype.stop = function () {
                t.clearInterval(this.interval);
            }),
            (o.prototype.pause = function () {
                t.clearInterval(this.interval);
            }),
            (o.prototype.destroy = function () {
                var e, i;
                for (e in (t.clearInterval(this.interval), this.handlers)) this.core.$element.off(e, this.handlers[e]);
                for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null);
            }),
            (e.fn.owlCarousel.Constructor.Plugins.autoplay = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        "use strict";
        var o = function (t) {
            (this._core = t),
                (this._initialized = !1),
                (this._pages = []),
                (this._controls = {}),
                (this._templates = []),
                (this.$element = this._core.$element),
                (this._overrides = {next: this._core.next, prev: this._core.prev, to: this._core.to}),
                (this._handlers = {
                    "prepared.owl.carousel": e.proxy(function (t) {
                        this._core.settings.dotsData && this._templates.push(e(t.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"));
                    }, this),
                    "add.owl.carousel": e.proxy(function (t) {
                        this._core.settings.dotsData && this._templates.splice(t.position, 0, e(t.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"));
                    }, this),
                    "remove.owl.carousel prepared.owl.carousel": e.proxy(function (e) {
                        this._core.settings.dotsData && this._templates.splice(e.position, 1);
                    }, this),
                    "change.owl.carousel": e.proxy(function (e) {
                        if ("position" == e.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                            var t = this._core.current(),
                                i = this._core.maximum(),
                                n = this._core.minimum();
                            e.data = e.property.value > i ? (t >= i ? n : i) : e.property.value < n ? i : e.property.value;
                        }
                    }, this),
                    "changed.owl.carousel": e.proxy(function (e) {
                        "position" == e.property.name && this.draw();
                    }, this),
                    "refreshed.owl.carousel": e.proxy(function () {
                        this._initialized || (this.initialize(), (this._initialized = !0)), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation");
                    }, this),
                }),
                (this._core.options = e.extend({}, o.Defaults, this._core.options)),
                this.$element.on(this._handlers);
        };
        (o.Defaults = {
            nav: !1,
            navRewind: !0,
            navText: ["prev", "next"],
            navSpeed: !1,
            navElement: "div",
            navContainer: !1,
            navContainerClass: "owl-nav",
            navClass: ["owl-prev", "owl-next"],
            slideBy: 1,
            dotClass: "owl-dot",
            dotsClass: "owl-dots",
            dots: !0,
            dotsEach: !1,
            dotData: !1,
            dotsSpeed: !1,
            dotsContainer: !1,
            controlsClass: "owl-controls",
        }),
            (o.prototype.initialize = function () {
                var t,
                    i,
                    n = this._core.settings;
                for (i in (n.dotsData || (this._templates = [e("<div>").addClass(n.dotClass).append(e("<span>")).prop("outerHTML")]),
                (n.navContainer && n.dotsContainer) || (this._controls.$container = e("<div>").addClass(n.controlsClass).appendTo(this.$element)),
                    (this._controls.$indicators = n.dotsContainer ? e(n.dotsContainer) : e("<div>").hide().addClass(n.dotsClass).appendTo(this._controls.$container)),
                    this._controls.$indicators.on(
                        "click",
                        "div",
                        e.proxy(function (t) {
                            var i = e(t.target).parent().is(this._controls.$indicators) ? e(t.target).index() : e(t.target).parent().index();
                            t.preventDefault(), this.to(i, n.dotsSpeed);
                        }, this)
                    ),
                    (t = n.navContainer ? e(n.navContainer) : e("<div>").addClass(n.navContainerClass).prependTo(this._controls.$container)),
                    (this._controls.$next = e("<" + n.navElement + ">")),
                    (this._controls.$previous = this._controls.$next.clone()),
                    this._controls.$previous
                        .addClass(n.navClass[0])
                        .html(n.navText[0])
                        .hide()
                        .prependTo(t)
                        .on(
                            "click",
                            e.proxy(function (e) {
                                this.prev(n.navSpeed);
                            }, this)
                        ),
                    this._controls.$next
                        .addClass(n.navClass[1])
                        .html(n.navText[1])
                        .hide()
                        .appendTo(t)
                        .on(
                            "click",
                            e.proxy(function (e) {
                                this.next(n.navSpeed);
                            }, this)
                        ),
                    this._overrides))
                    this._core[i] = e.proxy(this[i], this);
            }),
            (o.prototype.destroy = function () {
                var e, t, i, n;
                for (e in this._handlers) this.$element.off(e, this._handlers[e]);
                for (t in this._controls) this._controls[t].remove();
                for (n in this.overides) this._core[n] = this._overrides[n];
                for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null);
            }),
            (o.prototype.update = function () {
                var e,
                    t,
                    i = this._core.settings,
                    n = this._core.clones().length / 2,
                    o = n + this._core.items().length,
                    r = i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items;
                if (("page" !== i.slideBy && (i.slideBy = Math.min(i.slideBy, i.items)), i.dots || "page" == i.slideBy))
                    for (this._pages = [], e = n, t = 0, 0; e < o; e++) (t >= r || 0 === t) && (this._pages.push({
                        start: e - n,
                        end: e - n + r - 1
                    }), (t = 0), 0), (t += this._core.mergers(this._core.relative(e)));
            }),
            (o.prototype.draw = function () {
                var t,
                    i,
                    n = "",
                    o = this._core.settings,
                    r = (this._core.$stage.children(), this._core.relative(this._core.current()));
                if (
                    (!o.nav || o.loop || o.navRewind || (this._controls.$previous.toggleClass("disabled", r <= 0), this._controls.$next.toggleClass("disabled", r >= this._core.maximum())),
                        this._controls.$previous.toggle(o.nav),
                        this._controls.$next.toggle(o.nav),
                        o.dots)
                ) {
                    if (((t = this._pages.length - this._controls.$indicators.children().length), o.dotData && 0 !== t)) {
                        for (i = 0; i < this._controls.$indicators.children().length; i++) n += this._templates[this._core.relative(i)];
                        this._controls.$indicators.html(n);
                    } else t > 0 ? ((n = new Array(t + 1).join(this._templates[0])), this._controls.$indicators.append(n)) : t < 0 && this._controls.$indicators.children().slice(t).remove();
                    this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(e.inArray(this.current(), this._pages)).addClass("active");
                }
                this._controls.$indicators.toggle(o.dots);
            }),
            (o.prototype.onTrigger = function (t) {
                var i = this._core.settings;
                t.page = {
                    index: e.inArray(this.current(), this._pages),
                    count: this._pages.length,
                    size: i && (i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items)
                };
            }),
            (o.prototype.current = function () {
                var t = this._core.relative(this._core.current());
                return e
                    .grep(this._pages, function (e) {
                        return e.start <= t && e.end >= t;
                    })
                    .pop();
            }),
            (o.prototype.getPosition = function (t) {
                var i,
                    n,
                    o = this._core.settings;
                return (
                    "page" == o.slideBy
                        ? ((i = e.inArray(this.current(), this._pages)), (n = this._pages.length), t ? ++i : --i, (i = this._pages[((i % n) + n) % n].start))
                        : ((i = this._core.relative(this._core.current())), (n = this._core.items().length), t ? (i += o.slideBy) : (i -= o.slideBy)),
                        i
                );
            }),
            (o.prototype.next = function (t) {
                e.proxy(this._overrides.to, this._core)(this.getPosition(!0), t);
            }),
            (o.prototype.prev = function (t) {
                e.proxy(this._overrides.to, this._core)(this.getPosition(!1), t);
            }),
            (o.prototype.to = function (t, i, n) {
                var o;
                n ? e.proxy(this._overrides.to, this._core)(t, i) : ((o = this._pages.length), e.proxy(this._overrides.to, this._core)(this._pages[((t % o) + o) % o].start, i));
            }),
            (e.fn.owlCarousel.Constructor.Plugins.Navigation = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e, t, i, n) {
        "use strict";
        var o = function (i) {
            (this._core = i),
                (this._hashes = {}),
                (this.$element = this._core.$element),
                (this._handlers = {
                    "initialized.owl.carousel": e.proxy(function () {
                        "URLHash" == this._core.settings.startPosition && e(t).trigger("hashchange.owl.navigation");
                    }, this),
                    "prepared.owl.carousel": e.proxy(function (t) {
                        var i = e(t.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
                        this._hashes[i] = t.content;
                    }, this),
                }),
                (this._core.options = e.extend({}, o.Defaults, this._core.options)),
                this.$element.on(this._handlers),
                e(t).on(
                    "hashchange.owl.navigation",
                    e.proxy(function () {
                        var e = t.location.hash.substring(1),
                            i = this._core.$stage.children(),
                            n = (this._hashes[e] && i.index(this._hashes[e])) || 0;
                        return !!e && void this._core.to(n, !1, !0);
                    }, this)
                );
        };
        (o.Defaults = {URLhashListener: !1}),
            (o.prototype.destroy = function () {
                var i, n;
                for (i in (e(t).off("hashchange.owl.navigation"), this._handlers)) this._core.$element.off(i, this._handlers[i]);
                for (n in Object.getOwnPropertyNames(this)) "function" != typeof this[n] && (this[n] = null);
            }),
            (e.fn.owlCarousel.Constructor.Plugins.Hash = o);
    })(window.Zepto || window.jQuery, window, document),
    (function (e) {
        (e.fn.gMap = function (t, i) {
            switch (t) {
                case "addMarker":
                    return e(this).trigger("gMap.addMarker", [i.latitude, i.longitude, i.content, i.icon, i.popup]);
                case "centerAt":
                    return e(this).trigger("gMap.centerAt", [i.latitude, i.longitude, i.zoom]);
                case "clearMarkers":
                    return e(this).trigger("gMap.clearMarkers");
            }
            var n = e.extend({}, e.fn.gMap.defaults, t);
            return this.each(function () {
                var t = new google.maps.Map(this);
                e(this).data("gMap.reference", t);
                var i = new google.maps.Geocoder();
                n.address
                    ? i.geocode({address: n.address}, function (e) {
                        e && e.length && t.setCenter(e[0].geometry.location);
                    })
                    : n.latitude && n.longitude
                    ? t.setCenter(new google.maps.LatLng(n.latitude, n.longitude))
                    : e.isArray(n.markers) && n.markers.length > 0
                        ? n.markers[0].address
                            ? i.geocode({address: n.markers[0].address}, function (e) {
                                e && e.length > 0 && t.setCenter(e[0].geometry.location);
                            })
                            : t.setCenter(new google.maps.LatLng(n.markers[0].latitude, n.markers[0].longitude))
                        : t.setCenter(new google.maps.LatLng(34.885931, 9.84375)),
                    t.setZoom(n.zoom),
                    t.setMapTypeId(google.maps.MapTypeId[n.maptype]);
                var o = {scrollwheel: n.scrollwheel, disableDoubleClickZoom: !n.doubleclickzoom};
                !1 === n.controls ? e.extend(o, {disableDefaultUI: !0}) : 0 !== n.controls.length && e.extend(o, n.controls, {disableDefaultUI: !0}), t.setOptions(o);
                var r,
                    s,
                    a = new google.maps.Marker();
                ((r = new google.maps.MarkerImage(n.icon.image)).size = new google.maps.Size(n.icon.iconsize[0], n.icon.iconsize[1])),
                    (r.anchor = new google.maps.Point(n.icon.iconanchor[0], n.icon.iconanchor[1])),
                    a.setIcon(r),
                n.icon.shadow &&
                (((s = new google.maps.MarkerImage(n.icon.shadow)).size = new google.maps.Size(n.icon.shadowsize[0], n.icon.shadowsize[1])),
                    (s.anchor = new google.maps.Point(n.icon.shadowanchor[0], n.icon.shadowanchor[1])),
                    a.setShadow(s)),
                    e(this).bind("gMap.centerAt", function (e, i, n, o) {
                        o && t.setZoom(o), t.panTo(new google.maps.LatLng(parseFloat(i), parseFloat(n)));
                    });
                var l,
                    c = [];
                e(this).bind("gMap.clearMarkers", function () {
                    for (; c[0];) c.pop().setMap(null);
                }),
                    e(this).bind("gMap.addMarker", function (e, i, o, r, s, u) {
                        var d,
                            p,
                            h = new google.maps.LatLng(parseFloat(i), parseFloat(o)),
                            f = new google.maps.Marker({position: h});
                        if (
                            (s
                                ? (((d = new google.maps.MarkerImage(s.image)).size = new google.maps.Size(s.iconsize[0], s.iconsize[1])),
                                    (d.anchor = new google.maps.Point(s.iconanchor[0], s.iconanchor[1])),
                                    f.setIcon(d),
                                s.shadow &&
                                (((p = new google.maps.MarkerImage(s.shadow)).size = new google.maps.Size(s.shadowsize[0], s.shadowsize[1])), (p.anchor = new google.maps.Point(s.shadowanchor[0], s.shadowanchor[1])), a.setShadow(p)))
                                : (f.setIcon(a.getIcon()), f.setShadow(a.getShadow())),
                                r)
                        ) {
                            "_latlng" === r && (r = i + ", " + o);
                            var m = new google.maps.InfoWindow({content: n.html_prepend + r + n.html_append});
                            google.maps.event.addListener(f, "click", function () {
                                l && l.close(), m.open(t, f), (l = m);
                            }),
                            u &&
                            google.maps.event.addListenerOnce(t, "tilesloaded", function () {
                                m.open(t, f);
                            });
                        }
                        f.setMap(t), c.push(f);
                    });
                for (
                    var u,
                        d = this,
                        p = function (t) {
                            return function (i) {
                                i && i.length > 0 && e(d).trigger("gMap.addMarker", [i[0].geometry.location.lat(), i[0].geometry.location.lng(), t.html, t.icon, t.popup]);
                            };
                        },
                        h = 0;
                    h < n.markers.length;
                    h++
                )
                    (u = n.markers[h]).address ? ("_address" === u.html && (u.html = u.address), i.geocode({address: u.address}, p(u))) : e(this).trigger("gMap.addMarker", [u.latitude, u.longitude, u.html, u.icon, u.popup]);
            });
        }),
            (e.fn.gMap.defaults = {
                address: "",
                latitude: 0,
                longitude: 0,
                zoom: 1,
                markers: [],
                controls: [],
                scrollwheel: !1,
                doubleclickzoom: !0,
                maptype: "ROADMAP",
                html_prepend: '<div class="gmap_marker">',
                html_append: "</div>",
                icon: {
                    image: "http://www.google.com/mapfiles/marker.png",
                    shadow: "http://www.google.com/mapfiles/shadow50.png",
                    iconsize: [20, 34],
                    shadowsize: [37, 34],
                    iconanchor: [9, 34],
                    shadowanchor: [6, 34]
                },
            });
    })(jQuery),
    (function (e) {
        var t = "waitForImages";
        (e.waitForImages = {
            hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"],
            hasImageAttributes: ["srcset"]
        }),
            (e.expr[":"].uncached = function (t) {
                if (!e(t).is('img[src][src!=""]')) return !1;
                var i = new Image();
                return (i.src = t.src), !i.complete;
            }),
            (e.fn.waitForImages = function () {
                var i,
                    n,
                    o,
                    r = 0,
                    s = 0,
                    a = e.Deferred();
                if (
                    (e.isPlainObject(arguments[0])
                        ? ((o = arguments[0].waitForAll), (n = arguments[0].each), (i = arguments[0].finished))
                        : 1 === arguments.length && "boolean" === e.type(arguments[0])
                            ? (o = arguments[0])
                            : ((i = arguments[0]), (n = arguments[1]), (o = arguments[2])),
                        (i = i || e.noop),
                        (n = n || e.noop),
                        (o = !!o),
                    !e.isFunction(i) || !e.isFunction(n))
                )
                    throw new TypeError("An invalid callback was supplied.");
                return (
                    this.each(function () {
                        var l = e(this),
                            c = [],
                            u = e.waitForImages.hasImageProperties || [],
                            d = e.waitForImages.hasImageAttributes || [],
                            p = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
                        o
                            ? l
                                .find("*")
                                .addBack()
                                .each(function () {
                                    var t = e(this);
                                    t.is("img:uncached") && c.push({src: t.attr("src"), element: t[0]}),
                                        e.each(u, function (e, i) {
                                            var n,
                                                o = t.css(i);
                                            if (!o) return !0;
                                            for (; (n = p.exec(o));) c.push({src: n[2], element: t[0]});
                                        }),
                                        e.each(d, function (i, n) {
                                            var o,
                                                r = t.attr(n);
                                            return (
                                                !r ||
                                                ((o = r.split(",")),
                                                    void e.each(o, function (i, n) {
                                                        (n = e.trim(n).split(" ")[0]), c.push({src: n, element: t[0]});
                                                    }))
                                            );
                                        });
                                })
                            : l.find("img:uncached").each(function () {
                                c.push({src: this.src, element: this});
                            }),
                            (r = c.length),
                            (s = 0),
                        0 === r && (i.call(l[0]), a.resolveWith(l[0])),
                            e.each(c, function (o, c) {
                                var u = new Image(),
                                    d = "load." + t + " error." + t;
                                e(u).one(d, function t(o) {
                                    var u = [s, r, "load" == o.type];
                                    if ((s++, n.apply(c.element, u), a.notifyWith(c.element, u), e(this).off(d, t), s == r)) return i.call(l[0]), a.resolveWith(l[0]), !1;
                                }),
                                    (u.src = c.src);
                            });
                    }),
                        a.promise()
                );
            });
    })(jQuery),
    (function (e, t, i) {
        "use strict";

        function n(i) {
            if (((o = t.documentElement), (r = t.body), W(), (ne = this), (le = (i = i || {}).constants || {}), i.easing)) for (var n in i.easing) Y[n] = i.easing[n];
            (me = i.edgeStrategy || "set"),
                (se = {beforerender: i.beforerender, render: i.render, keyframe: i.keyframe}),
            (ae = !1 !== i.forceHeight) && (Pe = i.scale || 1),
                (ce = i.mobileDeceleration || S),
                (de = !1 !== i.smoothScrolling),
                (pe = i.smoothScrollingDuration || E),
                (he = {targetTop: ne.getScrollTop()}),
                (He = (
                    i.mobileCheck ||
                    function () {
                        return /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent || navigator.vendor || e.opera);
                    }
                )())
                    ? ((re = t.getElementById(i.skrollrBody || C)) && ie(), X(), ke(o, [y, b], [w]))
                    : ke(o, [y, x], [w]),
                ne.refresh(),
                ye(e, "resize orientationchange", function () {
                    var e = o.clientWidth,
                        t = o.clientHeight;
                    (t !== Ne || e !== $e) && ((Ne = t), ($e = e), (Re = !0));
                });
            var s = B();
            return (
                (function e() {
                    G(), (ve = s(e));
                })(),
                    ne
            );
        }

        var o,
            r,
            s = {
                get: function () {
                    return ne;
                },
                init: function (e) {
                    return ne || new n(e);
                },
                VERSION: "0.6.29",
            },
            a = Object.prototype.hasOwnProperty,
            l = e.Math,
            c = e.getComputedStyle,
            u = "touchstart",
            d = "touchmove",
            p = "touchcancel",
            h = "touchend",
            f = "skrollable",
            m = f + "-before",
            g = f + "-between",
            v = f + "-after",
            y = "skrollr",
            w = "no-" + y,
            x = y + "-desktop",
            b = y + "-mobile",
            T = "linear",
            S = 0.004,
            C = "skrollr-body",
            E = 200,
            k = "center",
            _ = "bottom",
            z = "___skrollable_id",
            L = /^(?:input|textarea|button|select)$/i,
            M = /^\s+|\s+$/g,
            I = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,
            P = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,
            D = /^(@?[a-z\-]+)\[(\w+)\]$/,
            O = /-([a-z0-9_])/g,
            A = function (e, t) {
                return t.toUpperCase();
            },
            $ = /[\-+]?[\d]*\.?[\d]+/g,
            N = /\{\?\}/g,
            R = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,
            F = /[a-z\-]+-gradient/g,
            H = "",
            j = "",
            W = function () {
                var e = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
                if (c) {
                    var t = c(r, null);
                    for (var n in t) if ((H = n.match(e) || (+n == n && t[n].match(e)))) break;
                    if (!H) return (H = j = ""), i;
                    "-" === (H = H[0]).slice(0, 1) ? ((j = H), (H = {
                        "-webkit-": "webkit",
                        "-moz-": "Moz",
                        "-ms-": "ms",
                        "-o-": "O"
                    }[H])) : (j = "-" + H.toLowerCase() + "-");
                }
            },
            B = function () {
                var t = e.requestAnimationFrame || e[H.toLowerCase() + "RequestAnimationFrame"],
                    i = Le();
                return (
                    (He || !t) &&
                    (t = function (t) {
                        var n = Le() - i,
                            o = l.max(0, 1e3 / 60 - n);
                        return e.setTimeout(function () {
                            (i = Le()), t();
                        }, o);
                    }),
                        t
                );
            },
            q = function () {
                var t = e.cancelAnimationFrame || e[H.toLowerCase() + "CancelAnimationFrame"];
                return (
                    (He || !t) &&
                    (t = function (t) {
                        return e.clearTimeout(t);
                    }),
                        t
                );
            },
            Y = {
                begin: function () {
                    return 0;
                },
                end: function () {
                    return 1;
                },
                linear: function (e) {
                    return e;
                },
                quadratic: function (e) {
                    return e * e;
                },
                cubic: function (e) {
                    return e * e * e;
                },
                swing: function (e) {
                    return -l.cos(e * l.PI) / 2 + 0.5;
                },
                sqrt: function (e) {
                    return l.sqrt(e);
                },
                outCubic: function (e) {
                    return l.pow(e - 1, 3) + 1;
                },
                bounce: function (e) {
                    var t;
                    if (0.5083 >= e) t = 3;
                    else if (0.8489 >= e) t = 9;
                    else if (0.96208 >= e) t = 27;
                    else {
                        if (!(0.99981 >= e)) return 1;
                        t = 91;
                    }
                    return 1 - l.abs((3 * l.cos(1.028 * e * t)) / t);
                },
            };
        (n.prototype.refresh = function (e) {
            var n,
                o,
                r = !1;
            for (e === i ? ((r = !0), (oe = []), (Fe = 0), (e = t.getElementsByTagName("*"))) : e.length === i && (e = [e]), n = 0, o = e.length; o > n; n++) {
                var s = e[n],
                    a = s,
                    l = [],
                    c = de,
                    u = me,
                    d = !1;
                if ((r && z in s && delete s[z], s.attributes)) {
                    for (var p = 0, h = s.attributes.length; h > p; p++) {
                        var m = s.attributes[p];
                        if ("data-anchor-target" !== m.name)
                            if ("data-smooth-scrolling" !== m.name)
                                if ("data-edge-strategy" !== m.name)
                                    if ("data-emit-events" !== m.name) {
                                        var g = m.name.match(I);
                                        if (null !== g) {
                                            var v = {props: m.value, element: s, eventType: m.name.replace(O, A)};
                                            l.push(v);
                                            var y = g[1];
                                            y && (v.constant = y.substr(1));
                                            var w = g[2];
                                            /p$/.test(w) ? ((v.isPercentage = !0), (v.offset = (0 | w.slice(0, -1)) / 100)) : (v.offset = 0 | w);
                                            var x = g[3],
                                                b = g[4] || x;
                                            x && "start" !== x && "end" !== x ? ((v.mode = "relative"), (v.anchors = [x, b])) : ((v.mode = "absolute"), "end" === x ? (v.isEnd = !0) : v.isPercentage || (v.offset = v.offset * Pe));
                                        }
                                    } else d = !0;
                                else u = m.value;
                            else c = "off" !== m.value;
                        else if (null === (a = t.querySelector(m.value))) throw 'Unable to find anchor target "' + m.value + '"';
                    }
                    var T, S, C;
                    if (l.length)
                        !r && z in s ? ((C = s[z]), (T = oe[C].styleAttr), (S = oe[C].classAttr)) : ((C = s[z] = Fe++), (T = s.style.cssText), (S = Ee(s))),
                            (oe[C] = {
                                element: s,
                                styleAttr: T,
                                classAttr: S,
                                anchorTarget: a,
                                keyFrames: l,
                                smoothScrolling: c,
                                edgeStrategy: u,
                                emitEvents: d,
                                lastFrameIndex: -1
                            }),
                            ke(s, [f], []);
                }
            }
            for (Te(), n = 0, o = e.length; o > n; n++) {
                var E = oe[e[n][z]];
                E !== i && (U(E), Z(E));
            }
            return ne;
        }),
            (n.prototype.relativeToAbsolute = function (e, t, i) {
                var n = o.clientHeight,
                    r = e.getBoundingClientRect(),
                    s = r.top,
                    a = r.bottom - r.top;
                return t === _ ? (s -= n) : t === k && (s -= n / 2), i === _ ? (s += a) : i === k && (s += a / 2), 0 | ((s += ne.getScrollTop()) + 0.5);
            }),
            (n.prototype.animateTo = function (e, t) {
                t = t || {};
                var n = Le(),
                    o = ne.getScrollTop();
                return (
                    (ue = {
                        startTop: o,
                        topDiff: e - o,
                        targetTop: e,
                        duration: t.duration || 1e3,
                        startTime: n,
                        endTime: n + (t.duration || 1e3),
                        easing: Y[t.easing || T],
                        done: t.done
                    }).topDiff ||
                    (ue.done && ue.done.call(ne, !1), (ue = i)),
                        ne
                );
            }),
            (n.prototype.stopAnimateTo = function () {
                ue && ue.done && ue.done.call(ne, !0), (ue = i);
            }),
            (n.prototype.isAnimatingTo = function () {
                return !!ue;
            }),
            (n.prototype.isMobile = function () {
                return He;
            }),
            (n.prototype.setScrollTop = function (t, i) {
                return (fe = !0 === i), He ? (je = l.min(l.max(t, 0), Ie)) : e.scrollTo(0, t), ne;
            }),
            (n.prototype.getScrollTop = function () {
                return He ? je : e.pageYOffset || o.scrollTop || r.scrollTop || 0;
            }),
            (n.prototype.getMaxScrollTop = function () {
                return Ie;
            }),
            (n.prototype.on = function (e, t) {
                return (se[e] = t), ne;
            }),
            (n.prototype.off = function (e) {
                return delete se[e], ne;
            }),
            (n.prototype.destroy = function () {
                q()(ve), xe(), ke(o, [w], [y, x, b]);
                for (var e = 0, t = oe.length; t > e; e++) te(oe[e].element);
                (o.style.overflow = r.style.overflow = ""),
                    (o.style.height = r.style.height = ""),
                re && s.setStyle(re, "transform", "none"),
                    (ne = i),
                    (re = i),
                    (se = i),
                    (ae = i),
                    (Ie = 0),
                    (Pe = 1),
                    (le = i),
                    (ce = i),
                    (De = "down"),
                    (Oe = -1),
                    ($e = 0),
                    (Ne = 0),
                    (Re = !1),
                    (ue = i),
                    (de = i),
                    (pe = i),
                    (he = i),
                    (fe = i),
                    (Fe = 0),
                    (me = i),
                    (He = !1),
                    (je = 0),
                    (ge = i);
            });
        var X = function () {
                var n, s, a, c, f, m, g, v, y, w, x;
                ye(o, [u, d, p, h].join(" "), function (e) {
                    var o = e.changedTouches[0];
                    for (c = e.target; 3 === c.nodeType;) c = c.parentNode;
                    switch (((f = o.clientY), (m = o.clientX), (y = e.timeStamp), L.test(c.tagName) || e.preventDefault(), e.type)) {
                        case u:
                            n && n.blur(), ne.stopAnimateTo(), (n = c), (s = g = f), (a = m), y;
                            break;
                        case d:
                            L.test(c.tagName) && t.activeElement !== c && e.preventDefault(), (v = f - g), (x = y - w), ne.setScrollTop(je - v, !0), (g = f), (w = y);
                            break;
                        default:
                        case p:
                        case h:
                            var r = s - f,
                                b = a - m;
                            if (49 > b * b + r * r) {
                                if (!L.test(n.tagName)) {
                                    n.focus();
                                    var T = t.createEvent("MouseEvents");
                                    T.initMouseEvent("click", !0, !0, e.view, 1, o.screenX, o.screenY, o.clientX, o.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null), n.dispatchEvent(T);
                                }
                                return;
                            }
                            n = i;
                            var S = v / x;
                            S = l.max(l.min(S, 3), -3);
                            var C = l.abs(S / ce),
                                E = S * C + 0.5 * ce * C * C,
                                k = ne.getScrollTop() - E,
                                _ = 0;
                            k > Ie ? ((_ = (Ie - k) / E), (k = Ie)) : 0 > k && ((_ = -k / E), (k = 0)), (C *= 1 - _), ne.animateTo(0 | (k + 0.5), {
                                easing: "outCubic",
                                duration: C
                            });
                    }
                }),
                    e.scrollTo(0, 0),
                    (o.style.overflow = r.style.overflow = "hidden");
            },
            V = function (e, t) {
                for (var i = 0, n = oe.length; n > i; i++) {
                    var o,
                        r,
                        l = oe[i],
                        c = l.element,
                        u = l.smoothScrolling ? e : t,
                        d = l.keyFrames,
                        p = d.length,
                        h = d[0],
                        y = d[d.length - 1],
                        w = h.frame > u,
                        x = u > y.frame,
                        b = w ? h : y,
                        T = l.emitEvents,
                        S = l.lastFrameIndex;
                    if (w || x) {
                        if ((w && -1 === l.edge) || (x && 1 === l.edge)) continue;
                        switch (
                            (w ? (ke(c, [m], [v, g]), T && S > -1 && (be(c, h.eventType, De), (l.lastFrameIndex = -1))) : (ke(c, [v], [m, g]), T && p > S && (be(c, y.eventType, De), (l.lastFrameIndex = p))),
                                (l.edge = w ? -1 : 1),
                                l.edgeStrategy)
                            ) {
                            case "reset":
                                te(c);
                                continue;
                            case "ease":
                                u = b.frame;
                                break;
                            default:
                            case "set":
                                var C = b.props;
                                for (o in C) a.call(C, o) && ((r = ee(C[o].value)), 0 === o.indexOf("@") ? c.setAttribute(o.substr(1), r) : s.setStyle(c, o, r));
                                continue;
                        }
                    } else 0 !== l.edge && (ke(c, [f, g], [m, v]), (l.edge = 0));
                    for (var E = 0; p - 1 > E; E++)
                        if (u >= d[E].frame && d[E + 1].frame >= u) {
                            var k = d[E],
                                _ = d[E + 1];
                            for (o in k.props)
                                if (a.call(k.props, o)) {
                                    var z = (u - k.frame) / (_.frame - k.frame);
                                    (z = k.props[o].easing(z)), (r = J(k.props[o].value, _.props[o].value, z)), (r = ee(r)), 0 === o.indexOf("@") ? c.setAttribute(o.substr(1), r) : s.setStyle(c, o, r);
                                }
                            T && S !== E && (be(c, "down" === De ? k.eventType : _.eventType, De), (l.lastFrameIndex = E));
                            break;
                        }
                }
            },
            G = function () {
                Re && ((Re = !1), Te());
                var e,
                    t,
                    n = ne.getScrollTop(),
                    o = Le();
                if (ue) o >= ue.endTime ? ((n = ue.targetTop), (e = ue.done), (ue = i)) : ((t = ue.easing((o - ue.startTime) / ue.duration)), (n = 0 | (ue.startTop + t * ue.topDiff))), ne.setScrollTop(n, !0);
                else if (!fe) {
                    he.targetTop - n && (he = {
                        startTop: Oe,
                        topDiff: n - Oe,
                        targetTop: n,
                        startTime: Ae,
                        endTime: Ae + pe
                    }), he.endTime >= o && ((t = Y.sqrt((o - he.startTime) / pe)), (n = 0 | (he.startTop + t * he.topDiff)));
                }
                if ((He && re && s.setStyle(re, "transform", "translate(0, " + -je + "px) " + ge), fe || Oe !== n)) {
                    fe = !1;
                    var r = {
                        curTop: n,
                        lastTop: Oe,
                        maxTop: Ie,
                        direction: (De = n > Oe ? "down" : Oe > n ? "up" : De)
                    };
                    !1 !== (se.beforerender && se.beforerender.call(ne, r)) && (V(n, ne.getScrollTop()), (Oe = n), se.render && se.render.call(ne, r)), e && e.call(ne, !1);
                }
                Ae = o;
            },
            U = function (e) {
                for (var t = 0, i = e.keyFrames.length; i > t; t++) {
                    for (var n, o, r, s, a = e.keyFrames[t], l = {}; null !== (s = P.exec(a.props));)
                        (r = s[1]), (o = s[2]), null !== (n = r.match(D)) ? ((r = n[1]), (n = n[2])) : (n = T), (o = o.indexOf("!") ? Q(o) : [o.slice(1)]), (l[r] = {
                            value: o,
                            easing: Y[n]
                        });
                    a.props = l;
                }
            },
            Q = function (e) {
                var t = [];
                return (
                    (R.lastIndex = 0),
                        (e = e.replace(R, function (e) {
                            return e.replace($, function (e) {
                                return (e / 255) * 100 + "%";
                            });
                        })),
                    j &&
                    ((F.lastIndex = 0),
                        (e = e.replace(F, function (e) {
                            return j + e;
                        }))),
                        (e = e.replace($, function (e) {
                            return t.push(+e), "{?}";
                        })),
                        t.unshift(e),
                        t
                );
            },
            Z = function (e) {
                var t,
                    i,
                    n = {};
                for (t = 0, i = e.keyFrames.length; i > t; t++) K(e.keyFrames[t], n);
                for (n = {}, t = e.keyFrames.length - 1; t >= 0; t--) K(e.keyFrames[t], n);
            },
            K = function (e, t) {
                var i;
                for (i in t) a.call(e.props, i) || (e.props[i] = t[i]);
                for (i in e.props) t[i] = e.props[i];
            },
            J = function (e, t, i) {
                var n,
                    o = e.length;
                if (o !== t.length) throw "Can't interpolate between \"" + e[0] + '" and "' + t[0] + '"';
                var r = [e[0]];
                for (n = 1; o > n; n++) r[n] = e[n] + (t[n] - e[n]) * i;
                return r;
            },
            ee = function (e) {
                var t = 1;
                return (
                    (N.lastIndex = 0),
                        e[0].replace(N, function () {
                            return e[t++];
                        })
                );
            },
            te = function (e, t) {
                for (var i, n, o = 0, r = (e = [].concat(e)).length; r > o; o++)
                    (n = e[o]),
                    (i = oe[n[z]]) && (t ? ((n.style.cssText = i.dirtyStyleAttr), ke(n, i.dirtyClassAttr)) : ((i.dirtyStyleAttr = n.style.cssText), (i.dirtyClassAttr = Ee(n)), (n.style.cssText = i.styleAttr), ke(n, i.classAttr)));
            },
            ie = function () {
                (ge = "translateZ(0)"), s.setStyle(re, "transform", ge);
                var e = c(re),
                    t = e.getPropertyValue("transform"),
                    i = e.getPropertyValue(j + "transform");
                (t && "none" !== t) || (i && "none" !== i) || (ge = "");
            };
        s.setStyle = function (e, t, i) {
            var n = e.style;
            if ("zIndex" === (t = t.replace(O, A).replace("-", ""))) n[t] = isNaN(i) ? i : "" + (0 | i);
            else if ("float" === t) n.styleFloat = n.cssFloat = i;
            else
                try {
                    H && (n[H + t.slice(0, 1).toUpperCase() + t.slice(1)] = i), (n[t] = i);
                } catch (e) {
                }
        };
        var ne,
            oe,
            re,
            se,
            ae,
            le,
            ce,
            ue,
            de,
            pe,
            he,
            fe,
            me,
            ge,
            ve,
            ye = (s.addEvent = function (t, i, n) {
                for (
                    var o,
                        r = function (t) {
                            return (
                                (t = t || e.event).target || (t.target = t.srcElement),
                                t.preventDefault ||
                                (t.preventDefault = function () {
                                    (t.returnValue = !1), (t.defaultPrevented = !0);
                                }),
                                    n.call(this, t)
                            );
                        },
                        s = 0,
                        a = (i = i.split(" ")).length;
                    a > s;
                    s++
                )
                    (o = i[s]), t.addEventListener ? t.addEventListener(o, n, !1) : t.attachEvent("on" + o, r), We.push({
                        element: t,
                        name: o,
                        listener: n
                    });
            }),
            we = (s.removeEvent = function (e, t, i) {
                for (var n = 0, o = (t = t.split(" ")).length; o > n; n++) e.removeEventListener ? e.removeEventListener(t[n], i, !1) : e.detachEvent("on" + t[n], i);
            }),
            xe = function () {
                for (var e, t = 0, i = We.length; i > t; t++) (e = We[t]), we(e.element, e.name, e.listener);
                We = [];
            },
            be = function (e, t, i) {
                se.keyframe && se.keyframe.call(ne, e, t, i);
            },
            Te = function () {
                var e = ne.getScrollTop();
                (Ie = 0),
                ae && !He && (r.style.height = ""),
                    (function () {
                        var e,
                            t,
                            i,
                            n,
                            r,
                            s,
                            a,
                            c,
                            u,
                            d,
                            p,
                            h = o.clientHeight,
                            f = Se();
                        for (c = 0, u = oe.length; u > c; c++)
                            for (t = (e = oe[c]).element, i = e.anchorTarget, r = 0, s = (n = e.keyFrames).length; s > r; r++)
                                (d = (a = n[r]).offset),
                                    (p = f[a.constant] || 0),
                                    (a.frame = d),
                                a.isPercentage && ((d *= h), (a.frame = d)),
                                "relative" === a.mode && (te(t), (a.frame = ne.relativeToAbsolute(i, a.anchors[0], a.anchors[1]) - d), te(t, !0)),
                                    (a.frame += p),
                                ae && !a.isEnd && a.frame > Ie && (Ie = a.frame);
                        for (Ie = l.max(Ie, Ce()), c = 0, u = oe.length; u > c; c++) {
                            for (r = 0, s = (n = (e = oe[c]).keyFrames).length; s > r; r++) (p = f[(a = n[r]).constant] || 0), a.isEnd && (a.frame = Ie - a.offset + p);
                            e.keyFrames.sort(Me);
                        }
                    })(),
                ae && !He && (r.style.height = Ie + o.clientHeight + "px"),
                    He ? ne.setScrollTop(l.min(ne.getScrollTop(), Ie)) : ne.setScrollTop(e, !0),
                    (fe = !0);
            },
            Se = function () {
                var e,
                    t,
                    i = o.clientHeight,
                    n = {};
                for (e in le) "function" == typeof (t = le[e]) ? (t = t.call(ne)) : /p$/.test(t) && (t = (t.slice(0, -1) / 100) * i), (n[e] = t);
                return n;
            },
            Ce = function () {
                var e = 0;
                return re && (e = l.max(re.offsetHeight, re.scrollHeight)), l.max(e, r.scrollHeight, r.offsetHeight, o.scrollHeight, o.offsetHeight, o.clientHeight) - o.clientHeight;
            },
            Ee = function (t) {
                var i = "className";
                return e.SVGElement && t instanceof e.SVGElement && ((t = t[i]), (i = "baseVal")), t[i];
            },
            ke = function (t, n, o) {
                var r = "className";
                if ((e.SVGElement && t instanceof e.SVGElement && ((t = t[r]), (r = "baseVal")), o === i)) return (t[r] = n), i;
                for (var s = t[r], a = 0, l = o.length; l > a; a++) s = ze(s).replace(ze(o[a]), " ");
                s = _e(s);
                for (var c = 0, u = n.length; u > c; c++) -1 === ze(s).indexOf(ze(n[c])) && (s += " " + n[c]);
                t[r] = _e(s);
            },
            _e = function (e) {
                return e.replace(M, "");
            },
            ze = function (e) {
                return " " + e + " ";
            },
            Le =
                Date.now ||
                function () {
                    return +new Date();
                },
            Me = function (e, t) {
                return e.frame - t.frame;
            },
            Ie = 0,
            Pe = 1,
            De = "down",
            Oe = -1,
            Ae = Le(),
            $e = 0,
            Ne = 0,
            Re = !1,
            Fe = 0,
            He = !1,
            je = 0,
            We = [];
        "function" == typeof define && define.amd
            ? define([], function () {
                return s;
            })
            : "undefined" != typeof module && module.exports
            ? (module.exports = s)
            : (e.skrollr = s);
    })(window, document);
var Swiper = function (e, t) {
    function i(e) {
        return document.querySelectorAll ? document.querySelectorAll(e) : jQuery(e);
    }

    function n() {
        var e = T - E;
        return t.freeMode && (e = T - E), t.slidesPerView > w.slides.length && (e = 0), 0 > e && (e = 0), e;
    }

    function o() {
        if (t.preventLinks) {
            var e = [];
            document.querySelectorAll ? (e = w.container.querySelectorAll("a")) : window.jQuery && (e = i(w.container).find("a"));
            for (var n = 0; n < e.length; n++) w.h.addEventListener(e[n], "click", d, !1);
        }
        if (t.releaseFormElements)
            for (e = document.querySelectorAll ? w.container.querySelectorAll("input, textarea, select") : i(w.container).find("input, textarea, select"), n = 0; n < e.length; n++)
                w.h.addEventListener(e[n], w.touchEvents.touchStart, p, !0);
        if (t.onSlideClick) for (n = 0; n < w.slides.length; n++) w.h.addEventListener(w.slides[n], "click", c, !1);
        if (t.onSlideTouch) for (n = 0; n < w.slides.length; n++) w.h.addEventListener(w.slides[n], w.touchEvents.touchStart, u, !1);
    }

    function r() {
        if (t.onSlideClick) for (var e = 0; e < w.slides.length; e++) w.h.removeEventListener(w.slides[e], "click", c, !1);
        if (t.onSlideTouch) for (e = 0; e < w.slides.length; e++) w.h.removeEventListener(w.slides[e], w.touchEvents.touchStart, u, !1);
        if (t.releaseFormElements) {
            var n = document.querySelectorAll ? w.container.querySelectorAll("input, textarea, select") : i(w.container).find("input, textarea, select");
            for (e = 0; e < n.length; e++) w.h.removeEventListener(n[e], w.touchEvents.touchStart, p, !0);
        }
        if (t.preventLinks) for (n = [], document.querySelectorAll ? (n = w.container.querySelectorAll("a")) : window.jQuery && (n = i(w.container).find("a")), e = 0; e < n.length; e++) w.h.removeEventListener(n[e], "click", d, !1);
    }

    function s(e) {
        var t = e.keyCode || e.charCode;
        if (37 == t || 39 == t || 38 == t || 40 == t) {
            for (
                var i = !1,
                    n = w.h.getOffset(w.container),
                    o = w.h.windowScroll().left,
                    r = w.h.windowScroll().top,
                    s = w.h.windowWidth(),
                    a = w.h.windowHeight(),
                    l =
                        ((n = [
                            [n.left, n.top],
                            [n.left + w.width, n.top],
                            [n.left, n.top + w.height],
                            [n.left + w.width, n.top + w.height],
                        ]),
                            0);
                l < n.length;
                l++
            ) {
                var c = n[l];
                c[0] >= o && c[0] <= o + s && c[1] >= r && c[1] <= r + a && (i = !0);
            }
            if (!i) return;
        }
        L
            ? ((37 != t && 39 != t) || (e.preventDefault ? e.preventDefault() : (e.returnValue = !1)), 39 == t && w.swipeNext(), 37 == t && w.swipePrev())
            : ((38 != t && 40 != t) || (e.preventDefault ? e.preventDefault() : (e.returnValue = !1)), 40 == t && w.swipeNext(), 38 == t && w.swipePrev());
    }

    function a(e) {
        var i,
            o = w._wheelEvent;
        return (
            e.detail ? (i = -e.detail) : "mousewheel" == o ? (i = e.wheelDelta) : "DOMMouseScroll" == o ? (i = -e.detail) : "wheel" == o && (i = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX : -e.deltaY),
                t.freeMode
                    ? (L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y"),
                        L
                            ? ((o = w.getWrapperTranslate("x") + i), (i = w.getWrapperTranslate("y")), 0 < o && (o = 0), o < -n() && (o = -n()))
                            : ((o = w.getWrapperTranslate("x")), 0 < (i = w.getWrapperTranslate("y") + i) && (i = 0), i < -n() && (i = -n())),
                        w.setWrapperTransition(0),
                        w.setWrapperTranslate(o, i, 0),
                        L ? w.updateActiveSlide(o) : w.updateActiveSlide(i))
                    : 0 > i
                    ? w.swipeNext()
                    : w.swipePrev(),
            t.autoplay && w.stopAutoplay(),
                e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
                !1
        );
    }

    function l(e) {
        for (var i = !1; !i;) -1 < e.className.indexOf(t.slideClass) && (i = e), (e = e.parentElement);
        return i;
    }

    function c(e) {
        w.allowSlideClick && (e.target ? ((w.clickedSlide = this), (w.clickedSlideIndex = w.slides.indexOf(this))) : ((w.clickedSlide = l(e.srcElement)), (w.clickedSlideIndex = w.slides.indexOf(w.clickedSlide))), t.onSlideClick(w));
    }

    function u(e) {
        (w.clickedSlide = e.target ? this : l(e.srcElement)), (w.clickedSlideIndex = w.slides.indexOf(w.clickedSlide)), t.onSlideTouch(w);
    }

    function d(e) {
        if (!w.allowLinks) return e.preventDefault ? e.preventDefault() : (e.returnValue = !1), !1;
    }

    function p(e) {
        return e.stopPropagation ? e.stopPropagation() : (e.returnValue = !1), !1;
    }

    function h(e) {
        if ((t.preventLinks && (w.allowLinks = !0), w.isTouched || t.onlyExternal)) return !1;
        var i;
        if ((i = t.noSwiping) && (i = e.target || e.srcElement)) {
            i = e.target || e.srcElement;
            var n = !1;
            do {
                -1 < i.className.indexOf(t.noSwipingClass) && (n = !0), (i = i.parentElement);
            } while (!n && i.parentElement && -1 == i.className.indexOf(t.wrapperClass));
            !n && -1 < i.className.indexOf(t.wrapperClass) && -1 < i.className.indexOf(t.noSwipingClass) && (n = !0), (i = n);
        }
        return (
            !i &&
            (($ = !1),
                (w.isTouched = !0),
                void (
                    ((A = "touchstart" == e.type) && 1 != e.targetTouches.length) ||
                    (t.loop && w.fixLoop(),
                        w.callPlugins("onTouchStartBegin"),
                    A || (e.preventDefault ? e.preventDefault() : (e.returnValue = !1)),
                        (i = A ? e.targetTouches[0].pageX : e.pageX || e.clientX),
                        (e = A ? e.targetTouches[0].pageY : e.pageY || e.clientY),
                        (w.touches.startX = w.touches.currentX = i),
                        (w.touches.startY = w.touches.currentY = e),
                        (w.touches.start = w.touches.current = L ? i : e),
                        w.setWrapperTransition(0),
                        (w.positions.start = w.positions.current = L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y")),
                        L ? w.setWrapperTranslate(w.positions.start, 0, 0) : w.setWrapperTranslate(0, w.positions.start, 0),
                        (w.times.start = new Date().getTime()),
                        (C = void 0),
                    0 < t.moveStartThreshold && (P = !1),
                    t.onTouchStart && t.onTouchStart(w),
                        w.callPlugins("onTouchStartEnd"))
                ))
        );
    }

    function f(e) {
        if (w.isTouched && !t.onlyExternal && (!A || "mousemove" != e.type)) {
            var i = A ? e.targetTouches[0].pageX : e.pageX || e.clientX,
                o = A ? e.targetTouches[0].pageY : e.pageY || e.clientY;
            if ((void 0 === C && L && (C = !!(C || Math.abs(o - w.touches.startY) > Math.abs(i - w.touches.startX))), void 0 !== C || L || (C = !!(C || Math.abs(o - w.touches.startY) < Math.abs(i - w.touches.startX))), C)) w.isTouched = !1;
            else if (e.assignedToSwiper) w.isTouched = !1;
            else if (
                ((e.assignedToSwiper = !0),
                    (w.isMoved = !0),
                t.preventLinks && (w.allowLinks = !1),
                t.onSlideClick && (w.allowSlideClick = !1),
                t.autoplay && w.stopAutoplay(),
                (!A || 1 == e.touches.length) &&
                (w.callPlugins("onTouchMoveStart"),
                    e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
                    (w.touches.current = L ? i : o),
                    (w.positions.current = (w.touches.current - w.touches.start) * t.touchRatio + w.positions.start),
                0 < w.positions.current && t.onResistanceBefore && t.onResistanceBefore(w, w.positions.current),
                w.positions.current < -n() && t.onResistanceAfter && t.onResistanceAfter(w, Math.abs(w.positions.current + n())),
                t.resistance &&
                "100%" != t.resistance &&
                (0 < w.positions.current && ((e = 1 - w.positions.current / E / 2), (w.positions.current = 0.5 > e ? E / 2 : w.positions.current * e)),
                w.positions.current < -n() &&
                ((i = (w.touches.current - w.touches.start) * t.touchRatio + (n() + w.positions.start)),
                    (e = (E + i) / E),
                    (i = w.positions.current - (i * (1 - e)) / 2),
                    (o = -n() - E / 2),
                    (w.positions.current = i < o || 0 >= e ? o : i))),
                t.resistance &&
                "100%" == t.resistance &&
                (0 < w.positions.current && (!t.freeMode || t.freeModeFluid) && (w.positions.current = 0), w.positions.current < -n() && (!t.freeMode || t.freeModeFluid) && (w.positions.current = -n())),
                    t.followFinger))
            )
                return (
                    t.moveStartThreshold
                        ? Math.abs(w.touches.current - w.touches.start) > t.moveStartThreshold || P
                        ? ((P = !0), L ? w.setWrapperTranslate(w.positions.current, 0, 0) : w.setWrapperTranslate(0, w.positions.current, 0))
                        : (w.positions.current = w.positions.start)
                        : L
                        ? w.setWrapperTranslate(w.positions.current, 0, 0)
                        : w.setWrapperTranslate(0, w.positions.current, 0),
                    (t.freeMode || t.watchActiveIndex) && w.updateActiveSlide(w.positions.current),
                    t.grabCursor && ((w.container.style.cursor = "move"), (w.container.style.cursor = "grabbing"), (w.container.style.cursor = "-moz-grabbin"), (w.container.style.cursor = "-webkit-grabbing")),
                    D || (D = w.touches.current),
                    O || (O = new Date().getTime()),
                        (w.velocity = (w.touches.current - D) / (new Date().getTime() - O) / 2),
                    2 > Math.abs(w.touches.current - D) && (w.velocity = 0),
                        (D = w.touches.current),
                        (O = new Date().getTime()),
                        w.callPlugins("onTouchMoveEnd"),
                    t.onTouchMove && t.onTouchMove(w),
                        !1
                );
        }
    }

    function m(e) {
        if ((C && w.swipeReset(), !t.onlyExternal && w.isTouched)) {
            (w.isTouched = !1),
            t.grabCursor && ((w.container.style.cursor = "move"), (w.container.style.cursor = "grab"), (w.container.style.cursor = "-moz-grab"), (w.container.style.cursor = "-webkit-grab")),
            w.positions.current || 0 === w.positions.current || (w.positions.current = w.positions.start),
            t.followFinger && (L ? w.setWrapperTranslate(w.positions.current, 0, 0) : w.setWrapperTranslate(0, w.positions.current, 0)),
                (w.times.end = new Date().getTime()),
                (w.touches.diff = w.touches.current - w.touches.start),
                (w.touches.abs = Math.abs(w.touches.diff)),
                (w.positions.diff = w.positions.current - w.positions.start),
                (w.positions.abs = Math.abs(w.positions.diff));
            var i = w.positions.diff,
                o = w.positions.abs;
            if (
                ((e = w.times.end - w.times.start),
                5 > o && 300 > e && 0 == w.allowLinks && (t.freeMode || 0 == o || w.swipeReset(), t.preventLinks && (w.allowLinks = !0), t.onSlideClick && (w.allowSlideClick = !0)),
                    setTimeout(function () {
                        t.preventLinks && (w.allowLinks = !0), t.onSlideClick && (w.allowSlideClick = !0);
                    }, 100),
                    w.isMoved)
            ) {
                w.isMoved = !1;
                var r = n();
                if (0 < w.positions.current) w.swipeReset();
                else if (w.positions.current < -r) w.swipeReset();
                else if (t.freeMode) {
                    if (t.freeModeFluid) {
                        (o = 1e3 * t.momentumRatio), (i = w.positions.current + w.velocity * o);
                        var s,
                            a = !1,
                            l = 20 * Math.abs(w.velocity) * t.momentumBounceRatio;
                        i < -r && (t.momentumBounce && w.support.transitions ? (i + r < -l && (i = -r - l), (s = -r), ($ = a = !0)) : (i = -r)),
                        0 < i && (t.momentumBounce && w.support.transitions ? (i > l && (i = l), (s = 0), ($ = a = !0)) : (i = 0)),
                        0 != w.velocity && (o = Math.abs((i - w.positions.current) / w.velocity)),
                            L ? w.setWrapperTranslate(i, 0, 0) : w.setWrapperTranslate(0, i, 0),
                            w.setWrapperTransition(o),
                        t.momentumBounce &&
                        a &&
                        w.wrapperTransitionEnd(function () {
                            $ && (t.onMomentumBounce && t.onMomentumBounce(w), L ? w.setWrapperTranslate(s, 0, 0) : w.setWrapperTranslate(0, s, 0), w.setWrapperTransition(300));
                        }),
                            w.updateActiveSlide(i);
                    }
                    (!t.freeModeFluid || 300 <= e) && w.updateActiveSlide(w.positions.current);
                } else {
                    if (
                        ("toNext" == (S = 0 > i ? "toNext" : "toPrev") && 300 >= e && (30 > o || !t.shortSwipes ? w.swipeReset() : w.swipeNext(!0)),
                        "toPrev" == S && 300 >= e && (30 > o || !t.shortSwipes ? w.swipeReset() : w.swipePrev(!0)),
                            (r = 0),
                        "auto" == t.slidesPerView)
                    ) {
                        i = Math.abs(L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y"));
                        for (var c = (a = 0); c < w.slides.length; c++)
                            if ((a += l = L ? w.slides[c].getWidth(!0) : w.slides[c].getHeight(!0)) > i) {
                                r = l;
                                break;
                            }
                        r > E && (r = E);
                    } else r = b * t.slidesPerView;
                    "toNext" == S && 300 < e && (o >= 0.5 * r ? w.swipeNext(!0) : w.swipeReset()), "toPrev" == S && 300 < e && (o >= 0.5 * r ? w.swipePrev(!0) : w.swipeReset());
                }
                t.onTouchEnd && t.onTouchEnd(w), w.callPlugins("onTouchEnd");
            } else (w.isMoved = !1), t.onTouchEnd && t.onTouchEnd(w), w.callPlugins("onTouchEnd"), w.swipeReset();
        }
    }

    function g(e, i, n) {
        if (w.support.transitions || !t.DOMAnimation) {
            L ? w.setWrapperTranslate(e, 0, 0) : w.setWrapperTranslate(0, e, 0);
            var o = "to" == i && 0 <= n.speed ? n.speed : t.speed;
            w.setWrapperTransition(o);
        } else {
            var r = L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y"),
                s = ((o = "to" == i && 0 <= n.speed ? n.speed : t.speed), Math.ceil(((e - r) / o) * (1e3 / 60))),
                a = r > e ? "toNext" : "toPrev";
            if (w._DOMAnimating) return;
            !(function i() {
                (r += s),
                    ("toNext" == a ? r > e : r < e)
                        ? (L ? w.setWrapperTranslate(Math.round(r), 0) : w.setWrapperTranslate(0, Math.round(r)),
                            (w._DOMAnimating = !0),
                            window.setTimeout(function () {
                                i();
                            }, 1e3 / 60))
                        : (t.onSlideChangeEnd && t.onSlideChangeEnd(w), L ? w.setWrapperTranslate(e, 0) : w.setWrapperTranslate(0, e), (w._DOMAnimating = !1));
            })();
        }
        w.updateActiveSlide(e),
        t.onSlideNext && "next" == i && t.onSlideNext(w, e),
        t.onSlidePrev && "prev" == i && t.onSlidePrev(w, e),
        t.onSlideReset && "reset" == i && t.onSlideReset(w, e),
        ("next" == i || "prev" == i || ("to" == i && 1 == n.runCallbacks)) &&
        (function () {
            if ((w.callPlugins("onSlideChangeStart"), t.onSlideChangeStart))
                if (t.queueStartCallbacks && w.support.transitions) {
                    if (w._queueStartCallbacks) return;
                    (w._queueStartCallbacks = !0),
                        t.onSlideChangeStart(w),
                        w.wrapperTransitionEnd(function () {
                            w._queueStartCallbacks = !1;
                        });
                } else t.onSlideChangeStart(w);
            t.onSlideChangeEnd &&
            (w.support.transitions
                ? t.queueEndCallbacks
                    ? w._queueEndCallbacks || ((w._queueEndCallbacks = !0), w.wrapperTransitionEnd(t.onSlideChangeEnd))
                    : w.wrapperTransitionEnd(t.onSlideChangeEnd)
                : t.DOMAnimation ||
                setTimeout(function () {
                    t.onSlideChangeEnd(w);
                }, 10));
        })();
    }

    function v() {
        for (var e = w.paginationButtons, t = 0; t < e.length; t++) w.h.removeEventListener(e[t], "click", y, !1);
    }

    function y(e) {
        var t;
        e = e.target || e.srcElement;
        for (var i = w.paginationButtons, n = 0; n < i.length; n++) e === i[n] && (t = n);
        w.swipeTo(t);
    }

    document.body.__defineGetter__ &&
    HTMLElement &&
    (k = HTMLElement.prototype).__defineGetter__ &&
    k.__defineGetter__("outerHTML", function () {
        return new XMLSerializer().serializeToString(this);
    });
    if (
        (window.getComputedStyle ||
        (window.getComputedStyle = function (e, t) {
            return (
                (this.el = e),
                    (this.getPropertyValue = function (t) {
                        var i = /(\-([a-z]){1})/g;
                        return (
                            "float" === t && (t = "styleFloat"),
                            i.test(t) &&
                            (t = t.replace(i, function (e, t, i) {
                                return i.toUpperCase();
                            })),
                                e.currentStyle[t] ? e.currentStyle[t] : null
                        );
                    }),
                    this
            );
        }),
        Array.prototype.indexOf ||
        (Array.prototype.indexOf = function (e, t) {
            for (var i = t || 0, n = this.length; i < n; i++) if (this[i] === e) return i;
            return -1;
        }),
        (document.querySelectorAll || window.jQuery) && void 0 !== e && (e.nodeType || 0 !== i(e).length))
    ) {
        var w = this;
        (w.touches = {start: 0, startX: 0, startY: 0, current: 0, currentX: 0, currentY: 0, diff: 0, abs: 0}),
            (w.positions = {start: 0, abs: 0, diff: 0, current: 0}),
            (w.times = {start: 0, end: 0}),
            (w.id = new Date().getTime()),
            (w.container = e.nodeType ? e : i(e)[0]),
            (w.isTouched = !1),
            (w.isMoved = !1),
            (w.activeIndex = 0),
            (w.activeLoaderIndex = 0),
            (w.activeLoopIndex = 0),
            (w.previousIndex = null),
            (w.velocity = 0),
            (w.snapGrid = []),
            (w.slidesGrid = []),
            (w.imagesToLoad = []),
            (w.imagesLoaded = 0),
            (w.wrapperLeft = 0),
            (w.wrapperRight = 0),
            (w.wrapperTop = 0),
            (w.wrapperBottom = 0);
        var x,
            b,
            T,
            S,
            C,
            E,
            k = {
                mode: "horizontal",
                touchRatio: 1,
                speed: 300,
                freeMode: !1,
                freeModeFluid: !1,
                momentumRatio: 1,
                momentumBounce: !0,
                momentumBounceRatio: 1,
                slidesPerView: 1,
                slidesPerGroup: 1,
                simulateTouch: !0,
                followFinger: !0,
                shortSwipes: !0,
                moveStartThreshold: !1,
                autoplay: !1,
                onlyExternal: !1,
                createPagination: !0,
                pagination: !1,
                paginationElement: "span",
                paginationClickable: !1,
                paginationAsRange: !0,
                resistance: !0,
                scrollContainer: !1,
                preventLinks: !0,
                noSwiping: !1,
                noSwipingClass: "swiper-no-swiping",
                initialSlide: 0,
                keyboardControl: !1,
                mousewheelControl: !1,
                mousewheelDebounce: 600,
                useCSS3Transforms: !0,
                loop: !1,
                loopAdditionalSlides: 0,
                calculateHeight: !1,
                updateOnImagesReady: !0,
                releaseFormElements: !0,
                watchActiveIndex: !1,
                visibilityFullFit: !1,
                offsetPxBefore: 0,
                offsetPxAfter: 0,
                offsetSlidesBefore: 0,
                offsetSlidesAfter: 0,
                centeredSlides: !1,
                queueStartCallbacks: !1,
                queueEndCallbacks: !1,
                autoResize: !0,
                resizeReInit: !1,
                DOMAnimation: !0,
                loader: {slides: [], slidesHTMLType: "inner", surroundGroups: 1, logic: "reload", loadAllSlides: !1},
                slideElement: "div",
                slideClass: "swiper-slide",
                slideActiveClass: "swiper-slide-active",
                slideVisibleClass: "swiper-slide-visible",
                wrapperClass: "swiper-wrapper",
                paginationElementClass: "swiper-pagination-switch",
                paginationActiveClass: "swiper-active-switch",
                paginationVisibleClass: "swiper-visible-switch",
            };
        for (var _ in ((t = t || {}), k))
            if (_ in t && "object" == typeof t[_]) for (var z in k[_]) z in t[_] || (t[_][z] = k[_][z]);
            else _ in t || (t[_] = k[_]);
        (w.params = t), t.scrollContainer && ((t.freeMode = !0), (t.freeModeFluid = !0)), t.loop && (t.resistance = "100%");
        var L = "horizontal" === t.mode;
        for (
            w.touchEvents = {
                touchStart: w.support.touch || !t.simulateTouch ? "touchstart" : w.browser.ie10 ? "MSPointerDown" : "mousedown",
                touchMove: w.support.touch || !t.simulateTouch ? "touchmove" : w.browser.ie10 ? "MSPointerMove" : "mousemove",
                touchEnd: w.support.touch || !t.simulateTouch ? "touchend" : w.browser.ie10 ? "MSPointerUp" : "mouseup",
            },
                _ = w.container.childNodes.length - 1;
            0 <= _;
            _--
        )
            if (w.container.childNodes[_].className) for (z = w.container.childNodes[_].className.split(" "), k = 0; k < z.length; k++) z[k] === t.wrapperClass && (x = w.container.childNodes[_]);
        (w.wrapper = x),
            (w._extendSwiperSlide = function (e) {
                return (
                    (e.append = function () {
                        return t.loop ? (e.insertAfter(w.slides.length - w.loopedSlides), w.removeLoopedSlides(), w.calcSlides(), w.createLoop()) : w.wrapper.appendChild(e), w.reInit(), e;
                    }),
                        (e.prepend = function () {
                            return t.loop ? (w.wrapper.insertBefore(e, w.slides[w.loopedSlides]), w.removeLoopedSlides(), w.calcSlides(), w.createLoop()) : w.wrapper.insertBefore(e, w.wrapper.firstChild), w.reInit(), e;
                        }),
                        (e.insertAfter = function (i) {
                            return (
                                void 0 !== i &&
                                (t.loop ? ((i = w.slides[i + 1 + w.loopedSlides]), w.wrapper.insertBefore(e, i), w.removeLoopedSlides(), w.calcSlides(), w.createLoop()) : ((i = w.slides[i + 1]), w.wrapper.insertBefore(e, i)), w.reInit(), e)
                            );
                        }),
                        (e.clone = function () {
                            return w._extendSwiperSlide(e.cloneNode(!0));
                        }),
                        (e.remove = function () {
                            w.wrapper.removeChild(e), w.reInit();
                        }),
                        (e.html = function (t) {
                            return void 0 === t ? e.innerHTML : ((e.innerHTML = t), e);
                        }),
                        (e.index = function () {
                            for (var t, i = w.slides.length - 1; 0 <= i; i--) e === w.slides[i] && (t = i);
                            return t;
                        }),
                        (e.isActive = function () {
                            return e.index() === w.activeIndex;
                        }),
                    e.swiperSlideDataStorage || (e.swiperSlideDataStorage = {}),
                        (e.getData = function (t) {
                            return e.swiperSlideDataStorage[t];
                        }),
                        (e.setData = function (t, i) {
                            return (e.swiperSlideDataStorage[t] = i), e;
                        }),
                        (e.data = function (t, i) {
                            return i ? (e.setAttribute("data-" + t, i), e) : e.getAttribute("data-" + t);
                        }),
                        (e.getWidth = function (t) {
                            return w.h.getWidth(e, t);
                        }),
                        (e.getHeight = function (t) {
                            return w.h.getHeight(e, t);
                        }),
                        (e.getOffset = function () {
                            return w.h.getOffset(e);
                        }),
                        e
                );
            }),
            (w.calcSlides = function (e) {
                var i = !!w.slides && w.slides.length;
                (w.slides = []), (w.displaySlides = []);
                for (var n = 0; n < w.wrapper.childNodes.length; n++)
                    if (w.wrapper.childNodes[n].className) for (var s = w.wrapper.childNodes[n].className.split(" "), a = 0; a < s.length; a++) s[a] === t.slideClass && w.slides.push(w.wrapper.childNodes[n]);
                for (n = w.slides.length - 1; 0 <= n; n--) w._extendSwiperSlide(w.slides[n]);
                i && (i !== w.slides.length || e) && (r(), o(), w.updateActiveSlide(), t.createPagination && w.params.pagination && w.createPagination(), w.callPlugins("numberOfSlidesChanged"));
            }),
            (w.createSlide = function (e, i, n) {
                return (i = i || w.params.slideClass), (n = n || t.slideElement), ((n = document.createElement(n)).innerHTML = e || ""), (n.className = i), w._extendSwiperSlide(n);
            }),
            (w.appendSlide = function (e, t, i) {
                if (e) return e.nodeType ? w._extendSwiperSlide(e).append() : w.createSlide(e, t, i).append();
            }),
            (w.prependSlide = function (e, t, i) {
                if (e) return e.nodeType ? w._extendSwiperSlide(e).prepend() : w.createSlide(e, t, i).prepend();
            }),
            (w.insertSlideAfter = function (e, t, i, n) {
                return void 0 !== e && (t.nodeType ? w._extendSwiperSlide(t).insertAfter(e) : w.createSlide(t, i, n).insertAfter(e));
            }),
            (w.removeSlide = function (e) {
                if (w.slides[e]) {
                    if (t.loop) {
                        if (!w.slides[e + w.loopedSlides]) return !1;
                        w.slides[e + w.loopedSlides].remove(), w.removeLoopedSlides(), w.calcSlides(), w.createLoop();
                    } else w.slides[e].remove();
                    return !0;
                }
                return !1;
            }),
            (w.removeLastSlide = function () {
                return 0 < w.slides.length && (t.loop ? (w.slides[w.slides.length - 1 - w.loopedSlides].remove(), w.removeLoopedSlides(), w.calcSlides(), w.createLoop()) : w.slides[w.slides.length - 1].remove(), !0);
            }),
            (w.removeAllSlides = function () {
                for (var e = w.slides.length - 1; 0 <= e; e--) w.slides[e].remove();
            }),
            (w.getSlide = function (e) {
                return w.slides[e];
            }),
            (w.getLastSlide = function () {
                return w.slides[w.slides.length - 1];
            }),
            (w.getFirstSlide = function () {
                return w.slides[0];
            }),
            (w.activeSlide = function () {
                return w.slides[w.activeIndex];
            });
        var M,
            I = [];
        for (M in w.plugins) t[M] && (_ = w.plugins[M](w, t[M])) && I.push(_);
        (w.callPlugins = function (e, t) {
            t || (t = {});
            for (var i = 0; i < I.length; i++) e in I[i] && I[i][e](t);
        }),
        w.browser.ie10 && !t.onlyExternal && (L ? w.wrapper.classList.add("swiper-wp8-horizontal") : w.wrapper.classList.add("swiper-wp8-vertical")),
        t.freeMode && (w.container.className += " swiper-free-mode"),
            (w.initialized = !1),
            (w.init = function (e, i) {
                var n = w.h.getWidth(w.container),
                    o = w.h.getHeight(w.container);
                if (n !== w.width || o !== w.height || e) {
                    if (((w.width = n), (w.height = o), (E = L ? n : o), (n = w.wrapper), e && w.calcSlides(i), "auto" === t.slidesPerView)) {
                        var r = 0,
                            s = 0;
                        0 < t.slidesOffset && ((n.style.paddingLeft = ""), (n.style.paddingRight = ""), (n.style.paddingTop = ""), (n.style.paddingBottom = "")),
                            (n.style.width = ""),
                            (n.style.height = ""),
                        0 < t.offsetPxBefore && (L ? (w.wrapperLeft = t.offsetPxBefore) : (w.wrapperTop = t.offsetPxBefore)),
                        0 < t.offsetPxAfter && (L ? (w.wrapperRight = t.offsetPxAfter) : (w.wrapperBottom = t.offsetPxAfter)),
                        t.centeredSlides &&
                        (L
                            ? ((w.wrapperLeft = (E - this.slides[0].getWidth(!0)) / 2), (w.wrapperRight = (E - w.slides[w.slides.length - 1].getWidth(!0)) / 2))
                            : ((w.wrapperTop = (E - w.slides[0].getHeight(!0)) / 2), (w.wrapperBottom = (E - w.slides[w.slides.length - 1].getHeight(!0)) / 2))),
                            L
                                ? (0 <= w.wrapperLeft && (n.style.paddingLeft = w.wrapperLeft + "px"), 0 <= w.wrapperRight && (n.style.paddingRight = w.wrapperRight + "px"))
                                : (0 <= w.wrapperTop && (n.style.paddingTop = w.wrapperTop + "px"), 0 <= w.wrapperBottom && (n.style.paddingBottom = w.wrapperBottom + "px"));
                        var a = 0,
                            l = 0;
                        (w.snapGrid = []), (w.slidesGrid = []);
                        for (var c = 0, u = 0; u < w.slides.length; u++) {
                            o = w.slides[u].getWidth(!0);
                            var d = w.slides[u].getHeight(!0);
                            t.calculateHeight && (c = Math.max(c, d));
                            var p = L ? o : d;
                            if (t.centeredSlides) {
                                var h = u === w.slides.length - 1 ? 0 : w.slides[u + 1].getWidth(!0),
                                    f = u === w.slides.length - 1 ? 0 : w.slides[u + 1].getHeight(!0);
                                h = L ? h : f;
                                if (p > E) {
                                    for (f = 0; f <= Math.floor(p / (E + w.wrapperLeft)); f++) 0 === f ? w.snapGrid.push(a + w.wrapperLeft) : w.snapGrid.push(a + w.wrapperLeft + E * f);
                                    w.slidesGrid.push(a + w.wrapperLeft);
                                } else w.snapGrid.push(l), w.slidesGrid.push(l);
                                l += p / 2 + h / 2;
                            } else {
                                if (p > E) for (f = 0; f <= Math.floor(p / E); f++) w.snapGrid.push(a + E * f);
                                else w.snapGrid.push(a);
                                w.slidesGrid.push(a);
                            }
                            (a += p), (r += o), (s += d);
                        }
                        t.calculateHeight && (w.height = c),
                            L
                                ? ((T = r + w.wrapperRight + w.wrapperLeft), (n.style.width = r + "px"), (n.style.height = w.height + "px"))
                                : ((T = s + w.wrapperTop + w.wrapperBottom), (n.style.width = w.width + "px"), (n.style.height = s + "px"));
                    } else if (t.scrollContainer)
                        (n.style.width = ""), (n.style.height = ""), (c = w.slides[0].getWidth(!0)), (r = w.slides[0].getHeight(!0)), (T = L ? c : r), (n.style.width = c + "px"), (n.style.height = r + "px"), (b = L ? c : r);
                    else {
                        if (t.calculateHeight) {
                            for (r = c = 0, L || (w.container.style.height = ""), n.style.height = "", u = 0; u < w.slides.length; u++)
                                (w.slides[u].style.height = ""), (c = Math.max(w.slides[u].getHeight(!0), c)), L || (r += w.slides[u].getHeight(!0));
                            (d = c), (w.height = d), L ? (r = d) : ((E = d), (w.container.style.height = E + "px"));
                        } else (d = L ? w.height : w.height / t.slidesPerView), (r = L ? w.height : w.slides.length * d);
                        for (
                            o = L ? w.width / t.slidesPerView : w.width,
                                c = L ? w.slides.length * o : w.width,
                                b = L ? o : d,
                            0 < t.offsetSlidesBefore && (L ? (w.wrapperLeft = b * t.offsetSlidesBefore) : (w.wrapperTop = b * t.offsetSlidesBefore)),
                            0 < t.offsetSlidesAfter && (L ? (w.wrapperRight = b * t.offsetSlidesAfter) : (w.wrapperBottom = b * t.offsetSlidesAfter)),
                            0 < t.offsetPxBefore && (L ? (w.wrapperLeft = t.offsetPxBefore) : (w.wrapperTop = t.offsetPxBefore)),
                            0 < t.offsetPxAfter && (L ? (w.wrapperRight = t.offsetPxAfter) : (w.wrapperBottom = t.offsetPxAfter)),
                            t.centeredSlides && (L ? ((w.wrapperLeft = (E - b) / 2), (w.wrapperRight = (E - b) / 2)) : ((w.wrapperTop = (E - b) / 2), (w.wrapperBottom = (E - b) / 2))),
                                L
                                    ? (0 < w.wrapperLeft && (n.style.paddingLeft = w.wrapperLeft + "px"), 0 < w.wrapperRight && (n.style.paddingRight = w.wrapperRight + "px"))
                                    : (0 < w.wrapperTop && (n.style.paddingTop = w.wrapperTop + "px"), 0 < w.wrapperBottom && (n.style.paddingBottom = w.wrapperBottom + "px")),
                                T = L ? c + w.wrapperRight + w.wrapperLeft : r + w.wrapperTop + w.wrapperBottom,
                                n.style.width = c + "px",
                                n.style.height = r + "px",
                                a = 0,
                                w.snapGrid = [],
                                w.slidesGrid = [],
                                u = 0;
                            u < w.slides.length;
                            u++
                        )
                            w.snapGrid.push(a), w.slidesGrid.push(a), (a += b), (w.slides[u].style.width = o + "px"), (w.slides[u].style.height = d + "px");
                    }
                    w.initialized ? (w.callPlugins("onInit"), t.onFirstInit && t.onInit(w)) : (w.callPlugins("onFirstInit"), t.onFirstInit && t.onFirstInit(w)), (w.initialized = !0);
                }
            }),
            (w.reInit = function (e) {
                w.init(!0, e);
            }),
            (w.resizeFix = function (e) {
                if ((w.callPlugins("beforeResizeFix"), w.init(t.resizeReInit || e), t.freeMode)) {
                    if ((L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y")) < -n()) {
                        e = L ? -n() : 0;
                        var i = L ? 0 : -n();
                        w.setWrapperTransition(0), w.setWrapperTranslate(e, i, 0);
                    }
                } else t.loop ? w.swipeTo(w.activeLoopIndex, 0, !1) : w.swipeTo(w.activeIndex, 0, !1);
                w.callPlugins("afterResizeFix");
            }),
            (w.destroy = function (e) {
                w.browser.ie10
                    ? (w.h.removeEventListener(w.wrapper, w.touchEvents.touchStart, h, !1), w.h.removeEventListener(document, w.touchEvents.touchMove, f, !1), w.h.removeEventListener(document, w.touchEvents.touchEnd, m, !1))
                    : (w.support.touch && (w.h.removeEventListener(w.wrapper, "touchstart", h, !1), w.h.removeEventListener(w.wrapper, "touchmove", f, !1), w.h.removeEventListener(w.wrapper, "touchend", m, !1)),
                    t.simulateTouch && (w.h.removeEventListener(w.wrapper, "mousedown", h, !1), w.h.removeEventListener(document, "mousemove", f, !1), w.h.removeEventListener(document, "mouseup", m, !1))),
                t.autoResize && w.h.removeEventListener(window, "resize", w.resizeFix, !1),
                    r(),
                t.paginationClickable && v(),
                t.mousewheelControl && w._wheelEvent && w.h.removeEventListener(w.container, w._wheelEvent, a, !1),
                t.keyboardControl && w.h.removeEventListener(document, "keydown", s, !1),
                t.autoplay && w.stopAutoplay(),
                    w.callPlugins("onDestroy"),
                    (w = null);
            }),
        t.grabCursor && ((w.container.style.cursor = "move"), (w.container.style.cursor = "grab"), (w.container.style.cursor = "-moz-grab"), (w.container.style.cursor = "-webkit-grab")),
            (w.allowSlideClick = !0),
            (w.allowLinks = !0);
        var P,
            D,
            O,
            A = !1,
            $ = !0;
        (w.swipeNext = function (e) {
            !e && t.loop && w.fixLoop(), w.callPlugins("onSwipeNext");
            var i = (e = L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y"));
            if ("auto" == t.slidesPerView) {
                for (var o = 0; o < w.snapGrid.length; o++)
                    if (-e >= w.snapGrid[o] && -e < w.snapGrid[o + 1]) {
                        i = -w.snapGrid[o + 1];
                        break;
                    }
            } else (i = b * t.slidesPerGroup), (i = -(Math.floor(Math.abs(e) / Math.floor(i)) * i + i));
            return i < -n() && (i = -n()), i != e && (g(i, "next"), !0);
        }),
            (w.swipePrev = function (e) {
                var i;
                if ((!e && t.loop && w.fixLoop(), !e && t.autoplay && w.stopAutoplay(), w.callPlugins("onSwipePrev"), (e = Math.ceil(L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y"))), "auto" == t.slidesPerView)) {
                    i = 0;
                    for (var n = 1; n < w.snapGrid.length; n++) {
                        if (-e == w.snapGrid[n]) {
                            i = -w.snapGrid[n - 1];
                            break;
                        }
                        if (-e > w.snapGrid[n] && -e < w.snapGrid[n + 1]) {
                            i = -w.snapGrid[n];
                            break;
                        }
                    }
                } else (i = b * t.slidesPerGroup), (i *= -(Math.ceil(-e / i) - 1));
                return 0 < i && (i = 0), i != e && (g(i, "prev"), !0);
            }),
            (w.swipeReset = function () {
                w.callPlugins("onSwipeReset");
                var e = L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y"),
                    i = b * t.slidesPerGroup;
                if ((n(), "auto" == t.slidesPerView)) {
                    for (var o = (i = 0); o < w.snapGrid.length; o++) {
                        if (-e === w.snapGrid[o]) return;
                        if (-e >= w.snapGrid[o] && -e < w.snapGrid[o + 1]) {
                            i = 0 < w.positions.diff ? -w.snapGrid[o + 1] : -w.snapGrid[o];
                            break;
                        }
                    }
                    -e >= w.snapGrid[w.snapGrid.length - 1] && (i = -w.snapGrid[w.snapGrid.length - 1]), e <= -n() && (i = -n());
                } else i = 0 > e ? Math.round(e / i) * i : 0;
                return t.scrollContainer && (i = 0 > e ? e : 0), i < -n() && (i = -n()), t.scrollContainer && E > b && (i = 0), i != e && (g(i, "reset"), !0);
            }),
            (w.swipeTo = function (e, i, o) {
                (e = parseInt(e, 10)), w.callPlugins("onSwipeTo", {
                    index: e,
                    speed: i
                }), t.loop && (e += w.loopedSlides);
                var r,
                    s = L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y");
                if (!(e > w.slides.length - 1 || 0 > e)) return (r = "auto" == t.slidesPerView ? -w.slidesGrid[e] : -e * b) < -n() && (r = -n()), r != s && (g(r, "to", {
                    index: e,
                    speed: i,
                    runCallbacks: !1 !== o
                }), !0);
            }),
            (w._queueStartCallbacks = !1),
            (w._queueEndCallbacks = !1),
            (w.updateActiveSlide = function (e) {
                if (w.initialized && 0 != w.slides.length) {
                    if (((w.previousIndex = w.activeIndex), 0 < e && (e = 0), void 0 === e && (e = L ? w.getWrapperTranslate("x") : w.getWrapperTranslate("y")), "auto" == t.slidesPerView)) {
                        if (((w.activeIndex = w.slidesGrid.indexOf(-e)), 0 > w.activeIndex)) {
                            for (var i = 0; i < w.slidesGrid.length - 1 && !(-e > w.slidesGrid[i] && -e < w.slidesGrid[i + 1]); i++) ;
                            var n = Math.abs(w.slidesGrid[i] + e),
                                o = Math.abs(w.slidesGrid[i + 1] + e);
                            w.activeIndex = n <= o ? i : i + 1;
                        }
                    } else w.activeIndex = t.visibilityFullFit ? Math.ceil(-e / b) : Math.round(-e / b);
                    if ((w.activeIndex == w.slides.length && (w.activeIndex = w.slides.length - 1), 0 > w.activeIndex && (w.activeIndex = 0), w.slides[w.activeIndex])) {
                        for (w.calcVisibleSlides(e), n = RegExp("\\s*" + t.slideActiveClass), o = RegExp("\\s*" + t.slideVisibleClass), i = 0; i < w.slides.length; i++)
                            (w.slides[i].className = w.slides[i].className.replace(n, "").replace(o, "")), 0 <= w.visibleSlides.indexOf(w.slides[i]) && (w.slides[i].className += " " + t.slideVisibleClass);
                        (w.slides[w.activeIndex].className += " " + t.slideActiveClass),
                            t.loop
                                ? ((i = w.loopedSlides),
                                    (w.activeLoopIndex = w.activeIndex - i),
                                w.activeLoopIndex >= w.slides.length - 2 * i && (w.activeLoopIndex = w.slides.length - 2 * i - w.activeLoopIndex),
                                0 > w.activeLoopIndex && (w.activeLoopIndex = w.slides.length - 2 * i + w.activeLoopIndex))
                                : (w.activeLoopIndex = w.activeIndex),
                        t.pagination && w.updatePagination(e);
                    }
                }
            }),
            (w.createPagination = function (e) {
                t.paginationClickable && w.paginationButtons && v();
                var n = "",
                    o = w.slides.length;
                t.loop && (o -= 2 * w.loopedSlides);
                for (var r = 0; r < o; r++) n += "<" + t.paginationElement + ' class="' + t.paginationElementClass + '"></' + t.paginationElement + ">";
                if (
                    ((w.paginationContainer = t.pagination.nodeType ? t.pagination : i(t.pagination)[0]),
                        (w.paginationContainer.innerHTML = n),
                        (w.paginationButtons = []),
                        document.querySelectorAll
                            ? (w.paginationButtons = w.paginationContainer.querySelectorAll("." + t.paginationElementClass))
                            : window.jQuery && (w.paginationButtons = i(w.paginationContainer).find("." + t.paginationElementClass)),
                    e || w.updatePagination(),
                        w.callPlugins("onCreatePagination"),
                        t.paginationClickable)
                )
                    for (e = w.paginationButtons, n = 0; n < e.length; n++) w.h.addEventListener(e[n], "click", y, !1);
            }),
            (w.updatePagination = function (e) {
                if (t.pagination && !(1 > w.slides.length)) {
                    if (document.querySelectorAll) var n = w.paginationContainer.querySelectorAll("." + t.paginationActiveClass);
                    else window.jQuery && (n = i(w.paginationContainer).find("." + t.paginationActiveClass));
                    if (n && 0 != (n = w.paginationButtons).length) {
                        for (var o = 0; o < n.length; o++) n[o].className = t.paginationElementClass;
                        var r = t.loop ? w.loopedSlides : 0;
                        if (t.paginationAsRange) {
                            for (w.visibleSlides || w.calcVisibleSlides(e), e = [], o = 0; o < w.visibleSlides.length; o++) {
                                var s = w.slides.indexOf(w.visibleSlides[o]) - r;
                                t.loop && 0 > s && (s = w.slides.length - 2 * w.loopedSlides + s), t.loop && s >= w.slides.length - 2 * w.loopedSlides && ((s = w.slides.length - 2 * w.loopedSlides - s), (s = Math.abs(s))), e.push(s);
                            }
                            for (o = 0; o < e.length; o++) n[e[o]] && (n[e[o]].className += " " + t.paginationVisibleClass);
                            t.loop ? (n[w.activeLoopIndex].className += " " + t.paginationActiveClass) : (n[w.activeIndex].className += " " + t.paginationActiveClass);
                        } else t.loop ? (n[w.activeLoopIndex].className += " " + t.paginationActiveClass + " " + t.paginationVisibleClass) : (n[w.activeIndex].className += " " + t.paginationActiveClass + " " + t.paginationVisibleClass);
                    }
                }
            }),
            (w.calcVisibleSlides = function (e) {
                var i = [],
                    n = 0,
                    o = 0,
                    r = 0;
                L && 0 < w.wrapperLeft && (e += w.wrapperLeft), !L && 0 < w.wrapperTop && (e += w.wrapperTop);
                for (var s = 0; s < w.slides.length; s++) {
                    r = (n = n + o) + (o = "auto" == t.slidesPerView ? (L ? w.h.getWidth(w.slides[s], !0) : w.h.getHeight(w.slides[s], !0)) : b);
                    var a = !1;
                    t.visibilityFullFit ? (n >= -e && r <= -e + E && (a = !0), n <= -e && r >= -e + E && (a = !0)) : (r > -e && r <= -e + E && (a = !0), n >= -e && n < -e + E && (a = !0), n < -e && r > -e + E && (a = !0)),
                    a && i.push(w.slides[s]);
                }
                0 == i.length && (i = [w.slides[w.activeIndex]]), (w.visibleSlides = i);
            }),
            (w.autoPlayIntervalId = void 0),
            (w.startAutoplay = function () {
                return (
                    void 0 === w.autoPlayIntervalId &&
                    (t.autoplay &&
                    !t.loop &&
                    (w.autoPlayIntervalId = setInterval(function () {
                        w.swipeNext(!0) || w.swipeTo(0);
                    }, t.autoplay)),
                    t.autoplay &&
                    t.loop &&
                    (w.autoPlayIntervalId = setInterval(function () {
                        w.swipeNext();
                    }, t.autoplay)),
                        void w.callPlugins("onAutoplayStart"))
                );
            }),
            (w.stopAutoplay = function () {
                w.autoPlayIntervalId && clearInterval(w.autoPlayIntervalId), (w.autoPlayIntervalId = void 0), w.callPlugins("onAutoplayStop");
            }),
            (w.loopCreated = !1),
            (w.removeLoopedSlides = function () {
                if (w.loopCreated) for (var e = 0; e < w.slides.length; e++) !0 === w.slides[e].getData("looped") && w.wrapper.removeChild(w.slides[e]);
            }),
            (w.createLoop = function () {
                if (0 != w.slides.length) {
                    w.loopedSlides = t.slidesPerView + t.loopAdditionalSlides;
                    for (var e = "", i = "", n = 0; n < w.loopedSlides; n++) e += w.slides[n].outerHTML;
                    for (n = w.slides.length - w.loopedSlides; n < w.slides.length; n++) i += w.slides[n].outerHTML;
                    for (x.innerHTML = i + x.innerHTML + e, w.loopCreated = !0, w.calcSlides(), n = 0; n < w.slides.length; n++) (n < w.loopedSlides || n >= w.slides.length - w.loopedSlides) && w.slides[n].setData("looped", !0);
                    w.callPlugins("onCreateLoop");
                }
            }),
            (w.fixLoop = function () {
                if (w.activeIndex < w.loopedSlides) {
                    var e = w.slides.length - 3 * w.loopedSlides + w.activeIndex;
                    w.swipeTo(e, 0, !1);
                } else w.activeIndex > w.slides.length - 2 * t.slidesPerView && ((e = -w.slides.length + w.activeIndex + w.loopedSlides), w.swipeTo(e, 0, !1));
            }),
            (w.loadSlides = function () {
                var e = "";
                w.activeLoaderIndex = 0;
                for (var i = t.loader.slides, n = t.loader.loadAllSlides ? i.length : t.slidesPerView * (1 + t.loader.surroundGroups), o = 0; o < n; o++)
                    e = "outer" == t.loader.slidesHTMLType ? e + i[o] : e + "<" + t.slideElement + ' class="' + t.slideClass + '" data-swiperindex="' + o + '">' + i[o] + "</" + t.slideElement + ">";
                (w.wrapper.innerHTML = e), w.calcSlides(!0), t.loader.loadAllSlides || w.wrapperTransitionEnd(w.reloadSlides, !0);
            }),
            (w.reloadSlides = function () {
                var e = t.loader.slides;
                if (!(0 > (r = parseInt(w.activeSlide().data("swiperindex"), 10)) || r > e.length - 1)) {
                    w.activeLoaderIndex = r;
                    var i = Math.max(0, r - t.slidesPerView * t.loader.surroundGroups),
                        n = Math.min(r + t.slidesPerView * (1 + t.loader.surroundGroups) - 1, e.length - 1);
                    if ((0 < r && ((r = -b * (r - i)), L ? w.setWrapperTranslate(r, 0, 0) : w.setWrapperTranslate(0, r, 0), w.setWrapperTransition(0)), "reload" === t.loader.logic)) {
                        for (var o = (w.wrapper.innerHTML = ""), r = i; r <= n; r++)
                            o += "outer" == t.loader.slidesHTMLType ? e[r] : "<" + t.slideElement + ' class="' + t.slideClass + '" data-swiperindex="' + r + '">' + e[r] + "</" + t.slideElement + ">";
                        w.wrapper.innerHTML = o;
                    } else {
                        o = 1e3;
                        var s = 0;
                        for (r = 0; r < w.slides.length; r++) {
                            var a = w.slides[r].data("swiperindex");
                            a < i || a > n ? w.wrapper.removeChild(w.slides[r]) : ((o = Math.min(a, o)), (s = Math.max(a, s)));
                        }
                        for (r = i; r <= n; r++)
                            r < o && (((i = document.createElement(t.slideElement)).className = t.slideClass), i.setAttribute("data-swiperindex", r), (i.innerHTML = e[r]), w.wrapper.insertBefore(i, w.wrapper.firstChild)),
                            r > s && (((i = document.createElement(t.slideElement)).className = t.slideClass), i.setAttribute("data-swiperindex", r), (i.innerHTML = e[r]), w.wrapper.appendChild(i));
                    }
                    w.reInit(!0);
                }
            }),
            w.calcSlides(),
        0 < t.loader.slides.length && 0 == w.slides.length && w.loadSlides(),
        t.loop && w.createLoop(),
            w.init(),
            (function () {
                function e(e) {
                    var i = new Image();
                    (i.onload = function () {
                        w.imagesLoaded++, w.imagesLoaded == w.imagesToLoad.length && (w.reInit(), t.onImagesReady) && t.onImagesReady(w);
                    }),
                        (i.src = e);
                }

                if (
                    (w.browser.ie10
                        ? (w.h.addEventListener(w.wrapper, w.touchEvents.touchStart, h, !1), w.h.addEventListener(document, w.touchEvents.touchMove, f, !1), w.h.addEventListener(document, w.touchEvents.touchEnd, m, !1))
                        : (w.support.touch && (w.h.addEventListener(w.wrapper, "touchstart", h, !1), w.h.addEventListener(w.wrapper, "touchmove", f, !1), w.h.addEventListener(w.wrapper, "touchend", m, !1)),
                        t.simulateTouch && (w.h.addEventListener(w.wrapper, "mousedown", h, !1), w.h.addEventListener(document, "mousemove", f, !1), w.h.addEventListener(document, "mouseup", m, !1))),
                    t.autoResize && w.h.addEventListener(window, "resize", w.resizeFix, !1),
                        o(),
                        (w._wheelEvent = !1),
                        t.mousewheelControl)
                ) {
                    void 0 !== document.onmousewheel && (w._wheelEvent = "mousewheel");
                    try {
                        WheelEvent("wheel"), (w._wheelEvent = "wheel");
                    } catch (e) {
                    }
                    w._wheelEvent || (w._wheelEvent = "DOMMouseScroll"), w._wheelEvent && w.h.addEventListener(w.container, w._wheelEvent, a, !1);
                }
                if ((t.keyboardControl && w.h.addEventListener(document, "keydown", s, !1), t.updateOnImagesReady)) {
                    document.querySelectorAll ? (w.imagesToLoad = w.container.querySelectorAll("img")) : window.jQuery && (w.imagesToLoad = i(w.container).find("img"));
                    for (var n = 0; n < w.imagesToLoad.length; n++) e(w.imagesToLoad[n].getAttribute("src"));
                }
            })(),
        t.pagination && t.createPagination && w.createPagination(!0),
            t.loop || 0 < t.initialSlide ? w.swipeTo(t.initialSlide, 0, !1) : w.updateActiveSlide(0),
        t.autoplay && w.startAutoplay();
    }
};
(Swiper.prototype = {
    plugins: {},
    wrapperTransitionEnd: function (e, t) {
        function i() {
            if ((e(n), n.params.queueEndCallbacks && (n._queueEndCallbacks = !1), !t)) for (var s = 0; s < r.length; s++) n.h.removeEventListener(o, r[s], i, !1);
        }

        var n = this,
            o = n.wrapper,
            r = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"];
        if (e) for (var s = 0; s < r.length; s++) n.h.addEventListener(o, r[s], i, !1);
    },
    getWrapperTranslate: function (e) {
        var t,
            i,
            n = this.wrapper,
            o = window.WebKitCSSMatrix
                ? new WebKitCSSMatrix(window.getComputedStyle(n, null).webkitTransform)
                : window.getComputedStyle(n, null).MozTransform ||
                window.getComputedStyle(n, null).OTransform ||
                window.getComputedStyle(n, null).MsTransform ||
                window.getComputedStyle(n, null).msTransform ||
                window.getComputedStyle(n, null).transform ||
                window.getComputedStyle(n, null).getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
        return (
            (t = o.toString().split(",")),
                this.params.useCSS3Transforms
                    ? ("x" == e && (i = 16 == t.length ? parseFloat(t[12]) : window.WebKitCSSMatrix ? o.m41 : parseFloat(t[4])), "y" == e && (i = 16 == t.length ? parseFloat(t[13]) : window.WebKitCSSMatrix ? o.m42 : parseFloat(t[5])))
                    : ("x" == e && (i = parseFloat(n.style.left, 10) || 0), "y" == e && (i = parseFloat(n.style.top, 10) || 0)),
            i || 0
        );
    },
    setWrapperTranslate: function (e, t, i) {
        var n = this.wrapper.style;
        (e = e || 0),
            (t = t || 0),
            (i = i || 0),
            this.params.useCSS3Transforms
                ? this.support.transforms3d
                ? (n.webkitTransform = n.MsTransform = n.msTransform = n.MozTransform = n.OTransform = n.transform = "translate3d(" + e + "px, " + t + "px, " + i + "px)")
                : ((n.webkitTransform = n.MsTransform = n.msTransform = n.MozTransform = n.OTransform = n.transform = "translate(" + e + "px, " + t + "px)"), this.support.transforms || ((n.left = e + "px"), (n.top = t + "px")))
                : ((n.left = e + "px"), (n.top = t + "px")),
            this.callPlugins("onSetWrapperTransform", {x: e, y: t, z: i});
    },
    setWrapperTransition: function (e) {
        var t = this.wrapper.style;
        (t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e / 1e3 + "s"), this.callPlugins("onSetWrapperTransition", {duration: e});
    },
    h: {
        getWidth: function (e, t) {
            var i = window.getComputedStyle(e, null).getPropertyValue("width"),
                n = parseFloat(i);
            return (
                (isNaN(n) || 0 < i.indexOf("%")) && (n = e.offsetWidth - parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-left")) - parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-right"))),
                t && (n += parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-left")) + parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-right"))),
                    n
            );
        },
        getHeight: function (e, t) {
            if (t) return e.offsetHeight;
            var i = window.getComputedStyle(e, null).getPropertyValue("height"),
                n = parseFloat(i);
            return (
                (isNaN(n) || 0 < i.indexOf("%")) && (n = e.offsetHeight - parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-top")) - parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-bottom"))),
                t && (n += parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-top")) + parseFloat(window.getComputedStyle(e, null).getPropertyValue("padding-bottom"))),
                    n
            );
        },
        getOffset: function (e) {
            var t = e.getBoundingClientRect(),
                i = document.body,
                n = e.clientTop || i.clientTop || 0,
                o = ((i = e.clientLeft || i.clientLeft || 0), window.pageYOffset || e.scrollTop);
            return (
                (e = window.pageXOffset || e.scrollLeft), document.documentElement && !window.pageYOffset && ((o = document.documentElement.scrollTop), (e = document.documentElement.scrollLeft)), {
                    top: t.top + o - n,
                    left: t.left + e - i
                }
            );
        },
        windowWidth: function () {
            return window.innerWidth ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : void 0;
        },
        windowHeight: function () {
            return window.innerHeight ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : void 0;
        },
        windowScroll: function () {
            return "undefined" != typeof pageYOffset ? {
                left: window.pageXOffset,
                top: window.pageYOffset
            } : document.documentElement ? {
                left: document.documentElement.scrollLeft,
                top: document.documentElement.scrollTop
            } : void 0;
        },
        addEventListener: function (e, t, i, n) {
            e.addEventListener ? e.addEventListener(t, i, n) : e.attachEvent && e.attachEvent("on" + t, i);
        },
        removeEventListener: function (e, t, i, n) {
            e.removeEventListener ? e.removeEventListener(t, i, n) : e.detachEvent && e.detachEvent("on" + t, i);
        },
    },
    setTransform: function (e, t) {
        var i = e.style;
        i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = t;
    },
    setTranslate: function (e, t) {
        var i = e.style,
            n = t.x || 0,
            o = t.y || 0,
            r = t.z || 0;
        (i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = this.support.transforms3d ? "translate3d(" + n + "px," + o + "px," + r + "px)" : "translate(" + n + "px," + o + "px)"),
        this.support.transforms || ((i.left = n + "px"), (i.top = o + "px"));
    },
    setTransition: function (e, t) {
        var i = e.style;
        i.webkitTransitionDuration = i.MsTransitionDuration = i.msTransitionDuration = i.MozTransitionDuration = i.OTransitionDuration = i.transitionDuration = t + "ms";
    },
    support: {
        touch: (window.Modernizr && !0 === Modernizr.touch) || !!("ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch)),
        transforms3d:
            (window.Modernizr && !0 === Modernizr.csstransforms3d) ||
            (function () {
                var e = document.createElement("div");
                return "webkitPerspective" in e.style || "MozPerspective" in e.style || "OPerspective" in e.style || "MsPerspective" in e.style || "perspective" in e.style;
            })(),
        transforms:
            (window.Modernizr && !0 === Modernizr.csstransforms) ||
            (function () {
                var e = document.createElement("div").style;
                return "transform" in e || "WebkitTransform" in e || "MozTransform" in e || "msTransform" in e || "MsTransform" in e || "OTransform" in e;
            })(),
        transitions:
            (window.Modernizr && !0 === Modernizr.csstransitions) ||
            (function () {
                var e = document.createElement("div").style;
                return "transition" in e || "WebkitTransition" in e || "MozTransition" in e || "msTransition" in e || "MsTransition" in e || "OTransition" in e;
            })(),
    },
    browser: {
        ie8: (function () {
            var e = -1;
            return "Microsoft Internet Explorer" == navigator.appName && null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (e = parseFloat(RegExp.$1)), -1 != e && 9 > e;
        })(),
        ie10: window.navigator.msPointerEnabled,
    },
}),
(window.jQuery || window.Zepto) &&
(function (e) {
    e.fn.swiper = function (t) {
        return (t = new Swiper(e(this)[0], t)), e(this).data("swiper", t), t;
    };
})(window.jQuery || window.Zepto),
"undefined" != typeof module && (module.exports = Swiper),
    (window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (e) {
            window.setTimeout(e, 1e3 / 60);
        }),
    (window.cancelRequestAnimFrame =
        window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout);
var Intense = (function () {
    "use strict";

    function e(e, t) {
        for (var i in t) e.style[i] = t[i];
    }

    function t(e) {
        e.src &&
        e.addEventListener(
            "click",
            function () {
                var e, t, i, u, d;
                (t = (e = this).src),
                    (i = e.getAttribute("data-title")),
                    (u = e.getAttribute("data-caption")),
                    ((d = new Image()).onload = function () {
                        (p = {w: d.width, h: d.height}),
                            (h = this),
                            o(i, u),
                            (m = document.body.style.overflow),
                            (document.body.style.overflow = "hidden"),
                            f.addEventListener("mousemove", a, !1),
                            f.addEventListener("touchmove", l, !1),
                            window.addEventListener("resize", s, !1),
                            window.addEventListener("keyup", c, !1),
                            h.addEventListener("click", r, !1),
                            n();
                    }),
                    (d.src = t);
            },
            !1
        );
    }

    function i() {
        cancelRequestAnimFrame(u);
    }

    function n() {
        (u = requestAnimFrame(n)),
            (function () {
                if (((v.xCurr += 0.05 * (v.xDest - v.xCurr)), (v.yCurr += 0.05 * (v.yDest - v.yCurr)), !0 === y)) {
                    if (((w += v.xCurr - w), v.xCurr !== d)) {
                        var e = parseFloat(w / b.w);
                        (e = T.x * e),
                            (h.style.webkitTransform = "translate3d(" + e + "px, 0px, 0px)"),
                            (h.style.MozTransform = "translate3d(" + e + "px, 0px, 0px)"),
                            (h.style.msTransform = "translate3d(" + e + "px, 0px, 0px)"),
                            (d = v.xCurr);
                    }
                } else if (!1 === y && ((w += v.yCurr - w), v.yCurr !== d)) {
                    var e = parseFloat(w / b.h);
                    (e = T.y * e),
                        (h.style.webkitTransform = "translate3d( 0px, " + e + "px, 0px)"),
                        (h.style.MozTransform = "translate3d( 0px, " + e + "px, 0px)"),
                        (h.style.msTransform = "translate3d( 0px, " + e + "px, 0px)"),
                        (d = v.yCurr);
                }
            })();
    }

    function o(t, i) {
        (f = document.createElement("figure")).appendChild(h),
            e(f, {
                backgroundColor: "rgba(0,0,0,0.8)",
                width: "100%",
                height: "100%",
                position: "fixed",
                top: "0px",
                left: "0px",
                overflow: "hidden",
                zIndex: "999999",
                margin: "0px",
                webkitTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
                MozTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
                transition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
                opacity: "0",
            });
        e(h, {cursor: 'url( "'});
        var n = document.createElement("figcaption");
        if (
            (e(n, {
                fontFamily: 'Georgia, Times, "Times New Roman", serif',
                position: "fixed",
                bottom: "0px",
                left: "0px",
                padding: "20px",
                color: "#fff",
                wordSpacing: "0.2px",
                webkitFontSmoothing: "antialiased",
                textShadow: "-1px 0px 1px rgba(0,0,0,0.4)",
            }),
                t)
        ) {
            var o = document.createElement("h1");
            e(o, {
                margin: "0px",
                padding: "0px",
                fontWeight: "normal",
                fontSize: "40px",
                letterSpacing: "0.5px",
                lineHeight: "35px",
                textAlign: "left"
            }), (o.innerHTML = t), n.appendChild(o);
        }
        if (i) {
            var r = document.createElement("h2");
            e(r, {
                margin: "0px",
                padding: "0px",
                fontWeight: "normal",
                fontSize: "20px",
                letterSpacing: "0.1px",
                maxWidth: "500px",
                textAlign: "left",
                background: "none",
                marginTop: "5px"
            }), (r.innerHTML = i), n.appendChild(r);
        }
        f.appendChild(n),
            s(),
            (v.xCurr = v.xDest = window.innerWidth / 2),
            (v.yCurr = v.yDest = window.innerHeight / 2),
            document.body.appendChild(f),
            setTimeout(function () {
                f.style.opacity = "1";
            }, 10);
    }

    function r() {
        (document.body.style.overflow = m),
            f.removeEventListener("mousemove", a, !1),
            f.removeEventListener("touchmove", l, !1),
            window.removeEventListener("resize", s, !1),
            window.removeEventListener("keyup", c, !1),
            h.removeEventListener("click", r, !1),
            i(),
            document.body.removeChild(f);
    }

    function s() {
        var e = (function (e) {
            var t = window.innerHeight / e.h;
            if (e.w * t > window.innerWidth) return {w: e.w * t, h: e.h * t, fit: !0};
            var i = window.innerWidth / e.w;
            return {w: e.w * i, h: e.h * i, fit: !1};
        })(p);
        (h.width = e.w), (h.height = e.h), (y = e.fit), (x = {w: h.width, h: h.height}), (b = {
            w: window.innerWidth,
            h: window.innerHeight
        }), (T = {x: b.w - x.w, y: b.h - x.h});
    }

    function a(e) {
        (v.xDest = e.clientX), (v.yDest = e.clientY);
    }

    function l(e) {
        e.preventDefault(), (v.xDest = e.touches[0].clientX), (v.yDest = e.touches[0].clientY);
    }

    function c(e) {
        e.preventDefault(), e.keyCode === g && r();
    }

    var u,
        d,
        p,
        h,
        f,
        m,
        g = 27,
        v = {xCurr: 0, yCurr: 0, xDest: 0, yDest: 0},
        y = !0,
        w = 0,
        x = {w: 0, h: 0},
        b = {w: 0, h: 0},
        T = {x: 0, y: 0};
    return (function (e, t) {
        for (var i in t) i in e || (e[i] = t[i]);
        return e;
    })(
        function (e) {
            if (!e) throw "You need to pass an element!";
            !(function (e) {
                var i;
                if (e.length) for (i = 0; i < e.length; i++) t(e[i]);
                else t(e);
            })(e);
        },
        {
            resize: s,
            start: function () {
                n();
            },
            stop: i,
        }
    );
})();
!(function (e, t) {
    var i = t.document;
    (e.fn.share = function (n) {
        var o = {
                init: function (n) {
                    this.share.settings = e.extend({}, this.share.defaults, n);
                    var o = (this.share.settings, this.share.settings.networks),
                        s = this.share.settings.theme,
                        a = this.share.settings.orientation,
                        l = this.share.settings.affix,
                        c = this.share.settings.margin,
                        u = this.share.settings.title || e(i).attr("title"),
                        d = this.share.settings.urlToShare || e(location).attr("href"),
                        p = "";
                    return (
                        e.each(e(i).find('meta[name="description"]'), function (t, i) {
                            p = e(i).attr("content");
                        }),
                            this.each(function () {
                                var i,
                                    n = e(this),
                                    h = n.attr("id"),
                                    f = encodeURIComponent(d),
                                    m = u.replace("|", ""),
                                    g = p.substring(0, 250);
                                o.forEach(function (t) {
                                    (i = (i = r.networkDefs[t].url).replace("|u|", f).replace("|t|", m).replace("|d|", g).replace("|140|", m.substring(0, 130))),
                                        e("<a href='" + i + "' title='Share this page on " + t + "' class='pop share-" + s + " share-" + s + "-" + t + "'></a>").appendTo(n);
                                }),
                                    e("#" + h + ".share-" + s).css("margin", c),
                                    "horizontal" != a ? e("#" + h + " a.share-" + s).css("display", "block") : e("#" + h + " a.share-" + s).css("display", "inline-block"),
                                void 0 !== l &&
                                (n.addClass("share-affix"),
                                    -1 != l.indexOf("right") ? (n.css("left", "auto"), n.css("right", "0px"), -1 != l.indexOf("center") && n.css("top", "40%")) : -1 != l.indexOf("left center") && n.css("top", "40%"),
                                -1 != l.indexOf("bottom") && (n.css("bottom", "0px"), n.css("top", "auto"), -1 != l.indexOf("center") && n.css("left", "40%"))),
                                    e(".pop").click(function () {
                                        return t.open(e(this).attr("href"), "t", "toolbar=0,resizable=1,status=0,width=640,height=528"), !1;
                                    });
                            })
                    );
                },
            },
            r = {
                networkDefs: {
                    facebook: {url: "http://www.facebook.com/share.php?u=|u|"},
                    twitter: {url: "https://twitter.com/share?via=in1.com&text=|140|"},
                    linkedin: {url: "http://www.linkedin.com/shareArticle?mini=true&url=|u|&title=|t|&summary=|d|&source=in1.com"},
                    in1: {url: "http://www.in1.com/cast?u=|u|", w: "490", h: "529"},
                    tumblr: {url: "http://www.tumblr.com/share?v=3&u=|u|"},
                    digg: {url: "http://digg.com/submit?url=|u|&title=|t|"},
                    googleplus: {url: "https://plusone.google.com/_/+1/confirm?hl=en&url=|u|"},
                    reddit: {url: "http://reddit.com/submit?url=|u|"},
                    pinterest: {url: "http://pinterest.com/pin/create/button/?url=|u|&media=&description=|d|"},
                    posterous: {url: "http://posterous.com/share?linkto=|u|&title=|t|"},
                    stumbleupon: {url: "http://www.stumbleupon.com/submit?url=|u|&title=|t|"},
                    email: {url: "mailto:?subject=|t|"},
                },
            };
        return o[n] ? o[n].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof n && n ? void e.error('Method "' + n + '" does not exist in social plugin') : o.init.apply(this, arguments);
    }),
        (e.fn.share.defaults = {
            networks: ["in1", "facebook", "twitter", "linkedin"],
            theme: "icon",
            autoShow: !0,
            margin: "3px",
            orientation: "horizontal",
            useIn1: !0
        }),
        (e.fn.share.settings = {});
})(jQuery, window),
    (function (e) {
        (e.isScrollToFixed = function (t) {
            return !!e(t).data("ScrollToFixed");
        }),
            (e.ScrollToFixed = function (t, i) {
                function n() {
                    b.trigger("preUnfixed.ScrollToFixed"),
                        u(),
                        b.trigger("unfixed.ScrollToFixed"),
                        (E = -1),
                        (T = b.offset().top),
                        (S = b.offset().left),
                    m.options.offsets && (S += b.offset().left - b.position().left),
                    -1 == C && (C = S),
                        (g = b.css("position")),
                        (x = !0),
                    -1 != m.options.bottom && (b.trigger("preFixed.ScrollToFixed"), l(), b.trigger("fixed.ScrollToFixed"));
                }

                function o() {
                    var e = m.options.limit;
                    return e ? ("function" == typeof e ? e.apply(b) : e) : 0;
                }

                function r() {
                    return "fixed" === g;
                }

                function s() {
                    return "absolute" === g;
                }

                function a() {
                    return !(r() || s());
                }

                function l() {
                    r() ||
                    (k.css({
                        display: b.css("display"),
                        width: b.outerWidth(!0),
                        height: b.outerHeight(!0),
                        float: b.css("float")
                    }),
                        (cssOptions = {
                            "z-index": m.options.zIndex,
                            position: "fixed",
                            top: -1 == m.options.bottom ? p() : "",
                            bottom: -1 == m.options.bottom ? "" : m.options.bottom,
                            "margin-left": "0px"
                        }),
                    m.options.dontSetWidth || (cssOptions.width = b.width()),
                        b.css(cssOptions),
                        b.addClass(m.options.baseClassName),
                    m.options.className && b.addClass(m.options.className),
                        (g = "fixed"));
                }

                function c() {
                    var e = o(),
                        t = S;
                    m.options.removeOffsets && ((t = ""), (e -= T)),
                        (cssOptions = {position: "absolute", top: e, left: t, "margin-left": "0px", bottom: ""}),
                    m.options.dontSetWidth || (cssOptions.width = b.width()),
                        b.css(cssOptions),
                        (g = "absolute");
                }

                function u() {
                    a() ||
                    ((E = -1),
                        k.css("display", "none"),
                        b.css({"z-index": w, width: "", position: v, left: "", top: y, "margin-left": ""}),
                        b.removeClass("scroll-to-fixed-fixed"),
                    m.options.className && b.removeClass(m.options.className),
                        (g = null));
                }

                function d(e) {
                    e != E && (b.css("left", S - e), (E = e));
                }

                function p() {
                    var e = m.options.marginTop;
                    return e ? ("function" == typeof e ? e.apply(b) : e) : 0;
                }

                function h() {
                    if (e.isScrollToFixed(b)) {
                        var t = x;
                        x ? a() && ((T = b.offset().top), (S = b.offset().left)) : n();
                        var i = e(window).scrollLeft(),
                            h = e(window).scrollTop(),
                            g = o();
                        m.options.minWidth && e(window).width() < m.options.minWidth
                            ? (a() && t) || (f(), b.trigger("preUnfixed.ScrollToFixed"), u(), b.trigger("unfixed.ScrollToFixed"))
                            : m.options.maxWidth && e(window).width() > m.options.maxWidth
                            ? (a() && t) || (f(), b.trigger("preUnfixed.ScrollToFixed"), u(), b.trigger("unfixed.ScrollToFixed"))
                            : -1 == m.options.bottom
                                ? g > 0 && h >= g - p()
                                    ? (s() && t) || (f(), b.trigger("preAbsolute.ScrollToFixed"), c(), b.trigger("unfixed.ScrollToFixed"))
                                    : h >= T - p()
                                        ? ((r() && t) || (f(), b.trigger("preFixed.ScrollToFixed"), l(), (E = -1), b.trigger("fixed.ScrollToFixed")), d(i))
                                        : (a() && t) || (f(), b.trigger("preUnfixed.ScrollToFixed"), u(), b.trigger("unfixed.ScrollToFixed"))
                                : g > 0
                                    ? h + e(window).height() - b.outerHeight(!0) >= g - (p() || -(m.options.bottom ? m.options.bottom : 0))
                                        ? r() && (f(), b.trigger("preUnfixed.ScrollToFixed"), "absolute" === v ? c() : u(), b.trigger("unfixed.ScrollToFixed"))
                                        : (r() || (f(), b.trigger("preFixed.ScrollToFixed"), l()), d(i), b.trigger("fixed.ScrollToFixed"))
                                    : d(i);
                    }
                }

                function f() {
                    var e = b.css("position");
                    "absolute" == e ? b.trigger("postAbsolute.ScrollToFixed") : "fixed" == e ? b.trigger("postFixed.ScrollToFixed") : b.trigger("postUnfixed.ScrollToFixed");
                }

                var m = this;
                (m.$el = e(t)), (m.el = t), m.$el.data("ScrollToFixed", m);
                var g,
                    v,
                    y,
                    w,
                    x = !1,
                    b = m.$el,
                    T = 0,
                    S = 0,
                    C = -1,
                    E = -1,
                    k = null,
                    _ = function (e) {
                        b.is(":visible") && ((x = !1), h());
                    },
                    z = function (e) {
                        window.requestAnimationFrame ? requestAnimationFrame(h) : h();
                    };
                (m.init = function () {
                    (m.options = e.extend({}, e.ScrollToFixed.defaultOptions, i)),
                        (w = b.css("z-index")),
                        m.$el.css("z-index", m.options.zIndex),
                        (k = e("<div />")),
                        (g = b.css("position")),
                        (v = b.css("position")),
                        (y = b.css("top")),
                    a() && m.$el.after(k),
                        e(window).bind("resize.ScrollToFixed", _),
                        e(window).bind("scroll.ScrollToFixed", z),
                    "ontouchmove" in window && e(window).bind("touchmove.ScrollToFixed", h),
                    m.options.preFixed && b.bind("preFixed.ScrollToFixed", m.options.preFixed),
                    m.options.postFixed && b.bind("postFixed.ScrollToFixed", m.options.postFixed),
                    m.options.preUnfixed && b.bind("preUnfixed.ScrollToFixed", m.options.preUnfixed),
                    m.options.postUnfixed && b.bind("postUnfixed.ScrollToFixed", m.options.postUnfixed),
                    m.options.preAbsolute && b.bind("preAbsolute.ScrollToFixed", m.options.preAbsolute),
                    m.options.postAbsolute && b.bind("postAbsolute.ScrollToFixed", m.options.postAbsolute),
                    m.options.fixed && b.bind("fixed.ScrollToFixed", m.options.fixed),
                    m.options.unfixed && b.bind("unfixed.ScrollToFixed", m.options.unfixed),
                    m.options.spacerClass && k.addClass(m.options.spacerClass),
                        b.bind("resize.ScrollToFixed", function () {
                            k.height(b.height());
                        }),
                        b.bind("scroll.ScrollToFixed", function () {
                            b.trigger("preUnfixed.ScrollToFixed"), u(), b.trigger("unfixed.ScrollToFixed"), h();
                        }),
                        b.bind("detach.ScrollToFixed", function (t) {
                            (function (e) {
                                (e = e || window.event).preventDefault && e.preventDefault(), (e.returnValue = !1);
                            })(t),
                                b.trigger("preUnfixed.ScrollToFixed"),
                                u(),
                                b.trigger("unfixed.ScrollToFixed"),
                                e(window).unbind("resize.ScrollToFixed", _),
                                e(window).unbind("scroll.ScrollToFixed", z),
                                b.unbind(".ScrollToFixed"),
                                k.remove(),
                                m.$el.removeData("ScrollToFixed");
                        }),
                        _();
                }),
                    m.init();
            }),
            (e.ScrollToFixed.defaultOptions = {
                marginTop: 0,
                limit: 0,
                bottom: -1,
                zIndex: 1e3,
                baseClassName: "scroll-to-fixed-fixed"
            }),
            (e.fn.scrollToFixed = function (t) {
                return this.each(function () {
                    new e.ScrollToFixed(this, t);
                });
            });
    })(jQuery),
    (function (e) {
        function t() {
            for (var t in ((r = !1), n)) {
                var o = e(n[t]).filter(function () {
                    return e(this).is(":appeared");
                });
                if ((o.trigger("appear", [o]), i)) {
                    var s = i.not(o);
                    s.trigger("disappear", [s]);
                }
                i = o;
            }
        }

        var i,
            n = [],
            o = !1,
            r = !1,
            s = {interval: 250, force_process: !1},
            a = e(window);
        (e.expr[":"].appeared = function (t) {
            var i = e(t);
            if (!i.is(":visible")) return !1;
            var n = a.scrollLeft(),
                o = a.scrollTop(),
                r = i.offset(),
                s = r.left,
                l = r.top;
            return l + i.height() >= o && l - (i.data("appear-top-offset") || 0) <= o + a.height() && s + i.width() >= n && s - (i.data("appear-left-offset") || 0) <= n + a.width();
        }),
            e.fn.extend({
                appear: function (i) {
                    var a = e.extend({}, s, i || {}),
                        l = this.selector || this;
                    if (!o) {
                        var c = function () {
                            r || ((r = !0), setTimeout(t, a.interval));
                        };
                        e(window).scroll(c).resize(c), (o = !0);
                    }
                    return a.force_process && setTimeout(t, a.interval), n.push(l), e(l);
                },
            }),
            e.extend({
                force_appear: function () {
                    return !!o && (t(), !0);
                },
            });
    })(jQuery),
"function" != typeof Object.create &&
(Object.create = function (e) {
    function t() {
    }

    return (t.prototype = e), new t();
}),
    (function (e, t, i) {
        var n = function (e) {
                var t = i.createElement("script"),
                    n = i.getElementsByTagName("head")[0];
                (t.src = location.protocol + "//www.youtube.com/iframe_api"), n.appendChild(t), (n = null), (t = null), o(e);
            },
            o = function (i) {
                "undefined" == typeof YT && void 0 === t.loadingPlayer
                    ? ((t.loadingPlayer = !0),
                        (t.dfd = e.Deferred()),
                        (t.onYouTubeIframeAPIReady = function () {
                            (t.onYouTubeIframeAPIReady = null), t.dfd.resolve("John"), i();
                        }))
                    : t.dfd.done(function (e) {
                        i();
                    });
            };
        (YTPlayer = {
            player: null,
            defaults: {
                ratio: 16 / 9,
                videoId: "LSmgKRx5pBo",
                mute: !0,
                repeat: !0,
                width: e(t).width(),
                playButtonClass: "YTPlayer-play",
                pauseButtonClass: "YTPlayer-pause",
                muteButtonClass: "YTPlayer-mute",
                volumeUpClass: "YTPlayer-volume-up",
                volumeDownClass: "YTPlayer-volume-down",
                start: 0,
                pauseOnScroll: !1,
                fitToBackground: !0,
                playerVars: {
                    modestbranding: 1,
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    wmode: "transparent",
                    branding: 0,
                    rel: 0,
                    autohide: 0,
                    origin: t.location.origin
                },
                events: null,
            },
            init: function (i, o) {
                var r = this;
                return (
                    (r.userOptions = o),
                        (r.$body = e("body")),
                        (r.$node = e(i)),
                        (r.$window = e(t)),
                        (r.defaults.events = {
                            onReady: function (e) {
                                r.onPlayerReady(e), r.options.pauseOnScroll && r.pauseOnScroll(), "function" == typeof r.options.callback && r.options.callback.call(this);
                            },
                            onStateChange: function (e) {
                                1 === e.data ? r.$node.addClass("loaded") : 0 === e.data && r.options.repeat && r.player.seekTo(r.options.start);
                            },
                        }),
                        (r.options = e.extend(!0, {}, r.defaults, r.userOptions)),
                        (r.ID = new Date().getTime()),
                        (r.holderID = "YTPlayer-ID-" + r.ID),
                        r.options.fitToBackground ? r.createBackgroundVideo() : r.createContainerVideo(),
                        r.$window.on("resize.YTplayer" + r.ID, function () {
                            r.resize(r);
                        }),
                        n(r.onYouTubeIframeAPIReady.bind(r)),
                        r.resize(r),
                        r
                );
            },
            pauseOnScroll: function () {
                var e = this;
                e.$window.on("scroll.YTplayer" + e.ID, function () {
                    1 === e.player.getPlayerState() && e.player.pauseVideo();
                }),
                    e.$window.scrollStopped(function () {
                        2 === e.player.getPlayerState() && e.player.playVideo();
                    });
            },
            createContainerVideo: function () {
                var t = this,
                    i = e(
                        '<div id="ytplayer-container' +
                        t.ID +
                        '" >                                    <div id="' +
                        t.holderID +
                        '" class="ytplayer-player"></div>                                     </div>                                     <div id="ytplayer-shield"></div>'
                    );
                t.$node.append(i), (t.$YTPlayerString = i), (i = null);
            },
            createBackgroundVideo: function () {
                var t = this,
                    i = e(
                        '<div id="ytplayer-container' +
                        t.ID +
                        '" class="ytplayer-container background">                                    <div id="' +
                        t.holderID +
                        '" class="ytplayer-player"></div>                                    </div>                                    <div id="ytplayer-shield"></div>'
                    );
                t.$node.append(i), (t.$YTPlayerString = i), (i = null);
            },
            resize: function (i) {
                var n = e(t);
                i.options.fitToBackground || (n = i.$node);
                var o,
                    r,
                    s = n.width(),
                    a = n.height(),
                    l = e("#" + i.holderID);
                s / i.options.ratio < a
                    ? ((o = Math.ceil(a * i.options.ratio)),
                        l
                            .width(o)
                            .height(a)
                            .css({left: (s - o) / 2, top: 0}))
                    : ((r = Math.ceil(s / i.options.ratio)), l.width(s).height(r).css({left: 0, top: 0})),
                    (l = null),
                    (n = null);
            },
            onYouTubeIframeAPIReady: function () {
                var e = this;
                e.player = new t.YT.Player(e.holderID, {
                    width: e.options.width,
                    height: Math.ceil(e.options.width / e.options.ratio),
                    videoId: e.options.videoId,
                    playerVars: e.options.playerVars,
                    events: e.options.events
                });
            },
            onPlayerReady: function (e) {
                this.options.mute && e.target.mute(), e.target.playVideo();
            },
            getPlayer: function () {
                return this.player;
            },
            destroy: function () {
                var i = this;
                i.$node.removeData("yt-init").removeData("ytPlayer").removeClass("loaded"),
                    i.$YTPlayerString.remove(),
                    e(t).off("resize.YTplayer" + i.ID),
                    e(t).off("scroll.YTplayer" + i.ID),
                    (i.$body = null),
                    (i.$node = null),
                    (i.$YTPlayerString = null),
                    i.player.destroy(),
                    (i.player = null);
            },
        }),
            (e.fn.scrollStopped = function (t) {
                var i = e(this),
                    n = this;
                i.scroll(function () {
                    i.data("scrollTimeout") && clearTimeout(i.data("scrollTimeout")), i.data("scrollTimeout", setTimeout(t, 250, n));
                });
            }),
            (e.fn.YTPlayer = function (t) {
                return this.each(function () {
                    var i = this;
                    e(i).data("yt-init", !0);
                    var n = Object.create(YTPlayer);
                    n.init(i, t), e.data(i, "ytPlayer", n);
                });
            });
    })(jQuery, window, document),
    (function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery);
    })(function (e) {
        var t = !1,
            i = !1,
            n = 0,
            o = 2e3,
            r = 0,
            s = ["webkit", "ms", "moz", "o"],
            a = window.requestAnimationFrame || !1,
            l = window.cancelAnimationFrame || !1;
        if (!a)
            for (var c in s) {
                var u = s[c];
                a || (a = window[u + "RequestAnimationFrame"]), l || (l = window[u + "CancelAnimationFrame"] || window[u + "CancelRequestAnimationFrame"]);
            }
        var d = window.MutationObserver || window.WebKitMutationObserver || !1,
            p = {
                zindex: "auto",
                cursoropacitymin: 0,
                cursoropacitymax: 1,
                cursorcolor: "#424242",
                cursorwidth: "5px",
                cursorborder: "1px solid #fff",
                cursorborderradius: "5px",
                scrollspeed: 60,
                mousescrollstep: 24,
                touchbehavior: !1,
                hwacceleration: !0,
                usetransition: !0,
                boxzoom: !1,
                dblclickzoom: !0,
                gesturezoom: !0,
                grabcursorenabled: !0,
                autohidemode: !0,
                background: "",
                iframeautoresize: !0,
                cursorminheight: 32,
                preservenativescrolling: !0,
                railoffset: !1,
                railhoffset: !1,
                bouncescroll: !0,
                spacebarenabled: !0,
                railpadding: {top: 0, right: 0, left: 0, bottom: 0},
                disableoutline: !0,
                horizrailenabled: !0,
                railalign: "right",
                railvalign: "bottom",
                enabletranslate3d: !0,
                enablemousewheel: !0,
                enablekeyboard: !0,
                smoothscroll: !0,
                sensitiverail: !0,
                enablemouselockapi: !0,
                cursorfixedheight: !1,
                directionlockdeadzone: 6,
                hidecursordelay: 400,
                nativeparentscrolling: !0,
                enablescrollonselection: !0,
                overflowx: !0,
                overflowy: !0,
                cursordragspeed: 0.3,
                rtlmode: "auto",
                cursordragontouch: !1,
                oneaxismousemode: "auto",
                scriptpath: (function () {
                    var e;
                    return 0 < (e = (e = document.getElementsByTagName("script"))[e.length - 1].src.split("?")[0]).split("/").length ? e.split("/").slice(0, -1).join("/") + "/" : "";
                })(),
                preventmultitouchscrolling: !0,
            },
            h = !1,
            f = function () {
                if (h) return h;
                var e = document.createElement("DIV"),
                    t = e.style,
                    i = navigator.userAgent,
                    n = navigator.platform,
                    o = {haspointerlock: "pointerLockElement" in document || "webkitPointerLockElement" in document || "mozPointerLockElement" in document};
                (o.isopera = "opera" in window),
                    (o.isopera12 = o.isopera && "getUserMedia" in navigator),
                    (o.isoperamini = "[object OperaMini]" === Object.prototype.toString.call(window.operamini)),
                    (o.isie = "all" in document && "attachEvent" in e && !o.isopera),
                    (o.isieold = o.isie && !("msInterpolationMode" in t)),
                    (o.isie7 = o.isie && !o.isieold && (!("documentMode" in document) || 7 == document.documentMode)),
                    (o.isie8 = o.isie && "documentMode" in document && 8 == document.documentMode),
                    (o.isie9 = o.isie && "performance" in window && 9 <= document.documentMode),
                    (o.isie10 = o.isie && "performance" in window && 10 == document.documentMode),
                    (o.isie11 = "msRequestFullscreen" in e && 11 <= document.documentMode),
                    (o.isie9mobile = /iemobile.9/i.test(i)),
                o.isie9mobile && (o.isie9 = !1),
                    (o.isie7mobile = !o.isie9mobile && o.isie7 && /iemobile/i.test(i)),
                    (o.ismozilla = "MozAppearance" in t),
                    (o.iswebkit = "WebkitAppearance" in t),
                    (o.ischrome = "chrome" in window),
                    (o.ischrome22 = o.ischrome && o.haspointerlock),
                    (o.ischrome26 = o.ischrome && "transition" in t),
                    (o.cantouch = "ontouchstart" in document.documentElement || "ontouchstart" in window),
                    (o.hasmstouch = window.MSPointerEvent || !1),
                    (o.hasw3ctouch = window.PointerEvent || !1),
                    (o.ismac = /^mac$/i.test(n)),
                    (o.isios = o.cantouch && /iphone|ipad|ipod/i.test(n)),
                    (o.isios4 = o.isios && !("seal" in Object)),
                    (o.isios7 = o.isios && "webkitHidden" in document),
                    (o.isandroid = /android/i.test(i)),
                    (o.haseventlistener = "addEventListener" in e),
                    (o.trstyle = !1),
                    (o.hastransform = !1),
                    (o.hastranslate3d = !1),
                    (o.transitionstyle = !1),
                    (o.hastransition = !1),
                    (o.transitionend = !1),
                    (n = ["transform", "msTransform", "webkitTransform", "MozTransform", "OTransform"]);
                for (i = 0; i < n.length; i++)
                    if (void 0 !== t[n[i]]) {
                        o.trstyle = n[i];
                        break;
                    }
                (o.hastransform = !!o.trstyle), o.hastransform && ((t[o.trstyle] = "translate3d(1px,2px,3px)"), (o.hastranslate3d = /translate3d/.test(t[o.trstyle]))), (o.transitionstyle = !1), (o.prefixstyle = ""), (o.transitionend = !1);
                n = "transition webkitTransition msTransition MozTransition OTransition OTransition KhtmlTransition".split(" ");
                var r = " -webkit- -ms- -moz- -o- -o -khtml-".split(" "),
                    s = "transitionend webkitTransitionEnd msTransitionEnd transitionend otransitionend oTransitionEnd KhtmlTransitionEnd".split(" ");
                for (i = 0; i < n.length; i++)
                    if (n[i] in t) {
                        (o.transitionstyle = n[i]), (o.prefixstyle = r[i]), (o.transitionend = s[i]);
                        break;
                    }
                o.ischrome26 && (o.prefixstyle = r[1]), (o.hastransition = o.transitionstyle);
                e: {
                    for (i = ["-webkit-grab", "-moz-grab", "grab"], ((o.ischrome && !o.ischrome22) || o.isie) && (i = []), n = 0; n < i.length; n++)
                        if (((r = i[n]), (t.cursor = r), t.cursor == r)) {
                            t = r;
                            break e;
                        }
                    t = "url(//mail.google.com/mail/images/2/openhand.cur),n-resize";
                }
                return (o.cursorgrabvalue = t), (o.hasmousecapture = "setCapture" in e), (o.hasMutationObserver = !1 !== d), (h = o);
            },
            m = function (s, c) {
                function u() {
                    var e = y.doc.css(x.trstyle);
                    return (
                        !(!e || "matrix" != e.substr(0, 6)) &&
                        e
                            .replace(/^.*\((.*)\)$/g, "$1")
                            .replace(/px/g, "")
                            .split(/, +/)
                    );
                }

                function h(e, t, i) {
                    return (
                        (t = e.css(t)), (e = parseFloat(t)), isNaN(e) ? ((i = 3 == (e = C[t] || 0) ? (i ? y.win.outerHeight() - y.win.innerHeight() : y.win.outerWidth() - y.win.innerWidth()) : 1), y.isie8 && e && (e += 1), i ? e : 0) : e
                    );
                }

                function m(e, t, i, n) {
                    y._bind(
                        e,
                        t,
                        function (n) {
                            var o = {
                                original: (n = n || window.event),
                                target: n.target || n.srcElement,
                                type: "wheel",
                                deltaMode: "MozMousePixelScroll" == n.type ? 0 : 1,
                                deltaX: 0,
                                deltaZ: 0,
                                preventDefault: function () {
                                    return n.preventDefault ? n.preventDefault() : (n.returnValue = !1), !1;
                                },
                                stopImmediatePropagation: function () {
                                    n.stopImmediatePropagation ? n.stopImmediatePropagation() : (n.cancelBubble = !0);
                                },
                            };
                            return "mousewheel" == t ? ((o.deltaY = -0.025 * n.wheelDelta), n.wheelDeltaX && (o.deltaX = -0.025 * n.wheelDeltaX)) : (o.deltaY = n.detail), i.call(e, o);
                        },
                        n
                    );
                }

                function v(e, t, i) {
                    var n, o;
                    if (
                        (0 == e.deltaMode
                            ? ((n = -Math.floor((y.opt.mousescrollstep / 54) * e.deltaX)), (o = -Math.floor((y.opt.mousescrollstep / 54) * e.deltaY)))
                            : 1 == e.deltaMode && ((n = -Math.floor(e.deltaX * y.opt.mousescrollstep)), (o = -Math.floor(e.deltaY * y.opt.mousescrollstep))),
                        t && y.opt.oneaxismousemode && 0 == n && o && ((n = o), (o = 0), i && (0 > n ? y.getScrollLeft() >= y.page.maxw : 0 >= y.getScrollLeft()) && ((o = n), (n = 0))),
                        n &&
                        (y.scrollmom && y.scrollmom.stop(),
                            (y.lastdeltax += n),
                            y.debounced(
                                "mousewheelx",
                                function () {
                                    var e = y.lastdeltax;
                                    (y.lastdeltax = 0), y.rail.drag || y.doScrollLeftBy(e);
                                },
                                15
                            )),
                            o)
                    ) {
                        if (y.opt.nativeparentscrolling && i && !y.ispage && !y.zoomactive)
                            if (0 > o) {
                                if (y.getScrollTop() >= y.page.maxh) return !0;
                            } else if (0 >= y.getScrollTop()) return !0;
                        y.scrollmom && y.scrollmom.stop(),
                            (y.lastdeltay += o),
                            y.debounced(
                                "mousewheely",
                                function () {
                                    var e = y.lastdeltay;
                                    (y.lastdeltay = 0), y.rail.drag || y.doScrollBy(e);
                                },
                                15
                            );
                    }
                    return e.stopImmediatePropagation(), e.preventDefault();
                }

                var y = this;
                if (((this.version = "3.6.0"), (this.name = "nicescroll"), (this.me = c), (this.opt = {
                    doc: e("body"),
                    win: !1
                }), e.extend(this.opt, p), (this.opt.snapbackspeed = 80), s))
                    for (var w in y.opt) void 0 !== s[w] && (y.opt[w] = s[w]);
                (this.iddoc = ((this.doc = y.opt.doc) && this.doc[0] && this.doc[0].id) || ""),
                    (this.ispage = /^BODY|HTML/.test(y.opt.win ? y.opt.win[0].nodeName : this.doc[0].nodeName)),
                    (this.haswrapper = !1 !== y.opt.win),
                    (this.win = y.opt.win || (this.ispage ? e(window) : this.doc)),
                    (this.docscroll = this.ispage && !this.haswrapper ? e(window) : this.win),
                    (this.body = e("body")),
                    (this.iframe = this.isfixed = this.viewport = !1),
                    (this.isiframe = "IFRAME" == this.doc[0].nodeName && "IFRAME" == this.win[0].nodeName),
                    (this.istextarea = "TEXTAREA" == this.win[0].nodeName),
                    (this.forcescreen = !1),
                    (this.canshowonmouseevent = "scroll" != y.opt.autohidemode),
                    (this.page = this.view = this.onzoomout = this.onzoomin = this.onscrollcancel = this.onscrollend = this.onscrollstart = this.onclick = this.ongesturezoom = this.onkeypress = this.onmousewheel = this.onmousemove = this.onmouseup = this.onmousedown = !1),
                    (this.scroll = {x: 0, y: 0}),
                    (this.scrollratio = {x: 0, y: 0}),
                    (this.cursorheight = 20),
                    (this.scrollvaluemax = 0),
                    (this.isrtlmode = "auto" == this.opt.rtlmode ? "rtl" == (this.win[0] == window ? this.body : this.win).css("direction") : !0 === this.opt.rtlmode),
                    (this.observerbody = this.observerremover = this.observer = this.scrollmom = this.scrollrunning = !1);
                do {
                    this.id = "ascrail" + o++;
                } while (document.getElementById(this.id));
                (this.hasmousefocus = this.hasfocus = this.zoomactive = this.zoom = this.selectiondrag = this.cursorfreezed = this.cursor = this.rail = !1),
                    (this.visibility = !0),
                    (this.hidden = this.locked = this.railslocked = !1),
                    (this.cursoractive = !0),
                    (this.wheelprevented = !1),
                    (this.overflowx = y.opt.overflowx),
                    (this.overflowy = y.opt.overflowy),
                    (this.nativescrollingarea = !1),
                    (this.checkarea = 0),
                    (this.events = []),
                    (this.saved = {}),
                    (this.delaylist = {}),
                    (this.synclist = {}),
                    (this.lastdeltay = this.lastdeltax = 0),
                    (this.detected = f());
                var x = e.extend({}, this.detected);
                (this.ishwscroll = (this.canhwscroll = x.hastransform && y.opt.hwacceleration) && y.haswrapper),
                    (this.hasreversehr = this.isrtlmode && !x.iswebkit),
                    (this.istouchcapable = !1),
                !x.cantouch || x.isios || x.isandroid || (!x.iswebkit && !x.ismozilla) || ((this.istouchcapable = !0), (x.cantouch = !1)),
                y.opt.enablemouselockapi || ((x.hasmousecapture = !1), (x.haspointerlock = !1)),
                    (this.debounced = function (e, t, i) {
                        var n = y.delaylist[e];
                        (y.delaylist[e] = t),
                        n ||
                        setTimeout(function () {
                            var t = y.delaylist[e];
                            (y.delaylist[e] = !1), t.call(y);
                        }, i);
                    });
                var b = !1;
                (this.synched = function (e, t) {
                    return (
                        (y.synclist[e] = t),
                        b ||
                        (a(function () {
                            for (var e in ((b = !1), y.synclist)) {
                                var t = y.synclist[e];
                                t && t.call(y), (y.synclist[e] = !1);
                            }
                        }),
                            (b = !0)),
                            e
                    );
                }),
                    (this.unsynched = function (e) {
                        y.synclist[e] && (y.synclist[e] = !1);
                    }),
                    (this.css = function (e, t) {
                        for (var i in t) y.saved.css.push([e, i, e.css(i)]), e.css(i, t[i]);
                    }),
                    (this.scrollTop = function (e) {
                        return void 0 === e ? y.getScrollTop() : y.setScrollTop(e);
                    }),
                    (this.scrollLeft = function (e) {
                        return void 0 === e ? y.getScrollLeft() : y.setScrollLeft(e);
                    });
                var T = function (e, t, i, n, o, r, s) {
                    (this.st = e), (this.ed = t), (this.spd = i), (this.p1 = n || 0), (this.p2 = o || 1), (this.p3 = r || 0), (this.p4 = s || 1), (this.ts = new Date().getTime()), (this.df = this.ed - this.st);
                };
                if (
                    ((T.prototype = {
                        B2: function (e) {
                            return 3 * e * e * (1 - e);
                        },
                        B3: function (e) {
                            return 3 * e * (1 - e) * (1 - e);
                        },
                        B4: function (e) {
                            return (1 - e) * (1 - e) * (1 - e);
                        },
                        getNow: function () {
                            var e = 1 - (new Date().getTime() - this.ts) / this.spd,
                                t = this.B2(e) + this.B3(e) + this.B4(e);
                            return 0 > e ? this.ed : this.st + Math.round(this.df * t);
                        },
                        update: function (e, t) {
                            return (this.st = this.getNow()), (this.ed = e), (this.spd = t), (this.ts = new Date().getTime()), (this.df = this.ed - this.st), this;
                        },
                    }),
                        this.ishwscroll)
                ) {
                    (this.doc.translate = {x: 0, y: 0, tx: "0px", ty: "0px"}),
                    x.hastranslate3d && x.isios && this.doc.css("-webkit-backface-visibility", "hidden"),
                        (this.getScrollTop = function (e) {
                            if (!e) {
                                if ((e = u())) return 16 == e.length ? -e[13] : -e[5];
                                if (y.timerscroll && y.timerscroll.bz) return y.timerscroll.bz.getNow();
                            }
                            return y.doc.translate.y;
                        }),
                        (this.getScrollLeft = function (e) {
                            if (!e) {
                                if ((e = u())) return 16 == e.length ? -e[12] : -e[4];
                                if (y.timerscroll && y.timerscroll.bh) return y.timerscroll.bh.getNow();
                            }
                            return y.doc.translate.x;
                        }),
                        (this.notifyScrollEvent = function (e) {
                            var t = document.createEvent("UIEvents");
                            t.initUIEvent("scroll", !1, !0, window, 1), (t.niceevent = !0), e.dispatchEvent(t);
                        });
                    var S = this.isrtlmode ? 1 : -1;
                    x.hastranslate3d && y.opt.enabletranslate3d
                        ? ((this.setScrollTop = function (e, t) {
                            (y.doc.translate.y = e), (y.doc.translate.ty = -1 * e + "px"), y.doc.css(x.trstyle, "translate3d(" + y.doc.translate.tx + "," + y.doc.translate.ty + ",0px)"), t || y.notifyScrollEvent(y.win[0]);
                        }),
                            (this.setScrollLeft = function (e, t) {
                                (y.doc.translate.x = e), (y.doc.translate.tx = e * S + "px"), y.doc.css(x.trstyle, "translate3d(" + y.doc.translate.tx + "," + y.doc.translate.ty + ",0px)"), t || y.notifyScrollEvent(y.win[0]);
                            }))
                        : ((this.setScrollTop = function (e, t) {
                            (y.doc.translate.y = e), (y.doc.translate.ty = -1 * e + "px"), y.doc.css(x.trstyle, "translate(" + y.doc.translate.tx + "," + y.doc.translate.ty + ")"), t || y.notifyScrollEvent(y.win[0]);
                        }),
                            (this.setScrollLeft = function (e, t) {
                                (y.doc.translate.x = e), (y.doc.translate.tx = e * S + "px"), y.doc.css(x.trstyle, "translate(" + y.doc.translate.tx + "," + y.doc.translate.ty + ")"), t || y.notifyScrollEvent(y.win[0]);
                            }));
                } else
                    (this.getScrollTop = function () {
                        return y.docscroll.scrollTop();
                    }),
                        (this.setScrollTop = function (e) {
                            return y.docscroll.scrollTop(e);
                        }),
                        (this.getScrollLeft = function () {
                            return y.detected.ismozilla && y.isrtlmode ? Math.abs(y.docscroll.scrollLeft()) : y.docscroll.scrollLeft();
                        }),
                        (this.setScrollLeft = function (e) {
                            return y.docscroll.scrollLeft(y.detected.ismozilla && y.isrtlmode ? -e : e);
                        });
                (this.getTarget = function (e) {
                    return !!e && (e.target ? e.target : !!e.srcElement && e.srcElement);
                }),
                    (this.hasParent = function (e, t) {
                        if (!e) return !1;
                        for (var i = e.target || e.srcElement || e || !1; i && i.id != t;) i = i.parentNode || !1;
                        return !1 !== i;
                    });
                var C = {thin: 1, medium: 3, thick: 5};
                (this.getDocumentScrollOffset = function () {
                    return {
                        top: window.pageYOffset || document.documentElement.scrollTop,
                        left: window.pageXOffset || document.documentElement.scrollLeft
                    };
                }),
                    (this.getOffset = function () {
                        if (y.isfixed) {
                            var e = y.win.offset(),
                                t = y.getDocumentScrollOffset();
                            return (e.top -= t.top), (e.left -= t.left), e;
                        }
                        return (e = y.win.offset()), y.viewport ? ((t = y.viewport.offset()), {
                            top: e.top - t.top,
                            left: e.left - t.left
                        }) : e;
                    }),
                    (this.updateScrollBar = function (e) {
                        if (y.ishwscroll)
                            y.rail.css({height: y.win.innerHeight() - (y.opt.railpadding.top + y.opt.railpadding.bottom)}), y.railh && y.railh.css({width: y.win.innerWidth() - (y.opt.railpadding.left + y.opt.railpadding.right)});
                        else {
                            var t = y.getOffset(),
                                i = t.top,
                                n = t.left - (y.opt.railpadding.left + y.opt.railpadding.right),
                                o = ((i = i + h(y.win, "border-top-width", !0)), (n = n + (y.rail.align ? y.win.outerWidth() - h(y.win, "border-right-width") - y.rail.width : h(y.win, "border-left-width"))), y.opt.railoffset);
                            o && (o.top && (i += o.top), y.rail.align && o.left && (n += o.left)),
                            y.railslocked || y.rail.css({
                                top: i,
                                left: n,
                                height: (e ? e.h : y.win.innerHeight()) - (y.opt.railpadding.top + y.opt.railpadding.bottom)
                            }),
                            y.zoom && y.zoom.css({top: i + 1, left: 1 == y.rail.align ? n - 20 : n + y.rail.width + 4}),
                            y.railh &&
                            !y.railslocked &&
                            ((i = t.top),
                                (n = t.left),
                            (o = y.opt.railhoffset) && (o.top && (i += o.top), o.left && (n += o.left)),
                                (e = y.railh.align ? i + h(y.win, "border-top-width", !0) + y.win.innerHeight() - y.railh.height : i + h(y.win, "border-top-width", !0)),
                                (n += h(y.win, "border-left-width")),
                                y.railh.css({
                                    top: e - (y.opt.railpadding.top + y.opt.railpadding.bottom),
                                    left: n,
                                    width: y.railh.width
                                }));
                        }
                    }),
                    (this.doRailClick = function (e, t, i) {
                        var n;
                        y.railslocked ||
                        (y.cancelEvent(e),
                            t
                                ? (t = i ? y.doScrollLeft : y.doScrollTop)((n = i ? (e.pageX - y.railh.offset().left - y.cursorwidth / 2) * y.scrollratio.x : (e.pageY - y.rail.offset().top - y.cursorheight / 2) * y.scrollratio.y))
                                : ((t = i ? y.doScrollLeftBy : y.doScrollBy), (n = i ? y.scroll.x : y.scroll.y), (e = i ? e.pageX - y.railh.offset().left : e.pageY - y.rail.offset().top), (i = i ? y.view.w : y.view.h), t(n >= e ? i : -i)));
                    }),
                    (y.hasanimationframe = a),
                    (y.hascancelanimationframe = l),
                    y.hasanimationframe
                        ? y.hascancelanimationframe ||
                        (l = function () {
                            y.cancelAnimationFrame = !0;
                        })
                        : ((a = function (e) {
                            return setTimeout(e, 15 - (Math.floor(+new Date() / 1e3) % 16));
                        }),
                            (l = clearInterval)),
                    (this.init = function () {
                        if (((y.saved.css = []), x.isie7mobile || x.isoperamini)) return !0;
                        if (
                            (x.hasmstouch && y.css(y.ispage ? e("html") : y.win, {"-ms-touch-action": "none"}),
                                (y.zindex = "auto"),
                                (y.zindex =
                                    y.ispage || "auto" != y.opt.zindex
                                        ? y.opt.zindex
                                        : (function () {
                                        var e = y.win;
                                        if ("zIndex" in e) return e.zIndex();
                                        for (; 0 < e.length && 9 != e[0].nodeType;) {
                                            var t = e.css("zIndex");
                                            if (!isNaN(t) && 0 != t) return parseInt(t);
                                            e = e.parent();
                                        }
                                        return !1;
                                    })() || "auto"),
                            !y.ispage && "auto" != y.zindex && y.zindex > r && (r = y.zindex),
                            y.isie && 0 == y.zindex && "auto" == y.opt.zindex && (y.zindex = "auto"),
                            !y.ispage || (!x.cantouch && !x.isieold && !x.isie9mobile))
                        ) {
                            var o = y.docscroll;
                            y.ispage && (o = y.haswrapper ? y.win : y.doc),
                            x.isie9mobile || y.css(o, {"overflow-y": "hidden"}),
                            y.ispage && x.isie7 && ("BODY" == y.doc[0].nodeName ? y.css(e("html"), {"overflow-y": "hidden"}) : "HTML" == y.doc[0].nodeName && y.css(e("body"), {"overflow-y": "hidden"})),
                            !x.isios || y.ispage || y.haswrapper || y.css(e("body"), {"-webkit-overflow-scrolling": "touch"});
                            var s = e(document.createElement("div"));
                            s.css({
                                position: "relative",
                                top: 0,
                                float: "right",
                                width: y.opt.cursorwidth,
                                height: "0px",
                                "background-color": y.opt.cursorcolor,
                                border: y.opt.cursorborder,
                                "background-clip": "padding-box",
                                "-webkit-border-radius": y.opt.cursorborderradius,
                                "-moz-border-radius": y.opt.cursorborderradius,
                                "border-radius": y.opt.cursorborderradius,
                            }),
                                (s.hborder = parseFloat(s.outerHeight() - s.innerHeight())),
                                s.addClass("nicescroll-cursors"),
                                (y.cursor = s),
                                (v = e(document.createElement("div"))).attr("id", y.id),
                                v.addClass("nicescroll-rails nicescroll-rails-vr");
                            var a,
                                l,
                                c,
                                u,
                                p = ["left", "right", "top", "bottom"];
                            for (c in p) (l = p[c]), (a = y.opt.railpadding[l]) ? v.css("padding-" + l, a + "px") : (y.opt.railpadding[l] = 0);
                            if (
                                (v.append(s),
                                    (v.width = Math.max(parseFloat(y.opt.cursorwidth), s.outerWidth())),
                                    v.css({
                                        width: v.width + "px",
                                        zIndex: y.zindex,
                                        background: y.opt.background,
                                        cursor: "default"
                                    }),
                                    (v.visibility = !0),
                                    (v.scrollable = !0),
                                    (v.align = "left" == y.opt.railalign ? 0 : 1),
                                    (y.rail = v),
                                    (s = y.rail.drag = !1),
                                !y.opt.boxzoom ||
                                y.ispage ||
                                x.isieold ||
                                ((s = document.createElement("div")),
                                    y.bind(s, "click", y.doZoom),
                                    y.bind(s, "mouseenter", function () {
                                        y.zoom.css("opacity", y.opt.cursoropacitymax);
                                    }),
                                    y.bind(s, "mouseleave", function () {
                                        y.zoom.css("opacity", y.opt.cursoropacitymin);
                                    }),
                                    (y.zoom = e(s)),
                                    y.zoom.css({
                                        cursor: "pointer",
                                        "z-index": y.zindex,
                                        backgroundImage: "url(" + y.opt.scriptpath + "zoomico.png)",
                                        height: 18,
                                        width: 18,
                                        backgroundPosition: "0px 0px"
                                    }),
                                y.opt.dblclickzoom && y.bind(y.win, "dblclick", y.doZoom),
                                x.cantouch &&
                                y.opt.gesturezoom &&
                                ((y.ongesturezoom = function (e) {
                                    return 1.5 < e.scale && y.doZoomIn(e), 0.8 > e.scale && y.doZoomOut(e), y.cancelEvent(e);
                                }),
                                    y.bind(y.win, "gestureend", y.ongesturezoom))),
                                    (y.railh = !1),
                                y.opt.horizrailenabled &&
                                (y.css(o, {"overflow-x": "hidden"}),
                                    (s = e(document.createElement("div"))).css({
                                        position: "absolute",
                                        top: 0,
                                        height: y.opt.cursorwidth,
                                        width: "0px",
                                        "background-color": y.opt.cursorcolor,
                                        border: y.opt.cursorborder,
                                        "background-clip": "padding-box",
                                        "-webkit-border-radius": y.opt.cursorborderradius,
                                        "-moz-border-radius": y.opt.cursorborderradius,
                                        "border-radius": y.opt.cursorborderradius,
                                    }),
                                x.isieold && s.css({overflow: "hidden"}),
                                    (s.wborder = parseFloat(s.outerWidth() - s.innerWidth())),
                                    s.addClass("nicescroll-cursors"),
                                    (y.cursorh = s),
                                    (u = e(document.createElement("div"))).attr("id", y.id + "-hr"),
                                    u.addClass("nicescroll-rails nicescroll-rails-hr"),
                                    (u.height = Math.max(parseFloat(y.opt.cursorwidth), s.outerHeight())),
                                    u.css({height: u.height + "px", zIndex: y.zindex, background: y.opt.background}),
                                    u.append(s),
                                    (u.visibility = !0),
                                    (u.scrollable = !0),
                                    (u.align = "top" == y.opt.railvalign ? 0 : 1),
                                    (y.railh = u),
                                    (y.railh.drag = !1)),
                                    y.ispage
                                        ? (v.css({position: "fixed", top: "0px", height: "100%"}),
                                            v.align ? v.css({right: "0px"}) : v.css({left: "0px"}),
                                            y.body.append(v),
                                        y.railh && (u.css({
                                            position: "fixed",
                                            left: "0px",
                                            width: "100%"
                                        }), u.align ? u.css({bottom: "0px"}) : u.css({top: "0px"}), y.body.append(u)))
                                        : (y.ishwscroll
                                        ? ("static" == y.win.css("position") && y.css(y.win, {position: "relative"}),
                                            (o = "HTML" == y.win[0].nodeName ? y.body : y.win),
                                            e(o).scrollTop(0).scrollLeft(0),
                                        y.zoom && (y.zoom.css({
                                            position: "absolute",
                                            top: 1,
                                            right: 0,
                                            "margin-right": v.width + 4
                                        }), o.append(y.zoom)),
                                            v.css({position: "absolute", top: 0}),
                                            v.align ? v.css({right: 0}) : v.css({left: 0}),
                                            o.append(v),
                                        u && (u.css({
                                            position: "absolute",
                                            left: 0,
                                            bottom: 0
                                        }), u.align ? u.css({bottom: 0}) : u.css({top: 0}), o.append(u)))
                                        : ((y.isfixed = "fixed" == y.win.css("position")),
                                            (o = y.isfixed ? "fixed" : "absolute"),
                                        y.isfixed || (y.viewport = y.getViewport(y.win[0])),
                                        y.viewport && ((y.body = y.viewport), 0 == /fixed|absolute/.test(y.viewport.css("position")) && y.css(y.viewport, {position: "relative"})),
                                            v.css({position: o}),
                                        y.zoom && y.zoom.css({position: o}),
                                            y.updateScrollBar(),
                                            y.body.append(v),
                                        y.zoom && y.body.append(y.zoom),
                                        y.railh && (u.css({position: o}), y.body.append(u))),
                                        x.isios && y.css(y.win, {
                                            "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
                                            "-webkit-touch-callout": "none"
                                        }),
                                        x.isie && y.opt.disableoutline && y.win.attr("hideFocus", "true"),
                                        x.iswebkit && y.opt.disableoutline && y.win.css({outline: "none"})),
                                    !1 === y.opt.autohidemode
                                        ? ((y.autohidedom = !1), y.rail.css({opacity: y.opt.cursoropacitymax}), y.railh && y.railh.css({opacity: y.opt.cursoropacitymax}))
                                        : !0 === y.opt.autohidemode || "leave" === y.opt.autohidemode
                                        ? ((y.autohidedom = e().add(y.rail)),
                                        x.isie8 && (y.autohidedom = y.autohidedom.add(y.cursor)),
                                        y.railh && (y.autohidedom = y.autohidedom.add(y.railh)),
                                        y.railh && x.isie8 && (y.autohidedom = y.autohidedom.add(y.cursorh)))
                                        : "scroll" == y.opt.autohidemode
                                            ? ((y.autohidedom = e().add(y.rail)), y.railh && (y.autohidedom = y.autohidedom.add(y.railh)))
                                            : "cursor" == y.opt.autohidemode
                                                ? ((y.autohidedom = e().add(y.cursor)), y.railh && (y.autohidedom = y.autohidedom.add(y.cursorh)))
                                                : "hidden" == y.opt.autohidemode && ((y.autohidedom = !1), y.hide(), (y.railslocked = !1)),
                                    x.isie9mobile)
                            )
                                (y.scrollmom = new g(y)),
                                    (y.onmangotouch = function () {
                                        var e = y.getScrollTop(),
                                            t = y.getScrollLeft();
                                        if (e == y.scrollmom.lastscrolly && t == y.scrollmom.lastscrollx) return !0;
                                        var i = e - y.mangotouch.sy,
                                            n = t - y.mangotouch.sx;
                                        if (0 != Math.round(Math.sqrt(Math.pow(n, 2) + Math.pow(i, 2)))) {
                                            var o = 0 > i ? -1 : 1,
                                                r = 0 > n ? -1 : 1,
                                                s = +new Date();
                                            y.mangotouch.lazy && clearTimeout(y.mangotouch.lazy),
                                                80 < s - y.mangotouch.tm || y.mangotouch.dry != o || y.mangotouch.drx != r
                                                    ? (y.scrollmom.stop(),
                                                        y.scrollmom.reset(t, e),
                                                        (y.mangotouch.sy = e),
                                                        (y.mangotouch.ly = e),
                                                        (y.mangotouch.sx = t),
                                                        (y.mangotouch.lx = t),
                                                        (y.mangotouch.dry = o),
                                                        (y.mangotouch.drx = r),
                                                        (y.mangotouch.tm = s))
                                                    : (y.scrollmom.stop(),
                                                        y.scrollmom.update(y.mangotouch.sx - n, y.mangotouch.sy - i),
                                                        (y.mangotouch.tm = s),
                                                        (i = Math.max(Math.abs(y.mangotouch.ly - e), Math.abs(y.mangotouch.lx - t))),
                                                        (y.mangotouch.ly = e),
                                                        (y.mangotouch.lx = t),
                                                    2 < i &&
                                                    (y.mangotouch.lazy = setTimeout(function () {
                                                        (y.mangotouch.lazy = !1), (y.mangotouch.dry = 0), (y.mangotouch.drx = 0), (y.mangotouch.tm = 0), y.scrollmom.doMomentum(30);
                                                    }, 100)));
                                        }
                                    }),
                                    (v = y.getScrollTop()),
                                    (u = y.getScrollLeft()),
                                    (y.mangotouch = {sy: v, ly: v, dry: 0, sx: u, lx: u, drx: 0, lazy: !1, tm: 0}),
                                    y.bind(y.docscroll, "scroll", y.onmangotouch);
                            else {
                                if (x.cantouch || y.istouchcapable || y.opt.touchbehavior || x.hasmstouch) {
                                    (y.scrollmom = new g(y)),
                                        (y.ontouchstart = function (t) {
                                            if (t.pointerType && 2 != t.pointerType && "touch" != t.pointerType) return !1;
                                            if (((y.hasmoving = !1), !y.railslocked)) {
                                                var i;
                                                if (x.hasmstouch)
                                                    for (i = !!t.target && t.target; i;) {
                                                        if (0 < (n = e(i).getNiceScroll()).length && n[0].me == y.me) break;
                                                        if (0 < n.length) return !1;
                                                        if ("DIV" == i.nodeName && i.id == y.id) break;
                                                        i = !!i.parentNode && i.parentNode;
                                                    }
                                                if ((y.cancelScroll(), (i = y.getTarget(t)) && /INPUT/i.test(i.nodeName) && /range/i.test(i.type))) return y.stopPropagation(t);
                                                if (
                                                    (!("clientX" in t) && "changedTouches" in t && ((t.clientX = t.changedTouches[0].clientX), (t.clientY = t.changedTouches[0].clientY)),
                                                    y.forcescreen && ((n = t), ((t = {original: t.original ? t.original : t}).clientX = n.screenX), (t.clientY = n.screenY)),
                                                        (y.rail.drag = {
                                                            x: t.clientX,
                                                            y: t.clientY,
                                                            sx: y.scroll.x,
                                                            sy: y.scroll.y,
                                                            st: y.getScrollTop(),
                                                            sl: y.getScrollLeft(),
                                                            pt: 2,
                                                            dl: !1
                                                        }),
                                                    y.ispage || !y.opt.directionlockdeadzone)
                                                )
                                                    y.rail.drag.dl = "f";
                                                else {
                                                    var n = e(window).width(),
                                                        o = e(window).height(),
                                                        r = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                                                        s = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                                                    (o = Math.max(0, s - o)), (n = Math.max(0, r - n));
                                                    (y.rail.drag.ck = !y.rail.scrollable && y.railh.scrollable ? 0 < o && "v" : !(!y.rail.scrollable || y.railh.scrollable) && 0 < n && "h"), y.rail.drag.ck || (y.rail.drag.dl = "f");
                                                }
                                                if (
                                                    (y.opt.touchbehavior && y.isiframe && x.isie && ((n = y.win.position()), (y.rail.drag.x += n.left), (y.rail.drag.y += n.top)),
                                                        (y.hasmoving = !1),
                                                        (y.lastmouseup = !1),
                                                        y.scrollmom.reset(t.clientX, t.clientY),
                                                    !x.cantouch && !this.istouchcapable && !t.pointerType)
                                                ) {
                                                    if (!i || !/INPUT|SELECT|TEXTAREA/i.test(i.nodeName))
                                                        return (
                                                            !y.ispage && x.hasmousecapture && i.setCapture(),
                                                                y.opt.touchbehavior
                                                                    ? (i.onclick &&
                                                                    !i._onclick &&
                                                                    ((i._onclick = i.onclick),
                                                                        (i.onclick = function (e) {
                                                                            return !y.hasmoving && void i._onclick.call(this, e);
                                                                        })),
                                                                        y.cancelEvent(t))
                                                                    : y.stopPropagation(t)
                                                        );
                                                    /SUBMIT|CANCEL|BUTTON/i.test(e(i).attr("type")) && ((pc = {
                                                        tg: i,
                                                        click: !1
                                                    }), (y.preventclick = pc));
                                                }
                                            }
                                        }),
                                        (y.ontouchend = function (e) {
                                            if (!y.rail.drag) return !0;
                                            if (2 == y.rail.drag.pt) {
                                                if (e.pointerType && 2 != e.pointerType && "touch" != e.pointerType) return !1;
                                                if ((y.scrollmom.doMomentum(), (y.rail.drag = !1), y.hasmoving && ((y.lastmouseup = !0), y.hideCursor(), x.hasmousecapture && document.releaseCapture(), !x.cantouch))) return y.cancelEvent(e);
                                            } else if (1 == y.rail.drag.pt) return y.onmouseup(e);
                                        });
                                    var h = y.opt.touchbehavior && y.isiframe && !x.hasmousecapture;
                                    y.ontouchmove = function (t, i) {
                                        if (!y.rail.drag || (t.targetTouches && y.opt.preventmultitouchscrolling && 1 < t.targetTouches.length) || (t.pointerType && 2 != t.pointerType && "touch" != t.pointerType)) return !1;
                                        if (2 == y.rail.drag.pt) {
                                            if (x.cantouch && x.isios && void 0 === t.original) return !0;
                                            if (
                                                ((y.hasmoving = !0),
                                                y.preventclick && !y.preventclick.click && ((y.preventclick.click = y.preventclick.tg.onclick || !1), (y.preventclick.tg.onclick = y.onpreventclick)),
                                                "changedTouches" in (t = e.extend({original: t}, t)) && ((t.clientX = t.changedTouches[0].clientX), (t.clientY = t.changedTouches[0].clientY)),
                                                    y.forcescreen)
                                            ) {
                                                var n = t;
                                                ((t = {original: t.original ? t.original : t}).clientX = n.screenX), (t.clientY = n.screenY);
                                            }
                                            var o;
                                            n = o = 0;
                                            h && !i && ((n = -(o = y.win.position()).left), (o = -o.top));
                                            var r = t.clientY + o;
                                            o = r - y.rail.drag.y;
                                            var s,
                                                a = t.clientX + n,
                                                l = a - y.rail.drag.x,
                                                c = y.rail.drag.st - o;
                                            if (
                                                (y.ishwscroll && y.opt.bouncescroll
                                                    ? 0 > c
                                                        ? (c = Math.round(c / 2))
                                                        : c > y.page.maxh && (c = y.page.maxh + Math.round((c - y.page.maxh) / 2))
                                                    : (0 > c && (r = c = 0), c > y.page.maxh && ((c = y.page.maxh), (r = 0))),
                                                y.railh &&
                                                y.railh.scrollable &&
                                                ((s = y.isrtlmode ? l - y.rail.drag.sl : y.rail.drag.sl - l),
                                                    y.ishwscroll && y.opt.bouncescroll
                                                        ? 0 > s
                                                        ? (s = Math.round(s / 2))
                                                        : s > y.page.maxw && (s = y.page.maxw + Math.round((s - y.page.maxw) / 2))
                                                        : (0 > s && (a = s = 0), s > y.page.maxw && ((s = y.page.maxw), (a = 0)))),
                                                    (n = !1),
                                                    y.rail.drag.dl)
                                            )
                                                (n = !0), "v" == y.rail.drag.dl ? (s = y.rail.drag.sl) : "h" == y.rail.drag.dl && (c = y.rail.drag.st);
                                            else {
                                                o = Math.abs(o);
                                                l = Math.abs(l);
                                                var u = y.opt.directionlockdeadzone;
                                                if ("v" == y.rail.drag.ck) {
                                                    if (o > u && l <= 0.3 * o) return (y.rail.drag = !1), !0;
                                                    l > u && ((y.rail.drag.dl = "f"), e("body").scrollTop(e("body").scrollTop()));
                                                } else if ("h" == y.rail.drag.ck) {
                                                    if (l > u && o <= 0.3 * l) return (y.rail.drag = !1), !0;
                                                    o > u && ((y.rail.drag.dl = "f"), e("body").scrollLeft(e("body").scrollLeft()));
                                                }
                                            }
                                            if (
                                                (y.synched("touchmove", function () {
                                                    y.rail.drag &&
                                                    2 == y.rail.drag.pt &&
                                                    (y.prepareTransition && y.prepareTransition(0),
                                                    y.rail.scrollable && y.setScrollTop(c),
                                                        y.scrollmom.update(a, r),
                                                        y.railh && y.railh.scrollable ? (y.setScrollLeft(s), y.showCursor(c, s)) : y.showCursor(c),
                                                    x.isie10 && document.selection.clear());
                                                }),
                                                x.ischrome && y.istouchcapable && (n = !1),
                                                    n)
                                            )
                                                return y.cancelEvent(t);
                                        } else if (1 == y.rail.drag.pt) return y.onmousemove(t);
                                    };
                                }
                                if (
                                    ((y.onmousedown = function (e, t) {
                                        if (!y.rail.drag || 1 == y.rail.drag.pt) {
                                            if (y.railslocked) return y.cancelEvent(e);
                                            y.cancelScroll(), (y.rail.drag = {
                                                x: e.clientX,
                                                y: e.clientY,
                                                sx: y.scroll.x,
                                                sy: y.scroll.y,
                                                pt: 1,
                                                hr: !!t
                                            });
                                            var i = y.getTarget(e);
                                            return (
                                                !y.ispage && x.hasmousecapture && i.setCapture(),
                                                y.isiframe && !x.hasmousecapture && ((y.saved.csspointerevents = y.doc.css("pointer-events")), y.css(y.doc, {"pointer-events": "none"})),
                                                    (y.hasmoving = !1),
                                                    y.cancelEvent(e)
                                            );
                                        }
                                    }),
                                        (y.onmouseup = function (e) {
                                            if (y.rail.drag)
                                                return (
                                                    1 != y.rail.drag.pt ||
                                                    (x.hasmousecapture && document.releaseCapture(),
                                                    y.isiframe && !x.hasmousecapture && y.doc.css("pointer-events", y.saved.csspointerevents),
                                                        (y.rail.drag = !1),
                                                    y.hasmoving && y.triggerScrollEnd(),
                                                        y.cancelEvent(e))
                                                );
                                        }),
                                        (y.onmousemove = function (e) {
                                            if (y.rail.drag && 1 == y.rail.drag.pt) {
                                                if (x.ischrome && 0 == e.which) return y.onmouseup(e);
                                                if (((y.cursorfreezed = !0), (y.hasmoving = !0), y.rail.drag.hr)) {
                                                    (y.scroll.x = y.rail.drag.sx + (e.clientX - y.rail.drag.x)), 0 > y.scroll.x && (y.scroll.x = 0);
                                                    var t = y.scrollvaluemaxw;
                                                    y.scroll.x > t && (y.scroll.x = t);
                                                } else (y.scroll.y = y.rail.drag.sy + (e.clientY - y.rail.drag.y)), 0 > y.scroll.y && (y.scroll.y = 0), (t = y.scrollvaluemax), y.scroll.y > t && (y.scroll.y = t);
                                                return (
                                                    y.synched("mousemove", function () {
                                                        y.rail.drag &&
                                                        1 == y.rail.drag.pt &&
                                                        (y.showCursor(),
                                                            y.rail.drag.hr
                                                                ? y.hasreversehr
                                                                ? y.doScrollLeft(y.scrollvaluemaxw - Math.round(y.scroll.x * y.scrollratio.x), y.opt.cursordragspeed)
                                                                : y.doScrollLeft(Math.round(y.scroll.x * y.scrollratio.x), y.opt.cursordragspeed)
                                                                : y.doScrollTop(Math.round(y.scroll.y * y.scrollratio.y), y.opt.cursordragspeed));
                                                    }),
                                                        y.cancelEvent(e)
                                                );
                                            }
                                        }),
                                    x.cantouch || y.opt.touchbehavior)
                                )
                                    (y.onpreventclick = function (e) {
                                        if (y.preventclick) return (y.preventclick.tg.onclick = y.preventclick.click), (y.preventclick = !1), y.cancelEvent(e);
                                    }),
                                        y.bind(y.win, "mousedown", y.ontouchstart),
                                        (y.onclick =
                                            !x.isios &&
                                            function (e) {
                                                return !y.lastmouseup || ((y.lastmouseup = !1), y.cancelEvent(e));
                                            }),
                                    y.opt.grabcursorenabled && x.cursorgrabvalue && (y.css(y.ispage ? y.doc : y.win, {cursor: x.cursorgrabvalue}), y.css(y.rail, {cursor: x.cursorgrabvalue}));
                                else {
                                    var f = function (e) {
                                        if (y.selectiondrag) {
                                            if (e) {
                                                var t = y.win.outerHeight();
                                                0 < (e = e.pageY - y.selectiondrag.top) && e < t && (e = 0), e >= t && (e -= t), (y.selectiondrag.df = e);
                                            }
                                            0 != y.selectiondrag.df &&
                                            (y.doScrollBy(2 * -Math.floor(y.selectiondrag.df / 6)),
                                                y.debounced(
                                                    "doselectionscroll",
                                                    function () {
                                                        f();
                                                    },
                                                    50
                                                ));
                                        }
                                    };
                                    (y.hasTextSelected =
                                        "getSelection" in document
                                            ? function () {
                                                return 0 < document.getSelection().rangeCount;
                                            }
                                            : "selection" in document
                                            ? function () {
                                                return "None" != document.selection.type;
                                            }
                                            : function () {
                                                return !1;
                                            }),
                                        (y.onselectionstart = function (e) {
                                            y.ispage || (y.selectiondrag = y.win.offset());
                                        }),
                                        (y.onselectionend = function (e) {
                                            y.selectiondrag = !1;
                                        }),
                                        (y.onselectiondrag = function (e) {
                                            y.selectiondrag &&
                                            y.hasTextSelected() &&
                                            y.debounced(
                                                "selectionscroll",
                                                function () {
                                                    f(e);
                                                },
                                                250
                                            );
                                        });
                                }
                                x.hasw3ctouch
                                    ? (y.css(y.rail, {"touch-action": "none"}),
                                        y.css(y.cursor, {"touch-action": "none"}),
                                        y.bind(y.win, "pointerdown", y.ontouchstart),
                                        y.bind(document, "pointerup", y.ontouchend),
                                        y.bind(document, "pointermove", y.ontouchmove))
                                    : x.hasmstouch
                                    ? (y.css(y.rail, {"-ms-touch-action": "none"}),
                                        y.css(y.cursor, {"-ms-touch-action": "none"}),
                                        y.bind(y.win, "MSPointerDown", y.ontouchstart),
                                        y.bind(document, "MSPointerUp", y.ontouchend),
                                        y.bind(document, "MSPointerMove", y.ontouchmove),
                                        y.bind(y.cursor, "MSGestureHold", function (e) {
                                            e.preventDefault();
                                        }),
                                        y.bind(y.cursor, "contextmenu", function (e) {
                                            e.preventDefault();
                                        }))
                                    : this.istouchcapable &&
                                    (y.bind(y.win, "touchstart", y.ontouchstart), y.bind(document, "touchend", y.ontouchend), y.bind(document, "touchcancel", y.ontouchend), y.bind(document, "touchmove", y.ontouchmove)),
                                (y.opt.cursordragontouch || (!x.cantouch && !y.opt.touchbehavior)) &&
                                (y.rail.css({cursor: "default"}),
                                y.railh && y.railh.css({cursor: "default"}),
                                    y.jqbind(y.rail, "mouseenter", function () {
                                        return !(!y.ispage && !y.win.is(":visible")) && (y.canshowonmouseevent && y.showCursor(), void (y.rail.active = !0));
                                    }),
                                    y.jqbind(y.rail, "mouseleave", function () {
                                        (y.rail.active = !1), y.rail.drag || y.hideCursor();
                                    }),
                                y.opt.sensitiverail &&
                                (y.bind(y.rail, "click", function (e) {
                                    y.doRailClick(e, !1, !1);
                                }),
                                    y.bind(y.rail, "dblclick", function (e) {
                                        y.doRailClick(e, !0, !1);
                                    }),
                                    y.bind(y.cursor, "click", function (e) {
                                        y.cancelEvent(e);
                                    }),
                                    y.bind(y.cursor, "dblclick", function (e) {
                                        y.cancelEvent(e);
                                    })),
                                y.railh &&
                                (y.jqbind(y.railh, "mouseenter", function () {
                                    return !(!y.ispage && !y.win.is(":visible")) && (y.canshowonmouseevent && y.showCursor(), void (y.rail.active = !0));
                                }),
                                    y.jqbind(y.railh, "mouseleave", function () {
                                        (y.rail.active = !1), y.rail.drag || y.hideCursor();
                                    }),
                                y.opt.sensitiverail &&
                                (y.bind(y.railh, "click", function (e) {
                                    y.doRailClick(e, !1, !0);
                                }),
                                    y.bind(y.railh, "dblclick", function (e) {
                                        y.doRailClick(e, !0, !0);
                                    }),
                                    y.bind(y.cursorh, "click", function (e) {
                                        y.cancelEvent(e);
                                    }),
                                    y.bind(y.cursorh, "dblclick", function (e) {
                                        y.cancelEvent(e);
                                    })))),
                                    x.cantouch || y.opt.touchbehavior
                                        ? (y.bind(x.hasmousecapture ? y.win : document, "mouseup", y.ontouchend),
                                            y.bind(document, "mousemove", y.ontouchmove),
                                        y.onclick && y.bind(document, "click", y.onclick),
                                        y.opt.cursordragontouch &&
                                        (y.bind(y.cursor, "mousedown", y.onmousedown),
                                            y.bind(y.cursor, "mouseup", y.onmouseup),
                                        y.cursorh &&
                                        y.bind(y.cursorh, "mousedown", function (e) {
                                            y.onmousedown(e, !0);
                                        }),
                                        y.cursorh && y.bind(y.cursorh, "mouseup", y.onmouseup)))
                                        : (y.bind(x.hasmousecapture ? y.win : document, "mouseup", y.onmouseup),
                                            y.bind(document, "mousemove", y.onmousemove),
                                        y.onclick && y.bind(document, "click", y.onclick),
                                            y.bind(y.cursor, "mousedown", y.onmousedown),
                                            y.bind(y.cursor, "mouseup", y.onmouseup),
                                        y.railh &&
                                        (y.bind(y.cursorh, "mousedown", function (e) {
                                            y.onmousedown(e, !0);
                                        }),
                                            y.bind(y.cursorh, "mouseup", y.onmouseup)),
                                        !y.ispage &&
                                        y.opt.enablescrollonselection &&
                                        (y.bind(y.win[0], "mousedown", y.onselectionstart),
                                            y.bind(document, "mouseup", y.onselectionend),
                                            y.bind(y.cursor, "mouseup", y.onselectionend),
                                        y.cursorh && y.bind(y.cursorh, "mouseup", y.onselectionend),
                                            y.bind(document, "mousemove", y.onselectiondrag)),
                                        y.zoom &&
                                        (y.jqbind(y.zoom, "mouseenter", function () {
                                            y.canshowonmouseevent && y.showCursor(), (y.rail.active = !0);
                                        }),
                                            y.jqbind(y.zoom, "mouseleave", function () {
                                                (y.rail.active = !1), y.rail.drag || y.hideCursor();
                                            }))),
                                y.opt.enablemousewheel &&
                                (y.isiframe || y.bind(x.isie && y.ispage ? document : y.win, "mousewheel", y.onmousewheel), y.bind(y.rail, "mousewheel", y.onmousewheel), y.railh && y.bind(y.railh, "mousewheel", y.onmousewheelhr)),
                                y.ispage ||
                                x.cantouch ||
                                /HTML|^BODY/.test(y.win[0].nodeName) ||
                                (y.win.attr("tabindex") || y.win.attr({tabindex: n++}),
                                    y.jqbind(y.win, "focus", function (e) {
                                        (t = y.getTarget(e).id || !0), (y.hasfocus = !0), y.canshowonmouseevent && y.noticeCursor();
                                    }),
                                    y.jqbind(y.win, "blur", function (e) {
                                        (t = !1), (y.hasfocus = !1);
                                    }),
                                    y.jqbind(y.win, "mouseenter", function (e) {
                                        (i = y.getTarget(e).id || !0), (y.hasmousefocus = !0), y.canshowonmouseevent && y.noticeCursor();
                                    }),
                                    y.jqbind(y.win, "mouseleave", function () {
                                        (i = !1), (y.hasmousefocus = !1), y.rail.drag || y.hideCursor();
                                    }));
                            }
                            if (
                                ((y.onkeypress = function (n) {
                                    if (y.railslocked && 0 == y.page.maxh) return !0;
                                    n = n || window.e;
                                    var o = y.getTarget(n);
                                    if ((o && /INPUT|TEXTAREA|SELECT|OPTION/.test(o.nodeName) && ((!o.getAttribute("type") && !o.type) || !/submit|button|cancel/i.tp)) || e(o).attr("contenteditable")) return !0;
                                    if (y.hasfocus || (y.hasmousefocus && !t) || (y.ispage && !t && !i)) {
                                        if (((o = n.keyCode), y.railslocked && 27 != o)) return y.cancelEvent(n);
                                        var r = n.ctrlKey || !1,
                                            s = n.shiftKey || !1,
                                            a = !1;
                                        switch (o) {
                                            case 38:
                                            case 63233:
                                                y.doScrollBy(72), (a = !0);
                                                break;
                                            case 40:
                                            case 63235:
                                                y.doScrollBy(-72), (a = !0);
                                                break;
                                            case 37:
                                            case 63232:
                                                y.railh && (r ? y.doScrollLeft(0) : y.doScrollLeftBy(72), (a = !0));
                                                break;
                                            case 39:
                                            case 63234:
                                                y.railh && (r ? y.doScrollLeft(y.page.maxw) : y.doScrollLeftBy(-72), (a = !0));
                                                break;
                                            case 33:
                                            case 63276:
                                                y.doScrollBy(y.view.h), (a = !0);
                                                break;
                                            case 34:
                                            case 63277:
                                                y.doScrollBy(-y.view.h), (a = !0);
                                                break;
                                            case 36:
                                            case 63273:
                                                y.railh && r ? y.doScrollPos(0, 0) : y.doScrollTo(0), (a = !0);
                                                break;
                                            case 35:
                                            case 63275:
                                                y.railh && r ? y.doScrollPos(y.page.maxw, y.page.maxh) : y.doScrollTo(y.page.maxh), (a = !0);
                                                break;
                                            case 32:
                                                y.opt.spacebarenabled && (s ? y.doScrollBy(y.view.h) : y.doScrollBy(-y.view.h), (a = !0));
                                                break;
                                            case 27:
                                                y.zoomactive && (y.doZoom(), (a = !0));
                                        }
                                        if (a) return y.cancelEvent(n);
                                    }
                                }),
                                y.opt.enablekeyboard && y.bind(document, x.isopera && !x.isopera12 ? "keypress" : "keydown", y.onkeypress),
                                    y.bind(document, "keydown", function (e) {
                                        e.ctrlKey && (y.wheelprevented = !0);
                                    }),
                                    y.bind(document, "keyup", function (e) {
                                        e.ctrlKey || (y.wheelprevented = !1);
                                    }),
                                    y.bind(window, "blur", function (e) {
                                        y.wheelprevented = !1;
                                    }),
                                    y.bind(window, "resize", y.lazyResize),
                                    y.bind(window, "orientationchange", y.lazyResize),
                                    y.bind(window, "load", y.lazyResize),
                                x.ischrome && !y.ispage && !y.haswrapper)
                            ) {
                                var m = y.win.attr("style"),
                                    v = parseFloat(y.win.css("width")) + 1;
                                y.win.css("width", v),
                                    y.synched("chromefix", function () {
                                        y.win.attr("style", m);
                                    });
                            }
                            (y.onAttributeChange = function (e) {
                                y.lazyResize(y.isieold ? 250 : 30);
                            }),
                            !1 !== d &&
                            ((y.observerbody = new d(function (t) {
                                if (
                                    (t.forEach(function (t) {
                                        if ("attributes" == t.type) return e("body").hasClass("modal-open") ? y.hide() : y.show();
                                    }),
                                    document.body.scrollHeight != y.page.maxh)
                                )
                                    return y.lazyResize(30);
                            })),
                                y.observerbody.observe(document.body, {
                                    childList: !0,
                                    subtree: !0,
                                    characterData: !1,
                                    attributes: !0,
                                    attributeFilter: ["class"]
                                })),
                            y.ispage ||
                            y.haswrapper ||
                            (!1 !== d
                                ? ((y.observer = new d(function (e) {
                                    e.forEach(y.onAttributeChange);
                                })),
                                    y.observer.observe(y.win[0], {
                                        childList: !0,
                                        characterData: !1,
                                        attributes: !0,
                                        subtree: !1
                                    }),
                                    (y.observerremover = new d(function (e) {
                                        e.forEach(function (e) {
                                            if (0 < e.removedNodes.length) for (var t in e.removedNodes) if (y && e.removedNodes[t] == y.win[0]) return y.remove();
                                        });
                                    })),
                                    y.observerremover.observe(y.win[0].parentNode, {
                                        childList: !0,
                                        characterData: !1,
                                        attributes: !1,
                                        subtree: !1
                                    }))
                                : (y.bind(y.win, x.isie && !x.isie9 ? "propertychange" : "DOMAttrModified", y.onAttributeChange),
                                x.isie9 && y.win[0].attachEvent("onpropertychange", y.onAttributeChange),
                                    y.bind(y.win, "DOMNodeRemoved", function (e) {
                                        e.target == y.win[0] && y.remove();
                                    }))),
                            !y.ispage && y.opt.boxzoom && y.bind(window, "resize", y.resizeZoom),
                            y.istextarea && y.bind(y.win, "mouseup", y.lazyResize),
                                y.lazyResize(30);
                        }
                        if ("IFRAME" == this.doc[0].nodeName) {
                            var w = function () {
                                var t;
                                y.iframexd = !1;
                                try {
                                    t = "contentDocument" in this ? this.contentDocument : this.contentWindow.document;
                                } catch (e) {
                                    (y.iframexd = !0), (t = !1);
                                }
                                if (y.iframexd) return "console" in window && console.log("NiceScroll error: policy restriced iframe"), !0;
                                if (
                                    ((y.forcescreen = !0),
                                    y.isiframe &&
                                    ((y.iframe = {
                                        doc: e(t),
                                        html: y.doc.contents().find("html")[0],
                                        body: y.doc.contents().find("body")[0]
                                    }),
                                        (y.getContentSize = function () {
                                            return {
                                                w: Math.max(y.iframe.html.scrollWidth, y.iframe.body.scrollWidth),
                                                h: Math.max(y.iframe.html.scrollHeight, y.iframe.body.scrollHeight)
                                            };
                                        }),
                                        (y.docscroll = e(y.iframe.body))),
                                    !x.isios && y.opt.iframeautoresize && !y.isiframe)
                                ) {
                                    y.win.scrollTop(0), y.doc.height("");
                                    var i = Math.max(t.getElementsByTagName("html")[0].scrollHeight, t.body.scrollHeight);
                                    y.doc.height(i);
                                }
                                y.lazyResize(30),
                                x.isie7 && y.css(e(y.iframe.html), {"overflow-y": "hidden"}),
                                    y.css(e(y.iframe.body), {"overflow-y": "hidden"}),
                                x.isios && y.haswrapper && y.css(e(t.body), {"-webkit-transform": "translate3d(0,0,0)"}),
                                    "contentWindow" in this ? y.bind(this.contentWindow, "scroll", y.onscroll) : y.bind(t, "scroll", y.onscroll),
                                y.opt.enablemousewheel && y.bind(t, "mousewheel", y.onmousewheel),
                                y.opt.enablekeyboard && y.bind(t, x.isopera ? "keypress" : "keydown", y.onkeypress),
                                (x.cantouch || y.opt.touchbehavior) &&
                                (y.bind(t, "mousedown", y.ontouchstart),
                                    y.bind(t, "mousemove", function (e) {
                                        return y.ontouchmove(e, !0);
                                    }),
                                y.opt.grabcursorenabled && x.cursorgrabvalue && y.css(e(t.body), {cursor: x.cursorgrabvalue})),
                                    y.bind(t, "mouseup", y.ontouchend),
                                y.zoom && (y.opt.dblclickzoom && y.bind(t, "dblclick", y.doZoom), y.ongesturezoom && y.bind(t, "gestureend", y.ongesturezoom));
                            };
                            this.doc[0].readyState &&
                            "complete" == this.doc[0].readyState &&
                            setTimeout(function () {
                                w.call(y.doc[0], !1);
                            }, 500),
                                y.bind(this.doc, "load", w);
                        }
                    }),
                    (this.showCursor = function (e, t) {
                        if ((y.cursortimeout && (clearTimeout(y.cursortimeout), (y.cursortimeout = 0)), y.rail)) {
                            if (
                                (y.autohidedom && (y.autohidedom.stop().css({opacity: y.opt.cursoropacitymax}), (y.cursoractive = !0)),
                                (y.rail.drag && 1 == y.rail.drag.pt) || (void 0 !== e && !1 !== e && (y.scroll.y = Math.round((1 * e) / y.scrollratio.y)), void 0 !== t && (y.scroll.x = Math.round((1 * t) / y.scrollratio.x))),
                                    y.cursor.css({height: y.cursorheight, top: y.scroll.y}),
                                    y.cursorh)
                            ) {
                                var i = y.hasreversehr ? y.scrollvaluemaxw - y.scroll.x : y.scroll.x;
                                !y.rail.align && y.rail.visibility ? y.cursorh.css({
                                    width: y.cursorwidth,
                                    left: i + y.rail.width
                                }) : y.cursorh.css({width: y.cursorwidth, left: i}), (y.cursoractive = !0);
                            }
                            y.zoom && y.zoom.stop().css({opacity: y.opt.cursoropacitymax});
                        }
                    }),
                    (this.hideCursor = function (e) {
                        y.cursortimeout ||
                        !y.rail ||
                        !y.autohidedom ||
                        (y.hasmousefocus && "leave" == y.opt.autohidemode) ||
                        (y.cursortimeout = setTimeout(function () {
                            (y.rail.active && y.showonmouseevent) || (y.autohidedom.stop().animate({opacity: y.opt.cursoropacitymin}), y.zoom && y.zoom.stop().animate({opacity: y.opt.cursoropacitymin}), (y.cursoractive = !1)),
                                (y.cursortimeout = 0);
                        }, e || y.opt.hidecursordelay));
                    }),
                    (this.noticeCursor = function (e, t, i) {
                        y.showCursor(t, i), y.rail.active || y.hideCursor(e);
                    }),
                    (this.getContentSize = y.ispage
                        ? function () {
                            return {
                                w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                                h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                            };
                        }
                        : y.haswrapper
                            ? function () {
                                return {
                                    w: y.doc.outerWidth() + parseInt(y.win.css("paddingLeft")) + parseInt(y.win.css("paddingRight")),
                                    h: y.doc.outerHeight() + parseInt(y.win.css("paddingTop")) + parseInt(y.win.css("paddingBottom"))
                                };
                            }
                            : function () {
                                return {w: y.docscroll[0].scrollWidth, h: y.docscroll[0].scrollHeight};
                            }),
                    (this.onResize = function (e, t) {
                        if (!y || !y.win) return !1;
                        if (!y.haswrapper && !y.ispage) {
                            if ("none" == y.win.css("display")) return y.visibility && y.hideRail().hideRailHr(), !1;
                            y.hidden || y.visibility || y.showRail().showRailHr();
                        }
                        var i = y.page.maxh,
                            n = y.page.maxw,
                            o = y.view.h,
                            r = y.view.w;
                        if (
                            ((y.view = {
                                w: y.ispage ? y.win.width() : parseInt(y.win[0].clientWidth),
                                h: y.ispage ? y.win.height() : parseInt(y.win[0].clientHeight)
                            }),
                                (y.page = t || y.getContentSize()),
                                (y.page.maxh = Math.max(0, y.page.h - y.view.h)),
                                (y.page.maxw = Math.max(0, y.page.w - y.view.w)),
                            y.page.maxh == i && y.page.maxw == n && y.view.w == r && y.view.h == o)
                        ) {
                            if (y.ispage) return y;
                            if (((i = y.win.offset()), y.lastposition && (n = y.lastposition).top == i.top && n.left == i.left)) return y;
                            y.lastposition = i;
                        }
                        return (
                            0 == y.page.maxh
                                ? (y.hideRail(), (y.scrollvaluemax = 0), (y.scroll.y = 0), (y.scrollratio.y = 0), (y.cursorheight = 0), y.setScrollTop(0), (y.rail.scrollable = !1))
                                : ((y.page.maxh -= y.opt.railpadding.top + y.opt.railpadding.bottom), (y.rail.scrollable = !0)),
                                0 == y.page.maxw
                                    ? (y.hideRailHr(), (y.scrollvaluemaxw = 0), (y.scroll.x = 0), (y.scrollratio.x = 0), (y.cursorwidth = 0), y.setScrollLeft(0), (y.railh.scrollable = !1))
                                    : ((y.page.maxw -= y.opt.railpadding.left + y.opt.railpadding.right), (y.railh.scrollable = !0)),
                                (y.railslocked = y.locked || (0 == y.page.maxh && 0 == y.page.maxw)),
                                y.railslocked
                                    ? (y.ispage || y.updateScrollBar(y.view), !1)
                                    : (y.hidden || y.visibility ? y.hidden || y.railh.visibility || y.showRailHr() : y.showRail().showRailHr(),
                                    y.istextarea && y.win.css("resize") && "none" != y.win.css("resize") && (y.view.h -= 20),
                                        (y.cursorheight = Math.min(y.view.h, Math.round((y.view.h / y.page.h) * y.view.h))),
                                        (y.cursorheight = y.opt.cursorfixedheight ? y.opt.cursorfixedheight : Math.max(y.opt.cursorminheight, y.cursorheight)),
                                        (y.cursorwidth = Math.min(y.view.w, Math.round((y.view.w / y.page.w) * y.view.w))),
                                        (y.cursorwidth = y.opt.cursorfixedheight ? y.opt.cursorfixedheight : Math.max(y.opt.cursorminheight, y.cursorwidth)),
                                        (y.scrollvaluemax = y.view.h - y.cursorheight - y.cursor.hborder - (y.opt.railpadding.top + y.opt.railpadding.bottom)),
                                    y.railh &&
                                    ((y.railh.width = 0 < y.page.maxh ? y.view.w - y.rail.width : y.view.w), (y.scrollvaluemaxw = y.railh.width - y.cursorwidth - y.cursorh.wborder - (y.opt.railpadding.left + y.opt.railpadding.right))),
                                    y.ispage || y.updateScrollBar(y.view),
                                        (y.scrollratio = {
                                            x: y.page.maxw / y.scrollvaluemaxw,
                                            y: y.page.maxh / y.scrollvaluemax
                                        }),
                                        y.getScrollTop() > y.page.maxh
                                            ? y.doScrollTop(y.page.maxh)
                                            : ((y.scroll.y = Math.round(y.getScrollTop() * (1 / y.scrollratio.y))), (y.scroll.x = Math.round(y.getScrollLeft() * (1 / y.scrollratio.x))), y.cursoractive && y.noticeCursor()),
                                    y.scroll.y && 0 == y.getScrollTop() && y.doScrollTo(Math.floor(y.scroll.y * y.scrollratio.y)),
                                        y)
                        );
                    }),
                    (this.resize = y.onResize),
                    (this.lazyResize = function (e) {
                        return (e = isNaN(e) ? 30 : e), y.debounced("resize", y.resize, e), y;
                    }),
                    (this.jqbind = function (t, i, n) {
                        y.events.push({e: t, n: i, f: n, q: !0}), e(t).bind(i, n);
                    }),
                    (this.bind = function (e, t, i, n) {
                        var o = "jquery" in e ? e[0] : e;
                        "mousewheel" == t
                            ? window.addEventListener || "onwheel" in document
                            ? y._bind(o, "wheel", i, n || !1)
                            : ((e = void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll"), m(o, e, i, n || !1), "DOMMouseScroll" == e && m(o, "MozMousePixelScroll", i, n || !1))
                            : o.addEventListener
                            ? (x.cantouch &&
                            /mouseup|mousedown|mousemove/.test(t) &&
                            y._bind(
                                o,
                                "mousedown" == t ? "touchstart" : "mouseup" == t ? "touchend" : "touchmove",
                                function (e) {
                                    if (e.touches) {
                                        if (2 > e.touches.length) {
                                            var t = e.touches.length ? e.touches[0] : e;
                                            (t.original = e), i.call(this, t);
                                        }
                                    } else e.changedTouches && (((t = e.changedTouches[0]).original = e), i.call(this, t));
                                },
                                n || !1
                            ),
                                y._bind(o, t, i, n || !1),
                            x.cantouch && "mouseup" == t && y._bind(o, "touchcancel", i, n || !1))
                            : y._bind(o, t, function (e) {
                                return (
                                    (e = e || window.event || !1) && e.srcElement && (e.target = e.srcElement),
                                    "pageY" in e || ((e.pageX = e.clientX + document.documentElement.scrollLeft), (e.pageY = e.clientY + document.documentElement.scrollTop)),
                                    (!1 !== i.call(o, e) && !1 !== n) || y.cancelEvent(e)
                                );
                            });
                    }),
                    x.haseventlistener
                        ? ((this._bind = function (e, t, i, n) {
                            y.events.push({e: e, n: t, f: i, b: n, q: !1}), e.addEventListener(t, i, n || !1);
                        }),
                            (this.cancelEvent = function (e) {
                                return !!e && ((e = e.original ? e.original : e).preventDefault(), e.stopPropagation(), e.preventManipulation && e.preventManipulation(), !1);
                            }),
                            (this.stopPropagation = function (e) {
                                return !!e && ((e = e.original ? e.original : e).stopPropagation(), !1);
                            }),
                            (this._unbind = function (e, t, i, n) {
                                e.removeEventListener(t, i, n);
                            }))
                        : ((this._bind = function (e, t, i, n) {
                            y.events.push({
                                e: e,
                                n: t,
                                f: i,
                                b: n,
                                q: !1
                            }), e.attachEvent ? e.attachEvent("on" + t, i) : (e["on" + t] = i);
                        }),
                            (this.cancelEvent = function (e) {
                                return !!(e = window.event || !1) && ((e.cancelBubble = !0), (e.cancel = !0), (e.returnValue = !1));
                            }),
                            (this.stopPropagation = function (e) {
                                return !!(e = window.event || !1) && ((e.cancelBubble = !0), !1);
                            }),
                            (this._unbind = function (e, t, i, n) {
                                e.detachEvent ? e.detachEvent("on" + t, i) : (e["on" + t] = !1);
                            })),
                    (this.unbindAll = function () {
                        for (var e = 0; e < y.events.length; e++) {
                            var t = y.events[e];
                            t.q ? t.e.unbind(t.n, t.f) : y._unbind(t.e, t.n, t.f, t.b);
                        }
                    }),
                    (this.showRail = function () {
                        return 0 == y.page.maxh || (!y.ispage && "none" == y.win.css("display")) || ((y.visibility = !0), (y.rail.visibility = !0), y.rail.css("display", "block")), y;
                    }),
                    (this.showRailHr = function () {
                        return y.railh ? (0 == y.page.maxw || (!y.ispage && "none" == y.win.css("display")) || ((y.railh.visibility = !0), y.railh.css("display", "block")), y) : y;
                    }),
                    (this.hideRail = function () {
                        return (y.visibility = !1), (y.rail.visibility = !1), y.rail.css("display", "none"), y;
                    }),
                    (this.hideRailHr = function () {
                        return y.railh ? ((y.railh.visibility = !1), y.railh.css("display", "none"), y) : y;
                    }),
                    (this.show = function () {
                        return (y.hidden = !1), (y.railslocked = !1), y.showRail().showRailHr();
                    }),
                    (this.hide = function () {
                        return (y.hidden = !0), (y.railslocked = !0), y.hideRail().hideRailHr();
                    }),
                    (this.toggle = function () {
                        return y.hidden ? y.show() : y.hide();
                    }),
                    (this.remove = function () {
                        y.stop(),
                        y.cursortimeout && clearTimeout(y.cursortimeout),
                            y.doZoomOut(),
                            y.unbindAll(),
                        x.isie9 && y.win[0].detachEvent("onpropertychange", y.onAttributeChange),
                        !1 !== y.observer && y.observer.disconnect(),
                        !1 !== y.observerremover && y.observerremover.disconnect(),
                        !1 !== y.observerbody && y.observerbody.disconnect(),
                            (y.events = null),
                        y.cursor && y.cursor.remove(),
                        y.cursorh && y.cursorh.remove(),
                        y.rail && y.rail.remove(),
                        y.railh && y.railh.remove(),
                        y.zoom && y.zoom.remove();
                        for (var t = 0; t < y.saved.css.length; t++) {
                            var i = y.saved.css[t];
                            i[0].css(i[1], void 0 === i[2] ? "" : i[2]);
                        }
                        (y.saved = !1), y.me.data("__nicescroll", "");
                        var n = e.nicescroll;
                        for (var o in (n.each(function (e) {
                            if (this && this.id === y.id) {
                                delete n[e];
                                for (var t = ++e; t < n.length; t++, e++) n[e] = n[t];
                                n.length--, n.length && delete n[n.length];
                            }
                        }),
                            y))
                            (y[o] = null), delete y[o];
                        y = null;
                    }),
                    (this.scrollstart = function (e) {
                        return (this.onscrollstart = e), y;
                    }),
                    (this.scrollend = function (e) {
                        return (this.onscrollend = e), y;
                    }),
                    (this.scrollcancel = function (e) {
                        return (this.onscrollcancel = e), y;
                    }),
                    (this.zoomin = function (e) {
                        return (this.onzoomin = e), y;
                    }),
                    (this.zoomout = function (e) {
                        return (this.onzoomout = e), y;
                    }),
                    (this.isScrollable = function (t) {
                        if ("OPTION" == (t = t.target ? t.target : t).nodeName) return !0;
                        for (; t && 1 == t.nodeType && !/^BODY|HTML/.test(t.nodeName);) {
                            var i = (i = e(t)).css("overflowY") || i.css("overflowX") || i.css("overflow") || "";
                            if (/scroll|auto/.test(i)) return t.clientHeight != t.scrollHeight;
                            t = !!t.parentNode && t.parentNode;
                        }
                        return !1;
                    }),
                    (this.getViewport = function (t) {
                        for (t = !(!t || !t.parentNode) && t.parentNode; t && 1 == t.nodeType && !/^BODY|HTML/.test(t.nodeName);) {
                            var i = e(t);
                            if (/fixed|absolute/.test(i.css("position"))) return i;
                            var n = i.css("overflowY") || i.css("overflowX") || i.css("overflow") || "";
                            if ((/scroll|auto/.test(n) && t.clientHeight != t.scrollHeight) || 0 < i.getNiceScroll().length) return i;
                            t = !!t.parentNode && t.parentNode;
                        }
                        return !1;
                    }),
                    (this.triggerScrollEnd = function () {
                        if (y.onscrollend) {
                            var e = y.getScrollLeft(),
                                t = y.getScrollTop();
                            y.onscrollend.call(y, {type: "scrollend", current: {x: e, y: t}, end: {x: e, y: t}});
                        }
                    }),
                    (this.onmousewheel = function (e) {
                        if (!y.wheelprevented) {
                            if (y.railslocked) return y.debounced("checkunlock", y.resize, 250), !0;
                            if (y.rail.drag) return y.cancelEvent(e);
                            if (("auto" == y.opt.oneaxismousemode && 0 != e.deltaX && (y.opt.oneaxismousemode = !1), y.opt.oneaxismousemode && 0 == e.deltaX && !y.rail.scrollable))
                                return !y.railh || !y.railh.scrollable || y.onmousewheelhr(e);
                            var t = +new Date(),
                                i = !1;
                            return y.opt.preservenativescrolling && y.checkarea + 600 < t && ((y.nativescrollingarea = y.isScrollable(e)), (i = !0)), (y.checkarea = t), !!y.nativescrollingarea || ((e = v(e, !1, i)) && (y.checkarea = 0), e);
                        }
                    }),
                    (this.onmousewheelhr = function (e) {
                        if (!y.wheelprevented) {
                            if (y.railslocked || !y.railh.scrollable) return !0;
                            if (y.rail.drag) return y.cancelEvent(e);
                            var t = +new Date(),
                                i = !1;
                            return (
                                y.opt.preservenativescrolling && y.checkarea + 600 < t && ((y.nativescrollingarea = y.isScrollable(e)), (i = !0)),
                                    (y.checkarea = t),
                                !!y.nativescrollingarea || (y.railslocked ? y.cancelEvent(e) : v(e, !0, i))
                            );
                        }
                    }),
                    (this.stop = function () {
                        return y.cancelScroll(), y.scrollmon && y.scrollmon.stop(), (y.cursorfreezed = !1), (y.scroll.y = Math.round(y.getScrollTop() * (1 / y.scrollratio.y))), y.noticeCursor(), y;
                    }),
                    (this.getTransitionSpeed = function (e) {
                        var t = Math.round(10 * y.opt.scrollspeed);
                        return 20 < (e = Math.min(t, Math.round((e / 20) * y.opt.scrollspeed))) ? e : 0;
                    }),
                    y.opt.smoothscroll
                        ? y.ishwscroll && x.hastransition && y.opt.usetransition && y.opt.smoothscroll
                        ? ((this.prepareTransition = function (e, t) {
                            var i = t ? (20 < e ? e : 0) : y.getTransitionSpeed(e),
                                n = i ? x.prefixstyle + "transform " + i + "ms ease-out" : "";
                            return (y.lasttransitionstyle && y.lasttransitionstyle == n) || ((y.lasttransitionstyle = n), y.doc.css(x.transitionstyle, n)), i;
                        }),
                            (this.doScrollLeft = function (e, t) {
                                var i = y.scrollrunning ? y.newscrolly : y.getScrollTop();
                                y.doScrollPos(e, i, t);
                            }),
                            (this.doScrollTop = function (e, t) {
                                var i = y.scrollrunning ? y.newscrollx : y.getScrollLeft();
                                y.doScrollPos(i, e, t);
                            }),
                            (this.doScrollPos = function (e, t, i) {
                                var n = y.getScrollTop(),
                                    o = y.getScrollLeft();
                                return (
                                    (0 > (y.newscrolly - n) * (t - n) || 0 > (y.newscrollx - o) * (e - o)) && y.cancelScroll(),
                                    0 == y.opt.bouncescroll && (0 > t ? (t = 0) : t > y.page.maxh && (t = y.page.maxh), 0 > e ? (e = 0) : e > y.page.maxw && (e = y.page.maxw)),
                                    (!y.scrollrunning || e != y.newscrollx || t != y.newscrolly) &&
                                    ((y.newscrolly = t),
                                        (y.newscrollx = e),
                                        (y.newscrollspeed = i || !1),
                                    !y.timer &&
                                    void (y.timer = setTimeout(function () {
                                        var i,
                                            n,
                                            o = y.getScrollTop(),
                                            r = y.getScrollLeft();
                                        (i = e - r),
                                            (n = t - o),
                                            (i = Math.round(Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2)))),
                                            (i = y.newscrollspeed && 1 < y.newscrollspeed ? y.newscrollspeed : y.getTransitionSpeed(i)),
                                        y.newscrollspeed && 1 >= y.newscrollspeed && (i *= y.newscrollspeed),
                                            y.prepareTransition(i, !0),
                                        y.timerscroll && y.timerscroll.tm && clearInterval(y.timerscroll.tm),
                                        0 < i &&
                                        (!y.scrollrunning &&
                                        y.onscrollstart &&
                                        y.onscrollstart.call(y, {
                                            type: "scrollstart",
                                            current: {x: r, y: o},
                                            request: {x: e, y: t},
                                            end: {x: y.newscrollx, y: y.newscrolly},
                                            speed: i
                                        }),
                                            x.transitionend
                                                ? y.scrollendtrapped || ((y.scrollendtrapped = !0), y.bind(y.doc, x.transitionend, y.onScrollTransitionEnd, !1))
                                                : (y.scrollendtrapped && clearTimeout(y.scrollendtrapped), (y.scrollendtrapped = setTimeout(y.onScrollTransitionEnd, i))),
                                            (y.timerscroll = {
                                                bz: new T(o, y.newscrolly, i, 0, 0, 0.58, 1),
                                                bh: new T(r, y.newscrollx, i, 0, 0, 0.58, 1)
                                            }),
                                        y.cursorfreezed ||
                                        (y.timerscroll.tm = setInterval(function () {
                                            y.showCursor(y.getScrollTop(), y.getScrollLeft());
                                        }, 60))),
                                            y.synched("doScroll-set", function () {
                                                (y.timer = 0), y.scrollendtrapped && (y.scrollrunning = !0), y.setScrollTop(y.newscrolly), y.setScrollLeft(y.newscrollx), y.scrollendtrapped || y.onScrollTransitionEnd();
                                            });
                                    }, 50)))
                                );
                            }),
                            (this.cancelScroll = function () {
                                if (!y.scrollendtrapped) return !0;
                                var e = y.getScrollTop(),
                                    t = y.getScrollLeft();
                                return (
                                    (y.scrollrunning = !1),
                                    x.transitionend || clearTimeout(x.transitionend),
                                        (y.scrollendtrapped = !1),
                                        y._unbind(y.doc[0], x.transitionend, y.onScrollTransitionEnd),
                                        y.prepareTransition(0),
                                        y.setScrollTop(e),
                                    y.railh && y.setScrollLeft(t),
                                    y.timerscroll && y.timerscroll.tm && clearInterval(y.timerscroll.tm),
                                        (y.timerscroll = !1),
                                        (y.cursorfreezed = !1),
                                        y.showCursor(e, t),
                                        y
                                );
                            }),
                            (this.onScrollTransitionEnd = function () {
                                y.scrollendtrapped && y._unbind(y.doc[0], x.transitionend, y.onScrollTransitionEnd),
                                    (y.scrollendtrapped = !1),
                                    y.prepareTransition(0),
                                y.timerscroll && y.timerscroll.tm && clearInterval(y.timerscroll.tm),
                                    (y.timerscroll = !1);
                                var e = y.getScrollTop(),
                                    t = y.getScrollLeft();
                                return (
                                    y.setScrollTop(e),
                                    y.railh && y.setScrollLeft(t),
                                        y.noticeCursor(!1, e, t),
                                        (y.cursorfreezed = !1),
                                        0 > e ? (e = 0) : e > y.page.maxh && (e = y.page.maxh),
                                        0 > t ? (t = 0) : t > y.page.maxw && (t = y.page.maxw),
                                        e != y.newscrolly || t != y.newscrollx ? y.doScrollPos(t, e, y.opt.snapbackspeed) : (y.onscrollend && y.scrollrunning && y.triggerScrollEnd(), void (y.scrollrunning = !1))
                                );
                            }))
                        : ((this.doScrollLeft = function (e, t) {
                            var i = y.scrollrunning ? y.newscrolly : y.getScrollTop();
                            y.doScrollPos(e, i, t);
                        }),
                            (this.doScrollTop = function (e, t) {
                                var i = y.scrollrunning ? y.newscrollx : y.getScrollLeft();
                                y.doScrollPos(i, e, t);
                            }),
                            (this.doScrollPos = function (e, t, i) {
                                if (((t = void 0 === t || !1 === t ? y.getScrollTop(!0) : t), y.timer && y.newscrolly == t && y.newscrollx == e)) return !0;
                                y.timer && l(y.timer), (y.timer = 0);
                                var n = y.getScrollTop(),
                                    o = y.getScrollLeft();
                                (0 > (y.newscrolly - n) * (t - n) || 0 > (y.newscrollx - o) * (e - o)) && y.cancelScroll(),
                                    (y.newscrolly = t),
                                    (y.newscrollx = e),
                                (y.bouncescroll && y.rail.visibility) || (0 > y.newscrolly ? (y.newscrolly = 0) : y.newscrolly > y.page.maxh && (y.newscrolly = y.page.maxh)),
                                (y.bouncescroll && y.railh.visibility) || (0 > y.newscrollx ? (y.newscrollx = 0) : y.newscrollx > y.page.maxw && (y.newscrollx = y.page.maxw)),
                                    (y.dst = {}),
                                    (y.dst.x = e - o),
                                    (y.dst.y = t - n),
                                    (y.dst.px = o),
                                    (y.dst.py = n);
                                var r = Math.round(Math.sqrt(Math.pow(y.dst.x, 2) + Math.pow(y.dst.y, 2)));
                                (y.dst.ax = y.dst.x / r), (y.dst.ay = y.dst.y / r);
                                var s = 0,
                                    c = r;
                                if (
                                    (0 == y.dst.x ? ((s = n), (c = t), (y.dst.ay = 1), (y.dst.py = 0)) : 0 == y.dst.y && ((s = o), (c = e), (y.dst.ax = 1), (y.dst.px = 0)),
                                        (r = y.getTransitionSpeed(r)),
                                    i && 1 >= i && (r *= i),
                                        (y.bzscroll = 0 < r && (y.bzscroll ? y.bzscroll.update(c, r) : new T(s, c, r, 0, 1, 0, 1))),
                                        !y.timer)
                                ) {
                                    ((n == y.page.maxh && t >= y.page.maxh) || (o == y.page.maxw && e >= y.page.maxw)) && y.checkContentSize();
                                    var u = 1;
                                    (y.cancelAnimationFrame = !1),
                                        (y.timer = 1),
                                    y.onscrollstart && !y.scrollrunning && y.onscrollstart.call(y, {
                                        type: "scrollstart",
                                        current: {x: o, y: n},
                                        request: {x: e, y: t},
                                        end: {x: y.newscrollx, y: y.newscrolly},
                                        speed: r
                                    }),
                                        (function e() {
                                            if (y.cancelAnimationFrame) return !0;
                                            if (((y.scrollrunning = !0), (u = 1 - u))) return (y.timer = a(e) || 1);
                                            var t,
                                                i,
                                                n = 0,
                                                o = (i = y.getScrollTop());
                                            y.dst.ay
                                                ? (((0 > (t = (o = y.bzscroll ? y.dst.py + y.bzscroll.getNow() * y.dst.ay : y.newscrolly) - i) && o < y.newscrolly) || (0 < t && o > y.newscrolly)) && (o = y.newscrolly),
                                                    y.setScrollTop(o),
                                                o == y.newscrolly && (n = 1))
                                                : (n = 1),
                                                (i = t = y.getScrollLeft()),
                                                y.dst.ax
                                                    ? (((0 > (t = (i = y.bzscroll ? y.dst.px + y.bzscroll.getNow() * y.dst.ax : y.newscrollx) - t) && i < y.newscrollx) || (0 < t && i > y.newscrollx)) && (i = y.newscrollx),
                                                        y.setScrollLeft(i),
                                                    i == y.newscrollx && (n += 1))
                                                    : (n += 1),
                                                2 == n
                                                    ? ((y.timer = 0),
                                                        (y.cursorfreezed = !1),
                                                        (y.bzscroll = !1),
                                                        (y.scrollrunning = !1),
                                                        0 > o ? (o = 0) : o > y.page.maxh && (o = y.page.maxh),
                                                        0 > i ? (i = 0) : i > y.page.maxw && (i = y.page.maxw),
                                                        i != y.newscrollx || o != y.newscrolly ? y.doScrollPos(i, o) : y.onscrollend && y.triggerScrollEnd())
                                                    : (y.timer = a(e) || 1);
                                        })(),
                                    ((n == y.page.maxh && t >= n) || (o == y.page.maxw && e >= o)) && y.checkContentSize(),
                                        y.noticeCursor();
                                }
                            }),
                            (this.cancelScroll = function () {
                                return y.timer && l(y.timer), (y.timer = 0), (y.bzscroll = !1), (y.scrollrunning = !1), y;
                            }))
                        : ((this.doScrollLeft = function (e, t) {
                            var i = y.getScrollTop();
                            y.doScrollPos(e, i, t);
                        }),
                            (this.doScrollTop = function (e, t) {
                                var i = y.getScrollLeft();
                                y.doScrollPos(i, e, t);
                            }),
                            (this.doScrollPos = function (e, t, i) {
                                var n = e > y.page.maxw ? y.page.maxw : e;
                                0 > n && (n = 0);
                                var o = t > y.page.maxh ? y.page.maxh : t;
                                0 > o && (o = 0),
                                    y.synched("scroll", function () {
                                        y.setScrollTop(o), y.setScrollLeft(n);
                                    });
                            }),
                            (this.cancelScroll = function () {
                            })),
                    (this.doScrollBy = function (e, t) {
                        var i = 0;
                        i = t ? Math.floor((y.scroll.y - e) * y.scrollratio.y) : (y.timer ? y.newscrolly : y.getScrollTop(!0)) - e;
                        if (y.bouncescroll) {
                            var n = Math.round(y.view.h / 2);
                            i < -n ? (i = -n) : i > y.page.maxh + n && (i = y.page.maxh + n);
                        }
                        return (y.cursorfreezed = !1), (n = y.getScrollTop(!0)), 0 > i && 0 >= n ? y.noticeCursor() : i > y.page.maxh && n >= y.page.maxh ? (y.checkContentSize(), y.noticeCursor()) : void y.doScrollTop(i);
                    }),
                    (this.doScrollLeftBy = function (e, t) {
                        var i = 0;
                        i = t ? Math.floor((y.scroll.x - e) * y.scrollratio.x) : (y.timer ? y.newscrollx : y.getScrollLeft(!0)) - e;
                        if (y.bouncescroll) {
                            var n = Math.round(y.view.w / 2);
                            i < -n ? (i = -n) : i > y.page.maxw + n && (i = y.page.maxw + n);
                        }
                        return (y.cursorfreezed = !1), (n = y.getScrollLeft(!0)), (0 > i && 0 >= n) || (i > y.page.maxw && n >= y.page.maxw) ? y.noticeCursor() : void y.doScrollLeft(i);
                    }),
                    (this.doScrollTo = function (e, t) {
                        t && Math.round(e * y.scrollratio.y), (y.cursorfreezed = !1), y.doScrollTop(e);
                    }),
                    (this.checkContentSize = function () {
                        var e = y.getContentSize();
                        (e.h == y.page.h && e.w == y.page.w) || y.resize(!1, e);
                    }),
                    (y.onscroll = function (e) {
                        y.rail.drag ||
                        y.cursorfreezed ||
                        y.synched("scroll", function () {
                            (y.scroll.y = Math.round(y.getScrollTop() * (1 / y.scrollratio.y))), y.railh && (y.scroll.x = Math.round(y.getScrollLeft() * (1 / y.scrollratio.x))), y.noticeCursor();
                        });
                    }),
                    y.bind(y.docscroll, "scroll", y.onscroll),
                    (this.doZoomIn = function (t) {
                        if (!y.zoomactive) {
                            (y.zoomactive = !0), (y.zoomrestore = {style: {}});
                            var i,
                                n = "position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight".split(" "),
                                o = y.win[0].style;
                            for (i in n) {
                                var s = n[i];
                                y.zoomrestore.style[s] = void 0 !== o[s] ? o[s] : "";
                            }
                            return (
                                (y.zoomrestore.style.width = y.win.css("width")),
                                    (y.zoomrestore.style.height = y.win.css("height")),
                                    (y.zoomrestore.padding = {
                                        w: y.win.outerWidth() - y.win.width(),
                                        h: y.win.outerHeight() - y.win.height()
                                    }),
                                x.isios4 && ((y.zoomrestore.scrollTop = e(window).scrollTop()), e(window).scrollTop(0)),
                                    y.win.css({
                                        position: x.isios4 ? "absolute" : "fixed",
                                        top: 0,
                                        left: 0,
                                        "z-index": r + 100,
                                        margin: "0px"
                                    }),
                                ("" == (n = y.win.css("backgroundColor")) || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(n)) && y.win.css("backgroundColor", "#fff"),
                                    y.rail.css({"z-index": r + 101}),
                                    y.zoom.css({"z-index": r + 102}),
                                    y.zoom.css("backgroundPosition", "0px -18px"),
                                    y.resizeZoom(),
                                y.onzoomin && y.onzoomin.call(y),
                                    y.cancelEvent(t)
                            );
                        }
                    }),
                    (this.doZoomOut = function (t) {
                        if (y.zoomactive)
                            return (
                                (y.zoomactive = !1),
                                    y.win.css("margin", ""),
                                    y.win.css(y.zoomrestore.style),
                                x.isios4 && e(window).scrollTop(y.zoomrestore.scrollTop),
                                    y.rail.css({"z-index": y.zindex}),
                                    y.zoom.css({"z-index": y.zindex}),
                                    (y.zoomrestore = !1),
                                    y.zoom.css("backgroundPosition", "0px 0px"),
                                    y.onResize(),
                                y.onzoomout && y.onzoomout.call(y),
                                    y.cancelEvent(t)
                            );
                    }),
                    (this.doZoom = function (e) {
                        return y.zoomactive ? y.doZoomOut(e) : y.doZoomIn(e);
                    }),
                    (this.resizeZoom = function () {
                        if (y.zoomactive) {
                            var t = y.getScrollTop();
                            y.win.css({
                                width: e(window).width() - y.zoomrestore.padding.w + "px",
                                height: e(window).height() - y.zoomrestore.padding.h + "px"
                            }), y.onResize(), y.setScrollTop(Math.min(y.page.maxh, t));
                        }
                    }),
                    this.init(),
                    e.nicescroll.push(this);
            },
            g = function (e) {
                var t = this;
                (this.nc = e),
                    (this.steptime = this.lasttime = this.speedy = this.speedx = this.lasty = this.lastx = 0),
                    (this.snapy = this.snapx = !1),
                    (this.demuly = this.demulx = 0),
                    (this.lastscrolly = this.lastscrollx = -1),
                    (this.timer = this.chky = this.chkx = 0),
                    (this.time = function () {
                        return +new Date();
                    }),
                    (this.reset = function (e, i) {
                        t.stop();
                        var n = t.time();
                        (t.steptime = 0), (t.lasttime = n), (t.speedx = 0), (t.speedy = 0), (t.lastx = e), (t.lasty = i), (t.lastscrollx = -1), (t.lastscrolly = -1);
                    }),
                    (this.update = function (e, i) {
                        var n = t.time();
                        (t.steptime = n - t.lasttime), (t.lasttime = n);
                        n = i - t.lasty;
                        var o = e - t.lastx,
                            r = (r = t.nc.getScrollTop()) + n,
                            s = (s = t.nc.getScrollLeft()) + o;
                        (t.snapx = 0 > s || s > t.nc.page.maxw), (t.snapy = 0 > r || r > t.nc.page.maxh), (t.speedx = o), (t.speedy = n), (t.lastx = e), (t.lasty = i);
                    }),
                    (this.stop = function () {
                        t.nc.unsynched("domomentum2d"), t.timer && clearTimeout(t.timer), (t.timer = 0), (t.lastscrollx = -1), (t.lastscrolly = -1);
                    }),
                    (this.doSnapy = function (e, i) {
                        var n = !1;
                        0 > i ? ((i = 0), (n = !0)) : i > t.nc.page.maxh && ((i = t.nc.page.maxh), (n = !0)),
                            0 > e ? ((e = 0), (n = !0)) : e > t.nc.page.maxw && ((e = t.nc.page.maxw), (n = !0)),
                            n ? t.nc.doScrollPos(e, i, t.nc.opt.snapbackspeed) : t.nc.triggerScrollEnd();
                    }),
                    (this.doMomentum = function (e) {
                        var i = t.time(),
                            n = e ? i + e : t.lasttime;
                        e = t.nc.getScrollLeft();
                        var o = t.nc.getScrollTop(),
                            r = t.nc.page.maxh,
                            s = t.nc.page.maxw;
                        if (
                            ((t.speedx = 0 < s ? Math.min(60, t.speedx) : 0),
                                (t.speedy = 0 < r ? Math.min(60, t.speedy) : 0),
                                (n = n && 60 >= i - n),
                            (0 > o || o > r || 0 > e || e > s) && (n = !1),
                                (e = !(!t.speedx || !n) && t.speedx),
                            (t.speedy && n && t.speedy) || e)
                        ) {
                            var a = Math.max(16, t.steptime);
                            50 < a && ((e = a / 50), (t.speedx *= e), (t.speedy *= e), (a = 50)),
                                (t.demulxy = 0),
                                (t.lastscrollx = t.nc.getScrollLeft()),
                                (t.chkx = t.lastscrollx),
                                (t.lastscrolly = t.nc.getScrollTop()),
                                (t.chky = t.lastscrolly);
                            var l = t.lastscrollx,
                                c = t.lastscrolly,
                                u = function () {
                                    var e = 600 < t.time() - i ? 0.04 : 0.02;
                                    t.speedx && ((l = Math.floor(t.lastscrollx - t.speedx * (1 - t.demulxy))), (t.lastscrollx = l), 0 > l || l > s) && (e = 0.1),
                                    t.speedy && ((c = Math.floor(t.lastscrolly - t.speedy * (1 - t.demulxy))), (t.lastscrolly = c), 0 > c || c > r) && (e = 0.1),
                                        (t.demulxy = Math.min(1, t.demulxy + e)),
                                        t.nc.synched("domomentum2d", function () {
                                            t.speedx && (t.nc.getScrollLeft() != t.chkx && t.stop(), (t.chkx = l), t.nc.setScrollLeft(l)),
                                            t.speedy && (t.nc.getScrollTop() != t.chky && t.stop(), (t.chky = c), t.nc.setScrollTop(c)),
                                            t.timer || (t.nc.hideCursor(), t.doSnapy(l, c));
                                        }),
                                        1 > t.demulxy ? (t.timer = setTimeout(u, a)) : (t.stop(), t.nc.hideCursor(), t.doSnapy(l, c));
                                };
                            u();
                        } else t.doSnapy(t.nc.getScrollLeft(), t.nc.getScrollTop());
                    });
            },
            v = e.fn.scrollTop;
        (e.cssHooks.pageYOffset = {
            get: function (t, i, n) {
                return (i = e.data(t, "__nicescroll") || !1) && i.ishwscroll ? i.getScrollTop() : v.call(t);
            },
            set: function (t, i) {
                var n = e.data(t, "__nicescroll") || !1;
                return n && n.ishwscroll ? n.setScrollTop(parseInt(i)) : v.call(t, i), this;
            },
        }),
            (e.fn.scrollTop = function (t) {
                if (void 0 === t) {
                    var i = !!this[0] && (e.data(this[0], "__nicescroll") || !1);
                    return i && i.ishwscroll ? i.getScrollTop() : v.call(this);
                }
                return this.each(function () {
                    var i = e.data(this, "__nicescroll") || !1;
                    i && i.ishwscroll ? i.setScrollTop(parseInt(t)) : v.call(e(this), t);
                });
            });
        var y = e.fn.scrollLeft;
        (e.cssHooks.pageXOffset = {
            get: function (t, i, n) {
                return (i = e.data(t, "__nicescroll") || !1) && i.ishwscroll ? i.getScrollLeft() : y.call(t);
            },
            set: function (t, i) {
                var n = e.data(t, "__nicescroll") || !1;
                return n && n.ishwscroll ? n.setScrollLeft(parseInt(i)) : y.call(t, i), this;
            },
        }),
            (e.fn.scrollLeft = function (t) {
                if (void 0 === t) {
                    var i = !!this[0] && (e.data(this[0], "__nicescroll") || !1);
                    return i && i.ishwscroll ? i.getScrollLeft() : y.call(this);
                }
                return this.each(function () {
                    var i = e.data(this, "__nicescroll") || !1;
                    i && i.ishwscroll ? i.setScrollLeft(parseInt(t)) : y.call(e(this), t);
                });
            });
        var w = function (t) {
            var i = this;
            if (
                ((this.length = 0),
                    (this.name = "nicescrollarray"),
                    (this.each = function (e) {
                        for (var t = 0, n = 0; t < i.length; t++) e.call(i[t], n++);
                        return i;
                    }),
                    (this.push = function (e) {
                        (i[i.length] = e), i.length++;
                    }),
                    (this.eq = function (e) {
                        return i[e];
                    }),
                    t)
            )
                for (var n = 0; n < t.length; n++) {
                    var o = e.data(t[n], "__nicescroll") || !1;
                    o && ((this[this.length] = o), this.length++);
                }
            return this;
        };
        !(function (e, t, i) {
            for (var n = 0; n < t.length; n++) i(e, t[n]);
        })(w.prototype, "show hide toggle onResize resize remove stop doScrollPos".split(" "), function (e, t) {
            e[t] = function () {
                var e = arguments;
                return this.each(function () {
                    this[t].apply(this, e);
                });
            };
        }),
            (e.fn.getNiceScroll = function (t) {
                return void 0 === t ? new w(this) : (this[t] && e.data(this[t], "__nicescroll")) || !1;
            }),
            e.extend(e.expr[":"], {
                nicescroll: function (t) {
                    return !!e.data(t, "__nicescroll");
                },
            }),
            (e.fn.niceScroll = function (t, i) {
                void 0 !== i || "object" != typeof t || "jquery" in t || ((i = t), (t = !1)), (i = e.extend({}, i));
                var n = new w();
                void 0 === i && (i = {}), t && ((i.doc = e(t)), (i.win = e(this)));
                var o = !("doc" in i);
                return (
                    o || "win" in i || (i.win = e(this)),
                        this.each(function () {
                            var t = e(this).data("__nicescroll") || !1;
                            t || ((i.doc = o ? e(this) : i.doc), (t = new m(i, e(this))), e(this).data("__nicescroll", t)), n.push(t);
                        }),
                        1 == n.length ? n[0] : n
                );
            }),
            (window.NiceScroll = {
                getjQuery: function () {
                    return e;
                },
            }),
        e.nicescroll || ((e.nicescroll = new w()), (e.nicescroll.options = p));
    }),
    (function (e) {
        function t(e) {
            return new RegExp("(^|\\s+)" + e + "(\\s+|$)");
        }

        function i(e, t) {
            (n(e, t) ? r : o)(e, t);
        }

        var n, o, r;
        "classList" in document.documentElement
            ? ((n = function (e, t) {
                return e.classList.contains(t);
            }),
                (o = function (e, t) {
                    e.classList.add(t);
                }),
                (r = function (e, t) {
                    e.classList.remove(t);
                }))
            : ((n = function (e, i) {
                return t(i).test(e.className);
            }),
                (o = function (e, t) {
                    n(e, t) || (e.className = e.className + " " + t);
                }),
                (r = function (e, i) {
                    e.className = e.className.replace(t(i), " ");
                }));
        var s = {hasClass: n, addClass: o, removeClass: r, toggleClass: i, has: n, add: o, remove: r, toggle: i};
        "function" == typeof define && define.amd ? define("classie/classie", s) : "object" == typeof exports ? (module.exports = s) : (e.classie = s);
    })(window),
    (function (e, t) {
        "function" == typeof define && define.amd ? define("packery/js/rect", t) : "object" == typeof exports ? (module.exports = t()) : ((e.Packery = e.Packery || {}), (e.Packery.Rect = t()));
    })(window, function () {
        function e(t) {
            for (var i in e.defaults) this[i] = e.defaults[i];
            for (i in t) this[i] = t[i];
        }

        return (
            ((window.Packery = function () {
            }).Rect = e),
                (e.defaults = {x: 0, y: 0, width: 0, height: 0}),
                (e.prototype.contains = function (e) {
                    var t = e.width || 0,
                        i = e.height || 0;
                    return this.x <= e.x && this.y <= e.y && this.x + this.width >= e.x + t && this.y + this.height >= e.y + i;
                }),
                (e.prototype.overlaps = function (e) {
                    var t = this.x + this.width,
                        i = this.y + this.height,
                        n = e.x + e.width,
                        o = e.y + e.height;
                    return this.x < n && t > e.x && this.y < o && i > e.y;
                }),
                (e.prototype.getMaximalFreeRects = function (t) {
                    if (!this.overlaps(t)) return !1;
                    var i,
                        n = [],
                        o = this.x + this.width,
                        r = this.y + this.height,
                        s = t.x + t.width,
                        a = t.y + t.height;
                    return (
                        this.y < t.y && ((i = new e({
                            x: this.x,
                            y: this.y,
                            width: this.width,
                            height: t.y - this.y
                        })), n.push(i)),
                        o > s && ((i = new e({x: s, y: this.y, width: o - s, height: this.height})), n.push(i)),
                        r > a && ((i = new e({x: this.x, y: a, width: this.width, height: r - a})), n.push(i)),
                        this.x < t.x && ((i = new e({
                            x: this.x,
                            y: this.y,
                            width: t.x - this.x,
                            height: this.height
                        })), n.push(i)),
                            n
                    );
                }),
                (e.prototype.canFit = function (e) {
                    return this.width >= e.width && this.height >= e.height;
                }),
                e
        );
    }),
    (function (e, t) {
        if ("function" == typeof define && define.amd) define("packery/js/packer", ["./rect"], t);
        else if ("object" == typeof exports) module.exports = t(require("./rect"));
        else {
            var i = (e.Packery = e.Packery || {});
            i.Packer = t(i.Rect);
        }
    })(window, function (e) {
        function t(e, t, i) {
            (this.width = e || 0), (this.height = t || 0), (this.sortDirection = i || "downwardLeftToRight"), this.reset();
        }

        (t.prototype.reset = function () {
            (this.spaces = []), (this.newSpaces = []);
            var t = new e({x: 0, y: 0, width: this.width, height: this.height});
            this.spaces.push(t), (this.sorter = i[this.sortDirection] || i.downwardLeftToRight);
        }),
            (t.prototype.pack = function (e) {
                for (var t = 0, i = this.spaces.length; i > t; t++) {
                    var n = this.spaces[t];
                    if (n.canFit(e)) {
                        this.placeInSpace(e, n);
                        break;
                    }
                }
            }),
            (t.prototype.placeInSpace = function (e, t) {
                (e.x = t.x), (e.y = t.y), this.placed(e);
            }),
            (t.prototype.placed = function (e) {
                for (var t = [], i = 0, n = this.spaces.length; n > i; i++) {
                    var o = this.spaces[i],
                        r = o.getMaximalFreeRects(e);
                    r ? t.push.apply(t, r) : t.push(o);
                }
                (this.spaces = t), this.mergeSortSpaces();
            }),
            (t.prototype.mergeSortSpaces = function () {
                t.mergeRects(this.spaces), this.spaces.sort(this.sorter);
            }),
            (t.prototype.addSpace = function (e) {
                this.spaces.push(e), this.mergeSortSpaces();
            }),
            (t.mergeRects = function (e) {
                for (var t = 0, i = e.length; i > t; t++) {
                    var n = e[t];
                    if (n) {
                        var o = e.slice(0);
                        o.splice(t, 1);
                        for (var r = 0, s = 0, a = o.length; a > s; s++) {
                            var l = o[s],
                                c = t > s ? 0 : 1;
                            n.contains(l) && (e.splice(s + c - r, 1), r++);
                        }
                    }
                }
                return e;
            });
        var i = {
            downwardLeftToRight: function (e, t) {
                return e.y - t.y || e.x - t.x;
            },
            rightwardTopToBottom: function (e, t) {
                return e.x - t.x || e.y - t.y;
            },
        };
        return t;
    }),
    (function (e, t) {
        "function" == typeof define && define.amd
            ? define("packery/js/item", ["get-style-property/get-style-property", "outlayer/outlayer", "./rect"], t)
            : "object" == typeof exports
            ? (module.exports = t(require("desandro-get-style-property"), require("outlayer"), require("./rect")))
            : (e.Packery.Item = t(e.getStyleProperty, e.Outlayer, e.Packery.Rect));
    })(window, function (e, t, i) {
        var n = e("transform"),
            o = function () {
                t.Item.apply(this, arguments);
            },
            r = (o.prototype = new t.Item())._create;
        return (
            (o.prototype._create = function () {
                r.call(this), (this.rect = new i()), (this.placeRect = new i());
            }),
                (o.prototype.dragStart = function () {
                    this.getPosition(),
                        this.removeTransitionStyles(),
                    this.isTransitioning && n && (this.element.style[n] = "none"),
                        this.getSize(),
                        (this.isPlacing = !0),
                        (this.needsPositioning = !1),
                        this.positionPlaceRect(this.position.x, this.position.y),
                        (this.isTransitioning = !1),
                        (this.didDrag = !1);
                }),
                (o.prototype.dragMove = function (e, t) {
                    this.didDrag = !0;
                    var i = this.layout.size;
                    (e -= i.paddingLeft), (t -= i.paddingTop), this.positionPlaceRect(e, t);
                }),
                (o.prototype.dragStop = function () {
                    this.getPosition();
                    var e = this.position.x != this.placeRect.x,
                        t = this.position.y != this.placeRect.y;
                    (this.needsPositioning = e || t), (this.didDrag = !1);
                }),
                (o.prototype.positionPlaceRect = function (e, t, i) {
                    (this.placeRect.x = this.getPlaceRectCoord(e, !0)), (this.placeRect.y = this.getPlaceRectCoord(t, !1, i));
                }),
                (o.prototype.getPlaceRectCoord = function (e, t, i) {
                    var n,
                        o = t ? "Width" : "Height",
                        r = this.size["outer" + o],
                        s = this.layout[t ? "columnWidth" : "rowHeight"],
                        a = this.layout.size["inner" + o];
                    if ((t || ((a = Math.max(a, this.layout.maxY)), this.layout.rowHeight || (a -= this.layout.gutter)), s)) {
                        var l;
                        (s += this.layout.gutter), (a += t ? this.layout.gutter : 0), (e = Math.round(e / s)), (l = this.layout.options.isHorizontal ? (t ? "ceil" : "floor") : t ? "floor" : "ceil");
                        var c = Math[l](a / s);
                        n = c -= Math.ceil(r / s);
                    } else n = a - r;
                    return (e = i ? e : Math.min(e, n)), (e *= s || 1), Math.max(0, e);
                }),
                (o.prototype.copyPlaceRectPosition = function () {
                    (this.rect.x = this.placeRect.x), (this.rect.y = this.placeRect.y);
                }),
                (o.prototype.removeElem = function () {
                    this.element.parentNode.removeChild(this.element), this.layout.packer.addSpace(this.rect), this.emitEvent("remove", [this]);
                }),
                o
        );
    }),
    (function (e, t) {
        "function" == typeof define && define.amd
            ? define("packery/js/packery", ["classie/classie", "get-size/get-size", "outlayer/outlayer", "./rect", "./packer", "./item"], t)
            : "object" == typeof exports
            ? (module.exports = t(require("desandro-classie"), require("get-size"), require("outlayer"), require("./rect"), require("./packer"), require("./item")))
            : (e.Packery = t(e.classie, e.getSize, e.Outlayer, e.Packery.Rect, e.Packery.Packer, e.Packery.Item));
    })(window, function (e, t, i, n, o, r) {
        function s(e, t) {
            return e.position.y - t.position.y || e.position.x - t.position.x;
        }

        function a(e, t) {
            return e.position.x - t.position.x || e.position.y - t.position.y;
        }

        n.prototype.canFit = function (e) {
            return this.width >= e.width - 1 && this.height >= e.height - 1;
        };
        var l = i.create("packery");
        return (
            (l.Item = r),
                (l.prototype._create = function () {
                    i.prototype._create.call(this), (this.packer = new o()), this.stamp(this.options.stamped);
                    var e = this;
                    (this.handleDraggabilly = {
                        dragStart: function () {
                            e.itemDragStart(this.element);
                        },
                        dragMove: function () {
                            e.itemDragMove(this.element, this.position.x, this.position.y);
                        },
                        dragEnd: function () {
                            e.itemDragEnd(this.element);
                        },
                    }),
                        (this.handleUIDraggable = {
                            start: function (t) {
                                e.itemDragStart(t.currentTarget);
                            },
                            drag: function (t, i) {
                                e.itemDragMove(t.currentTarget, i.position.left, i.position.top);
                            },
                            stop: function (t) {
                                e.itemDragEnd(t.currentTarget);
                            },
                        });
                }),
                (l.prototype._resetLayout = function () {
                    this.getSize(), this._getMeasurements();
                    var e = this.packer;
                    this.options.isHorizontal
                        ? ((e.width = Number.POSITIVE_INFINITY), (e.height = this.size.innerHeight + this.gutter), (e.sortDirection = "rightwardTopToBottom"))
                        : ((e.width = this.size.innerWidth + this.gutter), (e.height = Number.POSITIVE_INFINITY), (e.sortDirection = "downwardLeftToRight")),
                        e.reset(),
                        (this.maxY = 0),
                        (this.maxX = 0);
                }),
                (l.prototype._getMeasurements = function () {
                    this._getMeasurement("columnWidth", "width"), this._getMeasurement("rowHeight", "height"), this._getMeasurement("gutter", "width");
                }),
                (l.prototype._getItemLayoutPosition = function (e) {
                    return this._packItem(e), e.rect;
                }),
                (l.prototype._packItem = function (e) {
                    this._setRectSize(e.element, e.rect), this.packer.pack(e.rect), this._setMaxXY(e.rect);
                }),
                (l.prototype._setMaxXY = function (e) {
                    (this.maxX = Math.max(e.x + e.width, this.maxX)), (this.maxY = Math.max(e.y + e.height, this.maxY));
                }),
                (l.prototype._setRectSize = function (e, i) {
                    var n = t(e),
                        o = n.outerWidth,
                        r = n.outerHeight;
                    (o || r) && ((o = this._applyGridGutter(o, this.columnWidth)), (r = this._applyGridGutter(r, this.rowHeight))), (i.width = Math.min(o, this.packer.width)), (i.height = Math.min(r, this.packer.height));
                }),
                (l.prototype._applyGridGutter = function (e, t) {
                    if (!t) return e + this.gutter;
                    var i = e % (t += this.gutter);
                    return Math[i && 1 > i ? "round" : "ceil"](e / t) * t;
                }),
                (l.prototype._getContainerSize = function () {
                    return this.options.isHorizontal ? {width: this.maxX - this.gutter} : {height: this.maxY - this.gutter};
                }),
                (l.prototype._manageStamp = function (e) {
                    var t,
                        i = this.getItem(e);
                    if (i && i.isPlacing) t = i.placeRect;
                    else {
                        var o = this._getElementOffset(e);
                        t = new n({
                            x: this.options.isOriginLeft ? o.left : o.right,
                            y: this.options.isOriginTop ? o.top : o.bottom
                        });
                    }
                    this._setRectSize(e, t), this.packer.placed(t), this._setMaxXY(t);
                }),
                (l.prototype.sortItemsByPosition = function () {
                    var e = this.options.isHorizontal ? a : s;
                    this.items.sort(e);
                }),
                (l.prototype.fit = function (e, t, i) {
                    var n = this.getItem(e);
                    n &&
                    (this._getMeasurements(),
                        this.stamp(n.element),
                        n.getSize(),
                        (n.isPlacing = !0),
                        (t = void 0 === t ? n.rect.x : t),
                        (i = void 0 === i ? n.rect.y : i),
                        n.positionPlaceRect(t, i, !0),
                        this._bindFitEvents(n),
                        n.moveTo(n.placeRect.x, n.placeRect.y),
                        this.layout(),
                        this.unstamp(n.element),
                        this.sortItemsByPosition(),
                        (n.isPlacing = !1),
                        n.copyPlaceRectPosition());
                }),
                (l.prototype._bindFitEvents = function (e) {
                    function t() {
                        2 == ++n && i.emitEvent("fitComplete", [e]);
                    }

                    var i = this,
                        n = 0;
                    e.on("layout", function () {
                        return t(), !0;
                    }),
                        this.on("layoutComplete", function () {
                            return t(), !0;
                        });
                }),
                (l.prototype.resize = function () {
                    var e = t(this.element),
                        i = this.size && e,
                        n = this.options.isHorizontal ? "innerHeight" : "innerWidth";
                    (i && e[n] == this.size[n]) || this.layout();
                }),
                (l.prototype.itemDragStart = function (e) {
                    this.stamp(e);
                    var t = this.getItem(e);
                    t && t.dragStart();
                }),
                (l.prototype.itemDragMove = function (e, t, i) {
                    var n = this.getItem(e);
                    n && n.dragMove(t, i);
                    var o = this;
                    this.clearDragTimeout(),
                        (this.dragTimeout = setTimeout(function () {
                            o.layout(), delete o.dragTimeout;
                        }, 40));
                }),
                (l.prototype.clearDragTimeout = function () {
                    this.dragTimeout && clearTimeout(this.dragTimeout);
                }),
                (l.prototype.itemDragEnd = function (t) {
                    var i,
                        n = this.getItem(t);
                    if ((n && ((i = n.didDrag), n.dragStop()), n && (i || n.needsPositioning))) {
                        e.add(n.element, "is-positioning-post-drag");
                        var o = this._getDragEndLayoutComplete(t, n);
                        n.needsPositioning ? (n.on("layout", o), n.moveTo(n.placeRect.x, n.placeRect.y)) : n && n.copyPlaceRectPosition(), this.clearDragTimeout(), this.on("layoutComplete", o), this.layout();
                    } else this.unstamp(t);
                }),
                (l.prototype._getDragEndLayoutComplete = function (t, i) {
                    var n = i && i.needsPositioning,
                        o = 0,
                        r = n ? 2 : 1,
                        s = this;
                    return function () {
                        return ++o != r || (i && (e.remove(i.element, "is-positioning-post-drag"), (i.isPlacing = !1), i.copyPlaceRectPosition()), s.unstamp(t), s.sortItemsByPosition(), n && s.emitEvent("dragItemPositioned", [i]), !0);
                    };
                }),
                (l.prototype.bindDraggabillyEvents = function (e) {
                    e.on("dragStart", this.handleDraggabilly.dragStart), e.on("dragMove", this.handleDraggabilly.dragMove), e.on("dragEnd", this.handleDraggabilly.dragEnd);
                }),
                (l.prototype.bindUIDraggableEvents = function (e) {
                    e.on("dragstart", this.handleUIDraggable.start).on("drag", this.handleUIDraggable.drag).on("dragstop", this.handleUIDraggable.stop);
                }),
                (l.Rect = n),
                (l.Packer = o),
                l
        );
    }),
    (function (e, t) {
        "function" == typeof define && define.amd
            ? define(["isotope/js/layout-mode", "packery/js/packery", "get-size/get-size"], t)
            : "object" == typeof exports
            ? (module.exports = t(require("isotope-layout/js/layout-mode"), require("packery"), require("get-size")))
            : t(e.Isotope.LayoutMode, e.Packery, e.getSize);
    })(window, function (e, t, i) {
        var n = e.create("packery"),
            o = n.prototype._getElementOffset,
            r = n.prototype._getMeasurement;
        (function (e, t) {
            for (var i in t) e[i] = t[i];
        })(n.prototype, t.prototype),
            (n.prototype._getElementOffset = o),
            (n.prototype._getMeasurement = r);
        var s = n.prototype._resetLayout;
        n.prototype._resetLayout = function () {
            (this.packer = this.packer || new t.Packer()), s.apply(this, arguments);
        };
        var a = n.prototype._getItemLayoutPosition;
        n.prototype._getItemLayoutPosition = function (e) {
            return (e.rect = e.rect || new t.Rect()), a.call(this, e);
        };
        var l = n.prototype._manageStamp;
        return (
            (n.prototype._manageStamp = function () {
                (this.options.isOriginLeft = this.isotope.options.isOriginLeft), (this.options.isOriginTop = this.isotope.options.isOriginTop), l.apply(this, arguments);
            }),
                (n.prototype.needsResizeLayout = function () {
                    var e = i(this.element),
                        t = this.size && e,
                        n = this.options.isHorizontal ? "innerHeight" : "innerWidth";
                    return t && e[n] != this.size[n];
                }),
                n
        );
    }),
    (function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? (module.exports = e) : e(jQuery);
    })(function (e) {
        function t(t) {
            var s = t || window.event,
                a = l.call(arguments, 1),
                c = 0,
                d = 0,
                p = 0,
                h = 0,
                f = 0,
                m = 0;
            if (
                (((t = e.event.fix(s)).type = "mousewheel"),
                "detail" in s && (p = -1 * s.detail),
                "wheelDelta" in s && (p = s.wheelDelta),
                "wheelDeltaY" in s && (p = s.wheelDeltaY),
                "wheelDeltaX" in s && (d = -1 * s.wheelDeltaX),
                "axis" in s && s.axis === s.HORIZONTAL_AXIS && ((d = -1 * p), (p = 0)),
                    (c = 0 === p ? d : p),
                "deltaY" in s && (c = p = -1 * s.deltaY),
                "deltaX" in s && ((d = s.deltaX), 0 === p && (c = -1 * d)),
                0 !== p || 0 !== d)
            ) {
                if (1 === s.deltaMode) {
                    var g = e.data(this, "mousewheel-line-height");
                    (c *= g), (p *= g), (d *= g);
                } else if (2 === s.deltaMode) {
                    var v = e.data(this, "mousewheel-page-height");
                    (c *= v), (p *= v), (d *= v);
                }
                if (
                    ((h = Math.max(Math.abs(p), Math.abs(d))),
                    (!r || r > h) && ((r = h), n(s, h) && (r /= 40)),
                    n(s, h) && ((c /= 40), (d /= 40), (p /= 40)),
                        (c = Math[c >= 1 ? "floor" : "ceil"](c / r)),
                        (d = Math[d >= 1 ? "floor" : "ceil"](d / r)),
                        (p = Math[p >= 1 ? "floor" : "ceil"](p / r)),
                    u.settings.normalizeOffset && this.getBoundingClientRect)
                ) {
                    var y = this.getBoundingClientRect();
                    (f = t.clientX - y.left), (m = t.clientY - y.top);
                }
                return (
                    (t.deltaX = d),
                        (t.deltaY = p),
                        (t.deltaFactor = r),
                        (t.offsetX = f),
                        (t.offsetY = m),
                        (t.deltaMode = 0),
                        a.unshift(t, c, d, p),
                    o && clearTimeout(o),
                        (o = setTimeout(i, 200)),
                        (e.event.dispatch || e.event.handle).apply(this, a)
                );
            }
        }

        function i() {
            r = null;
        }

        function n(e, t) {
            return u.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0;
        }

        var o,
            r,
            s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            a = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            l = Array.prototype.slice;
        if (e.event.fixHooks) for (var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
        var u = (e.event.special.mousewheel = {
            version: "3.1.11",
            setup: function () {
                if (this.addEventListener) for (var i = a.length; i;) this.addEventListener(a[--i], t, !1);
                else this.onmousewheel = t;
                e.data(this, "mousewheel-line-height", u.getLineHeight(this)), e.data(this, "mousewheel-page-height", u.getPageHeight(this));
            },
            teardown: function () {
                if (this.removeEventListener) for (var i = a.length; i;) this.removeEventListener(a[--i], t, !1);
                else this.onmousewheel = null;
                e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height");
            },
            getLineHeight: function (t) {
                var i = e(t)["offsetParent" in e.fn ? "offsetParent" : "parent"]();
                return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10);
            },
            getPageHeight: function (t) {
                return e(t).height();
            },
            settings: {adjustOldDeltas: !0, normalizeOffset: !0},
        });
        e.fn.extend({
            mousewheel: function (e) {
                return e ? this.bind("mousewheel", e) : this.trigger("mousewheel");
            },
            unmousewheel: function (e) {
                return this.unbind("mousewheel", e);
            },
        });
    }),
    (function (e) {
        function t() {
            for (var t in ((r = !1), n)) {
                var o = e(n[t]).filter(function () {
                    return e(this).is(":appeared");
                });
                if ((o.trigger("appear", [o]), i)) {
                    var s = i.not(o);
                    s.trigger("disappear", [s]);
                }
                i = o;
            }
        }

        var i,
            n = [],
            o = !1,
            r = !1,
            s = {interval: 250, force_process: !1},
            a = e(window);
        (e.expr[":"].appeared = function (t) {
            var i = e(t);
            if (!i.is(":visible")) return !1;
            var n = a.scrollLeft(),
                o = a.scrollTop(),
                r = i.offset(),
                s = r.left,
                l = r.top;
            return l + i.height() >= o && l - (i.data("appear-top-offset") || 0) <= o + a.height() && s + i.width() >= n && s - (i.data("appear-left-offset") || 0) <= n + a.width();
        }),
            e.fn.extend({
                appear: function (i) {
                    var a = e.extend({}, s, i || {}),
                        l = this.selector || this;
                    if (!o) {
                        var c = function () {
                            r || ((r = !0), setTimeout(t, a.interval));
                        };
                        e(window).scroll(c).resize(c), (o = !0);
                    }
                    return a.force_process && setTimeout(t, a.interval), n.push(l), e(l);
                },
            }),
            e.extend({
                force_appear: function () {
                    return !!o && (t(), !0);
                },
            });
    })(jQuery),
"function" != typeof Object.create &&
(Object.create = function (e) {
    function t() {
    }

    return (t.prototype = e), new t();
}),
    (function (e, t, i, n) {
        "use strict";
        var o = {
            init: function (i, n) {
                (this.options = e.extend({}, e.fn.singlePageNav.defaults, i)),
                    (this.container = n),
                    (this.$container = e(n)),
                    (this.$links = this.$container.find("a")),
                "" !== this.options.filter && (this.$links = this.$links.filter(this.options.filter)),
                    (this.$window = e(t)),
                    (this.$htmlbody = e("html, body")),
                    this.$links.on("click.singlePageNav", e.proxy(this.handleClick, this)),
                    (this.didScroll = !1),
                    this.checkPosition(),
                    this.setTimer();
            },
            handleClick: function (t) {
                var i = this,
                    n = t.currentTarget,
                    o = e(n.hash);
                t.preventDefault(),
                o.length &&
                (i.clearTimer(),
                "function" == typeof i.options.beforeStart && i.options.beforeStart(),
                    i.setActiveLink(n.hash),
                    i.scrollTo(o, function () {
                        i.options.updateHash && history.pushState && history.pushState(null, null, n.hash), i.setTimer(), "function" == typeof i.options.onComplete && i.options.onComplete();
                    }));
            },
            scrollTo: function (e, t) {
                var i = this,
                    n = i.getCoords(e).top,
                    o = !1;
                i.$htmlbody.stop().animate(
                    {scrollTop: n},
                    {
                        duration: i.options.speed,
                        easing: i.options.easing,
                        complete: function () {
                            "function" != typeof t || o || t(), (o = !0);
                        },
                    }
                );
            },
            setTimer: function () {
                var e = this;
                e.$window.on("scroll.singlePageNav", function () {
                    e.didScroll = !0;
                }),
                    (e.timer = setInterval(function () {
                        e.didScroll && ((e.didScroll = !1), e.checkPosition());
                    }, 250));
            },
            clearTimer: function () {
                clearInterval(this.timer), this.$window.off("scroll.singlePageNav"), (this.didScroll = !1);
            },
            checkPosition: function () {
                var e = this.$window.scrollTop(),
                    t = this.getCurrentSection(e);
                null !== t && this.setActiveLink(t);
            },
            getCoords: function (e) {
                return {top: Math.round(e.offset().top) - this.options.offset};
            },
            setActiveLink: function (e) {
                var t = this.$container.find("a[href$='" + e + "']");
                t.hasClass(this.options.currentClass) || (this.$links.removeClass(this.options.currentClass), t.addClass(this.options.currentClass));
            },
            getCurrentSection: function (t) {
                var i, n, o;
                for (i = 0; i < this.$links.length; i++) (n = this.$links[i].hash), e(n).length && t >= this.getCoords(e(n)).top - this.options.threshold && (o = n);
                return o || (0 === this.$links.length ? null : this.$links[0].hash);
            },
        };
        (e.fn.singlePageNav = function (e) {
            return this.each(function () {
                Object.create(o).init(e, this);
            });
        }),
            (e.fn.singlePageNav.defaults = {
                offset: 0,
                threshold: 120,
                speed: 400,
                currentClass: "current",
                easing: "swing",
                updateHash: !1,
                filter: "",
                onComplete: !1,
                beforeStart: !1
            });
    })(jQuery, window, document),
    $(document).ready(function () {
        initOutdoor(), initparallax();
    });
