import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    CreditCard,
    Wallet,
    Users,
    Settings,
    Bell,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Search,
    Globe
} from 'lucide-react';
import { clsx } from 'clsx';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const SidebarItem = ({ icon: Icon, label, to, subItems }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(to) || (subItems && subItems.some(item => location.pathname === item.to));
    const [isOpen, setIsOpen] = useState(isActive);

    const handleClick = (e) => {
        if (subItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="mb-1">
            <NavLink
                to={to}
                onClick={handleClick}
                className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                    isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
            >
                <Icon className={clsx("w-5 h-5", isActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-500")} />
                <span className="flex-1">{label}</span>
                {subItems && (
                    <ChevronDown className={clsx("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />
                )}
            </NavLink>

            {subItems && isOpen && (
                <div className="ml-12 mt-1 space-y-1">
                    {subItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => clsx(
                                "block py-2 text-sm transition-colors",
                                isActive ? "text-orange-600 font-medium" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setIsLangOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-16 lg:h-20 flex items-center px-4 lg:px-6 border-b border-gray-50">
                    <div className="flex items-center gap-2.5 font-bold text-xl text-gray-900">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex justify-center items-center text-lg shadow-sm">
                            G
                        </div>
                        <span className="hidden sm:inline">GoldCard</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden ml-auto p-2 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">{t('nav.system')}</div>

                    <SidebarItem
                        icon={LayoutDashboard}
                        label={t('nav.dashboard')}
                        to="/dashboard"
                    />

                    <SidebarItem
                        icon={CreditCard}
                        label={t('nav.cards')}
                        to="/card"
                        subItems={[
                            { label: t('nav.cardList'), to: '/card/list' },
                            { label: t('nav.applyCard'), to: '/card/apply' },
                            { label: t('nav.transactions'), to: '/card/transactions' },
                        ]}
                    />

                    <SidebarItem
                        icon={Wallet}
                        label={t('nav.account')}
                        to="/account"
                        subItems={[
                            { label: t('nav.topUp'), to: '/account/topup' },
                            { label: t('nav.accountDetails'), to: '/account/details' },
                            { label: t('nav.topUpOrders'), to: '/account/orders' },
                        ]}
                    />

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-8">{t('nav.system')}</div>

                    <SidebarItem icon={Settings} label={t('nav.settings')} to="/settings" />
                    <SidebarItem icon={Users} label={t('nav.users')} to="/users" />
                </div>

                <div className="p-4 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-xl p-3 lg:p-4 flex items-center gap-3">
                        <div className="w-9 lg:w-10 h-9 lg:h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                            {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-semibold truncate">{user.username || 'User'}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email || ''}</div>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 p-1">
                            <LogOut className="w-4 lg:w-5 h-4 lg:h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-50 rounded-xl w-48 lg:w-64 focus-within:ring-2 ring-orange-100 transition-all">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('common.search') + '...'}
                                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-6">
                        {/* Language Selector */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline text-sm">{currentLang.name}</span>
                            </button>
                            {isLangOpen && (
                                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={clsx(
                                                "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2",
                                                i18n.language === lang.code ? "text-orange-600 font-medium" : "text-gray-600"
                                            )}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="hidden lg:flex items-center gap-2">
                            <span className="text-right text-sm">
                                <div className="font-medium text-gray-900">{t('dashboard.totalBalance')}</div>
                                <div className="text-orange-600 font-bold">$ 0.00</div>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
