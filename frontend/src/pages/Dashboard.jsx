import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Activity,
    MoreHorizontal,
    Plus
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const StatCard = ({ title, value, change, trend, icon, color }) => {
    const IconComponent = icon;
    return (
        <div className="bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className={`p-2.5 lg:p-3 rounded-xl ${color}`}>
                    {IconComponent && <IconComponent className="w-5 lg:w-6 h-5 lg:h-6 text-white" />}
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {change}
                    </div>
                )}
            </div>
            <div className="text-gray-500 text-xs lg:text-sm font-medium">{title}</div>
            <div className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{value}</div>
        </div>
    );
};

const TransactionRow = ({ id, type, amount, status, date, card }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-900">#{id}</td>
            <td className="px-4 lg:px-6 py-3 lg:py-4">
                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs lg:text-sm font-medium text-gray-900">{card || 'N/A'}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{type}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-500">{date}</td>
            <td className="px-4 lg:px-6 py-3 lg:py-4">
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status === 'Success'
                        ? 'bg-green-50 text-green-700'
                        : status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                    }`}>
                    {status}
                </div>
            </td>
            <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold text-gray-900 text-right">
                ${amount}
            </td>
            <td className="px-4 lg:px-6 py-3 lg:py-4 text-right hidden sm:table-cell">
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalBalance: 0,
        activeCards: 0,
        totalSpending: 0,
        totalCompanies: 0
    });
    const [chartData, setChartData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                const statsRes = await fetch('/api/stats', { headers });
                if (statsRes.ok) setStats(await statsRes.json());

                const chartRes = await fetch('/api/dashboard/chart', { headers });
                if (chartRes.ok) setChartData(await chartRes.json());

                const txRes = await fetch('/api/transactions', { headers });
                if (txRes.ok) {
                    const txs = await txRes.json();
                    setRecentTransactions(txs.slice(0, 5));
                }
            } catch (e) {
                console.error("Dashboard fetch error", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
                    <p className="text-gray-500 text-sm mt-0.5 lg:mt-1">{t('dashboard.welcome')}, {user.username || 'User'}</p>
                </div>
                <div className="flex gap-2 lg:gap-3">
                    <button className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-50 transition-colors">
                        {t('common.download')}
                    </button>
                    <button 
                        onClick={() => navigate('/card/apply')}
                        className="flex-1 sm:flex-none px-3 lg:px-4 py-2 bg-orange-600 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-1.5 lg:gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('cards.createCard')}</span>
                        <span className="sm:hidden">+</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <StatCard
                    title={t('dashboard.totalBalance')}
                    value={`$${stats.totalBalance.toLocaleString()}`}
                    change="+12.5%"
                    trend="up"
                    icon={Wallet}
                    color="bg-blue-500"
                />
                <StatCard
                    title={t('dashboard.activeCards')}
                    value={stats.activeCards}
                    change="+5.2%"
                    trend="up"
                    icon={CreditCard}
                    color="bg-purple-500"
                />
                <StatCard
                    title={t('dashboard.totalSpending')}
                    value={`$${stats.totalSpending.toLocaleString()}`}
                    change="-2.4%"
                    trend="down"
                    icon={Activity}
                    color="bg-orange-500"
                />
                <StatCard
                    title={t('dashboard.successRate')}
                    value="91.67%"
                    change="+1.8%"
                    trend="up"
                    icon={Building2}
                    color="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                        <h3 className="font-bold text-gray-900 text-sm lg:text-base">{t('dashboard.transactionOverview')}</h3>
                        <select className="bg-gray-50 border border-transparent rounded-lg text-xs lg:text-sm p-1.5 lg:p-2 outline-none focus:bg-white focus:border-gray-200 transition-all">
                            <option>{t('dashboard.last7Days')}</option>
                            <option>{t('dashboard.lastMonth')}</option>
                            <option>{t('dashboard.lastYear')}</option>
                        </select>
                    </div>
                    <div className="h-[200px] lg:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f57c00" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f57c00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f57c00" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Transfer */}
                <div className="bg-white p-4 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-4 lg:mb-6">{t('dashboard.quickTransfer')}</h3>
                    <div className="space-y-3 lg:space-y-4">
                        <div className="p-3 lg:p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1.5 lg:mb-2">{t('dashboard.fromBalance')}</div>
                            <div className="flex justify-between items-center">
                                <div className="font-bold text-gray-900 text-base lg:text-lg">${stats.totalBalance.toLocaleString()}</div>
                                <div 
                                    onClick={() => navigate('/account/topup')}
                                    className="text-orange-600 text-xs font-medium cursor-pointer hover:text-orange-700"
                                >
                                    {t('nav.topUp')}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1.5">{t('common.amount')}</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                className="w-full bg-gray-50 rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 text-sm outline-none focus:ring-2 ring-orange-100 transition-all" 
                            />
                        </div>
                        <button className="w-full bg-gray-900 text-white py-2.5 lg:py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                            {t('dashboard.transferNow')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm lg:text-base">{t('dashboard.recentTransactions')}</h3>
                    <button 
                        onClick={() => navigate('/card/transactions')}
                        className="text-xs lg:text-sm text-orange-600 font-medium hover:text-orange-700"
                    >
                        {t('common.viewAll')}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('cards.cardDetails')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.date')}</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('common.amount')}</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tx) => (
                                    <TransactionRow
                                        key={tx.id}
                                        id={tx.id}
                                        card={tx.card?.label || tx.card?.number?.slice(-4)}
                                        type={tx.type}
                                        date={new Date(tx.date).toLocaleDateString()}
                                        status={tx.status}
                                        amount={tx.amount}
                                    />
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
            </div>
        </div>
    );
};

export default Dashboard;
