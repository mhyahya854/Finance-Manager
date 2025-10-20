import React, { useMemo, useState } from 'react';
import { useData } from '../App';
import { Transaction, TransactionType } from '../types';
import { RepeatIcon, PlusIcon } from './icons';
import TransactionForm from './TransactionForm';

const getDueDateStatus = (dateStr: string): { text: string; isOverdue: boolean; diffDays: number } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `Overdue by ${Math.abs(diffDays)} day(s)`, isOverdue: true, diffDays };
    }
    if (diffDays === 0) {
        return { text: `Due today`, isOverdue: false, diffDays };
    }
    return { text: `Due in ${diffDays} day(s)`, isOverdue: false, diffDays };
};

const ReminderItem: React.FC<{ 
    transaction: Transaction, 
    onLog: (id: string) => void, 
    isDue: boolean,
    onEdit: (transaction: Transaction) => void,
    onDelete: (id: string) => void,
}> = ({ transaction, onLog, isDue, onEdit, onDelete }) => {
    const { settings } = useData();
    const status = getDueDateStatus(transaction.nextRecurrenceDate!);

    const formatCurrency = (amount: number, currencyCode: string = settings.baseCurrency) => {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(amount);
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
            <div className={`w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center ${
                status.isOverdue ? 'bg-red-100 dark:bg-red-900/50 text-red-500' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-500'
            }`}>
                <RepeatIcon className="w-6 h-6" />
            </div>
            <div className="flex-grow">
                <p className="font-bold">{transaction.merchant || transaction.category || (transaction.type === TransactionType.Income ? 'Recurring Income' : 'Recurring Expense')}</p>
                <p className="text-sm font-medium capitalize text-gray-500 dark:text-gray-400">{transaction.recurrenceFrequency}</p>
                 <p className={`text-sm font-semibold mt-1 ${status.isOverdue ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                    {status.text}
                </p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className={`font-semibold ${transaction.type === TransactionType.Income ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === TransactionType.Income ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currencyCode)}
                </p>
                <div className="flex gap-2 mt-1 justify-end items-center">
                    {isDue && (
                        <button onClick={() => onLog(transaction.id)} className="px-3 py-1 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Log Payment
                        </button>
                    )}
                     <button onClick={() => onEdit(transaction)} className="text-xs text-blue-500 hover:underline">Edit</button>
                     <button onClick={() => onDelete(transaction.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
            </div>
        </div>
    )
};


const Reminders: React.FC = () => {
    const { transactions, logRecurringTransaction, addTransaction, updateTransaction, deleteTransaction } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const recurringTransactions = useMemo(() => {
        return transactions.filter(t => t.isRecurring && t.nextRecurrenceDate);
    }, [transactions]);

    const { due, upcoming } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dueList: Transaction[] = [];
        const upcomingList: Transaction[] = [];

        recurringTransactions.forEach(t => {
            const nextDate = new Date(t.nextRecurrenceDate!);
            if (nextDate <= today) {
                dueList.push(t);
            } else {
                upcomingList.push(t);
            }
        });
        
        // Sort due by most overdue first, then upcoming by soonest first
        dueList.sort((a, b) => new Date(a.nextRecurrenceDate!).getTime() - new Date(b.nextRecurrenceDate!).getTime());
        upcomingList.sort((a, b) => new Date(a.nextRecurrenceDate!).getTime() - new Date(b.nextRecurrenceDate!).getTime());

        return { due: dueList, upcoming: upcomingList };
    }, [recurringTransactions]);
    
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
        if (window.confirm("Are you sure you want to delete this reminder? This cannot be undone.")) {
            deleteTransaction(id);
        }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center">Bills &amp; Subscriptions</h1>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b-2 border-red-500 pb-2 text-red-600 dark:text-red-400">Due &amp; Overdue</h2>
                {due.length > 0 ? (
                    <div className="space-y-3">
                        {due.map(t => <ReminderItem key={t.id} transaction={t} onLog={logRecurringTransaction} isDue={true} onEdit={handleEdit} onDelete={handleDelete} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-6">Nothing is due right now. Good job!</p>
                )}
            </div>
            
            <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b-2 border-blue-500 pb-2 text-blue-600 dark:text-blue-400">Upcoming</h2>
                 {upcoming.length > 0 ? (
                    <div className="space-y-3">
                        {upcoming.map(t => <ReminderItem key={t.id} transaction={t} onLog={logRecurringTransaction} isDue={false} onEdit={handleEdit} onDelete={handleDelete} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-6">No upcoming payments scheduled.</p>
                )}
            </div>

            <button
                onClick={() => {
                    setEditingTransaction(null);
                    setIsFormOpen(true);
                }}
                className="fixed bottom-20 right-5 sm:right-10 z-30 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition transform hover:scale-110"
                aria-label="Add reminder"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>

            {isFormOpen && <TransactionForm
                transaction={editingTransaction}
                onSave={handleSaveTransaction}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingTransaction(null);
                }}
                 onDelete={(id) => {
                    handleDelete(id);
                    setIsFormOpen(false);
                    setEditingTransaction(null);
                }}
                isReminderMode={true}
            />}
        </div>
    );
};

export default Reminders;