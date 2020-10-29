let $servicesMasonry

function masonry(){
  $('.teachers-grid').masonry({
    // options
    itemSelector: '.teachers-grid__item',
    columnWidth: '.teachers-grid__sizer',
    gutter: 40
  });
  $servicesMasonry = $('#service-items').masonry({
    itemSelector: '.choose-service__item',
    columnWidth: '.choose-service__grid-sizer',
    horizontalOrder: true,
    gutter: 20
  });
}

$(document).ready(function (){
  masonry()
})

