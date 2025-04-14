// StackNavigation.ts
type StackParamList = {
  Home: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  EmailSent: undefined;
  SignUp: undefined;
  GetStarted: undefined;
  Setpin: undefined;
  Setpin1: undefined;
  AllSet: undefined;
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
  Expense: undefined;
  Income: undefined;
  Transfer: undefined;
  FinancialReportExpense: undefined;
  FinancialReportBudget: undefined;
  FinancialReportQuote: undefined;
  FinancialReportIncome: undefined;
  FinancialReport: undefined;
  DetailTransaction_Expense: undefined;
  DetailTransaction_Income: undefined;
  DetailTransaction_Transfer: undefined;
  DetailBudget: {
    category: string;
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
};
export default StackParamList;
