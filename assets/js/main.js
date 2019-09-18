"use strict";
var $slider;
jQuery(document).ready(function ($) {

//for Preloader

    $(window).load(function () {
        $("#loading").fadeOut(500);
    });


    /*---------------------------------------------*
     * Mobile menu
     ---------------------------------------------*/
    $('#navbar-menu').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 80)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });



    /*---------------------------------------------*
     * WOW
     ---------------------------------------------*/

    var wow = new WOW({
        mobile: false // trigger animations on mobile devices (default is true)
    });
    wow.init();

// magnificPopup

    $('.popup-img').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    $('.video-link').magnificPopup({
        type: 'iframe'
    });



// slick slider active Home Page Tow
    $slider = $(".hello_slid").slick({
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false,
        arrows: true,
        prevArrow: "<i class='icon icon-chevron-left nextprevleft'></i>",
        nextArrow: "<i class='icon icon-chevron-right nextprevright' id='teste'></i>",
        waitForAnimate: false,
        // fnCanGoNext: function(instance, currentSlide){
        //     console.log("aasdasd");
        //     return false;
        //     // console.log("fnCanGoNext called");
            
        //     // var currentSlide = instance.$slides.eq(currentSlide);
        //     // var checkbox = currentSlide.find("input[type=checkbox]");
            
        //     // if(checkbox.is(':checked')){
        //     //     return true; // allow to go to next
        //     // } else {
        //     //     return false; // cannot go to next
        //     // }
            
        // },
    });
    $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
        if(window.sliderBeforeChange)
            sliderBeforeChange(event, slick, currentSlide, nextSlide);
    });
    $slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
        if(window.sliderAfterChange)
            sliderAfterChange(event, slick, currentSlide, nextSlide);
    });

    $('a[data-slide]').click(function(e) {
        e.preventDefault();
        var slideno = $(this).data('slide');
        $('.hello_slid').slick('slickGoTo', slideno - 1);
      });
    
    
    
    $(".business_items").slick({
        dots: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: "<i class='icon icon-chevron-left nextprevleft'></i>",
        nextArrow: "<i class='icon icon-chevron-right nextprevright'></i>",
    });




//---------------------------------------------
// Scroll Up 
//---------------------------------------------

    $('.scrollup').click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
        return false;
    });











    //End



});



