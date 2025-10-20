import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Transaction, Rate, Settings, NotificationFrequency, TransactionType, Account } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { DEFAULT_CATEGORIES } from './constants';
import { Onboarding } from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import SettingsComponent from './components/Settings';
import Reminders from './components/Reminders';
import { ChartPieIcon, ListBulletIcon, Cog6ToothIcon, RepeatIcon } from './components/icons';

type View = 'dashboard' | 'transactions' | 'reminders' | 'settings';

type DataContextType = {
    transactions: Transaction[];
    rates: Rate[];
    settings: Settings;
    accounts: Account[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    updateRates: (newRates: Rate[]) => void;
    addAccount: (account: Omit<Account, 'id'>) => Account;
    updateAccount: (account: Account) => void;
    deleteAccount: (id: string) => void;
    convert: (amount: number, fromCurrency: string) => number;
    getRate: (from: string, to: string) => number | undefined;
    logRecurringTransaction: (id: string) => void;
};

const DataContext = createContext<DataContextType | null>(null);
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};

type SettingsContextType = {
    settings: Settings;
    updateSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

const SettingsContext = createContext<SettingsContextType | null>(null);
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within a SettingsProvider");
    return context;
};


const App: React.FC = () => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
    const [rates, setRates] = useLocalStorage<Rate[]>('rates', []);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', {
        baseCurrency: '',
        preferredCurrencies: [],
        notificationFrequency: NotificationFrequency.Daily,
        notificationTime: '09:00',
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
        theme: 'light',
        categories: DEFAULT_CATEGORIES,
    });

    const [view, setView] = useState<View>('dashboard');
    const [isOnboarding, setIsOnboarding] = useState(() => accounts.length === 0);

    useEffect(() => {
        if (!settings.categories || settings.categories.length === 0) {
            setSettings(s => ({ ...s, categories: DEFAULT_CATEGORIES }));
        } else {
            const needsMigration = settings.categories.some(c => !c.icon);
            if(needsMigration) {
                setSettings(s => ({
                    ...s,
                    categories: s.categories.map(c => {
                        if (c.icon) return c;
                        const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.name === c.name);
                        return { ...c, icon: defaultCat ? defaultCat.icon : 'OtherIcon' };
                    })
                }));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.theme]);

    const calculateNextRecurrenceDate = useCallback((startDateStr: string, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): Date => {
        const date = new Date(startDateStr);
        switch (frequency) {
            case 'daily':
                date.setDate(date.getDate() + 1);
                break;
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'yearly':
                date.setFullYear(date.getFullYear() + 1);
                break;
        }
        return date;
    }, []);

    useEffect(() => {
        const checkRecurringTransactions = async () => {
            if (Notification.permission !== 'granted') {
                await Notification.requestPermission();
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dueTransactions: Transaction[] = [];
            
            transactions.forEach(t => {
                if (t.isRecurring && t.nextRecurrenceDate) {
                    let nextDueDate = new Date(t.nextRecurrenceDate);
                    if (nextDueDate <= today) {
                        dueTransactions.push(t);
                    }
                }
            });
            
            if (dueTransactions.length > 0) {
                 dueTransactions.forEach(t => {
                    const title = 'Recurring Transaction Due';
                    const options = {
                        body: `Your ${t.recurrenceFrequency} transaction for "${t.merchant || t.category}" of ${t.amount} ${t.currencyCode} is due.`,
                        icon: '/favicon.ico' 
                    };
                    if (Notification.permission === 'granted') {
                        new Notification(title, options);
                    }
                });
            }
        };

        const intervalId = setInterval(checkRecurringTransactions, 3600 * 1000);
        checkRecurringTransactions();

        return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);

    const addAccount = useCallback((account: Omit<Account, 'id'>): Account => {
        const newAccount = { ...account, id: crypto.randomUUID() };
        setAccounts(prev => [...prev, newAccount]);
        return newAccount;
    }, [setAccounts]);

    const updateAccount = useCallback((updatedAccount: Account) => {
        setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    }, [setAccounts]);
    
    const deleteAccount = useCallback((id: string) => {
        if(transactions.some(t => t.accountId === id || t.destinationAccountId === id)) {
            alert("Cannot delete an account with associated transactions.");
            return;
        }
        setAccounts(prev => prev.filter(acc => acc.id !== id));
    }, [setAccounts, transactions]);


    const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() }]);
        setAccounts(prevAccounts => {
            return prevAccounts.map(acc => {
                let balanceChange = 0;
                if (acc.id === transaction.accountId) {
                    if (transaction.type === TransactionType.Income) {
                        balanceChange += transaction.amount;
                    } else { // Outflow
                        balanceChange -= transaction.amount;
                    }
                }
                if (transaction.isTransfer && acc.id === transaction.destinationAccountId) {
                    const destAmount = transaction.outflowType === 'international' ? transaction.baseCurrencyAmount! : transaction.amount;
                    balanceChange += destAmount;
                }
                return balanceChange !== 0 ? { ...acc, balance: acc.balance + balanceChange } : acc;
            });
        });
    }, [setTransactions, setAccounts]);

    const deleteTransaction = useCallback((id: string) => {
        const transactionToDelete = transactions.find(t => t.id === id);
        if (!transactionToDelete) return;

        const balanceChanges = new Map<string, number>();
        
        // Revert transaction
        if (transactionToDelete.type === TransactionType.Income) {
            balanceChanges.set(transactionToDelete.accountId, (balanceChanges.get(transactionToDelete.accountId) || 0) - transactionToDelete.amount);
        } else { // Outflow
            balanceChanges.set(transactionToDelete.accountId, (balanceChanges.get(transactionToDelete.accountId) || 0) + transactionToDelete.amount);
            if (transactionToDelete.isTransfer && transactionToDelete.destinationAccountId) {
                const destAmount = transactionToDelete.outflowType === 'international' ? transactionToDelete.baseCurrencyAmount! : transactionToDelete.amount;
                balanceChanges.set(transactionToDelete.destinationAccountId, (balanceChanges.get(transactionToDelete.destinationAccountId) || 0) - destAmount);
            }
        }

        setTransactions(prev => prev.filter(t => t.id !== id));
        
        setAccounts(prevAccounts => 
            prevAccounts.map(acc => {
                if (balanceChanges.has(acc.id)) {
                    return { ...acc, balance: acc.balance + (balanceChanges.get(acc.id) || 0) };
                }
                return acc;
            })
        );
    }, [transactions, setTransactions, setAccounts]);

    const updateTransaction = useCallback((updatedTransaction: Transaction) => {
        const originalTransaction = transactions.find(t => t.id === updatedTransaction.id);
        if (!originalTransaction) return;

        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        setAccounts(prevAccounts => {
            const balanceChanges = new Map<string, number>();

            const addChange = (accountId: string, amount: number) => {
                balanceChanges.set(accountId, (balanceChanges.get(accountId) || 0) + amount);
            };

            // Revert original transaction
            if (originalTransaction.type === TransactionType.Income) {
                addChange(originalTransaction.accountId, -originalTransaction.amount);
            } else {
                addChange(originalTransaction.accountId, originalTransaction.amount);
                if (originalTransaction.isTransfer && originalTransaction.destinationAccountId) {
                    const destAmount = originalTransaction.outflowType === 'international' ? originalTransaction.baseCurrencyAmount! : originalTransaction.amount;
                    addChange(originalTransaction.destinationAccountId, -destAmount);
                }
            }

            // Apply new transaction
            if (updatedTransaction.type === TransactionType.Income) {
                addChange(updatedTransaction.accountId, updatedTransaction.amount);
            } else {
                addChange(updatedTransaction.accountId, -updatedTransaction.amount);
                if (updatedTransaction.isTransfer && updatedTransaction.destinationAccountId) {
                    const destAmount = updatedTransaction.outflowType === 'international' ? updatedTransaction.baseCurrencyAmount! : updatedTransaction.amount;
                    addChange(updatedTransaction.destinationAccountId, destAmount);
                }
            }

            return prevAccounts.map(acc => {
                if (balanceChanges.has(acc.id)) {
                    return { ...acc, balance: acc.balance + (balanceChanges.get(acc.id) || 0) };
                }
                return acc;
            });
        });
    }, [transactions, setTransactions, setAccounts]);

    const logRecurringTransaction = useCallback((id: string) => {
        const recurringTransaction = transactions.find(t => t.id === id);
        if (!recurringTransaction || !recurringTransaction.isRecurring || !recurringTransaction.nextRecurrenceDate) return;

        const newTransactionInstance: Omit<Transaction, 'id'> = {
            ...recurringTransaction,
            isRecurring: false,
            recurrenceFrequency: undefined,
            recurrenceEndDate: undefined,
            nextRecurrenceDate: undefined,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
        };
        
        addTransaction(newTransactionInstance);

        let nextDate = calculateNextRecurrenceDate(recurringTransaction.nextRecurrenceDate, recurringTransaction.recurrenceFrequency!);
        let updatedTemplate = { ...recurringTransaction, nextRecurrenceDate: nextDate.toISOString().split('T')[0] };

        const recurrenceEndDate = updatedTemplate.recurrenceEndDate ? new Date(updatedTemplate.recurrenceEndDate) : null;
        if (recurrenceEndDate && nextDate > recurrenceEndDate) {
            updatedTemplate = { ...updatedTemplate, isRecurring: false, nextRecurrenceDate: undefined };
        }

        setTransactions(prev => prev.map(t => t.id === id ? updatedTemplate : t));
    }, [transactions, addTransaction, setTransactions, calculateNextRecurrenceDate]);

    const updateRates = useCallback((newRates: Rate[]) => {
        setRates(prev => {
            const updated = [...prev];
            newRates.forEach(newRate => {
                const index = updated.findIndex(r => r.fromCurrency === newRate.fromCurrency && r.toCurrency === newRate.toCurrency);
                if (index > -1) {
                    updated[index] = newRate;
                } else {
                    updated.push(newRate);
                }
            });
            return updated;
        });
    }, [setRates]);

    const handleOnboardingComplete = (account: Account) => {
        addAccount(account);
        setSettings(prev => ({...prev, baseCurrency: account.currencyCode}));
        setIsOnboarding(false);
        setView('dashboard');
    };

    const convert = useCallback((amount: number, fromCurrency: string): number => {
        if (fromCurrency === settings.baseCurrency) {
            return amount;
        }
        const rate = rates.find(r => r.fromCurrency === fromCurrency && r.toCurrency === settings.baseCurrency);
        return rate ? amount * rate.rate : 0;
    }, [rates, settings.baseCurrency]);

    const getRate = useCallback((from: string, to: string): number | undefined => {
        if (from === to) return 1;
        const rateInfo = rates.find(r => r.fromCurrency === from && r.toCurrency === to);
        if (rateInfo) return rateInfo.rate;

        const reverseRateInfo = rates.find(r => r.fromCurrency === to && r.toCurrency === from);
        if (reverseRateInfo && reverseRateInfo.rate !== 0) return 1 / reverseRateInfo.rate;
        
        // Try converting via base currency
        const fromToBaseRate = rates.find(r => r.fromCurrency === from && r.toCurrency === settings.baseCurrency);
        const toToBaseRate = rates.find(r => r.fromCurrency === to && r.toCurrency === settings.baseCurrency);

        if(fromToBaseRate && toToBaseRate && toToBaseRate.rate !== 0) {
            return fromToBaseRate.rate / toToBaseRate.rate;
        }

        return undefined;
    }, [rates, settings.baseCurrency]);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard setView={setView} />;
            case 'transactions':
                return <TransactionManager />;
            case 'reminders':
                return <Reminders />;
            case 'settings':
                return <SettingsComponent />;
            default:
                return <Dashboard setView={setView} />;
        }
    };

    const NavItem: React.FC<{ targetView: View; icon: React.ReactNode; label: string }> = ({ targetView, icon, label }) => (
        <button
            onClick={() => setView(targetView)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
                view === targetView ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );

    if (isOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings: setSettings }}>
            <DataContext.Provider value={{ transactions, rates, settings, accounts, addTransaction, updateTransaction, deleteTransaction, updateRates, addAccount, updateAccount, deleteAccount, convert, getRate, logRecurringTransaction }}>
                <div className="flex flex-col h-screen max-w-4xl mx-auto shadow-2xl">
                    <main className="flex-grow overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-950">
                        {renderView()}
                    </main>
                    <nav className="flex justify-around bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
                        <NavItem targetView="dashboard" icon={<ChartPieIcon />} label="Dashboard" />
                        <NavItem targetView="transactions" icon={<ListBulletIcon />} label="Transactions" />
                        <NavItem targetView="reminders" icon={<RepeatIcon className="w-6 h-6" />} label="Reminders" />
                        <NavItem targetView="settings" icon={<Cog6ToothIcon />} label="Settings" />
                    </nav>
                </div>
            </DataContext.Provider>
        </SettingsContext.Provider>
    );
};

export default App;