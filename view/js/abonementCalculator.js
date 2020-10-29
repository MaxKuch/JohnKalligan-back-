class AbonementCalculator {
  constructor(id, usd = false, lessonPrice, discount = 0){
    this._instance = $(`#${id}`)
    this._plusBtn = this._instance.find('.abonement-calculator__plus')
    this._minusBtn = this._instance.find('.abonement-calculator__minus')
    this._lessonsAmountInstance = this._instance.find('.abonement-calculator__amount')
    this._sumInstance = this._instance.find('.abonement-calculator__sum')

    this._lessonPrice = lessonPrice
    this._discount = discount
    this._usd = usd

    this._minLesAmount = 1
    this._minLesDiscount = 4
    this._lessonsAmount = this._minLesAmount
    this._sum = this._lessonPrice * this._minLesAmount
    this.render()

    this._plusBtn.click(this.addLesson.bind(this))
    this._minusBtn.click(this.removeLesson.bind(this))
  }

  addLesson(){
    this._lessonsAmount++
    this.render()
  }

  removeLesson(){
    if(this._lessonsAmount !== this._minLesAmount){
      this._lessonsAmount--
      this.render()
    }
    
  }

  calcSum(){
    let sum = this._lessonsAmount * this._lessonPrice
    if(this._discount && this._lessonsAmount >= this._minLesDiscount)
      sum -= sum * (this._discount / 100)
    this._sum = sum
  }

  render(){
    this.calcSum()
    if(this._lessonsAmount === this._minLesAmount)
      this._minusBtn.attr('disabled', true)
    if(this._lessonsAmount === this._minLesAmount + 1)
      this._minusBtn.removeAttr('disabled')
    $(this._sumInstance).text(this._sum)
    this._lessonsAmountInstance.text(this._lessonsAmount)
  }

  convert(){
    return new Promise((resolve) => {
      if(this._usd){
        axios.get('https://www.cbr-xml-daily.ru/daily_json.js').then(({data: {Valute:{USD:{Value:course}}}}) => {
        this._lessonPrice = Math.floor(this._lessonPrice*course)
        this.render()
        resolve()
      })
      }
      else resolve()
    })
    
  }

  get sum() {
    return this._sum
  }

  get lessonsAmount(){
    return this._lessonsAmount
  }
}