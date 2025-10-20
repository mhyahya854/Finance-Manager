import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { useData } from '../App';

const TransactionForm: React.FC<{
    transaction: Transaction | null;
    onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
    onClose: () => void;
    onDelete?: (id: string) => void;
    isReminderMode?: boolean;
}> = ({ transaction, onSave, onClose, onDelete, isReminderMode = false }) => {
    const { settings, getRate, accounts } = useData();
    const [type, setType] = useState<TransactionType>(transaction?.type || TransactionType.Outflow);
    const [accountId, setAccountId] = useState<string>(transaction?.accountId || (accounts.length > 0 ? accounts[0].id : ''));
    const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(transaction?.time || new Date().toTimeString().slice(0, 5));
    const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
    
    const selectedAccount = useMemo(() => accounts.find(a => a.id === accountId), [accounts, accountId]);
    const [currencyCode, setCurrencyCode] = useState(transaction?.currencyCode || selectedAccount?.currencyCode || settings.baseCurrency);
    
    const [merchant, setMerchant] = useState(transaction?.merchant || '');
    const [locationText, setLocationText] = useState(transaction?.locationText || '');
    const [note, setNote] = useState(transaction?.note || '');
    const [receiptUri, setReceiptUri] = useState(transaction?.receiptUri || '');
    const [category, setCategory] = useState(transaction?.category || (settings.categories.length > 0 ? settings.categories[0].name : ''));
    
    // Outflow specific state
    const [outflowType, setOutflowType] = useState<'local' | 'international'>(transaction?.outflowType || 'local');
    const [baseCurrencyAmount, setBaseCurrencyAmount] = useState(transaction?.baseCurrencyAmount?.toString() || '');
    const [isTransfer, setIsTransfer] = useState(transaction?.isTransfer || false);
    const [destinationAccountId, setDestinationAccountId] = useState(transaction?.destinationAccountId || '');
    const [exchangeRate, setExchangeRate] = useState(transaction?.exchangeRate?.toString() || '');

    // Recurring transaction state
    const [isRecurring, setIsRecurring] = useState(transaction?.isRecurring || isReminderMode);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(transaction?.recurrenceFrequency || 'monthly');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(transaction?.recurrenceEndDate || '');

    useEffect(() => {
        // If account changes, update the default currency
        if (selectedAccount) {
            setCurrencyCode(selectedAccount.currencyCode);
        }
    }, [accountId, selectedAccount]);

    useEffect(() => {
        // Auto-detect if a transfer is international and set outflow type
        if (isTransfer && accountId && destinationAccountId) {
            const sourceAcc = accounts.find(a => a.id === accountId);
            const destAcc = accounts.find(a => a.id === destinationAccountId);
            if (sourceAcc && destAcc && sourceAcc.currencyCode !== destAcc.currencyCode) {
                setOutflowType('international');
                const rate = getRate(sourceAcc.currencyCode, destAcc.currencyCode) || 1;
                setExchangeRate(rate.toFixed(6));
                const amountNum = parseFloat(amount);
                if (!isNaN(amountNum)) {
                    setBaseCurrencyAmount((amountNum * rate).toFixed(2));
                }
            } else {
                setOutflowType('local');
                setBaseCurrencyAmount(amount);
                setExchangeRate('1');
            }
        }
    }, [isTransfer, accountId, destinationAccountId, accounts, getRate, amount]);

    const calculateNextRecurrenceDate = (startDateStr: string, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): Date => {
        const date = new Date(startDateStr);
        date.setHours(12, 0, 0, 0);
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
    };

    const handleSave = () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || !currencyCode || !date || !time || !accountId) {
            alert("Please fill all required fields: Account, Date, Time, Amount, and Currency.");
            return;
        }
        if (isTransfer && !destinationAccountId) {
            alert("Please select a destination account for the transfer.");
            return;
        }

        const newTransaction: Omit<Transaction, 'id'> = {
            accountId,
            type,
            date,
            time,
            amount: parsedAmount,
            currencyCode,
            locationText,
            note,
            receiptUri,
            isRecurring,
            ...(isRecurring && {
                recurrenceFrequency,
                recurrenceEndDate: recurrenceEndDate || undefined,
                nextRecurrenceDate: calculateNextRecurrenceDate(date, recurrenceFrequency).toISOString().split('T')[0],
            }),
            ...(type === TransactionType.Outflow && {
                outflowType,
                isTransfer,
                destinationAccountId: isTransfer ? destinationAccountId : undefined,
                merchant,
                category: !isTransfer ? category : undefined,
                ...(outflowType === 'international' && {
                    baseCurrencyAmount: parseFloat(baseCurrencyAmount),
                    exchangeRate: parseFloat(exchangeRate),
                }),
            }),
        };

        if (transaction?.id) {
            onSave({ ...newTransaction, id: transaction.id });
        } else {
            onSave(newTransaction);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptUri(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const fetchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("Could not retrieve location. Please check browser permissions and try again.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    
    const handleAmountChange = (val: string) => {
        setAmount(val);
        const amountNum = parseFloat(val);
        const rateNum = parseFloat(exchangeRate);
        if(!isNaN(amountNum) && !isNaN(rateNum) && rateNum > 0) {
            setBaseCurrencyAmount((amountNum * rateNum).toFixed(2));
        }
    };

    const handleBaseAmountChange = (val: string) => {
        setBaseCurrencyAmount(val);
        const baseAmountNum = parseFloat(val);
        const amountNum = parseFloat(amount);
        if(!isNaN(baseAmountNum) && !isNaN(amountNum) && amountNum > 0) {
            setExchangeRate((baseAmountNum / amountNum).toFixed(6));
        }
    };

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        if (newType === TransactionType.Income) {
            setOutflowType('local');
            setIsTransfer(false);
        }
    };
    
    const handleOutflowTypeChange = (newOutflowType: 'local' | 'international') => {
        setOutflowType(newOutflowType);
        if(newOutflowType === 'local') {
            setBaseCurrencyAmount('');
            setExchangeRate('');
        }
    };
    
    const destinationAccountCurrency = useMemo(() => {
        if(!isTransfer || !destinationAccountId) return settings.baseCurrency;
        return accounts.find(a => a.id === destinationAccountId)?.currencyCode || settings.baseCurrency;
    }, [isTransfer, destinationAccountId, accounts, settings.baseCurrency]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{transaction ? 'Edit' : 'Add'} {isReminderMode ? 'Reminder' : 'Transaction'}</h2>
                    
                    <div className="flex space-x-2">
                        <button onClick={() => handleTypeChange(TransactionType.Outflow)} className={`flex-1 py-2 rounded-md capitalize font-semibold transition-colors ${type === TransactionType.Outflow ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Outflow</button>
                        <button onClick={() => handleTypeChange(TransactionType.Income)} className={`flex-1 py-2 rounded-md capitalize font-semibold transition-colors ${type === TransactionType.Income ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Income</button>
                    </div>
                    
                     <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</label>
                        <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                           {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.currencyCode})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                    </div>
                    
                    {type === TransactionType.Outflow && (
                        <div className="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-gray-900/30 rounded-r-md space-y-3">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="is-transfer" checked={isTransfer} onChange={e => setIsTransfer(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="is-transfer" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as a transfer</label>
                            </div>
                            
                            <div className="flex space-x-2">
                                <button onClick={() => handleOutflowTypeChange('local')} disabled={isTransfer} className={`flex-1 py-2 text-sm rounded-md capitalize font-semibold transition-colors ${outflowType === 'local' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'} ${isTransfer ? 'cursor-not-allowed opacity-70' : ''}`}>Local</button>
                                <button onClick={() => handleOutflowTypeChange('international')} disabled={isTransfer} className={`flex-1 py-2 text-sm rounded-md capitalize font-semibold transition-colors ${outflowType === 'international' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'} ${isTransfer ? 'cursor-not-allowed opacity-70' : ''}`}>International</button>
                            </div>
                            
                            {isTransfer && (
                                 <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To Account</label>
                                    <select value={destinationAccountId} onChange={e => setDestinationAccountId(e.target.value)} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                                       <option value="">Select Destination</option>
                                       {accounts.filter(acc => acc.id !== accountId).map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.currencyCode})</option>)}
                                    </select>
                                </div>
                            )}

                            <div className={`space-y-4 overflow-hidden transition-all duration-500 ease-in-out ${outflowType === 'international' ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-3 border border-dashed border-gray-400 rounded-lg space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Paid ({currencyCode})</label>
                                        <input type="number" placeholder="Amount Paid" value={amount} onChange={(e) => handleAmountChange(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Received ({destinationAccountCurrency})</label>
                                        <input type="number" placeholder="Amount Received" value={baseCurrencyAmount} onChange={(e) => handleBaseAmountChange(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                                    </div>
                                    <div className="text-center text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                        <span className="font-medium">Calculated Rate:</span> 1 {currencyCode} = {parseFloat(exchangeRate || '0').toFixed(4)} {destinationAccountCurrency}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {!(type === TransactionType.Outflow && outflowType === 'international') && (
                            <div className="flex gap-2">
                                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-2/3 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                                <input readOnly value={currencyCode} className="w-1/3 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-center font-medium" />
                            </div>
                        )}
                        
                        {!isTransfer && type === TransactionType.Outflow && (
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                                {settings.categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        )}
                        
                        <input type="text" placeholder={type === TransactionType.Income ? "Payer" : "Merchant or Payee"} value={merchant} onChange={e => setMerchant(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                    </div>
                    
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-900/30 rounded-r-md space-y-3">
                        <div className="flex items-center space-x-2">
                           <input
                            type="checkbox"
                            id="is-recurring"
                            checked={isRecurring}
                            onChange={e => setIsRecurring(e.target.checked)}
                            disabled={isReminderMode && !transaction}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50" />
                           <label htmlFor="is-recurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring Transaction</label>
                        </div>
                        <div className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${isRecurring ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                           <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="recurrence-freq" className="text-xs font-medium text-gray-500 dark:text-gray-400">Frequency</label>
                                    <select id="recurrence-freq" value={recurrenceFrequency} onChange={e => setRecurrenceFrequency(e.target.value as any)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                                <div>
                                   <label htmlFor="recurrence-end" className="text-xs font-medium text-gray-500 dark:text-gray-400">End Date (Optional)</label>
                                   <input type="date" id="recurrence-end" value={recurrenceEndDate} onChange={e => setRecurrenceEndDate(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                                </div>
                           </div>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                         <input type="text" placeholder="Location" value={locationText} onChange={e => setLocationText(e.target.value)} className="flex-grow p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                         <button onClick={fetchLocation} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">GPS</button>
                    </div>

                    <textarea placeholder="Note" value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm min-h-[60px]" />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Receipt Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-600 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-gray-500"/>
                        {receiptUri && <img src={receiptUri} alt="Receipt preview" className="mt-2 rounded-lg max-h-40 w-auto"/>}
                    </div>

                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-between items-center">
                    <div>
                        {transaction && onDelete && (
                             <button onClick={() => onDelete(transaction.id)} className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                                Delete
                             </button>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionForm;
