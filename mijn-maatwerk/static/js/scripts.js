$(function($){
    $('body').on('click', 'header .icon-user', function () {
        $(this).addClass('active');
        return false;
    });
    $('body').on('click', 'header .icon-user .overlay', function () {
        $(this).parent().removeClass('active');
        return false;
    });
    $('body').on('click', 'header .icon-menu', function () {
        $('header .menu').addClass('active');
        return false;
    });
    $('body').on('click', '.close-menu', function () {
        $('header .menu').removeClass('active');
        return false;
    });
    $('body').on('click', '.more-tr', function () {
        $(this).parent().parent().parent().children('.hide').removeClass('hide');
        return false;
    });
    /*
    $('body').on('click', 'header .menu.active ul.first-level > li > a', function () {
        $(this).parent().toggleClass('active');
        $(this).next().slideToggle();
        return false;
    });
    */
    $('body').on('click', '.detailed-edit > ul > li > a', function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle();
        return false;
    });
    $('body').on('click', '#show-modal-create-acc', function () {
        $("#modal-create-acc").lightbox_me({centered: true, onLoad: function() {
            $("#modal-create-acc").find("input:first").focus();
        }});
    });
    $('body').on('click', '#show-modal-edit', function () {
        $("#modal-edit").lightbox_me({centered: true, onLoad: function() {
            $("#modal-edit").find("input:first").focus();
        }});
    });
    $('body').on('click', '#show-modal-new', function () {
        $("#modal-new").lightbox_me({centered: true, onLoad: function() {
            $("#modal-new").find("input:first").focus();
        }});
    });
    $('body').on('click', '#show-modal-select-category', function () {
        $("#modal-select-category").lightbox_me({centered: true});
    });
    $('body').on('click', '#show-modal-select-product', function () {
        $("#modal-select-product").lightbox_me({centered: true});
    });
    $('body').on('click', '#show-modal-select-color', function () {
        $("#modal-select-color").lightbox_me({centered: true});
    });
});

$(document).ready(function() {
    // Transition effect for navbar 
    $(window).scroll(function() {
      // checks if window is scrolled more than 500px, adds/removes solid class
      if($(this).scrollTop() > 300) { 
          $('header').addClass('with-bg');
      } else {
          $('header').removeClass('with-bg');
      }
    });
});