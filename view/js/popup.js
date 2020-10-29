
const popup = function(){
  const closeWindow = function(){
      $('.popup').css('display', 'none');
      $('body').css('overflow','auto');
  }
  $('.popup-btn').click(function(e){
      e.preventDefault();
      e.stopPropagation();
      $($(this).attr('data-popup')).css('display', 'block');
      $('body').css('overflow','hidden');
  });
  $('.popup__close').click(closeWindow);
  $('.popup__sub').click(closeWindow);
}

$(document).ready(function (){
  popup()
})

