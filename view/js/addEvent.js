const hash = window.location.href.slice(window.location.href.indexOf('success') + 8)
if(hash){
  instance.post('/add-events', {
    hash
  })
  .then(({data:{data}}) => {
    let teacherName
    if(data.teacher == 'Елизавета'){
      teacherName = 'Елизаветe'
    }
    else{
      teacherName = teacherName+'у'
    }
    moment.locale('ru');
    $('#lessons-info').append(`
    Вы записались к ${teacherName} на услугу ${data.serviceTitle} на следующие дни:
    <ul>
    ${data.datesArray.map((date, ind) => `<li><span class="red">${ind+1}.</span> ${moment(date).format('D MMM YYYY, HH:mm')}</li>`).join(' ')}
    </ul>
    `)
  })
  .catch(() => {
    Swal.fire({
      title: `Что-то пошло не так при постановке урока в календарь. Обратитесь, пожалуйста, сюда
      <div class="contacts-section__socials socials">
        <a href="https://vk.com/emmagilman" target="_blank" class="header-socials__link socials__link socials__link--red">
          <i class="fab fa-vk"></i>
        </a>
        <a href="https://t.me/emmagilman" target="_blank" class="header-socials__link socials__link socials__link--red">
          <i class="fab fa-telegram-plane"></i>
        </a>
        <a href="https://wa.me/79991207708" target="_blank" class="header-socials__link socials__link socials__link--red">
          <i class="fab fa-whatsapp"></i>
        </a>
      </div>
      `,
      icon: 'warning',
      showConfirmButton: false,
      background: '#131316',
      iconColor: '#EA2E2E',
      showCancelButton: true,
      cancelButtonColor: '#EA2E2E',
      cancelButtonText: 'Ок',
      showClass: {
        popup: 'fade-in-vertical',
      },
      hideClass: {
        popup: 'fade-out-vertical',
      },
    })
  })  
}
