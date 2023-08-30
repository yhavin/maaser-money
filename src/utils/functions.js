export const formatPercent = (number) => {
  let value = null
  if (number.endsWith("%")) {
    value = parseFloat(number.replace("%", ""))
  } else {
    value = parseFloat(number)
  }
  return value / 100
}

export const convertCurrency = async (amount, baseCurrency, convertCurrency) => {
  const host = "https://api.frankfurter.app"
  try {
    const response = await fetch(`${host}/latest?amount=${amount}&from=${baseCurrency}&to=${convertCurrency}`)
    const data = await response.json()
    const convertedAmount = data.rates[convertCurrency]
    return Number(convertedAmount.toFixed(2))
  } catch (error) {
    console.error(error)
  }
}

export const calculateElapsedWeeks = (startDateMs, endDateMs) => {
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const elapsedMs = endDateMs - startDateMs
  const elapsedWeeks = Math.floor(elapsedMs / weekMs)

  return [weekMs, elapsedWeeks]
}

export const calculateElapsedTwoWeeks = (startDateMs, endDateMs) => {
  const twoWeeksMs = 2* 7 * 24 * 60 * 60 * 1000
  const elapsedMs = endDateMs - startDateMs
  const elapsedWeeks = Math.floor(elapsedMs / twoWeeksMs)

  return [twoWeeksMs, elapsedWeeks]
}

export const calculateElapsedMonths = (startDateMs, endDateMs) => {
  const startDate = new Date(startDateMs)
  const endDate = new Date(endDateMs)
  let elapsedMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12
  elapsedMonths -= startDate.getMonth()
  elapsedMonths += endDate.getMonth()

  if (endDate < startDate) {
    elapsedMonths--
  }

  return elapsedMonths
}