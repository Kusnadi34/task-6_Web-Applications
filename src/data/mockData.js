export const initialRevenueData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 6000 },
  { name: 'Apr', revenue: 4780 }, { name: 'May', revenue: 5890 }, { name: 'Jun', revenue: 7390 }, { name: 'Jul', revenue: 8490 },
];

export const initialTransactions = [
  { id: 1, user: "Alex Carter", email: "alex@example.com", amount: "$120.00", status: "Success", date: "2023-10-24" },
  { id: 2, user: "Sarah Smith", email: "sarah@example.com", amount: "$340.50", status: "Pending", date: "2023-10-23" },
  { id: 3, user: "Michael Johnson", email: "michael@example.com", amount: "$50.00", status: "Success", date: "2023-10-23" },
  { id: 4, user: "Emma Davis", email: "emma@example.com", amount: "$1,200.00", status: "Failed", date: "2023-10-22" },
];

// Updated dummy names to avoid plagiarism
export const initialMessages = [
  { id: 1, sender: "David Miller", text: "Can you update the invoice for last month?", time: "09:15 AM", isRead: false },
  { id: 2, sender: "Jessica Alba", text: "The new dashboard looks fantastic!", time: "Yesterday", isRead: false },
  { id: 3, sender: "Ryan Gosling", text: "Please send me the API documentation.", time: "2 days ago", isRead: true },
  { id: 4, sender: "Emma Stone", text: "Thanks for the quick support.", time: "3 days ago", isRead: true },
];

export const mockAddTransaction = (newData) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...newData, id: Math.floor(Math.random() * 1000) + 10 }), 800);
  });
};