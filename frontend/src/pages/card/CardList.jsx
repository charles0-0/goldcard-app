import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    CreditCard,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Eye,
    Trash2,
    Lock,
    Unlock,
    Copy,
    Check
} from 'lucide-react';

const CardList = () => {
    const { t } = useTranslation();
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/cards', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setCards(await res.json());
                }
            } catch (e) {
                console.error("Failed to fetch cards", e);
            }
        };
        fetchCards();
    }, []);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredCards = cards.filter(card => 
        card.number?.includes(searchTerm) || 
        card.holder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t('cards.title')}</h1>
                    <p className="text-gray-500 text-sm mt-0.5 lg:mt-1 hidden sm:block">{t('cards.title')}</p>
                </div>
                <Link 
                    to="/card/apply" 
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                >
                    <Plus className="w-4 h-4" />
                    {t('cards.createCard')}
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-3 lg:p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full sm:w-48 lg:w-64 focus-within:ring-2 ring-orange-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('common.search') + '...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 lg:gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('common.filter')}</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('cards.cardDetails')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('cards.cardholderName')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('cards.expiryDate')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('cards.status')}</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.balance')}</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('cards.monthlyLimit')}</th>
                                <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCards.map((card) => (
                                <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <div className="flex items-center gap-2 lg:gap-3">
                                            <div className={`w-9 lg:w-10 h-6 lg:h-7 rounded-md bg-gradient-to-br flex items-center justify-center text-[9px] lg:text-[10px] font-bold text-white shadow-sm ${(card.type || '').toLowerCase() === 'visa' ? 'from-blue-600 to-blue-800' : 'from-orange-500 to-orange-700'
                                                }`}>
                                                {(card.type || 'CARD').toUpperCase().substring(0, 4)}
                                            </div>
                                            <div className="text-xs lg:text-sm font-medium text-gray-900 font-mono">
                                                •••• {card.number?.slice(-4)}
                                            </div>
                                            <button 
                                                onClick={() => copyToClipboard(card.number, card.id)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {copiedId === card.id ? <Check className="w-3.5 lg:w-4 h-3.5 lg:h-4 text-green-500" /> : <Copy className="w-3.5 lg:w-4 h-3.5 lg:h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-600 hidden md:table-cell">
                                        {card.holder_name}
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-500 font-mono">
                                        {card.expiry}
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${card.status === 'Active'
                                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : card.status === 'Locked'
                                                ? 'bg-yellow-50 text-yellow-700'
                                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                                            }`}>
                                            {card.status === 'Active' ? t('cards.active') : card.status === 'Locked' ? t('cards.locked') : t('cards.cancelled')}
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-right text-sm font-bold text-gray-900">
                                        ${card.balance}
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm text-gray-500 hidden lg:table-cell">
                                        ${card.limit}
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                                            <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title={t('common.view')}>
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors" title={card.status === 'Active' ? t('cards.lock') : t('cards.unlock')}>
                                                {card.status === 'Active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                            </button>
                                            <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors hidden sm:flex" title={t('common.actions')}>
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCards.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-4 lg:px-6 py-8 lg:py-12 text-center text-gray-500 text-sm">
                                        {t('common.noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-3 lg:p-4 border-t border-gray-50 flex items-center justify-between text-xs lg:text-sm text-gray-500">
                    <div>{t('common.total')}: {filteredCards.length}</div>
                </div>
            </div>
        </div>
    );
};

export default CardList;
