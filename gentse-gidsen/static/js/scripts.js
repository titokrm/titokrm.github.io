$(function($){
  var hint_open = false;
  $('body').on('click', 'header .panel .show-drop', function () {
    $(this).parent().addClass('active');
    $(this).next('.drop').slideToggle().find('input:first').focus();
    $('.overlay-drop').toggleClass('active');
    return false;
  });
  $('body').on('click', '.overlay-drop', function () {
    $('.overlay-drop').removeClass('active');
    $('header .panel div').removeClass('active');
    $('header .panel .drop').slideUp();
    return false;
  });
  $('body').on('click', '.tabs #busines', function () {
    $('.tabs li').removeClass('active');
    $(this).addClass('active');
    $('.tabs-content > div').removeClass('active');
    $('.tabs-content #tab-busines').addClass('active');
    return false;
  });
  $('body').on('click', '.tabs #individual', function () {
    $('.tabs li').removeClass('active');
    $(this).addClass('active');
    $('.tabs-content > div').removeClass('active');
    $('.tabs-content #tab-individual').addClass('active');
    return false;
  });
  $('body').on('click', '.show-more-btn', function () {
    $(this).toggleClass('active');
    $(this).prev('.add-options').slideToggle();
    return false;
  });
  $('body').on('click', '.select-custom.btn-select', function () {
    $(this).toggleClass('active');
    return false;
  });
  $('body').on('click', '.filter.active .collapsed-btn', function () {
    $(this).toggleClass('active');
    $(this).next('.collapsed-item').slideToggle();
    return false;
  });
  $('body').on('click', '.show-window', function () {
    $('.window').addClass('active');
    $('body').addClass('no-scroll');
    return false;
  });
  $('body').on('click', '.window .title .close', function () {
    $(this).parents('.window').removeClass('active');
    $('body').removeClass('no-scroll');
    return false;
  });
  $('body').on('click', '.hint', function () {
    $(this).toggleClass('active');
    return false;
  });
  $(document).on('click', '', function () {
    $('.hint').removeClass('active');
  });
  $('body').on('click', '.items-profile-edit .link-btn a', function () {
    $(this).parents('.item').children('.txt-form').addClass('active');
    return false;
  });
  $('body').on('click', '.items-profile-edit .item .cancel-btn', function () {
    $(this).parents('.item').children('.txt-form').removeClass('active');
    return false;
  });
  /*
  $(function(){
    var position_filter = jQuery(".fixed-scroll").offset().top;
    $(window).scroll(function() {
     var top = $(document).scrollTop();
     if (top > position_filter - 28) $('.fixed-scroll').addClass('fixed')
     else $('.fixed-scroll').removeClass('fixed');
    });
  });
*/
  $(".slider").owlCarousel({
 
    navigation : true, // Show next and prev buttons
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem:true
 
  });

    var leftPosition,
        TIME_ANIMATION = 300,
        LEFT_MARGIN = 78;

    leftPosition = $('.wrapper-animation-menu').width();

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
        leftPosition = $('.wrapper-animation-menu').width();
        if (leftPosition > (961 - getScrollWidth()))
        {
            $('.wrapper-all').removeClass('menu-visible');
            $(".wrapper-animation-menu").css('left', '0px');
            $("header .menu").css('left', '100%');
            $("header .top-mobile").css('left', '0');
        }
        $(".wrapper-all.menu-visible .wrapper-animation-menu").css('left', (leftPosition - LEFT_MARGIN) * -1 + 'px');
        $(".wrapper-all.menu-visible header .top-mobile").css('left', (leftPosition - LEFT_MARGIN) * -1 + 'px');
        $(".wrapper-all.menu-visible header .menu").css("width", $('.wrapper-animation-menu').width()-LEFT_MARGIN+'px');
        $('.filter-block form').css('top',$('.filter-block .active-filter').innerHeight());
    });

    $('body').on('click', '.overlay', function () {
        $(".wrapper-animation-menu").animate({
            left:0
          }, TIME_ANIMATION );
        $("header .top-mobile").animate({
            left:0
          }, TIME_ANIMATION );
        $("header .menu").animate({
            left:'100%'
          }, TIME_ANIMATION, function () {$('.wrapper-all').removeClass('menu-visible')} );
        return false;
    });

    $('body').on('click', '.menu-btn', function () {
        if ($('.wrapper-all').hasClass('menu-visible'))
        {
            $(".wrapper-animation-menu").animate({
                left:0
              }, TIME_ANIMATION );
            $("header .top-mobile").animate({
                left:0
              }, TIME_ANIMATION );
            $("header .menu").animate({
                left:'100%'
              }, TIME_ANIMATION, function () {$('.wrapper-all').removeClass('menu-visible')} );
            return false;
        }
        $('.wrapper-all').addClass('menu-visible');
        $(".wrapper-all.menu-visible header .menu").css("width", $('.wrapper-animation-menu').width()-LEFT_MARGIN+'px');
        $(".wrapper-animation-menu").animate({
            left:(leftPosition - LEFT_MARGIN) * -1 + 'px'
          }, TIME_ANIMATION );
        $("header .top-mobile").animate({
            left:(leftPosition - LEFT_MARGIN) * -1 + 'px'
          }, TIME_ANIMATION );
        $("header .menu").animate({
            left:LEFT_MARGIN + 'px'
          }, TIME_ANIMATION );
        return false;
    });

	$('body').on('click', 'nav .drop-btn', function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle();
        return false;
    });

    $('body').on('click', '#update', function () {
        $(".update-form").lightbox_me({centered: true, onLoad: function() {
            $(".update-form").find("input:first").focus();
        }});
    });

    $('body').on('click', '#request', function () {
        $(".request-form").lightbox_me({centered: true, onLoad: function() {
            $(".request-form").find("input:first").focus();
        }});
    });
});
