const convertDate = (epoch) => {
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

const convertTemp = (temp) => {
  let plus = '+'
  if (temp < 0) {
    plus = ''
  }
  return plus + Number(temp).toFixed(1)
}

module.exports = { convertDate, convertTemp }
