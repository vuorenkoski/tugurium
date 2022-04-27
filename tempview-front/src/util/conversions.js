const convertDate = (date) => {
  return (
    date.getDate() +
    '.' +
    (date.getMonth() + 1) +
    ' ' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0')
  )
}

const convertTemp = (temp) => {
  let plus = '+'
  if (temp < 0) {
    plus = ''
  }
  return plus + Number(temp).toFixed(1)
}

module.exports = { convertDate, convertTemp }
