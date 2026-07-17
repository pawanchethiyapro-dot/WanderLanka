import { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useCurrency } from './context/CurrencyContext';

function PaymentModal({ amount, itemName, description, onSuccess, onCancel }) {
    const { convertPrice } = useCurrency();
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [cardType, setCardType] = useState('unknown'); // 'visa', 'mastercard', 'unknown'
    const [paymentState, setPaymentState] = useState('idle'); // 'idle', 'processing', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    // Card number format and detection
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Digits only
        if (value.length > 16) value = value.slice(0, 16);

        // Detect type
        if (value.startsWith('4')) {
            setCardType('visa');
        } else if (value.startsWith('5')) {
            setCardType('mastercard');
        } else {
            setCardType('unknown');
        }

        // Format in blocks of 4 digits
        let formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardData({ ...cardData, number: formatted });
    };

    // Expiry date format
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Digits only
        if (value.length > 4) value = value.slice(0, 4);

        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setCardData({ ...cardData, expiry: value });
    };

    // CVV format
    const handleCVVChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        setCardData({ ...cardData, cvv: value });
    };

    const handlePay = (e) => {
        e.preventDefault();
        
        // Basic validations
        const cleanNumber = cardData.number.replace(/\s/g, '');
        if (cleanNumber.length !== 16) {
            setErrorMessage('Please enter a valid 16-digit card number.');
            return;
        }
        if (cardData.expiry.length !== 5) {
            setErrorMessage('Please enter card expiry date (MM/YY).');
            return;
        }
        if (cardData.cvv.length !== 3) {
            setErrorMessage('Please enter a valid 3-digit CVV.');
            return;
        }
        if (!cardData.name.trim()) {
            setErrorMessage('Please enter the cardholder name.');
            return;
        }

        setErrorMessage('');
        setPaymentState('processing');

        // Simulate payment gateway API delay
        setTimeout(() => {
            // Mock failures for specific cards if desired (e.g. starting with 9)
            setPaymentState('success');
            setTimeout(() => {
                onSuccess();
            }, 1500); // Wait for success checkmark animation
        }, 2200);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                boxShadow: 'var(--shadow)',
                maxWidth: '460px',
                width: '100%',
                padding: '30px',
                boxSizing: 'border-box',
                position: 'relative',
                textAlign: 'left'
            }} onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                {paymentState === 'idle' && (
                    <button 
                        onClick={onCancel}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-h)'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}

                {paymentState === 'idle' && (
                    <>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck style={{ color: 'var(--primary)' }} /> Secure Checkout
                        </h2>
                        <p style={{ margin: '0 0 20px 0', color: 'var(--text-light)', fontSize: '13px' }}>
                            Your connection is encrypted with standard 256-bit SSL technology.
                        </p>

                        {/* Order Summary box */}
                        <div style={{
                            background: 'var(--accent-bg)',
                            border: '1px solid var(--accent-border)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)', fontWeight: '700', marginBottom: '4px' }}>Booking Item</div>
                            <div style={{ color: 'var(--text-h)', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>{itemName}</div>
                            {description && <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '12px' }}>{description}</div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                                <strong style={{ color: 'var(--text-h)' }}>Total Amount:</strong>
                                <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{convertPrice(amount)}</strong>
                            </div>
                        </div>

                        {errorMessage && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#fca5a5',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={16} /> {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            {/* Card Number Input */}
                            <div className="input-group">
                                <label className="input-label">Card Number</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text"
                                        className="form-input"
                                        placeholder="0000 0000 0000 0000"
                                        value={cardData.number}
                                        onChange={handleCardNumberChange}
                                        required
                                        style={{ letterSpacing: '2px', fontFamily: 'monospace' }}
                                    />
                                    {/* Dynamic Card Brand Icon */}
                                    <div style={{ position: 'absolute', right: '14px', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                                        {cardType === 'visa' && <span style={{ color: '#1a1f71', fontWeight: '800', fontStyle: 'italic', fontSize: '14px', background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd' }}>VISA</span>}
                                        {cardType === 'mastercard' && <span style={{ color: '#eb001b', fontWeight: '800', fontStyle: 'italic', fontSize: '14px', background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd' }}>MC</span>}
                                        {cardType === 'unknown' && <CreditCard size={20} style={{ color: 'var(--text-light)' }} />}
                                    </div>
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div className="input-group">
                                <label className="input-label">Cardholder Name</label>
                                <input 
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. John Doe"
                                    value={cardData.name}
                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                    required
                                    style={{ paddingLeft: '16px' }} // No icon, normal padding
                                />
                            </div>

                            {/* Expiry & CVV */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="input-group">
                                    <label className="input-label">Expiration Date</label>
                                    <input 
                                        type="text"
                                        className="form-input"
                                        placeholder="MM/YY"
                                        value={cardData.expiry}
                                        onChange={handleExpiryChange}
                                        required
                                        style={{ paddingLeft: '16px', textAlign: 'center' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">CVV / CVC</label>
                                    <input 
                                        type="password"
                                        className="form-input"
                                        placeholder="***"
                                        value={cardData.cvv}
                                        onChange={handleCVVChange}
                                        required
                                        style={{ paddingLeft: '16px', textAlign: 'center' }}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="btn-primary"
                                style={{
                                    padding: '14px',
                                    marginTop: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Lock size={16} /> Pay {convertPrice(amount)}
                            </button>
                        </form>
                    </>
                )}

                {/* Processing State */}
                {paymentState === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{ 
                            border: '4px solid rgba(14, 165, 233, 0.1)',
                            borderTop: '4px solid var(--primary)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px auto'
                        }}></div>
                        <h3 style={{ margin: '0 0 8px 0' }}>Processing Payment...</h3>
                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '13px' }}>
                            Verifying details with your credit card provider. Please do not refresh.
                        </p>
                    </div>
                )}

                {/* Success State */}
                {paymentState === 'success' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <CheckCircle size={50} style={{ color: 'var(--accent-green)', marginBottom: '20px' }} />
                        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-h)' }}>Payment Successful!</h3>
                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '13px' }}>
                            Your reservation has been secured. Creating booking logs.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default PaymentModal;
