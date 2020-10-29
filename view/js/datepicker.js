
class Datepicker {
  constructor(disabledDays, maxLessons, timeRanges, teacher){
    this._teacher = teacher
    this._disabledDays = disabledDays
    this._maxLessons = maxLessons
    this._timeRanges = timeRanges
    const tommorrow = new Date()
    tommorrow.setDate(tommorrow.getDate() + 1) 
    this._tommorrow = tommorrow
    this._dateMin = new Date(tommorrow)
  }

  get maxLessons(){
    return this._maxLessons
  }

  get teacher(){
    return this._teacher
  }

  init(inputId, title = '', datesArray = [], vip){
      $('#'+inputId+'Timepicker').timepicker({
        appendTo: '.choose-time__timepicker',
        minTime: '10:00am',
        maxTime: '11:00pm',
        step: 60,
        timeFormat: 'H:i',
      })
      $('#'+inputId+'Timepicker').keydown(e => {
        e.preventDefault()
      })
      $(`#${inputId}Datepicker`).append('<div id="loading" class="lds-ellipsis d-block m-auto"><div></div><div></div><div></div><div></div></div>')
      instance.get(`/calendar-events/${this._teacher}`).then(({data}) => {
        $('#loading').remove()
        $('#'+inputId+'Datepicker').datepicker({
          autoClose: true,
          minDate: this._tommorrow,
          selectOtherMonths: false,
          onRenderCell: (date, cellType) => { 
            const day = date.getDay()
            if(title != 'Vip'){
              if (cellType == 'day') {
                let eventsAmount = 0
                  data.forEach(event => { 
                    if(event.start && this._timeRanges.get(day) && event.status != 'cancelled' && event.summary != 'НЕРАБОЧЕЕ ВРЕМЯ'){
                      const eventStart = new Date(event.start.dateTime)
                      if(eventStart.toDateString()  == date.toDateString() ){
                        eventsAmount++
                      }
                    }
                  })
                  const isDisabled = this._disabledDays.indexOf(day) != -1 || eventsAmount >= this._maxLessons
                  return {
                      disabled: isDisabled
                  }
              }
            }
            else{
              return {
                disabled: day === 1
              }
            }
          },
          onSelect: (_, date) => {
            const day = date.getDay()
            let minTime, maxTime
            if(title == 'Vip'){
              minTime = '10:00'
              maxTime = '23:00'
              $('#'+inputId+'Timepicker').timepicker('option', {
                minTime,
                maxTime
              })
            }
            else {
              if(this._timeRanges.has(day)){
                minTime = this._timeRanges.get(day)[0]
                maxTime =  this._timeRanges.get(day)[1]
                $('#'+inputId+'Timepicker').timepicker('option', {
                  minTime,
                  maxTime
                })
              }
            } 
            instance.get(`/calendar-events/${date.toISOString()}/${minTime}/${maxTime}/${this._teacher}?vip=${vip}`).then(({data}) => {
              let todayDates = datesArray.filter(dateItem =>{ 
                return dateItem.toDateString() == date.toDateString()
              })
              .map(date => {
                const endDate = new Date(date)
                endDate.setTime(date.getTime() + 3540000)
                return {
                  start: date,
                  end: endDate
                }
              })
              .concat(data)
              $('#'+inputId+'Timepicker').timepicker('option', { disableTimeRanges: todayDates.map(timeRange => {
                const timeRangeStartDate = new Date(timeRange.start)
                const timeRangeEndDate = new Date(timeRange.end)
                const timeRangeStart = `${timeRangeStartDate.getHours() - 1 >= 10 ? timeRangeStartDate.getHours() - 1 : '0'+(timeRangeStartDate.getHours()-1)}:${timeRangeStartDate.getMinutes()+1 >= 10 ? timeRangeStartDate.getMinutes()+1 : '0'+(timeRangeStartDate.getMinutes()+1)}`
                let timeRangeEnd 
                if(timeRangeStartDate.toDateString() == timeRangeEndDate.toDateString()){
                  timeRangeEnd = `${timeRangeEndDate.getHours() >= 10 ? timeRangeEndDate.getHours() : '0'+timeRangeEndDate.getHours()}:${timeRangeEndDate.getMinutes() >= 10 ? timeRangeEndDate.getMinutes() : '0'+timeRangeEndDate.getMinutes()}`
                }
                else{
                  timeRangeEnd = '23:59'
                }
                return [
                  timeRangeStart,
                  timeRangeEnd
                ]
              }) });
            })
          }
        })
      })
  }
}