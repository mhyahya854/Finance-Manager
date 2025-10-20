import { Category } from './types';

export const CURRENCY_CODES = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
];

export const DEFAULT_CATEGORIES: Category[] = [
  { name: "Food", color: "#3B82F6", icon: "FoodIcon" },
  { name: "Transport", color: "#10B981", icon: "TransportIcon" },
  { name: "Shopping", color: "#EF4444", icon: "ShoppingIcon" },
  { name: "Bills", color: "#F59E0B", icon: "BillsIcon" },
  { name: "Rent", color: "#F97316", icon: "RentIcon" },
  { name: "Subscriptions", color: "#6D28D9", icon: "SubscriptionIcon" },
  { name: "Utilities", color: "#0EA5E9", icon: "UtilitiesIcon" },
  { name: "Entertainment", color: "#8B5CF6", icon: "EntertainmentIcon" },
  { name: "Health", color: "#EC4899", icon: "HealthIcon" },
  { name: "Personal Care", color: "#D946EF", icon: "PersonalCareIcon" },
  { name: "Groceries", color: "#6366F1", icon: "GroceriesIcon" },
  { name: "Travel", color: "#2563EB", icon: "TravelIcon" },
  { name: "Education", color: "#16A34A", icon: "EducationIcon" },
  { name: "Other", color: "#14B8A6", icon: "OtherIcon" }
];