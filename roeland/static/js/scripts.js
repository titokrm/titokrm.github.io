$(function($){
    var widthBody,
        reviewsSlider,
        reviewsSliderOwl,
        TIME_ANIMATION = 500,
        LEFT_MARGIN = 61;

    widthBody = $('body').width();

    function getScrollWidth() {
        var div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        var scrollWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
        return scrollWidth;
    }

    $(window).resize(function(){
        var tmp;

        widthBody = $('body').width();
        if (widthBody > (961 - getScrollWidth()))
        {
            $('body').removeClass('menu-visible');
            $(".mobile-header .menu").css('left', '100%');
        }
        $(".mobile-header .menu").css("width", widthBody-LEFT_MARGIN+'px');
    });

    $('body').on('click', '.overlay', function () {
        $(".mobile-header .menu").animate({
            left:'100%'
          }, TIME_ANIMATION, function () {$('body').removeClass('menu-visible')} );
        return false;
    });

/*    $('body').on('click', '.menu-close', function () {
        $("header .menu").animate({
            left:'100%'
          }, TIME_ANIMATION, function () {$('body').removeClass('menu-visible')} );
        return false;
    });
*/
    $('body').on('click', '.menu-btn', function () {
        if ($('body').hasClass('menu-visible'))
        {
            $(".mobile-header .menu").animate({
                left:'100%'
              }, TIME_ANIMATION, function () {$('body').removeClass('menu-visible')} );
            return false;
        }
        $('body').addClass('menu-visible');
        widthBody = $('body').width();
        $(".mobile-header .menu").css("width", widthBody-LEFT_MARGIN+'px');
        $(".mobile-header .menu").animate({
            left:LEFT_MARGIN
          }, TIME_ANIMATION );
        return false;
    });


    $(document).ready(function() {
     
      $(".work-with-us .slider").owlCarousel({
     
          navigation : false,
          slideSpeed : 300,
          paginationSpeed : 400,
          singleItem:true
      });
     
    });

    $('body').on('click', '.user .name', function () {
        $(this).parents('.wrap').toggleClass('with-user-menu');
        $(this).next('.user-menu').slideToggle();
        return false;
    });

    $('body').on('click', '.show-search-form-btn', function () {
        $('body').addClass('menu-visible');
        $('.refine-search').show();
        return false;
    });

    $('body').on('click', '.refine-search .close', function () {
        $('body').removeClass('menu-visible');
        $('.refine-search').hide();
        return false;
    });

    $('body').on('click', '.show-booking-form-btn', function () {
        $('body').addClass('menu-visible');
        $('.booking-sum').show();
        return false;
    });

    $('body').on('click', '.booking-sum .close', function () {
        $('body').removeClass('menu-visible');
        $('.booking-sum').hide();
        return false;
    });

    $('body').on('click', '.drop-menu-btn .btn-menu', function () {
        $('.drop-menu').slideToggle();
        return false;
    });

    $('body').on('click', '.faq h2 span', function () {
        $(this).parent().toggleClass('active');
        $(this).parent().next('.faq-list').slideToggle();
        return false;
    });

    $('body').on('click', '.faq-list h3 span', function () {
        $(this).parent().next('.answer').slideToggle();
        return false;
    });

    $(document).ready(function() {
     
      var owl = $(".similar .slider .wrap");
     
      owl.owlCarousel({
          itemsCustom : [
            [0, 1],
            [943, 4]
          ],
          navigation : false
      });
     
    });

    $(document).ready(function() {
     
      var owl = $("article .picture .slider");
     
      owl.owlCarousel({
          itemsCustom : [
            [0, 1],
            [943, 2]
          ],
          navigation : false
      });
     
    });

    $(document).ready(function() {
     
      var owl = $(".list-moonth .slider");
     
      owl.owlCarousel({
          itemsCustom : [
            [0, 1],
            [543, 2],
            [751, 3]
          ],
          pagination : false
      });
     
      // Custom Navigation Events
      $(".btn-prev").click(function(){
        owl.trigger('owl.next');
      })
      $(".btn-next").click(function(){
        owl.trigger('owl.prev');
      })
    });

});

    $(document).ready(function() {
     
        $(window).scroll(function() { 
          var position_footer = $("footer").offset().top;
          var top_2 = $(document).scrollTop() + $(window).height() - parseInt($('.show-search-form-btn').css('bottom')) + 10;
          if (top_2 >= position_footer) $('.show-search-form-btn').addClass('hidden')
          else $('.show-search-form-btn').removeClass('hidden');
        });
     
        $(window).scroll(function() { 
          var position_similar;
          var top = $(document).scrollTop() + $(window).height() - parseInt($('.show-booking-form-btn').css('bottom'));
          if ($(".similar").length)
          {
              position_similar = $(".similar").offset().top;
              if (top >= position_similar) $('.show-booking-form-btn').addClass('hidden')
              else $('.show-booking-form-btn').removeClass('hidden');
          }
        });
     
        $(window).scroll(function() { 
          var top = $(document).scrollTop();
            if ($(".camp-detail article").length)
            {
              var position_booking = $(".camp-detail article").offset().top - 10;
              var end_article_pos = $(".camp-detail article").offset().top + $(".camp-detail article").height();
              var height_booking = $(".booking-sum").innerHeight();
              if (top >= position_booking) $('.booking-sum').addClass('fixed')
              else $('.booking-sum').removeClass('fixed');
              if (top >= (end_article_pos - height_booking))
              {
                  $('.booking-sum').addClass('absolute');
              }
              else {
                  $('.booking-sum').removeClass('absolute');
              }
            }
        });
     
    });

$(function() {
    var widthBody,
        reviewsSlider,
        reviewsSliderOwl;

    widthBody = $('body').width();

    function getScrollWidth() {
        var div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        var scrollWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
        return scrollWidth;
    }

    $(document).ready(function() {
        $(window).resize(function(){
            widthBody = $('body').width();
            if (widthBody < (961 - getScrollWidth()))
            {
                if (reviewsSlider == false)
                {
                  reviewsSliderOwl.owlCarousel({
                      singleItem:true,
                      navigation : false
                  });
                  reviewsSlider = true;
                }
            }
            else {
                reviewsSliderOwl.data('owlCarousel').destroy();
                reviewsSlider = false;
            }
        });
          reviewsSliderOwl = $(".slider-volunteers .wrap");
          reviewsSlider = false;
          if (widthBody < (961 - getScrollWidth()))
          {
              reviewsSlider = true;
              reviewsSliderOwl.owlCarousel({
                  singleItem:true,
                  navigation : false
              });
          }
    });
});

$(document).ready(function(){
    $("ul.tabs").jTabs({content: ".tabs-content", animate: true, effect:"fade"});
});
