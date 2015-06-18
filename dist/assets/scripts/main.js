// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    preload: function (){
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
                    $('.loading').fadeOut();
                    $('.swiper-container').removeClass('hide');
                    app.create();
                    isLoaded = true;
                    console.log('images load end');
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
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            effect: 'fade',

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
                $('.scene').eq(curIndex).addClass('active')
                    .siblings('.scene').removeClass('active');
            }
        });

        //  first time play BGM
        var isPlay = false;
        $('body').click(function () {
            isPlay == false ? $('audio')[0].play() : false;
            isPlay = true;
        });
    },

    start: function (){
        this.preload();
    }
};

$(function (){
    // init app
    app.start();
});