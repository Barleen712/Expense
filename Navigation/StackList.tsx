// StackNavigation.ts
type StackParamList = {
  Home: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  EmailSent: { email: string };
  SignUp: undefined;
  GetStarted: undefined;
  Setpin: undefined;
  Setpin1: { FirstPin: string };
  AllSet: { title: string };
  MainScreen: undefined;
  Settings: undefined;
  Account: undefined;
  Export: undefined;
  Export1: undefined;
  Currency: undefined;
  Theme: undefined;
  Security: undefined;
  Language: undefined;
  Notification: undefined;
  Header: undefined;
  CreateBudget: {
    value: number;
    category: string;
    alert: boolean;
    percentage: number;
    index?: number;
    edit: boolean;
    header: string;
  };
  Expense: { amount: number; category: string; edit: boolean; title: string; wallet: string };
  Income: { amount: number; category: string; edit: boolean; title: string; wallet: string };
  Transfer: { amount: number; to: string; from: string; edit: boolean; title: string; id: string };
  FinancialReportExpense: undefined;
  FinancialReportBudget: undefined;
  FinancialReportQuote: undefined;
  FinancialReportIncome: undefined;
  FinancialReport: undefined;
  DetailTransaction_Expense: undefined;
  DetailTransaction_Income: undefined;
  DetailTransaction_Transfer: undefined;
  DetailBudget: {
    category: any;
    remaining: number;
    progress: number;
    exceeded: boolean;
    index: number;
    total: number;
    percentage: number;
  };
  DetailAccount: {
    wallet: number;
  };
  DisplayNotification: undefined;
  EnterPin: undefined;
};
export default StackParamList;
