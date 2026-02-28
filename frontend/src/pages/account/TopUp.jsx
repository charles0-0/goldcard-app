import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Copy, DollarSign, ArrowRight, Check, Upload, Clock, X } from 'lucide-react';

const TopUp = () => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('crypto');
    const [user, setUser] = useState(null);
    const [copied, setCopied] = useState(false);
    const [orders] = useState([]);
    const [voucher, setVoucher] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setUser(await res.json());
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUser();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVoucher(e.target.files[0]);
        }
    };

    const handleTopUp = async () => {
        if (parseFloat(amount) < 10) {
            alert(t('account.minAmount'));
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('method', method);
            if (voucher) {
                formData.append('voucher', voucher);
            }

            const res = await fetch('/api/account/topup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, method })
            });
            
            if (res.ok) {
                alert(t('account.topUpSuccess'));
                setAmount('');
                setVoucher(null);
            } else {
                alert(t('account.topUpError'));
            }
        } catch (e) {
            console.error(e);
            alert(t('account.topUpError'));
        } finally {
            setLoading(false);
        }
    };

    const copyAddress = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const bankInfo = {
        accountName: 'Hongkong Zengfa International Limited',
        accountNumber: '798612004',
        bankName: 'DBS Bank (Hong Kong) Limited',
        bankAddress: '16/F, The Center, 99 Queen\'s Road Central, Central, Hong Kong',
        swiftCode: 'DHBKHKHH',
        bankCode: '016',
        branchCode: '478'
    };

    const quickAmounts = [100, 500, 1000, 5000];

    return (
        <div className="space-y-4 lg:space-y-6">
            <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t('account.topUpTitle')}</h1>
                <p className="text-gray-500 text-sm mt-0.5 lg:mt-1">{t('account.topUpSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                {/* Left Side: Top Up Form */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
                        <div className="text-sm font-bold text-gray-900 mb-3 lg:mb-4">{t('account.selectMethod')}</div>
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            <button
                                onClick={() => setMethod('crypto')}
                                className={`p-3 lg:p-4 rounded-xl border-2 text-left transition-all ${method === 'crypto' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="font-bold text-gray-900 text-sm lg:text-base">{t('account.crypto')}</div>
                                <div className="text-xs text-gray-500 mt-1">{t('account.cryptoDesc')}</div>
                            </button>
                            <button
                                onClick={() => setMethod('bank')}
                                className={`p-3 lg:p-4 rounded-xl border-2 text-left transition-all ${method === 'bank' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="font-bold text-gray-900 text-sm lg:text-base">{t('account.bankTransfer')}</div>
                                <div className="text-xs text-gray-500 mt-1">{t('account.bankTransferDesc')}</div>
                            </button>
                        </div>
                    </div>

                    {method === 'bank' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
                            <div className="text-sm font-bold text-gray-900 mb-3 lg:mb-4">{t('account.bankInfo')}</div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs lg:text-sm text-gray-500">{t('account.accountName')}</span>
                                    <span className="text-xs lg:text-sm font-medium text-gray-900">{bankInfo.accountName}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs lg:text-sm text-gray-500">{t('account.accountNumber')}</span>
                                    <span className="text-xs lg:text-sm font-medium text-gray-900">{bankInfo.accountNumber}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs lg:text-sm text-gray-500">{t('account.bankName')}</span>
                                    <span className="text-xs lg:text-sm font-medium text-gray-900">{bankInfo.bankName}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs lg:text-sm text-gray-500">{t('account.swiftCode')}</span>
                                    <span className="text-xs lg:text-sm font-medium text-gray-900">{bankInfo.swiftCode}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-xs lg:text-sm text-gray-500">{t('account.bankCode')} / {t('account.branchCode')}</span>
                                    <span className="text-xs lg:text-sm font-medium text-gray-900">{bankInfo.bankCode} / {bankInfo.branchCode}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
                        <div className="text-sm font-bold text-gray-900 mb-3 lg:mb-4">{t('account.enterAmount')}</div>
                        <div className="relative">
                            <DollarSign className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 lg:w-6 h-5 lg:h-6" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-50 border border-transparent rounded-xl pl-10 lg:pl-12 pr-4 py-3 lg:py-4 text-xl lg:text-2xl font-bold text-gray-900 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder-gray-300"
                                placeholder="0.00"
                            />
                            <div className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm lg:text-base">USD</div>
                        </div>

                        <div className="flex flex-wrap gap-2 lg:gap-3 mt-3 lg:mt-4">
                            {quickAmounts.map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-50 rounded-lg text-xs lg:text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>

                        {method === 'bank' && (
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-gray-500 block mb-2">{t('account.uploadVoucher')}</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition-colors cursor-pointer">
                                    <input 
                                        type="file" 
                                        accept=".jpg,.jpeg,.png" 
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        id="voucher-upload"
                                    />
                                    <label htmlFor="voucher-upload" className="cursor-pointer">
                                        {voucher ? (
                                            <div className="flex items-center justify-center gap-2 text-green-600">
                                                <Check className="w-5 h-5" />
                                                <span className="text-sm">{voucher.name}</span>
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); setVoucher(null); }}
                                                    className="ml-2 p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <span className="text-xs lg:text-sm">JPG, PNG</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleTopUp}
                        disabled={loading || !amount}
                        className={`w-full bg-orange-600 text-white rounded-xl py-3 lg:py-4 font-bold text-sm lg:text-lg shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 ${(!amount || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <Clock className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{t('account.continueToPayment')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                {/* Right Side: Wallet Info & Instructions */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
                        <div className="flex items-center gap-3 lg:gap-4 mb-5 lg:mb-6">
                            <div className="w-10 lg:w-12 h-10 lg:h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Wallet className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-white/60 text-xs lg:text-sm">{t('dashboard.totalBalance')}</div>
                                <div className="font-bold text-xl lg:text-2xl">$ {user?.balance?.toLocaleString() || '0.00'}</div>
                            </div>
                        </div>

                        {method === 'crypto' && (
                            <div className="space-y-3 lg:space-y-4">
                                <div className="bg-white/5 rounded-xl p-3 lg:p-4 border border-white/10">
                                    <div className="text-xs text-white/50 mb-1.5 lg:mb-2">USDT Deposit Address (TRC20)</div>
                                    <div className="flex items-center justify-between gap-2 lg:gap-4">
                                        <code className="text-xs lg:text-sm font-mono text-white/90 break-all flex-1">
                                            TFgHXmWqKGmbpNB5T2h1mwUBjE7LqxcyYz
                                        </code>
                                        <button 
                                            onClick={() => copyAddress('TFgHXmWqKGmbpNB5T2h1mwUBjE7LqxcyYz')}
                                            className="text-orange-400 hover:text-white transition-colors shrink-0"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-3 lg:p-4 border border-white/10">
                                    <div className="text-xs text-white/50 mb-1.5 lg:mb-2">USDT Deposit Address (ERC20)</div>
                                    <div className="flex items-center justify-between gap-2 lg:gap-4">
                                        <code className="text-xs lg:text-sm font-mono text-white/90 break-all flex-1">
                                            0x8A9B5a4C6d7E8f9G0h1I2j3K4L5m6N7o8P
                                        </code>
                                        <button 
                                            onClick={() => copyAddress('0x8A9B5a4C6d7E8f9G0h1I2j3K4L5m6N7o8P')}
                                            className="text-orange-400 hover:text-white transition-colors shrink-0"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="text-xs text-white/40 leading-relaxed">
                                    * {t('account.minAmount')}
                                    <br />* Only send USDT to these addresses
                                </div>
                            </div>
                        )}

                        {method === 'bank' && (
                            <div className="text-xs text-white/40 leading-relaxed">
                                * Please include your username in the transfer remarks
                                <br />* Processing time: 1-3 business days
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
                        <div className="text-sm font-bold text-gray-900 mb-3 lg:mb-4">{t('account.recentTopUps')}</div>
                        <div className="space-y-3">
                            {orders.length > 0 ? orders.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">${item.amount}</div>
                                            <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {item.status === 'Success' ? t('common.success') : t('common.pending')}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 text-sm py-4">
                                    {t('common.noData')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopUp;
