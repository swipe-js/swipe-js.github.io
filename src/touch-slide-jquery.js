// for jquery

(function () { // $(document).ready의 축약 형 - DOM 로드 후 실행
    
    'use strict'; // 엄격한 문법 준수
    
    var pluginName = 'touchSlide',
        version = '1.0.0',              // 버전
        defaultsOptions = {             // 기본 설정 옵션
            width: 320,                 // 넓이
            height: 260,                // 높이
            mode: 'horizontal',         // 가로 모드
            speed: 200,                 // 애니메이션 속도
            useSizeUnitPercent: false   // % 사이즈 단위 사용여부
        };

    $.fn[pluginName] = function(options) {
        
        // options 객체에 extend를 통해 '기본설정' 과 매개변수로 들어온 'options'를 하나의 객체로 병합
        var options = $.extend(true, {}, defaultsOptions, options);

        this.each(function (index, item) {

            var el = $(item);                       // 타겟 객체
            var ul = el.find('> ul');               // 타겟의 li를 wrapping하는 ul 태그
            var length = ul.find(' > li').length;   // li의 갯수

            // 초기가 값 설정
            var sd = {
                tsY: 0,                 // 터치 시작 할때 pageY값
                tsX: 0,                 // 터치 시작 할때 pageX값
                sX: -options.width,     // 저장되는 X 좌표 값
                sY: 0,                  // 저장되는 Y 좌표 값
                mdX: 0,                 // 횡 이동 거리
                ci: 1                   // 현재 index 번호
            };

            // 초기화
            var init = function () {
                var 
                elSize = {  // 타겟의 넓이와 높이 설정 (options.width, options.height)
                    width: options.width,
                    height: options.height
                },
                ulW = { // li를 감싸는 ul의 넓이 설정
                    width: ( length * 100 ) + '%'
                },
                pagesW = {  // ul안에 각 li의 넓이 부여 (높이는 스타일시트에서 100% 미리 설정됨)
                    width: ( 100 / length ) + '%'
                };
                
                // 타겟 객체의 사이즈 할당, 하위 ul태그에 넓이 할당
                el.css( elSize ).find(' > ul').css( ulW );
                
                // 마지막 li를 첫번째 li 앞에 삽입 (위치 변경)
                ul.find('> li:last').insertBefore( ul.find('> li:eq(0)') );

                // ul의 left 좌표를 넓이 만큼 왼쪽으로 이동시킴(마지막 li가 맨 앞에 와있으므로)
                ul.css( 'left', -options.width );
                
                // 각 li를 순회하여 마지막, 처음, 2번째 페이지를 제외하고 안보이게 숨김처리
                ul.find(' > li').each(function(i, item){
                    $(item).css((function(j){
                        return $.extend({}, pagesW, {opacity: j > 2 ? 0 : 1});
                    })(i));
                });
            };
            init();

            // touchstart 이벤트 발생시 실행 할 함수
            var _start = function ( event ) {
                // 이벤트 객체 할당
                var event = event.originalEvent || window.event;
                
                // touches 객체의 length 체크(touches 실제 발생 했는지 확인하는 효과)
                if ( event.touches.length === 1 ) {
                    // 원소가 여러개 있는 것이 아니라 프로퍼티 name이 숫자 '0'으로 되어 있어 
                    // 각괄호 표기법을 사용함.
                    sd.tsX = event.touches[0].pageX;
                    sd.tsY = event.touches[0].pageY;
                }
            };
            
            // touchstart 이벤트 발생시 실행 할 함수
            var _move = function ( event ) {
                
                var event = event.originalEvent || window.event,    // 이벤트 객체 할당
                    axisXDistace = 0,                               // 현재 x축 기준 이동거리
                    axisYDistance = 0;                              // 현재 y축 기준 이동거리
                    
                if ( event.touches.length === 1 ) {

                    axisXDistace = event.touches[0].pageX - sd.tsX;     // x축 이동거리 계산
                    axisYDistance = event.touches[0].pageY - sd.tsY;    // y축 이동거리 계산
                    sd.mdX = ( axisXDistace / options.width ) * 100;

                    if ( Math.abs( axisXDistace ) > Math.abs( axisYDistance ) ) {
            
                        // move 할 동안 위치 반영
                        ul.css({ left: sd.sX + axisXDistace });
            
                        event.preventDefault( );
                    }
                }
            };

            var _endOrCancel = function ( event ) {
                var event = event.originalEvent || window.event,
                    left = 0;

                if ( event.touches.length === 0 ) {

                    if ( Math.abs( sd.mdX ) > 30 ) {

                        // next
                        if ( sd.mdX < 0 ) { animation( 'next' ); }

                         // prev
                        if ( sd.mdX > 0 ) { animation( 'prev' ); }

                    } else {
                        animation();
                    }
                    
                    sd.tsY = 0;
                    sd.tsX = 0;
                    sd.mdX = 0;
                    sd.sX = -options.width;
            
                    event.preventDefault( );
                }
            };

            // 슬라이드 이동 애니메이션
            var animation = function ( direction ) {
                var target = ul,
                    left = (function(){
                        switch ( direction ) {
                            case 'next': return -(options.width*2);
                            break;
                            case 'prev': return 0;
                            break;
                            default: return sd.sX;
                        }
                    })();

                target.stop().animate({left: left}, options.speed, 'swing', function(){
                    setAfterAnimation( direction );
                });
            };
            
            // 애니메이션 이동 후 설정
            var setAfterAnimation = function ( direction ) {

                if ( direction === 'next' ) {
                    ul.find('li:eq(0)').insertAfter( ul.find('li:last') );
                } else if ( direction === 'prev' ) {
                    ul.find('li:last').insertBefore( ul.find('li:eq(0)') );
                }

                ul.find('> li').each(function(i, item){
                    $(item).css( 'opacity', i > 2 ? 0 : 1 );
                });
                ul.css( 'left', -options.width );

            };

            // 이벤트 바인딩
            el.on({
                touchstart: _start,
                touchmove: _move,
                touchend: _endOrCancel,
                touchcancel: _endOrCancel
            });

        });
        
    }

})();

$(function() {
    var slide = $('[data-slide-wrapper]').touchSlide({
        width: 320,
        height: 260,
        mode: 'horizontal'
    });
});   