// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    preload: function (){
        var runningTimerStart = new Date();
        var loadingIndex = 1;
        var loadingTimer = null;

        loadingTimer = setInterval(function () {
            loadingIndex++;

            //  if the next frame over the last frame
            if (loadingIndex == 4) {
                $('.loading-img').prop('src', 'assets/images/loading01.png');
                loadingIndex = 1;
            } else {
                $('.loading-img').prop('src', 'assets/images/loading0' + loadingIndex + '.png');
            }
        }, 800);


        var imgSrcArr = [
            'scene01-01',
            'scene01-02',
            'scene01-03',
            'scene01-04',

            'scene02-01',
            'scene02-02',
            'scene02-03',
            'scene02-04',
            'scene02-05',

            'scene03-01',
            'scene03-02',
            'scene03-05',

            'scene04-01',
            'scene04-02',
            'scene04-03',
            'scene04-05',

            'scene05-01',
            'scene05-02',
            'scene05-03',
            'scene05-05',

            'scene06-01',
            'scene06-02',
            'scene06-05'
        ];
        var imgPath = "assets/images/";
        var imgLength = imgSrcArr.length;
        var loadedLength = 0;
        var isLoaded = false;

        for (var i = 0; i < imgLength; i++) {
            var img = new Image();
            img.src = imgPath + imgSrcArr[i] + '.png';

            img.onload = function () {
                loadedLength++;

                /* check img load progress */
                if (checkIsAllLoaded() && isLoaded == false) {
                    var runningTimerEnd = new Date();
                    isLoaded = true;

                    if (runningTimerEnd - runningTimerStart < 1000*3) {
                        setTimeout(function () {
                            $('.loading').fadeOut();
                            $('.swiper-container').removeClass('hide');
                            app.create();
                            clearInterval(loadingTimer);

                            console.log('images load end');
                        //}, 3000);
                        }, 1);
                    }
                }
            };
        }

        function checkIsAllLoaded () {
            var loadedRate = 0.8;
            return loadedLength / imgLength <= imgLength*loadedRate;
        }
    },

    create: function (){
        //  create slider
        app.mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            noSwiping: false,

            // init
            onInit: function () {
                console.log('Initialized...');
                $('.scene01').addClass('active');
            },

            //  router
            onTransitionEnd: function (swiper) {
                var curIndex = swiper.activeIndex;

                //  show bg
                $('.scene').eq(curIndex).addClass('activeBg')
                    .siblings('.scene').removeClass('activeBg');

                //  show content
                setTimeout(function () {
                    $('.scene').eq(curIndex).addClass('active')
                        .siblings('.scene').removeClass('active');
                }, 250);
            }
        });

        //  first time play BGM
        var isPlay = false;
        $('body').click(function () {
            isPlay == false ? $('audio')[0].play() : false;
            isPlay = true;
        });

        //  bind play again button
        $('.playAgain').click(function(){
            app.mySwiper.slideTo(0, 0, false);
            setTimeout(function () {
                $('.scene01').addClass('active')
                    .siblings('.scene').removeClass('active');
            }, 100);
        });

        // init game
        toTickerGame();

        //  开始游戏
        function toTickerGame () {
            /** debug */
            clearPlayCache();

            if (!localStorage.isUserPlayedDuanwujie) {
                app.server();
            } else {
                //  赢了卷
                if (localStorage.isWinDuanwujie == 200) {
                    $('.scene07 > *').hide();
                    $('.scene07 .get-ticket').show();

                }
                //  活动过期
                else if (localStorage.isWinDuanwujie == 10086) {
                    $('.scene07 > *').hide();
                    $('.scene07 .end').show();
                } else {
                    $('.scene07 > *').hide();
                    $('.scene07 .not-get').show();
                }
            }
        }

        //  clear play cache
        function clearPlayCache () {
            localStorage.removeItem("isUserPlayedDuanwujie");
            localStorage.removeItem("isWinDuanwujie");
        }
    },

    server: function () {
        console.log("Initializing server...");

        //  try button
        $('.try .try-btn').unbind('click');
        $('.try .try-btn').bind('click', choujiang);

        //  抽奖粽子跟抽奖按钮的效果
        setTimeout(function () {
            $('.try .zongzi').addClass('bounce');
            setTimeout(function () {
                $('.try .try-btn').addClass('bounceIn');
            }, 1100);
        }, 400);

        //  抽奖
        function choujiang (){
            //  get game result from server
            if (!localStorage.isUserPlayedDuanwujie) {
                console.log('连接抽奖服务器');

                $.ajax({
                    url: 'http://120.26.48.94:88/sijishangdong/userinfo',
                    type: 'GET',
                    crossDomain: true,
                    statusCode: {
                        200: function () {
                            console.log('你中奖了哥们');
                            localStorage.isWinDuanwujie = 200;

                            $('.scene07 .get-ticket').fadeIn();
                            $('.stars, .stars2').addClass('animated infinite bounceIn').removeClass('hide');

                            setTimeout(function () {
                                $('.scene07 .form').fadeIn(800);
                            }, 1800);

                            $('.form-close').unbind('click');
                            $('.form-close').bind('click', function () {
                                $('.form').fadeOut();
                                setTimeout(function () {
                                    $('.form-before').show();
                                    $('.form-after').hide();
                                }, 300);

                                // jump to last scene
                                setTimeout(function () {
                                    //  go to final scene
                                    setTimeout(function () {
                                        app.mySwiper.slideTo(7, 1000, false);
                                    }, 900);
                                }, 400);
                            });
                        },

                        10010: function () {
                            console.log('你没中奖');
                            $('.scene07 .not-get').show();
                            localStorage.isWinDuanwujie = 10010;
                        },

                        10086: function () {
                            console.log("活动结束");
                            $('.scene07 .end').show();
                            localStorage.isWinDuanwujie = 10086;
                        }
                    }
                });

                localStorage.isUserPlayedDuanwujie = true;
            } else {
            }

        }

        //  submit user info
        $('.form-submit').unbind('click');
        $('.form-submit').bind('click', submitUserInfo);

        function submitUserInfo () {
            //  test is user's name and phone number valid
            var phoneValid = /^0?(13[0-9]|15[0-9]| 17[0-9] |18[0-9]|14[57])[0-9]{8}$/.test($('.form-number').val());
            if ($('.form-name').val().trim()) {

                if (phoneValid) {
                    var userInfo = {
                        "username": $('.form-name').val(),
                        "phone": $('.form-number').val()
                    };

                    //  push userinfo to server
                    $.ajax({
                        url: 'http://120.26.48.94:88/sijishangdong/userinfo',
                        type: 'POST',
                        dataType: 'json',
                        data: userInfo,
                        crossDomain: true
                    });

                    $('.form-before').hide();
                    $('.form-after').fadeIn();

                    // jump to last scene
                    setTimeout(function () {
                        $('.form').hide();
                        $('.form-before').show();
                        $('.form-after').hide();

                        //  go to final scene
                        setTimeout(function () {
                            app.mySwiper.slideTo(7, 1000, false);
                        }, 900);
                    }, 2000);
                } else {
                    alert("请您填写正确的手机号码.");
                }

            } else {
                alert("请您填写您的称呼和手机号码.");
            }
        }
    },

    start: function (){
        this.preload();
    }
};

$(function (){
    // init app
    app.start();
});