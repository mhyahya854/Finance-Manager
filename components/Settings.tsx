import React, { useState, useMemo } from 'react';
import { useSettings, useData } from '../App';
import { Category, NotificationFrequency, TransactionType, Account } from '../types';
import { SunIcon, MoonIcon, GetCategoryIcon } from './icons';
import { CURRENCY_CODES } from '../constants';


interface SettingsProps {}

const ConfirmationDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
                <div className="p-6">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-medium">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium">Delete</button>
                </div>
            </div>
        </div>
    );
};

interface AccountFormProps {
    account: Account | null;
    onSave: (account: Account | Omit<Account, 'id'>) => void;
    onClose: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onSave, onClose }) => {
    const [name, setName] = useState(account?.name || '');
    const [currencyCode, setCurrencyCode] = useState(account?.currencyCode || 'USD');
    const [balance, setBalance] = useState(account?.balance.toString() || '0');

    const handleSave = () => {
        const parsedBalance = parseFloat(balance);
        if(!name.trim() || isNaN(parsedBalance)) {
            alert("Please provide a valid account name and balance.");
            return;
        }

        if (account) {
            onSave({ ...account, name, balance: parsedBalance });
        } else {
            onSave({ name, currencyCode, balance: parsedBalance });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{account ? 'Edit' : 'Add'} Account</h2>
                    <input type="text" placeholder="Account Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                    <select value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} disabled={!!account} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm disabled:bg-gray-100 dark:disabled:bg-gray-800">
                        {CURRENCY_CODES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" placeholder="Current Balance" value={balance} onChange={(e) => setBalance(e.target.value)} disabled={!!account} className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm disabled:bg-gray-100 dark:disabled:bg-gray-800" />
                     {account && <p className="text-xs text-gray-500">Currency and balance cannot be changed after creation. To adjust balance, add an income/expense transaction.</p>}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
};


interface CategoryFormProps {
    category: Category | null;
    onSave: (category: Category) => void;
    onClose: () => void;
    onDelete: (categoryName: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose, onDelete }) => {
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || '#3B82F6');
    const [icon, setIcon] = useState(category?.icon || 'OtherIcon');

    const handleSave = () => {
        if (!name) {
            alert('Category name cannot be empty.');
            return;
        }
        onSave({ name, color, icon });
        onClose();
    };

    const handleDelete = () => {
        if (category) {
            onDelete(category.name);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{category ? 'Edit' : 'Add'} Category</h2>
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        disabled={!!category}
                    />
                    <div className="flex items-center gap-4">
                        <label htmlFor="category-color">Color:</label>
                        <input
                            id="category-color"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-16 h-8 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                        />
                         <span className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md font-mono text-sm">{color.toUpperCase()}</span>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-between items-center">
                    <div>
                        {category && (
                             <button onClick={handleDelete} className="px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
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


const SettingsComponent: React.FC<SettingsProps> = () => {
    const { settings, updateSettings } = useSettings();
    const { transactions, accounts, addAccount, updateAccount, deleteAccount } = useData();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'category' | 'account'} | null>(null);

    const rateHistory = useMemo(() => {
        return transactions
            .filter(t => 
                t.type === TransactionType.Outflow && 
                t.outflowType === 'international' && 
                t.exchangeRate
            )
            .map(t => ({
                id: t.id,
                date: t.date,
                from: t.currencyCode,
                to: settings.baseCurrency,
                rate: t.exchangeRate,
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, settings.baseCurrency]);

    const handleThemeChange = (theme: 'light' | 'dark') => {
        updateSettings(s => ({ ...s, theme }));
    };

    const handleSettingChange = (field: keyof typeof settings, value: any) => {
        updateSettings(s => ({ ...s, [field]: value }));
    };

    const handleSaveCategory = (category: Category) => {
        updateSettings(s => {
            const existing = s.categories.find(c => c.name === category.name);
            if (existing) {
                return { ...s, categories: s.categories.map(c => c.name === category.name ? category : c) };
            } else {
                return { ...s, categories: [...s.categories, category] };
            }
        });
    };

    const handleDeleteRequest = (id: string, type: 'category' | 'account') => {
        setItemToDelete({ id, type });
        setIsConfirmModalOpen(true);
    };
    
    const confirmDelete = () => {
        if (!itemToDelete) return;
        if(itemToDelete.type === 'category') {
             updateSettings(s => ({ ...s, categories: s.categories.filter(c => c.name !== itemToDelete.id) }));
        } else if (itemToDelete.type === 'account') {
            deleteAccount(itemToDelete.id);
        }
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };

    const handleSaveAccount = (accountData: Account | Omit<Account, 'id'>) => {
        if('id' in accountData) {
            updateAccount(accountData);
        } else {
            addAccount(accountData);
        }
    };
    
    const handleResetData = () => {
        if (window.confirm("Are you sure you want to delete ALL application data (transactions, settings, etc)? This cannot be undone.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const formatCurrency = (amount: number, currencyCode: string) => {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(amount);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">Settings</h1>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                <div className="flex items-center space-x-4">
                    <span>Theme:</span>
                    <button onClick={() => handleThemeChange('light')} className={`p-2 rounded-full ${settings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><SunIcon /></button>
                    <button onClick={() => handleThemeChange('dark')} className={`p-2 rounded-full ${settings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><MoonIcon /></button>
                </div>
            </div>

             <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
                <div className="space-y-2">
                    {accounts.map(acc => (
                         <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div>
                                <p className="font-medium">{acc.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(acc.balance, acc.currencyCode)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => {setEditingAccount(acc); setIsAccountModalOpen(true);}} className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleDeleteRequest(acc.id, 'account')} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => {setEditingAccount(null); setIsAccountModalOpen(true);}} className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500">
                    Add New Account
                </button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                    {settings.categories.map(cat => (
                         <button 
                            key={cat.name} 
                            onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
                            aria-label={`Edit category ${cat.name}`}
                        >
                            <div className="flex items-center gap-3">
                                <GetCategoryIcon iconName={cat.icon} className="w-5 h-5" style={{ color: cat.color }} />
                                <span className="font-medium">{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{cat.color.toUpperCase()}</span>
                                <div style={{ backgroundColor: cat.color }} className="w-6 h-6 rounded-md border border-gray-200 dark:border-gray-600"></div>
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true);}} className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500">
                    Add New Category
                </button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Exchange Rate History</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {rateHistory.length > 0 ? rateHistory.map(r => (
                        <div key={r.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <span className="font-semibold">{r.from}</span>
                                <span className="text-gray-500 dark:text-gray-400"> to </span>
                                <span className="font-semibold">{r.to}</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{r.date}</p>
                            </div>
                            <span className="font-mono text-sm">{r.rate.toFixed(4)}</span>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No international transactions recorded yet.</p>
                    )}
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Frequency</label>
                        <select
                            value={settings.notificationFrequency}
                            onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
                            className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            <option value={NotificationFrequency.Off}>Off</option>
                            <option value={NotificationFrequency.Daily}>Daily</option>
                            <option value={NotificationFrequency.Weekly}>Weekly</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Time</label>
                        <input
                            type="time"
                            value={settings.notificationTime}
                            onChange={(e) => handleSettingChange('notificationTime', e.target.value)}
                            className="w-full p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    </div>
                </div>
            </div>

             <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Data Management</h2>
                <button onClick={handleResetData} className="w-full mt-2 py-2 text-white bg-red-600 font-semibold rounded-lg hover:bg-red-700 transition-colors">
                    Reset All Data
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">Warning: This will delete all your transactions and settings permanently.</p>
            </div>

            {isCategoryModalOpen && <CategoryForm 
                category={editingCategory} 
                onSave={handleSaveCategory} 
                onClose={() => setIsCategoryModalOpen(false)} 
                onDelete={(name) => handleDeleteRequest(name, 'category')}
            />}
            
            {isAccountModalOpen && <AccountForm
                account={editingAccount}
                onSave={handleSaveAccount}
                onClose={() => setIsAccountModalOpen(false)}
            />}

            <ConfirmationDialog
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Delete ${itemToDelete?.type}`}
                message={
                    <>
                        <p>Are you sure you want to delete this {itemToDelete?.type}?</p>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
                    </>
                }
            />
        </div>
    );
};

export default SettingsComponent;