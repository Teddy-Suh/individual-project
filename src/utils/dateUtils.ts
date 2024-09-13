const getMonthAndWeek = (date: Date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const firstThursday = firstDayOfMonth.getDate() + ((4 - dayOfWeek + 7) % 7);

  const currentDay = date.getDate();
  let week;
  if (currentDay <= firstThursday) {
    week = 1;
  } else {
    week = Math.ceil((currentDay - firstThursday) / 7) + 1;
  }

  const month = date.getMonth() + 1;

  return { month, week };
};

export { getMonthAndWeek };
