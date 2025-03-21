export const calculateTotalRevenue = (orders: any[]) => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

export const calculateMonthlyRevenue = (orders: any[]) => {
  const monthlyData = new Array(12).fill(0);
  
  if (orders.length === 0) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: 0,
      prevRevenue: 0
    }));
  }

  orders.forEach(order => {
    const date = new Date(order.date);
    const month = date.getMonth();
    monthlyData[month] += order.amount;
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, index) => ({
    month,
    revenue: monthlyData[index],
    prevRevenue: monthlyData[index] * 0.8 // Simulated previous year data
  }));
};

export const calculateMonthlyDeliveries = (orders: any[]) => {
  const monthlyData = new Array(12).fill(0).map((_, index) => ({
    name: new Date(2024, index).toLocaleString('default', { month: 'short' }),
    delivered: 0,
    returns: 0 // This will include Pickup Pending, NDR Pending, and RTO
  }));

  if (orders.length === 0) {
    return monthlyData;
  }

  orders.forEach(order => {
    const date = new Date(order.date);
    const monthIndex = date.getMonth();

    if (order.status === 'Delivered') {
      monthlyData[monthIndex].delivered++;
    } else if (
      order.status === 'Pickup Pending' || 
      order.status === 'NDR Pending' || 
      order.status === 'RTO'
    ) {
      monthlyData[monthIndex].returns++;
    }
  });

  return monthlyData;
};
