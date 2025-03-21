export interface Order {
  id: string;
  customer: string;
  destination: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Pickup Pending' | 'NDR Pending' | 'RTO';
  amount: number;
  items: number;
  priority: 'High' | 'Medium' | 'Low';
  trackingNumber: string;
  productName: string;
  quantity: number;
  weight: string;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
    shippingAddress: {
      country: string;
      state: string;
      city: string;
      postalCode: string;
      streetAddress: string;
    }
  };
  paymentBreakdown: {
    orderValue: number;
    courierFee: number;
    gatewayCharge: number;
    aggregatorCharge: number;
    total: number;
  }
}

export const orders: Order[] = [
  // ...existing orders array from order/page.tsx...
];
