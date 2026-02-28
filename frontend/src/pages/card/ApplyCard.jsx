import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, AlertCircle } from 'lucide-react';

const ApplyCard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cardType: 'virtual',
        currency: 'USD',
        limit: 1000,
        label: '',
        holderName: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: formData.cardType,
                    holder_name: formData.holderName,
                    currency: formData.currency,
                    limit: parseFloat(formData.limit),
                    label: formData.label
                })
            });

            if (res.ok) {
                alert(t('cards.createSuccess'));
                navigate('/card/list');
            } else {
                alert(t('cards.createError'));
            }
        } catch (error) {
            console.error('Error creating card:', error);
            alert(t('cards.createError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 lg:space-y-6">
            <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t('nav.applyCard')}</h1>
                <p className="text-gray-500 text-sm mt-0.5 lg:mt-1">{t('cards.createCard')}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-8 space-y-6 lg:space-y-8">

                {/* Card Type Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t('cards.cardType')}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                        <div
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 lg:gap-4 ${formData.cardType === 'virtual' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            onClick={() => setFormData({ ...formData, cardType: 'virtual' })}
                        >
                            <div className={`p-2 rounded-lg ${formData.cardType === 'virtual' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CreditCard className="w-5 lg:w-6 h-5 lg:h-6" />
                            </div>
                            <div className="flex-1">
                                <div className={`font-bold text-sm lg:text-base ${formData.cardType === 'virtual' ? 'text-orange-900' : 'text-gray-900'}`}>{t('cards.virtualCard')}</div>
                                <div className="text-xs text-gray-500 mt-1 hidden sm:block">{t('cards.virtualCard').includes('Instant') ? '' : 'Instant activation, ready for online use'}</div>
                            </div>
                            {formData.cardType === 'virtual' && <Check className="w-5 h-5 text-orange-600 shrink-0" />}
                        </div>

                        <div
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 lg:gap-4 ${formData.cardType === 'physical' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            onClick={() => setFormData({ ...formData, cardType: 'physical' })}
                        >
                            <div className={`p-2 rounded-lg ${formData.cardType === 'physical' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CreditCard className="w-5 lg:w-6 h-5 lg:h-6" />
                            </div>
                            <div className="flex-1">
                                <div className={`font-bold text-sm lg:text-base ${formData.cardType === 'physical' ? 'text-orange-900' : 'text-gray-900'}`}>{t('cards.physicalCard')}</div>
                                <div className="text-xs text-gray-500 mt-1 hidden sm:block">{t('cards.physicalCard').includes('Metal') ? '' : 'Metal card delivered in 3-5 days'}</div>
                            </div>
                            {formData.cardType === 'physical' && <Check className="w-5 h-5 text-orange-600 shrink-0" />}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('cards.cardLabel')}</label>
                        <input
                            type="text"
                            placeholder="e.g. Marketing Ops"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                            value={formData.label}
                            onChange={e => setFormData({ ...formData, label: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('cards.cardholderName')}</label>
                        <input
                            type="text"
                            placeholder="Name on card"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                            value={formData.holderName}
                            onChange={e => setFormData({ ...formData, holderName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('common.currency')}</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                        >
                            <option value="USD">{t('common.USD')} - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('cards.monthlyLimit')} ({formData.currency})</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                            value={formData.limit}
                            onChange={e => setFormData({ ...formData, limit: e.target.value })}
                            min="0"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 p-3 lg:p-4 rounded-xl flex gap-2 lg:gap-3 text-blue-700 text-xs lg:text-sm">
                    <AlertCircle className="w-4 lg:w-5 h-4 lg:h-5 shrink-0" />
                    <div className="leading-relaxed">
                        {t('cards.virtualCard').includes('free') ? '' : 'Creating a new card is free. Physical cards cost $10.00 for shipping.'}
                    </div>
                </div>

                <div className="flex justify-end gap-3 lg:gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={() => navigate('/card/list')}
                        className="px-5 lg:px-6 py-2.5 lg:py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                        {t('common.cancel')}
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`px-6 lg:px-8 py-2.5 lg:py-3 bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all transform active:scale-95 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? t('common.loading') : t('cards.createCard')}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ApplyCard;
