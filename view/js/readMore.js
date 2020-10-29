$(document).ready(function(){

  $('.read-more__btn').click(function(e){  
    e.stopPropagation()
    if($(this).text().trim() == 'Читать дальше')
      $(this).text('Скрыть текст')
    else
      $(this).text('Читать дальше')

    $($(this).data("read-more")).toggleClass('read-more__text--stretched')
    $servicesMasonry.masonry('layout')
    let elementOffset = $(this).closest('.choose-service__item').offset().top - 100
    $('html, body').animate({scrollTop : elementOffset}, 0);
  })
})