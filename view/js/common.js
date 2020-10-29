$(document).ready(function () {

    /* SLICK SLIDER */

    $('.team-section__gallery').slick({
        adaptiveHeight: true,
        autoplay: true,
        dots: true, 
    });
    $('.videos-section__gallery').slick({
        autoplay: true,
        dots: true,
        draggable: false,
        fade: true 
    });

    /* SCROLL */

    const scroll = function(){
        $('.scroll-button').click(function(e){
            e.preventDefault();
            let elementOffset = $($(this).attr('data-scroll')).offset().top;
            $('html, body').animate({scrollTop : elementOffset} , 500);    
        });
    }

    /* SIDE MENU */

    const sideMenu = function(){
        let isOpened = false;
        $('.header__side-menu-btn').click(function(){
            $('.side-menu').removeClass('fade-out').css('display', 'block').addClass('fade-in');
            isOpened = true;
        });
        $('.side-menu__close').click(function(){
            $('.side-menu').removeClass('fade-in').addClass('fade-out');
            setTimeout(function(){
                $('.side-menu').css('display', 'none');
            },600);
            isOpened=false;
        });
        $(window).click(function(e){
            if(isOpened){
                if(e.target.closest('[class*="side-menu"]') == null){
                    e.preventDefault();
                    $('.side-menu').removeClass('fade-in').addClass('fade-out');
                setTimeout(function(){
                    $('.side-menu').css('display', 'none');
                },600);
                isOpened=false;
                } 
            }
        });
    }

/* ACORDION */

const faqAccordion = function(){
    var isOpened = false;
    $('.faq-section__item-head').click(function(){
            if($(this).find('.faq-section__item-btn').filter('.rotate-out').length == 0 && $(this).find('.faq-section__item-btn').filter('.rotate-in').length ==0){
                $(this).find('.faq-section__item-btn').addClass('rotate-in');
            }
            else{
                $(this).find('.faq-section__item-btn').toggleClass('rotate-out').toggleClass('rotate-in');
            }
        $(this).next().slideToggle(400, function(){
            if(!isOpened){
                isOpened=true;
            }
        }); 
    });
}

/* DROPDOWN */

const lyricsDropdown = function(selector){
    $(selector).click(function(){
        $(this).next().slideToggle("slow")
    });
}
faqAccordion();
sideMenu();
scroll();
lyricsDropdown("#dropdown-lyrics_winds");
lyricsDropdown(".lesson-signup__btn")
});