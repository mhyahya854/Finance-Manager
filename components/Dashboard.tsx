import React, { useEffect, useRef } from 'react';
import { useData } from '../App';
import { TransactionType, Account } from '../types';
import { PlusIcon, GetCategoryIcon, QuestionMarkIcon, TransferIcon, RepeatIcon } from './icons';

// TypeScript declaration for global Chart variable from CDN script
declare const Chart: any;

interface DashboardProps {
    setView: (view: 'dashboard' | 'transactions' | 'settings') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const { transactions, settings, convert, accounts } = useData();
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);

    const totalIncome = monthlyTransactions
        .filter(t => t.type === TransactionType.Income)
        .reduce((sum, t) => {
            const account = accounts.find(a => a.id === t.accountId);
            return sum + convert(t.amount, account?.currencyCode || settings.baseCurrency);
        }, 0);

    const totalOutflows = monthlyTransactions
        .filter(t => t.type === TransactionType.Outflow)
        .reduce((sum, t) => {
            const account = accounts.find(a => a.id === t.accountId);
            if (t.outflowType === 'international' && t.baseCurrencyAmount) {
                 return sum + t.baseCurrencyAmount;
            }
            return sum + convert(t.amount, account?.currencyCode || settings.baseCurrency);
        }, 0);
        
    const totalNetWorth = accounts.reduce((sum, acc) => sum + convert(acc.balance, acc.currencyCode), 0);

    const formatCurrency = (amount: number, currencyCode: string = settings.baseCurrency) => {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(amount);
    };

    const expensesByCategory = monthlyTransactions
        .filter(t => t.type === TransactionType.Outflow && t.category && !t.isTransfer)
        .reduce((acc, t) => {
            const account = accounts.find(a => a.id === t.accountId);
            const convertedAmount = t.baseCurrencyAmount || convert(t.amount, account?.currencyCode || settings.baseCurrency);
            acc[t.category!] = (acc[t.category!] || 0) + convertedAmount;
            return acc;
        }, {} as Record<string, number>);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const labels = Object.keys(expensesByCategory);
            const backgroundColors = labels.map(label => {
                const category = settings.categories.find(c => c.name === label);
                return category ? category.color : '#A9A9A9';
            });

            const chartData = {
                labels: labels,
                datasets: [{
                    data: Object.values(expensesByCategory),
                    backgroundColor: backgroundColors,
                    hoverOffset: 4
                }]
            };

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context: any) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += formatCurrency(context.parsed);
                                        }
                                        return label;
                                    }
                                }
                            }
                        }
                    },
                });
            }
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expensesByCategory, settings.baseCurrency, settings.categories]);


    return (
        <div className="space-y-6 relative">
             <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Your financial overview</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Net Worth</h3>
                <p className="text-3xl font-bold text-indigo-500">{formatCurrency(totalNetWorth)}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month's Income</h3>
                    <p className="text-2xl font-semibold text-green-500">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month's Outflow</h3>
                    <p className="text-2xl font-semibold text-red-500">{formatCurrency(totalOutflows)}</p>
                </div>
            </div>
            
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <h3 className="text-lg font-semibold mb-4">Accounts</h3>
                 <ul className="space-y-3">
                     {accounts.map(acc => (
                        <li key={acc.id} className="flex justify-between items-center">
                            <p className="font-medium">{acc.name}</p>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">
                                {formatCurrency(acc.balance, acc.currencyCode)}
                            </span>
                        </li>
                     ))}
                 </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-center">Spending by Category</h3>
                {Object.keys(expensesByCategory).length > 0 ? (
                    <div className="relative h-64 w-full">
                         <canvas ref={chartRef}></canvas>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">No expenses recorded this month.</p>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                 {transactions.slice(0, 5).length > 0 ? (
                    <ul className="space-y-3">
                        {transactions.slice(0, 5).map(t => {
                            const description = t.isTransfer ? 'Transfer' : (t.merchant || t.category || t.type);
                            const account = accounts.find(a => a.id === t.accountId);
                            return (
                                <li key={t.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const category = t.category ? settings.categories.find(c => c.name === t.category) : null;
                                            const iconClassName = "w-8 h-8 p-1.5 rounded-md flex-shrink-0";

                                            if (t.isRecurring) {
                                                return (
                                                    <div className={`${iconClassName} bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center`}>
                                                        <RepeatIcon className="w-5 h-5"/>
                                                    </div>
                                                );
                                            }
                                            if (t.isTransfer) {
                                                return (
                                                    <div className={`${iconClassName} bg-indigo-100 dark:bg-indigo-900/50 text-indigo-500 flex items-center justify-center`}>
                                                        <TransferIcon className="w-5 h-5" />
                                                    </div>
                                                );
                                            }
                                            if (category) {
                                                return (
                                                    <div className={iconClassName} style={{ backgroundColor: `${category.color}20` }}>
                                                        <GetCategoryIcon iconName={category.icon} className="w-full h-full" style={{ color: category.color }} />
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className={`${iconClassName} bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center`}>
                                                    <QuestionMarkIcon className="w-5 h-5"/>
                                                </div>
                                            );
                                        })()}
                                        <div>
                                            <p className="font-medium">{description}</p>
                                            <p className="text-sm text-gray-500">{t.date} - {account?.name}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'} {t.amount.toFixed(2)} {t.currencyCode}
                                        {t.outflowType === 'international' && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 block text-right">
                                                ({t.baseCurrencyAmount?.toFixed(2)} {settings.baseCurrency})
                                            </span>
                                        )}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                 ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No transactions yet.</p>
                 )}
                 <button onClick={() => setView('transactions')} className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                     View All
                 </button>
            </div>
            
             <button
                onClick={() => setView('transactions')}
                className="fixed bottom-20 right-5 sm:right-10 z-30 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition transform hover:scale-110"
                aria-label="Add transaction"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>
        </div>
    );
};

export default Dashboard;