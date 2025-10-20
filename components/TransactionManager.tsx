import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { useData } from '../App';
import { PlusIcon, ArrowDownTrayIcon, RepeatIcon, GetCategoryIcon, TransferIcon, QuestionMarkIcon } from './icons';
import { exportToExcel, exportToPdf, exportToDocx } from '../services/exportService';
import TransactionForm from './TransactionForm';

const TransactionManager: React.FC = () => {
    const { transactions, addTransaction, updateTransaction, deleteTransaction, settings, accounts } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [filters, setFilters] = useState({ dateStart: '', dateEnd: '', merchant: '', accountId: '', category: '' });
    const [showExportOptions, setShowExportOptions] = useState(false);

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                if (filters.dateStart && t.date < filters.dateStart) return false;
                if (filters.dateEnd && t.date > filters.dateEnd) return false;
                if (filters.merchant && !t.merchant?.toLowerCase().includes(filters.merchant.toLowerCase())) return false;
                if (filters.accountId && t.accountId !== filters.accountId) return false;
                if (filters.category && t.category !== filters.category) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.time.localeCompare(a.time));
    }, [transactions, filters]);
    
    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'> | Transaction) => {
        if ('id' in transactionData && transactionData.id) {
            updateTransaction(transactionData as Transaction);
        } else {
            addTransaction(transactionData as Omit<Transaction, 'id'>);
        }
        setIsFormOpen(false);
        setEditingTransaction(null);
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to delete this transaction? This will also update the account balance.")) {
            deleteTransaction(id);
        }
    };
    
    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <button onClick={() => setShowExportOptions(prev => !prev)} className="p-2 rounded-full bg-white dark:bg-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-600">
                           <ArrowDownTrayIcon />
                        </button>
                        {showExportOptions && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                                <a onClick={() => { exportToExcel(filteredTransactions, settings.baseCurrency, accounts); setShowExportOptions(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Export as Excel (.xlsx)</a>
                                <a onClick={() => { exportToPdf(filteredTransactions, settings.baseCurrency, accounts); setShowExportOptions(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Export as PDF (.pdf)</a>
                                <a onClick={() => { exportToDocx(filteredTransactions, settings.baseCurrency, accounts); setShowExportOptions(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Export as Word (.docx)</a>
                            </div>
                        )}
                    </div>
                    <button onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }} className="p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700">
                        <PlusIcon />
                    </button>
                </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <input type="date" value={filters.dateStart} onChange={e => setFilters({...filters, dateStart: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                <input type="date" value={filters.dateEnd} onChange={e => setFilters({...filters, dateEnd: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                <input type="text" placeholder="Filter by merchant..." value={filters.merchant} onChange={e => setFilters({...filters, merchant: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                 <select value={filters.accountId} onChange={e => setFilters({...filters, accountId: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                    <option value="">All Accounts</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
                <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                    <option value="">All Categories</option>
                    {settings.categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            
            <div className="space-y-3">
                {filteredTransactions.map(t => (
                    <div key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
                        {(() => {
                            const category = t.category ? settings.categories.find(c => c.name === t.category) : null;
                            if (t.isRecurring) {
                                return (
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-md flex-shrink-0 flex items-center justify-center text-blue-500">
                                        <RepeatIcon className="w-6 h-6"/>
                                    </div>
                                );
                            }
                            if (t.isTransfer) {
                                return (
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-md flex-shrink-0 flex items-center justify-center text-indigo-500">
                                        <TransferIcon className="w-6 h-6" />
                                    </div>
                                );
                            }
                            if (category) {
                                return (
                                    <div className="w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                                        <GetCategoryIcon iconName={category.icon} className="w-6 h-6" style={{ color: category.color }} />
                                    </div>
                                );
                            }
                            if (t.receiptUri) {
                                return <img src={t.receiptUri} alt="Receipt" className="w-12 h-12 object-cover rounded-md flex-shrink-0" />;
                            }
                            return (
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400">
                                    <QuestionMarkIcon className="w-6 h-6" />
                                </div>
                            );
                        })()}
                        <div className="flex-grow">
                            <p className="font-bold">{t.isTransfer ? "Transfer" : t.merchant || t.category || t.type}</p>
                            <p className="text-sm text-gray-500">{t.date} at {t.time}</p>
                            {t.isRecurring && (
                                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 font-semibold">
                                    Next due: {t.nextRecurrenceDate}
                                </p>
                            )}
                            {t.note && !t.isRecurring && <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">"{t.note}"</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                           <p className={`font-semibold ${t.type === TransactionType.Income ? 'text-green-500' : 'text-red-500'}`}>
                               {t.type === TransactionType.Income ? '+' : '-'}{t.amount.toFixed(2)} {t.currencyCode}
                           </p>
                           {t.outflowType === 'international' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ({t.baseCurrencyAmount?.toFixed(2)} {settings.baseCurrency})
                                </p>
                           )}
                           <div className="flex gap-2 mt-1 justify-end">
                               <button onClick={() => handleEdit(t)} className="text-xs text-blue-500 hover:underline">Edit</button>
                               <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                           </div>
                        </div>
                    </div>
                ))}
                 {filteredTransactions.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No transactions found.</p>
                    </div>
                )}
            </div>

            {isFormOpen && <TransactionForm 
                transaction={editingTransaction} 
                onSave={handleSaveTransaction} 
                onClose={() => setIsFormOpen(false)}
                onDelete={(id) => {
                    handleDelete(id);
                    setIsFormOpen(false);
                    setEditingTransaction(null);
                }}
            />}
        </div>
    );
};

export default TransactionManager;
