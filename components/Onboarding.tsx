import React, { useState, useCallback } from 'react';
import { CURRENCY_CODES } from '../constants';
import { Account } from '../types';

interface OnboardingProps {
    onComplete: (account: Account) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [accountName, setAccountName] = useState('Main Account');
    const [currency, setCurrency] = useState('USD');
    const [initialBalance, setInitialBalance] = useState('0');

    const finishOnboarding = useCallback(() => {
        const balance = parseFloat(initialBalance);
        if(!accountName.trim() || isNaN(balance)) {
            alert("Please provide a valid account name and initial balance.");
            return;
        }
        onComplete({
            id: crypto.randomUUID(),
            name: accountName,
            currencyCode: currency,
            balance: balance
        });
    }, [accountName, currency, initialBalance, onComplete]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all">
                <div className="min-h-[20rem] flex flex-col justify-center">
                     <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-200">Create Your First Account</h2>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Let's set up your primary bank account.</p>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                            <input
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                className="mt-1 w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Checking, Savings"
                            />
                        </div>

                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="mt-1 w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                aria-label="Select currency"
                            >
                                {CURRENCY_CODES.map(code => <option key={code} value={code}>{code}</option>)}
                            </select>
                        </div>
                        
                        <div>
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Initial Balance</label>
                             <input
                                type="number"
                                value={initialBalance}
                                onChange={(e) => setInitialBalance(e.target.value)}
                                className="mt-1 w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={finishOnboarding}
                        className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105"
                    >
                        Finish Setup
                    </button>
                </div>
            </div>
        </div>
    );
};