$(function(){
    $('.mobile-menu-btn').click(function(){
        if ($(this).hasClass('is-active')) {
            $(this).removeClass('is-active');
            $('.mobile-nav-holder').hide('slow');
        } else {
            $(this).addClass('is-active');
            $('.mobile-nav-holder').show('slow');
        }
    });
});