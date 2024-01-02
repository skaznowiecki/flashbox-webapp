export const getCurrentAndPreviousMonths = (numberOfMonths) => {
  const today = new Date()
  const previousMonths = []

  for (let i = 0; i < numberOfMonths; i++) {
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - i, 1)
    previousMonths.push([previousMonth.getFullYear(), previousMonth.getMonth() + 1])
  }
  return previousMonths
}

export const getCurrentAndPreviousPayrolls = (payrolls, numberOfMonths) => {
  const dates = getCurrentAndPreviousMonths(numberOfMonths)
  return payrolls.filter((item) => {
    return dates.some((date) => {
      return item.year === date[0] && item.month === date[1]
    })
  })
}
