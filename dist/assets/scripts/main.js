// Created by sam mok 2015(Siso brand interactive team).

"use strict";

var app = {
    config: function (){

    },

    create: function (){
        //  create slider
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'vertical',

            // init
            onInit: function () {
              $('.scene01').addClass('active');
            },

            //  router
            onTransitionEnd: function (swiper) {
                var curIndex = swiper.activeIndex;

                $('.scene').eq(curIndex).addClass('active')
                    .siblings('.scene').removeClass('active');
            }
        });

        $('.trigger').click(function () {
            $('.scene01').toggleClass('active');
        });
    },

    start: function (){
        this.create();
    }
};

$(function (){
    // init app
    app.start();
});