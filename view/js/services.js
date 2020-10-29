
function serviceItem({ popupId, img, title, priceTitle, description, index, sets }) {
  if (sets) {
    popupId = sets.name
  }
  return `
    <div class="choose-service__item popup-btn" data-popup="#${popupId}">
      <div class="choose-service__item-inner">
        <img src="/${img}" class="choose-service__item-img">
        </img>
        <div class="choose-service__item-info">
          <h4 class="choose-service__item-title section-title red">${title}</h4>
          <h5 class="choose-service__item-price small-title">${priceTitle}</h5>
          <p id="service-${index}" class="choose-service__item-description parag read-more__text">
            ${description}
          </p>
          <button class="text-btn red read-more__btn" data-read-more="#service-${index}">
            Читать дальше
          </button>
        </div>
      </div>
    </div>
  `
}

function popupChooseTimeTemplate(id, lessonNum) {
  return `
  <div id="${id}Calendar${lessonNum}" class="popup choose-time">
    <div class="popup__inner">
      <h3 class="popup__title choose-service__options-title section-title">
        Выберите день для ${lessonNum}-го занятия
      </h3>
      <div id="${id}${lessonNum}Datepicker" class="choose-time__datepicker"></div>
      <button id="${id}DatepickerSubmit${lessonNum}" class="calc-datepicker button button--fill m-auto">Далее</button>
      <button id="CalendarBack${lessonNum}" class="choose-time__arrow-back arrow-back">
        <div class="arrow-back__icon">
        </div>
      </button>
      <button class="popup__close"></button>
    </div>
  </div>
  <div id="${id}Time${lessonNum}" class="popup choose-time">
    <div class="popup__inner">
      <h3 class="popup__title choose-service__options-title section-title">
        Выберите время для ${lessonNum}-го занятия
      </h3>
      <strong class="t-center d-block red">Обратите внимание, что выбирать время нужно относительно МСК и на протяжении года время в России не переводится!!!</strong>
      <div class="choose-time__timepicker" id="${id}${lessonNum}Timepicker"></div>
      <button id="${id}${lessonNum}TimepickerSubmit" class="calc-timepicker button button--fill m-auto">Далее</button>
      <button id="TimepickerBack${lessonNum}" class="choose-time__arrow-back arrow-back">
        <div class="arrow-back__icon"></div>
      </button>
      <button class="popup__close"></button>
    </div>
  </div>
  `
}

function popupChooseTime(
  id,
  teacher,
  sum,
  usd,
  title,
  lessonNum,
  lessonsAmount,
  datepicker,
  datesArray,
  vip) {
  if (lessonNum <= lessonsAmount) {
    $('#payment-forms').append(popupChooseTimeTemplate(id, lessonNum))
    $(`#CalendarBack${lessonNum}`).click(() => {
      $(`#${id}Calendar${lessonNum}`).remove()
      $(`#${id}Time${lessonNum}`).remove()
      if (lessonNum > 1) {
        datesArray.pop()
        popupChooseTime(
          id,
          teacher,
          sum,
          usd,
          title,
          lessonNum - 1,
          lessonsAmount,
          datepicker,
          datesArray,
          vip
        )
      }
      else {
        $(`#${id}`).css('display', 'block')
      }
    })
    $(`#${id}Calendar${lessonNum}`).find('.popup__close').click(() => {
      $(this).off()
      $(`#${id}Calendar${lessonNum}`).find('button').off()
      $(`#${id}Time${lessonNum}`).find('button').off()
      $(`#${id}Calendar${lessonNum}`).remove()
      $(`#${id}Time${lessonNum}`).remove()
    })
    $(`#${id}Time${lessonNum}`).find('.popup__close').click(() => {
      $(this).off()
      $(`#${id}Calendar${lessonNum}`).find('button').off()
      $(`#${id}Time${lessonNum}`).find('button').off()
      $(`#${id}Calendar${lessonNum}`).remove()
      $(`#${id}Time${lessonNum}`).remove()
    })
    popup()
    $(`#${id}Calendar${lessonNum}`).css('display', 'block')
    datepicker.init(`${id}${lessonNum}`, title, datesArray, !!vip)
    $(`#${id}DatepickerSubmit${lessonNum}`).click(() => {
      let date = $(`#${id}${lessonNum}Datepicker`).data('datepicker').selectedDates[0]
      let lessonsToday = 0

      $(`#TimepickerBack${lessonNum}`).click(() => {
        $(`#${id}Calendar${lessonNum}`).css('display', 'block')
        $(`#${id}Time${lessonNum}`).css('display', 'none')
        $(`#${id}${lessonNum}TimepickerSubmit`).off()
      })
      if (date) {
        date = new Date(date)
        datesArray.forEach(dateItem => {
          if (dateItem.toDateString() == date.toDateString()) {
            lessonsToday++
          }
        })
        instance.get(`/is-day-free/${date.toISOString()}/${datepicker.maxLessons - lessonsToday}/${datepicker.teacher}?vip=${!!vip}`)
          .then(() => {
            $(`#${id}Calendar${lessonNum}`).css('display', 'none')
            $(`#${id}Time${lessonNum}`).css('display', 'block')
            $('.choose-time__timepicker').trigger("click")
            $(`#${id}${lessonNum}TimepickerSubmit`).click(() => {
              const Time = $(`#${id}${lessonNum}Timepicker`).timepicker('getSecondsFromMidnight')
              if (Time) {
                date.setHours(0)
                date.setMinutes(0)
                date.setSeconds(0)
                date.setTime(date.getTime() + Time * 1000)
                instance.get(`/is-time-free/${date.toISOString()}/${datepicker.maxLessons}/${datepicker.teacher}?vip=${!!vip}`)
                  .then(() => {
                    datesArray.push(date)
                    $(`#${id}Calendar${lessonNum}`).remove()
                    $(`#${id}Time${lessonNum}`).remove()
                    popupChooseTime(
                      id,
                      teacher,
                      sum,
                      usd,
                      title,
                      lessonNum + 1,
                      lessonsAmount,
                      datepicker,
                      datesArray,
                      vip)
                  })
                  .catch(err => {
                    Swal.fire({
                      toast: true,
                      title: err.response.data.message,
                      icon: 'warning',
                      showConfirmButton: false,
                      background: '#131316',
                      iconColor: '#EA2E2E',
                      timer: 4000,
                      showClass: {
                        popup: 'fade-in-vertical',
                      },
                      hideClass: {
                        popup: 'fade-out-vertical',
                      },
                      position: 'top',
                    })
                  })
              }
              else {
                Swal.fire({
                  toast: true,
                  title: 'Выберите время',
                  icon: 'warning',
                  showConfirmButton: false,
                  background: '#131316',
                  iconColor: '#EA2E2E',
                  timer: 4000,
                  showClass: {
                    popup: 'fade-in-vertical',
                  },
                  hideClass: {
                    popup: 'fade-out-vertical',
                  },
                  position: 'top',
                })
              }
            })
          })
          .catch(err => {
            Swal.fire({
              toast: true,
              title: err.response.data.message,
              icon: 'warning',
              showConfirmButton: false,
              background: '#131316',
              iconColor: '#EA2E2E',
              timer: 4000,
              showClass: {
                popup: 'fade-in-vertical',
              },
              hideClass: {
                popup: 'fade-out-vertical',
              },
              position: 'top',
            })
          })
      }
      else {
        Swal.fire({
          toast: true,
          title: 'Выберите день',
          icon: 'warning',
          showConfirmButton: false,
          background: '#131316',
          iconColor: '#EA2E2E',
          timer: 4000,
          showClass: {
            popup: 'fade-in-vertical',
          },
          hideClass: {
            popup: 'fade-out-vertical',
          },
          position: 'top',
        })
      }
    })
  }
  else {
    const hash = Date.now()
    popupTinkoffForm({
      price: sum,
      usd: false,
      calc: false,
      id: id + 'Pay',
      hash,
      teacher,
      chooseTime: true,
    }, true).then((template) => {
      $('#payment-forms').append(template)
      $(`#${id}Pay .arrow-back`).click(() => {
        $(`#TinkoffPayForm${id}Pay${hash}`).off()
        $(`#${id}Pay`).remove()
        datesArray.pop()
        popupChooseTime(
          id,
          teacher,
          sum,
          usd,
          title,
          lessonNum - 1,
          lessonsAmount,
          datepicker,
          datesArray,
          vip
        )
      })
      $(`#${id}Pay`).css('display', 'block')
      $(`#TinkoffPayForm${id}Pay${hash}`).submit(function (e) {
        e.preventDefault()
        popupTinkoffFormSubmit(
          this,
          teacher,
          datepicker.maxLessons,
          `${lessonsAmount} занят., ${teachers[teacher].name}, ${title}`,
          title,
          datesArray,
          vip,
          {
            id,
            sum,
            usd,
            datepicker
          }
        )
      })
      popup()
    })
  }
}

function popupTinkoffFormSubmit(thisForm, teacher, maxLessons, cashBoxDesc, title, datesArray = [], vip) {
  const Name = thisForm.querySelector(`input[name='name']`).value
  const Email = thisForm.querySelector(`input[name='email']`).value
  const Phone = thisForm.querySelector(`input[name='phone']`).value
  const Price = +thisForm.querySelector(`input[name='amount']`).value * 100
  nacl_factory.instantiate(function (nacl) {
    const hash = nacl.encode_utf8(JSON.stringify({
      datesArray,
      maxLessons,
      serviceTitle: title,
      teacher,
      apprenticeName: Name,
      vip: !!vip
    })).join('s')
    let SuccessURL
    if(title == 'ОНЛАЙН-СОВЕТ'){
      SuccessURL = 'https://johnkalligan.ru/success-advice'
    }
    else if(datesArray.length){
      SuccessURL = `https://johnkalligan.ru/success/${hash}`
    }
    else{
      SuccessURL = 'https://johnkalligan.ru/success'
    }
    axios.post('https://securepay.tinkoff.ru/v2/Init', {
      TerminalKey: 'terminalkey',
      OrderId: Date.now(),
      Amount: Price,
      DATA: { Email, Phone, Name },
      Language: "ru",
      Description: cashBoxDesc,
      SuccessURL,
      Receipt: {
        Email,
        Phone,
        EmailCompany: 'inkalian@yandex.ru',
        Taxation: 'usn_income',
        Items: [{
          Name: `${cashBoxDesc} ${teacher == 'john' ? '' : '*'}`,
          Price,
          Quantity: 1.00,
          Amount: '' + Price,
          PaymentObject: 'service',
          Tax: 'none'
        }]
      }
    })
    .then(({ data }) => {
      document.location = data.PaymentURL
    if($('.payment-helper')){
      $('.payment-helper').remove()
    }
    $(thisForm).after(`
      <p class="payment-helper t-center">
      Если кнопка не сработала, перейдите по 
      <a class="red underline" href="${data.PaymentURL}" target="_blank">ссылке</a></p>
    `)
    })
  });
}

function popupTinkoffForm({ price, id, usd, calc, hash, teacher, chooseTime }, show = false) {
  function formTemplate({ price, id, hash }) {
    return `
    <div id="${id}" class="popup" style="display: ${show ? 'block' : 'none'}">
      <div class="popup__inner tinkoffPayForm">
      <div>
          <form id="TinkoffPayForm${id}${hash}" name="TinkoffPayForm${id}${hash}">
            <input class="tinkoffPayRow input" type="hidden" name="terminalkey" value="terminalkey">
            <input class="tinkoffPayRow" type="hidden" name="receipt" value="">
            <input class="tinkoffPayRow input" type="hidden" name="frame" value="true">
            <input class="tinkoffPayRow input" type="hidden" name="language" value="ru">
            <input class="tinkoffPayRow input" required type="hidden" placeholder="Сумма заказа" name="amount" value="${price}">
            <input class="tinkoffPayRow input" type="hidden" placeholder="Номер заказа" name="order">
            <input class="tinkoffPayRow input" required type="text" placeholder="ФИО плательщика" name="name">
            <input class="tinkoffPayRow input" required type="text" placeholder="E-mail" name="email">
            <input class="tinkoffPayRow input" required type="text" placeholder="Контактный телефон" name="phone">
            <input class="tinkoffPayRow button button--pay" type="submit" value="Оплатить">
          </form>
          
          <div class="tinkoffWidgetContainer" id="tinkoffWidgetContainer${id}${hash}"></div>
          <script type="text/javascript">
            const terminalkey${id}${hash} = document.forms.TinkoffPayForm${id}${hash}.terminalkey
            const widgetParameters${id}${hash} = {
              container: 'tinkoffWidgetContainer${id}${hash}',
              terminalKey: terminalkey${id}${hash}.value,
              paymentSystems: {
                ApplePay: { 
                  paymentInfo: function () { 
                    return { infoEmail: "inkalian@yandex.ru", 
                    paymentData: document.forms.TinkoffPayForm${id}${hash}
                    } 
                  }
                }
              },
            };
            initPayments(widgetParameters${id}${hash});
          </script>
          <div class="lesson-signup__socials">
            <div class="socials socials--centered">
              <a href="https://vk.com/emmagilman" target="_blank" class="header-socials__link socials__link">
                <i class="fab fa-vk"></i>
              </a>
              <a href="https://t.me/emmagilman" target="_blank" class="header-socials__link socials__link">
                <i class="fab fa-telegram-plane"></i>
              </a>
              <a href="https://wa.me/79991207708" target="_blank" class="header-socials__link socials__link">
                <i class="fab fa-whatsapp"></i>
              </a>
              <a href="https://www.instagram.com/johnkalligan.official" target="_blank"
                class="header-socials__link socials__link">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        ${chooseTime
        ? `
          <div class="arrow-back tinkoffPayForm__arrow-back">
            <div class="arrow-back__icon"></div>
          </div>
        `: ''}
        <button class="popup__close"></button>
      </div>
    </div>
  `
  }

  return new Promise((resolve) => {
    if (usd && !calc) {
      axios.get('https://www.cbr-xml-daily.ru/daily_json.js').then(({ data: { Valute: { USD: { Value: course } } } }) => {
        price = Math.floor(price * course)
        resolve(formTemplate({ price, id, hash, teacher }))
      })
    }
    else {
      resolve(formTemplate({ price, id, hash, teacher }))
    }
  })
}

function popupChooseSet({ sets, id }) {
  return `
    <div id="${id}" class="popup">
      <div class="popup__inner">
        <h3 class="popup__title choose-service__options-title section-title">${sets.title}</h3>
        <form id="${sets.id}">
          <div class="choose-service__options">
          ${sets.items.map((item, index) => {
    return `
              <div class="choose-service__option">
                <input id="${sets.name}${index}" type="radio" name="${sets.name}" value='${JSON.stringify({
      price: item.price,
      label: item.label,
      lessonsAmount: item.lessonsAmount
    })}'/>
                <label class="small-title" for="${sets.name}${index}">
                  ${item.label}
                </label>
              </div>
            `
  }).join('')}
          </div>
          <button type="submit" class="choose-service__options-submit button button--fill">Далее</button>
        </form>
        <button class="popup__close"></button>
      </div>
    </div>
  `
}

function popupCalc(popupId, discount) {
  return `
    <div id="${popupId}" class="popup">
      <div class="popup__inner">
        <h3 class="popup__title choose-service__options-title section-title">Выберите количество занятий</h3>
          ${discount ? `<small class="parag red t-center d-block">От 4-ех занятий автоматическая скидка ${discount}%</small>` : ''}
          <div class="abonement-calculator">
            <div class="abonement-calculator__controls">
              <button class="abonement-calculator__minus"></button>
              <small class="abonement-calculator__amount small-title"></small>
              <button class="abonement-calculator__plus"></button>
            </div>
            <b class="section-title">Всего: <span class="abonement-calculator__sum"></span>₽</b>
          </div>
          <button id="${popupId}Btn" class="m-auto button button--fill">Далее</button>
        <button class="popup__close"></button>
      </div>
    </div>
  `
}

$(document).ready(() => {
  let teacher = window.location.href.slice(window.location.href.indexOf('choose-service') + 15)
  const datepicker = new Datepicker(
    teachers[teacher].disabledDays,
    teachers[teacher].maxLessons,
    teachers[teacher].timeRanges,
    teacher
  )
  teachers[teacher].services.forEach((service, index) => {
    $('#service-items').append(serviceItem({ ...service, index }))
    if (!service.specialPopup) {
      if (service.calc === false) {
        const hash = Date.now()
        popupTinkoffForm({
          price: service.price,
          usd: service.usd,
          calc: false,
          cashBoxDesc: `${teachers[teacher].name}, (${service.title})`,
          id: service.popupId,
          datepicker: false,
          hash,
          teacher
        }).then((template) => {
          $('#payment-forms').append(template)
          $(`#${service.popupId} .popup__close`).click(() => {
            $('.payment-helper').remove()
          })
          $(`#TinkoffPayForm${service.popupId}${hash}`).submit(function (e) {
            e.preventDefault()
            popupTinkoffFormSubmit(
              this,
              teacher,
              teachers[teacher].maxLessons,
              `${teachers[teacher].name}, (${service.title})`,
              service.title,
              []
            )
          })
          popup()
        })
      }
      else if (service.sets) {
        $('#payment-forms').append(popupChooseSet({ sets: service.sets, id: service.sets.name }))
        $(`#${service.sets.id}`).submit(function (e) {
          e.preventDefault()
          for (let option of $(e.target)[0]) {
            if (option.checked && option.nodeName === "INPUT") {
              const choseTimeInfo = JSON.parse(option.value)
              popupChooseTime(
                service.sets.id,
                teacher,
                choseTimeInfo.price,
                service.usd,
                service.title,
                1,
                choseTimeInfo.lessonsAmount,
                datepicker,
                [],
                false
              )
            }
          }
        })
      }
      else {
        $('#payment-forms').append(popupCalc(service.popupId, service.discount))
        const abonementCalculator = new AbonementCalculator(service.popupId, service.usd, service.price, service.discount)
        abonementCalculator.convert().then(() => {
          $(`#${service.popupId}Btn`).click(function () {
            if ($(`#${service.popupId}Pay`).length) {
              $(`#${service.popupId}Pay`).remove()
            }
            $(`#${service.popupId}`).css('display', 'none')
            popupChooseTime(
              service.popupId,
              teacher,
              abonementCalculator.sum,
              service.usd,
              service.title,
              1,
              abonementCalculator.lessonsAmount,
              datepicker,
              [],
              service.vip
            )
            popup()
          })
        })
      }
    }
    else {
      if (service.calc) {
        $(`#${service.popupId}Btn`).click(() => {
          $(`#${service.popupId}CalcBtn`).off('click')
          $(`#${service.popupId}`).css('display', 'none')
          $('#payment-forms').append(popupCalc(service.popupId + 'Calc', service.discount))
          popup()
          $(`#${service.popupId}Calc`).css('display', 'block')
          const abonementCalculator = new AbonementCalculator(service.popupId + 'Calc', service.usd, service.price, service.discount)
          abonementCalculator.convert().then(() => {
            const hash = Date.now()
            $(`#${service.popupId}CalcBtn`).click(function () {
              if ($(`#${service.popupId}Pay`).length) {
                $(`#${service.popupId}Pay`).remove()
              }
              $(`#${service.popupId}Calc`).css('display', 'none')
              popupTinkoffForm({
                price: abonementCalculator.sum,
                usd: service.usd,
                calc: true,
                cashBoxDesc: `${teachers[teacher].name}, (${service.title})`,
                id: service.popupId + 'Pay',
                hash,
                teacher
              },
                true).then((template) => {
                  $('#payment-forms').append(template)
                  $(`#TinkoffPayForm${service.popupId}Pay${hash}`).submit(function (e) {
                    e.preventDefault()
                    popupTinkoffFormSubmit(
                      this,
                      teacher,
                      teachers[teacher].maxLessons,
                      `${abonementCalculator.lessonsAmount} занят., ${teachers[teacher].name}, (${service.title})`,
                      service.title,
                      [],
                    )
                  })
                  popup()
                })
            })
          })
        })
      }
    }
  })
  $servicesMasonry.masonry('reloadItems')
  $servicesMasonry.masonry('layout')
  popup()
})