export enum TransactionType {
  Income = 'income',
  Outflow = 'outflow',
}

export interface Account {
  id: string;
  name: string;
  currencyCode: string;
  balance: number;
}

export interface Transaction {
  id:string;
  date: string; // This acts as the start date for recurring transactions
  time: string;
  type: TransactionType;
  accountId: string;
  
  // Common fields
  amount: number; // For Income, this is the amount received. For Outflow, it's the amount in the transaction's currency.
  currencyCode: string;
  
  // Outflow specific fields
  outflowType?: 'local' | 'international';
  baseCurrencyAmount?: number; // For international outflow, the equivalent amount in the base currency.
  exchangeRate?: number; // For international outflow
  isTransfer?: boolean; // For outflow, marks if it's a transfer between user's accounts
  destinationAccountId?: string;

  // Recurring transaction fields
  isRecurring?: boolean;
  recurrenceFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceEndDate?: string;
  nextRecurrenceDate?: string;

  // Optional details
  category?: string; // Primarily for local outflows/expenses
  merchant?: string;
  note?: string;
  receiptUri?: string;
  locationText?: string;
}


export interface Category {
  name: string;
  color: string;
  icon: string;
}

export interface Rate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: number;
}

export enum NotificationFrequency {
  Off = 'off',
  Daily = 'daily',
  Weekly = 'weekly',
}

export interface Settings {
  baseCurrency: string;
  preferredCurrencies: string[];
  notificationFrequency: NotificationFrequency;
  notificationTime: string; // HH:MM
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM
  quietHoursEnd: string; // HH:MM
  theme: 'light' | 'dark';
  categories: Category[];
}