

(function () { // $(document).ready의 축약 형 - DOM 로드 후 실행
    
        'use strict';
    
        var pluginName = 'touchSlide',
            version = '1.0.0',
            defaultsOptions = {
            width: 320,
            height: 260,
            mode: 'horizontal'
        };
    
        jQuery.fn[pluginName] = function(options) {
    
            var options = $.extend(true, {}, defaultsOptions, options);
    
            this.each(function (index, item) {
    
                var el = $(item),
                    ul = el.find('> ul'),
                    length = ul.find(' > li').length;
    
                var init = function () {
                    var elSize = { width: options.width, height: options.height };
                    var ulW = { width: ( (length + 2) * 100 ) + '%' };
                    var pagesW = { width: ( 100 / (length + 2) ) + '%' };
    
                    el.css( elSize );
                    ul.css( ulW );
                    ul.prepend( ul.find('li:last').clone() );
                    ul.append( ul.find('li:eq(1)').clone() );
                    ul.css({ left: -options.width });
    
                    ul.find(' > li').each(function(i, item){
                        $(item).css((function(j){
                            var left = 0;

                            if ( j > 2 ) {
                                return $.extend({}, pagesW, {opacity: 0});
                            } else {
                                return $.extend({}, pagesW);
                            }
    
                        })(i));
                    });
                };
                init();
    
                var sd = {
                    tsY: 0,
                    tsX: 0,
                    sX: -options.width,
                    sY: 0,
                    mdX: 0,
                    ci: 1
                };

                var _start = function ( event ) {
                    var event = event.originalEvent || window.event;
    
                    if ( event.touches.length === 1 ) {
                        sd.tsX = event.touches[0].pageX;
                        sd.tsY = event.touches[0].pageY;
                    }
                };
    
                var _move = function ( event ) {
                    var event = event.originalEvent || window.event;
                    var drag_dist = 0;
                    var scroll_dist = 0;
                    var list_width = options.width;
                        
                    if ( event.touches.length === 1 ) {
                        drag_dist = event.touches[0].pageX - sd.tsX;
                        scroll_dist = event.touches[0].pageY - sd.tsY;
                        sd.mdX = ( drag_dist / list_width ) * 100;
    
                        if ( Math.abs( drag_dist ) > Math.abs( scroll_dist ) ) {
                
                            // move 할 동안 위치 반영
                            ul.css({ left: sd.sX + drag_dist });
                
                            event.preventDefault( );
                        }
                    }
                };
    
                var _endOrCancel = function ( event ) {
                    var event = event.originalEvent || window.event;
                    var left = 0;
                    if ( event.touches.length === 0 ) {
                        
                        var ulLeft = ul.position().left;
    
                        if ( Math.abs( sd.mdX ) > 30 ) {
                            
                            console.log('다음인지 이전인지 판단');

                            // next
                            if ( sd.mdX < 0 ) {
                                console.log('다음');
                                ani( -(options.width*2),  function () {
                                    ul.find('li:eq(0)').insertAfter( ul.find('li:last') );
                                    ul.find('> li').each(function(i, item){
                                        $(item).css({ opacity: i > 2 ? 0 : 1 });
                                    });
                                    ul.css({ left: -options.width });
                                });
                            }
                             // prev
                            if ( sd.mdX > 0 ) {
                                console.log('이전');
                                ani( left, function () {
                                    ul.find('li:last').insertBefore( ul.find('li:eq(0)') );
                                    ul.find('> li').each(function(i, item){
                                        $(item).css({ opacity: i > 2 ? 0 : 1 });
                                    });
                                    ul.css({ left: -options.width });
                                });
                            }
    
                        } else {
                            console.log("되돌리기");
                            ul.stop().animate({left: sd.sX}, 'swing', function () {
                            });
                        }
                        
                        sd.tsY = 0;
                        sd.tsX = 0;
                        sd.mdX = 0;
                        sd.sX = -options.width;
                
                        event.preventDefault( );
                    }
                };

                // 슬라이드 이동 애니메이션
                var ani = function ( distance, callback) {
                    var target = ul;
                    target.stop().animate({left: distance}, 'swing', callback);
                };

    
                el.on({
                    touchstart: _start,
                    touchmove: _move,
                    touchend: _endOrCancel,
                    touchcancel: _endOrCancel
                });
            
            });
    
        };
    
    })();
    
    
    
    
    // (function (win, doc) {
    
    //     // array method group
    //     var arrayProto = Array.prototype;
    //     var forEach = arrayProto.forEach;
    //     var map = arrayProto.map;
    
    //     // object method group
    //     var objProto = Object.prototype;
    //     var assign = Object.assign;
    //     var keys = Object.keys;
    //     var objToString = objProto.toString;
    
    //     //css 할당
    //     var css = function ( selector, styleObj ) {
    //         IsDOM = isDOM(selector);
    //         var target = isDOM ? selector : doc.querySelector(selector);
    
    //         //get style
    //         if ( undefined == styleObj || Object.keys(styleObj).length == 0 ) {
    
    //             var styles = {};
    //             var target = {}
    
    //             for (var i in target.style ) {
    //                 if ( target.style[i] != "" ) {
    //                     styles[i] = target.style[i];
    //                 }
    //             }
    
    //             return styles;
    
    //         }
    
    //         // set style
    //         var condition = objToString.call(styleObj).toLowerCase().replace(/\[|\]/gi, "").split(" ")[1];
    
    //         if ( condition !== 'object' ) {
    //             return console.error('styleObj is only \'Object\'!!');
    //         }
    
    //         console.log(target);
    //         var targetStyle = target.getAttribute("style");
            
    //         var styleStr = targetStyle == null ? "" : targetStyle ;
    
    //         keys(styleObj).map(function(cv, i, arr){
    //             styleStr += cv + ':' + styleObj[cv] + ';';
    //         });
    
    //         target.setAttribute("style", styleStr);
    
    //     };
    
    //     css.units = ['px', '%', 'em', 'pt'];
    
    //     var isDOM = function ( target ){
    //         if ( target.nodeType == 1 ) return true;
    //         else return false;
    //     };
    
    //     var defaultOptions = {
    //         //style
    //         width: 'auto'
    //         ,height: 'auto'
    
    //         // mode (fade, horizontal)
    //         ,mode: 'horizontal'
    //     };
    
    //     var SwipeSlide = (function(){
    //         return function SwipeSlide(selector, options) {
    //             this.options = Object.assign({}, defaultOptions, options);
    //             this.el = doc.querySelector(selector);
                
    //             // DOM 존재 여부 판단 후 처리
    //             if ( this.el.length == 0 ) {
    //                 return console.error("can not find \'selector\'!!");
    //             } else {
    //                 this.init();
    //             }
    //         }
    //     })();
    
    //     SwipeSlide.prototype.init = function() {
    //         var that = this;
    //         var target = that.el.querySelectorAll("ul > li");
    
    //         css(that.el, {width: that.options.width + 'px'})
    
    //         forEach.call(target, function(cv, i, arr){
    //             if ( i == 0 ) {
    //                 css(cv, {
    //                     left: 0,
    //                     top: 0
    //                 });
    //             }
                
    //             if ( i !== 1 ) else {
    //                 console.log(css(cv));
    //                 css(cv, {
    //                     left: that.options.width + 'px'
    //                 });
    //             }
    
    //         });
    //     };
    
    //     window.SwipeSlide = SwipeSlide;
    
    // })(window, document);