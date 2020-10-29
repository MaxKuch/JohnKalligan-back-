$(document).ready(function(){
  const anchor = window.location.href.slice(window.location.href.indexOf('teachers') + 9)
  const offset = $('#'+anchor).offset().top
  $('html, body').animate({scrollTop: offset}, 0);
})