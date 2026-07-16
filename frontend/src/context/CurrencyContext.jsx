import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('LKR');

    const rates = {
        LKR: { symbol: 'Rs. ', rate: 1 },
        USD: { symbol: '$', rate: 1 / 300 },
        EUR: { symbol: '€', rate: 1 / 325 },
        GBP: { symbol: '£', rate: 1 / 385 }
    };

    const convertPrice = (lkrPrice) => {
        const p = Number(lkrPrice) || 0;
        const current = rates[currency];
        const converted = p * current.rate;
        
        if (currency === 'LKR') {
            return `${current.symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${current.symbol}${converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, rates }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
