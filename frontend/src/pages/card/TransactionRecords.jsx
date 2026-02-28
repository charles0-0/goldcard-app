import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download } from 'lucide-react';

const TransactionRecords = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/transactions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(item => {
        const matchesSearch = searchTerm === '' || 
            item.id?.toString().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t('transactions.title')}</h1>
                    <p className="text-gray-500 text-sm mt-0.5 lg:mt-1 hidden sm:block">{t('transactions.title')}</p>
                </div>
                <button className="flex items-center justify-center gap-1.5 lg:gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    {t('cards.exportExcel')}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-3 lg:p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full sm:w-64 lg:w-80 focus-within:ring-2 ring-orange-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('common.search') + '...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        <select 
                            className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-50"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">{t('account.all')}</option>
                            <option value="success">{t('common.success')}</option>
                            <option value="pending">{t('common.pending')}</option>
                            <option value="failed">{t('common.error')}</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.date')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t('common.type')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('transactions.merchantName')}</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.amount')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-500">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-600 hidden sm:table-cell">{item.type}</td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Success' ? 'bg-green-50 text-green-700' :
                                                item.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                                    'bg-red-50 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-500 hidden md:table-cell">
                                            {item.description}
                                        </td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-bold ${item.type === 'Top Up' || item.type === 'Credit' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            ${item.amount}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 lg:px-6 py-8 lg:py-12 text-center text-gray-500 text-sm">
                                        {t('common.noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-3 lg:p-4 border-t border-gray-50 flex items-center justify-between text-xs lg:text-sm text-gray-500">
                    <div>{t('common.total')}: {filteredTransactions.length}</div>
                </div>
            </div>
        </div>
    );
};

export default TransactionRecords;
