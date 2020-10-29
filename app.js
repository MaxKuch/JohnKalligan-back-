const http = require('http');
const axios = require('axios')
const sha256 = require('js-sha256').sha256
const nacl_factory = require("js-nacl");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const { google } = require('googleapis');
const app = express()
const server = http.createServer(app)

const teachersData = {
  john: {
    calendarId: 'primary',
    name: 'Джон'
  },
  egor: {
    calendarId: 'calendarId',
    name: 'Егор'
  },
  vlad: {
    calendarId: 'calendarId',
    name: 'Влад'
  },
  lex: {
    calendarId: 'calendarId',
    name: 'Александр'
  },
  elizabeth: {
    calendarId: 'calendarId',
    name: 'Елизавета'
  }
}

const corsOptions = {
  origin: 'http://localhost:5500',
  credentials: true
}

app.use(bodyParser.json())
app.use(express.static(__dirname + '/view/'))
app.use(cors(corsOptions))

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2(
  'clientId', 
  'clientSecret'
)

oAuth2Client.setCredentials({
  refresh_token: 
    'refresh_token'
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


app.get('/calendar-events/:teacher', (req, response) => {
  const eventStartTime = new Date()
  eventStartTime.setHours(0)
  eventStartTime.setMinutes(0)
  eventStartTime.setSeconds(0)
  const eventEndTime = new Date()
  eventEndTime.setTime(eventStartTime.getTime() + 2419200000 * 7)
  calendar.events.list({
    calendarId: teachersData[req.params.teacher].calendarId,
    timeMin: eventStartTime,
    timeMax: eventEndTime,
    timeZone: req.params.teacher === 'egor' ? 'Europe/Moscow' : 'Europe/Samara',
    maxResults: 2500,
    singleEvents: true
  },
  (err, res) => {
    if(err) return console.error('Free Busy Query Error: ', err)
    const eventsArr = res.data.items
    response.json(eventsArr)
  })
})

function addEvents(
  datesArray, 
  maxLessons, 
  serviceTitle, 
  teacher, 
  apprenticeName, 
  vip,
  lessonNum, 
  resolve, 
  errorMessage){
  if(lessonNum < datesArray.length){
    const date = datesArray[lessonNum]
    const eventStartTime = new Date(date)
      const eventEndTime = new Date(eventStartTime)
      eventEndTime.setMinutes(eventStartTime.getMinutes() + 59)
      calendar.events.list({
        calendarId: teachersData[teacher].calendarId,
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        singleEvents: true,
        timeZone: teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
      },
      (err, res) => {
        if(err){
          errorMessage = 'При постановке урока в календарь что-то пошло не так. Свяжитесь с <a href="https://vk.com/emmagilman" class="red underline d-inline" target="_blank">Эммой</a>'
          addEvents(
            datesArray,
            maxLessons, 
            serviceTitle, 
            teacher, 
            apprenticeName, 
            vip,
            lessonNum + 1, 
            resolve,
            errorMessage
          )
          return 
        }
        const eventsArr = res.data.items
        let eventsAmount = 0
        eventsArr.forEach(event => {
          if(event.summary != 'НЕРАБОЧЕЕ ВРЕМЯ' 
            && new Date(event.start.dateTime).toDateString() == eventStartTime.toDateString()
            && event.status != 'cancelled'){
              eventsAmount++
          }
        })
        if (eventsAmount >= maxLessons && !vip) {
          errorMessage = 'К сожалению, лимит уроков на этот день превышен. Свяжитесь с <a href="https://vk.com/emmagilman" class="red underline d-inline" target="_blank">Эммой</a>'
          addEvents(
            datesArray,
            maxLessons, 
            serviceTitle, 
            teacher, 
            apprenticeName, 
            vip,
            lessonNum + 1, 
            resolve,
            errorMessage
          )
          return
        }
        else{
          const event = {
            summary:  `${apprenticeName} (${serviceTitle} ${lessonNum+1}/${datesArray.length})${teacher == 'john' || lessonNum > 0 ? '' : '*'}`,
            start: {
              dateTime: eventStartTime,
              timeZone: 'Europe/Moscow'
            },
            end: {
              dateTime: eventEndTime,
              timeZone: 'Europe/Moscow'
            },
            colorId: 1
          }
        
          calendar.events.list({
            calendarId: teachersData[teacher].calendarId,
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            singleEvents: true,
            timeZone: teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
          },
          (err, res) => {
            if(err) {
              errorMessage =  'При постановке урока в календарь что-то пошло не так. Свяжитесь с <a href="https://vk.com/emmagilman" class="red underline d-inline" target="_blank">Эммой</a>'
              addEvents(
                datesArray,
                maxLessons, 
                serviceTitle, 
                teacher, 
                apprenticeName, 
                vip,
                lessonNum + 1, 
                resolve,
                errorMessage
              )
            }
            const eventsArr = vip ? res.data.items.filter(event => event.summary != 'НЕРАБОЧЕЕ ВРЕМЯ') : res.data.items
            let eventsAmount = 0
            eventsArr.forEach(event => {
              if(new Date(event.start.dateTime).toDateString() == eventStartTime.toDateString()
                && event.status != 'cancelled'){
                  eventsAmount++
              }
            })
            if (eventsAmount === 0) {
              return calendar.events.insert(
                { calendarId: teachersData[teacher].calendarId, resource: event }, 
                err => {
                  if(err){
                    errorMessage = 'При постановке урока в календарь что-то пошло не так. Свяжитесь с <a href="https://vk.com/emmagilman" class="red underline d-inline" target="_blank">Эммой</a>'
                    addEvents(
                      datesArray,
                      maxLessons, 
                      serviceTitle, 
                      teacher, 
                      apprenticeName, 
                      vip,
                      lessonNum + 1, 
                      resolve,
                      errorMessage
                    )
                    return
                  }
                  else{
                    addEvents(
                    datesArray,
                    maxLessons, 
                    serviceTitle, 
                    teacher, 
                    apprenticeName, 
                    vip,
                    lessonNum + 1, 
                    resolve,
                    errorMessage
                  )
                  }
                })
            }
            else{
              errorMessage = 'При постановке урока в календарь что-то пошло не так. Свяжитесь с <a href="https://vk.com/emmagilman" class="red underline d-inline" target="_blank">Эммой</a>'
              addEvents(
                datesArray,
                maxLessons, 
                serviceTitle, 
                teacher, 
                apprenticeName, 
                vip,
                lessonNum + 1, 
                resolve,
                errorMessage
              )
              return
            }
          })
        }
      })
  }
  else{
    resolve(errorMessage)
  }
}

app.post('/add-events', (req, response) => {
  nacl_factory.instantiate(function (nacl) {
    const calendarData = JSON.parse(nacl.decode_utf8(req.body.hash.split('s')))
    const {
      datesArray, 
      maxLessons, 
      serviceTitle, 
      teacher, 
      apprenticeName, 
      vip } = calendarData
      new Promise(resolve => {
        addEvents(
          datesArray,
          maxLessons, 
          serviceTitle, 
          teacher, 
          apprenticeName, 
          vip,
          0, 
          resolve
        )
      }).then(errorMessage => {
        if(errorMessage){
          return response.status(400).json({ message: errorMessage })
        }
        else{
          response.status(200).json({
            message: 'Урок поставлен в календарь',
            data: {
              datesArray: datesArray,
              serviceTitle: serviceTitle,
              teacher: teachersData[teacher].name,
            }
          })
        }
      })
  });
})

app.get('/calendar-events/:date/:start/:end/:teacher', (req, response) => {
  const eventStartTime = new Date(req.params.date)
  eventStartTime.setHours(req.params.start.slice(0,2))
  const eventEndTime = new Date(eventStartTime)
  eventEndTime.setHours(+req.params.end.slice(0,2)+1)
  calendar.events.list({
    calendarId: teachersData[req.params.teacher].calendarId,
    timeMin: eventStartTime,
    timeMax: eventEndTime,
    singleEvents: true,
    timeZone: req.params.teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
  },
  (err, res) => {
    if(err){
      console.log(err)
       return response.status(500).json({
        mesage: err
      })
    }
    
    let eventsArr = req.query.vip == 'true' ?  res.data.items.filter(event => event.summary != 'НЕРАБОЧЕЕ ВРЕМЯ') : res.data.items
    eventsArr =  eventsArr.map(event => ({
      start: event.start.dateTime,
      end: event.end.dateTime
    }))
    response.json(eventsArr)
  })
})

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'))
})

app.get('/contacts', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'contacts.html'))
})

app.get('/info', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'info.html'))
})

app.get('/order-song', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'order-song.html'))
})

app.get('/pay', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'pay.html'))
})

app.get('/prices', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'prices.html'))
})

app.get('/teachers', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'teachers.html'))
})

app.get('/teachers/:teacher', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'teachers.html'))
})

app.get('/choose-service/:teacher', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'choose-service.html'))
})

app.get('/is-time-free/:startTime/:maxLessons/:teacher', (req, response) => {
  const eventStartTime = new Date(req.params.startTime)
  const eventEndTime = new Date(eventStartTime)
  eventEndTime.setMinutes(eventStartTime.getMinutes() + 59)
  const eventTodayStart = new Date(eventStartTime)
  eventTodayStart.setHours(0)
  eventTodayStart.setMinutes(0)
  eventTodayStart.setSeconds(0)
  const eventTodayEnd = new Date(eventTodayStart)
  eventTodayEnd.setHours(23)
  eventTodayEnd.setMinutes(59)
  eventTodayEnd.setSeconds(59)
  calendar.events.list({
    calendarId: teachersData[req.params.teacher].calendarId,
    timeMin: eventTodayStart,
    singleEvents: true,
    timeMax: eventTodayEnd,
    timeZone: req.params.teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
  },
  (err, res) => {
    if(err){
      return response.status(400).json({
        message: 'Что-то пошло не так. Проверьте корректность введенных данных'
      })
    }
    else{
      const eventsArr = res.data.items
      let lessonsAmount = 0
      eventsArr.forEach(item => {
        if(item.summary != 'НЕРАБОЧЕЕ ВРЕМЯ' 
        && new Date(item.start.dateTime).toDateString() == eventStartTime.toDateString()
        && item.status != 'cancelled'){
          lessonsAmount++
        }
        
      })
    
      if(lessonsAmount < req.params.maxLessons || req.query.vip == 'true'){
        calendar.events.list({
          calendarId: teachersData[req.params.teacher].calendarId,
          timeMin: eventStartTime,
          timeMax: eventEndTime,
          singleEvents: true,
          timeZone: req.params.teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
        },
        (err, res) => {
          if(err) return response.status(500).json({
            success: false,
            message: 'Что-то пошло не так. Попробуйте выбрать другой день или время.'
          })
          const eventsArr = res.data.items
          if (eventsArr.length === 0 || req.query.vip == 'true') {
            return response.status(200).json({
              success: true,
              message: 'Это время доступно'
            })
          }
          else{
            response.status(400).json({
              success: false,
              message: 'Извините, это время недоступно. Выберите другое'
            })
          }
        })
      }
      else{
        response.json({
          message: 'Лимит занятий в этот день превышен. Выберите другой'
        })
      }
    }
  })
})

app.get('/success', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'success.html'))
})

app.get('/success/:h', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'success.html'))
})

app.get('/success-advice', (_, res) => {
  res.sendFile(path.join(__dirname, 'view', 'success-advice.html'))
})

app.get('/is-day-free/:date/:maxLessons/:teacher', (req, response) => {
  const eventStartTime = new Date(req.params.date)
  const eventEndTime = new Date(eventStartTime)
  eventEndTime.setHours(23)
  eventEndTime.setMinutes(59)
  eventEndTime.setSeconds(59)
  calendar.events.list({
    calendarId: teachersData[req.params.teacher].calendarId,
    timeMin: eventStartTime,
    timeMax: eventEndTime,
    singleEvents: true,
    timeZone: req.params.teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
  },
  (err, res) => {
    if(err) return console.error('Free Busy Query Error: ', err)
    const eventsArr = res.data.items
    let lessonsAmount = 0
    eventsArr.forEach(item => {
      if(item.summary != 'НЕРАБОЧЕЕ ВРЕМЯ' 
        && new Date(item.start.dateTime).toDateString() == eventStartTime.toDateString()
        && item.status != 'cancelled')
        lessonsAmount++
      })
    
    if(lessonsAmount < req.params.maxLessons || req.query.vip == 'true'){
      response.json({
        message: 'День свободен'
      })
    }
    else{
      response.status(400).json({
        message: 'Лимит занятий в этот день превышен. Выберите другой'
      })
    } 
  })
})

app.post('/add-event', (req, response) => {
  const eventStartTime = new Date(req.body.startTime)
  const eventEndTime = new Date(eventStartTime)
  eventEndTime.setMinutes(eventStartTime.getMinutes() + 59)
  calendar.events.list({
    calendarId: teachersData[req.body.teacher].calendarId,
    timeMin: eventStartTime,
    timeMax: eventEndTime,
    singleEvents: true,
    timeZone: req.body.teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
  },
  (err, res) => {
    if(err){
      return console.error(err)
    }
    const eventsArr = res.data.items
    let eventsAmount = 0
    eventsArr.forEach(event => {
      if(event.summary != 'НЕРАБОЧЕЕ ВРЕМЯ' 
        && new Date(event.start.dateTime).toDateString() == eventStartTime.toDateString()
        && event.status != 'cancelled'){
          lessonsAmount++
      }
    })
    if (eventsAmount >= req.body.maxLessons && !req.query.vip == 'true') {
      return response.status(400).json({
        message: 'К сожалению, лимит уроков на этот день превышен. Выберите другой'
      })
    }
    else{
      const event = {
        summary:  req.body.description,
        start: {
          dateTime: eventStartTime,
          timeZone: 'Europe/Moscow'
        },
        end: {
          dateTime: eventEndTime,
          timeZone: 'Europe/Moscow'
        },
        colorId: 1
      }
    
      calendar.events.list({
        calendarId: teachersData[req.body.teacher].calendarId,
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        singleEvents: true,
        timeZone: req.body.teacher === 'egor' ? 'Europe/Samara' : 'Europe/Moscow'
      },
      (err, res) => {
        if(err) return response.status(500).json({
          message: 'Что-то пошло не так'
        })
        const eventsArr = req.query.vip == 'true' ? res.data.items.filter(event => event.summary != 'НЕРАБОЧЕЕ ВРЕМЯ') : res.data.items
        let eventsAmount = 0
        eventsArr.forEach(event => {
          if(new Date(event.start.dateTime).toDateString() == eventStartTime.toDateString()
            && event.status != 'cancelled'){
              lessonsAmount++
          }
        })
        if (eventsAmount === 0) {
          return calendar.events.insert(
            { calendarId: 'primary', resource: event }, 
            err => {
              if(err){
                 return response.status(500).json({
                message: 'Что-то пошло не так'
              })
            }
              return response.status(200).json({
                message: 'Урок поставлен в календарь'
              })
            })
        }
        else{
          response.status(400).json({
            message: 'Извините, это время недоступно. Выберите другое'
          })
        }
      })
    }
  })
})

server.listen(3001, function (req, res) {
  console.log('Server Started')
})



