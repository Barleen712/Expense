// models/Transaction.js
export const TransactionSchema = {
    name: "Transaction",
    properties: {
      _id: "string",
      amount: "double",
      description: "string",
      category: "string",
      wallet: "string",
      moneyCategory: "string", 
      Frequency: "string?",
      endAfter: "int?",
      weekly: "string?",
      endDate: "date?",
      startDate: "int",
      startMonth: "string",
      startYear: "int",
      userId: "string?",
      createdAt: "date",
    },
    primaryKey: "_id",
  };
  