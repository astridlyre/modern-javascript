const $ = v => document.getElementById(v)

const loan = {
  notificationEl: $('notification'),
  notificationText: $('notification-message'),
  loanAmountEl: $('loan-amount'),
  loanInterestEl: $('loan-interest'),
  loanYearsEl: $('loan-years'),
  loanForm: $('loan-calculator'),
  resultsEl: $('results'),
  resultsMonthlyPayment: $('result-monthly-payment'),
  resultsTotalPayment: $('result-total-payment'),
  resultsTotalInterest: $('result-total-interest'),
  showingResults: false,
  amount() {
    return this.loanAmountEl.value
  },
  interest() {
    return this.loanInterestEl.value
  },
  years() {
    return this.loanYearsEl.value
  },
  showResults({ monthly, total, interest }) {
    this.showingResults = true
    this.resultsMonthlyPayment.innerText = `$${monthly}`
    this.resultsTotalPayment.innerText = `$${total}`
    this.resultsTotalInterest.innerText = `$${interest}`
    this.resultsEl.classList.add('active')
  },
  clearResults() {
    this.showingResults = false
    this.resultsMonthlyPayment.innerText = ''
    this.resultsTotalPayment.innerText = ''
    this.resultsTotalInterest.innerText = ''
    this.resultsEl.classList.remove('active')
  },
  showNotification({ text, time }) {
    this.notificationText.innerText = text
    this.notificationEl.classList.add('active')
    setTimeout(() => this.clearNotification(), time * 1000)
  },
  clearNotification() {
    this.notificationText.innerText = ''
    this.notificationEl.classList.remove('active')
  },
}

const parse = n => (Math.round(n * 100) / 100).toFixed(2)

const calculateLoan = () => {
  const effectiveInterest = loan.interest() / 100 / 12
  const totalPayments = loan.years() * 12
  const bottom = 1 - Math.pow(1 + effectiveInterest, -totalPayments)
  const monthly = parse(loan.amount() * (effectiveInterest / bottom))
  const total = parse(monthly * (12 * loan.years()))
  const interest = parse(total - loan.amount())
  return {
    monthly,
    total,
    interest,
  }
}

const handleFormSubmit = event => {
  event.preventDefault()
  const result = calculateLoan()
  loan.showResults(result)
  loan.showNotification({
    text: `Success! Your monthly payment is: $${result.monthly}`,
    time: 3,
  })
}

const handleChange = () => (loan.showingResults ? loan.clearResults() : null)

loan.loanForm.onsubmit = handleFormSubmit
loan.loanAmountEl.oninput = handleChange
loan.loanInterestEl.oninput = handleChange
loan.loanYearsEl.oninput = handleChange
