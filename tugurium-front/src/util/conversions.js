const convertDate = (epoch) => {
  if (!epoch) {
    return '- - - - -'
  }
  const date = new Date(epoch * 1000)
  return (
    date.getDate() +
    '.' +
    (date.getMonth() + 1) +
    '. klo ' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0')
  )
}

const convertDateToDate = (epoch) => {
  if (!epoch) {
    return '- - - - -'
  }
  const date = new Date(epoch * 1000)
  return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
}

const convertTemp = (temp, unit) => {
  if (temp === null) {
    return '- - - - -'
  }
  if (unit === 'kpl') {
    return `${parseInt(temp)} ${unit}`
  }
  if (unit === 'c') {
    let plus = '+'
    if (temp < 0) {
      plus = ''
    }
    return plus + temp.toFixed(1)
  }
  return `${temp.toFixed(1)} ${unit}`
}

const convertNumber = (number) => {
  if (!number) {
    return '0'
  }
  if (number < 1000) {
    return String(number)
  }
  if (number < 10000) {
    return String((number / 1000).toFixed(1)) + 'k'
  }
  if (number < 1000000) {
    return String((number / 1000).toFixed(0)) + 'k'
  }
  return String((number / 1000000).toFixed(1)) + 'm'
}

module.exports = { convertDate, convertTemp, convertDateToDate, convertNumber }
