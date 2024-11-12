import dailyData from '../constants/json/dailyChartData.json';

export const fetchTodayPlaylistData = async () => {
  /*
  const dailyUrl = 'http://127.0.0.1:8000/charts/daily';
  const weeklyUrl = 'http://127.0.0.1:8000/charts/weekly';
  const monthlyUrl = 'http://127.0.0.1:8000/charts/monthly';
  const yearlyUrl = 'http://127.0.0.1:8000/charts/yearly';

  return Promise.all([
    fetch(dailyUrl).then(res => res.json()),
    fetch(weeklyUrl).then(res => res.json()),
    fetch(monthlyUrl).then(res => res.json()),
    fetch(yearlyUrl).then(res => res.json()),
  ]);*/
  return Promise.resolve(dailyData);
};
