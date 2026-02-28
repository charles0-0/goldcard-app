import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Lock, MessageSquare, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState('demo');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                let errorMsg = t('auth.loginError');
                try {
                    const data = await res.json();
                    errorMsg = data.detail || data.message || errorMsg;
                } catch {
                    alert(errorMsg);
                }
            }
        } catch (err) {
            console.error(err);
            alert('Login error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gradient-to-br from-gray-50 to-amber-50">
            <div className="flex flex-col lg:flex-row items-center justify-between flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-12 gap-8 lg:gap-16">

                {/* Left Side - Hidden on mobile */}
                <div className="hidden lg:flex flex-1 flex-col items-start gap-6 lg:gap-8">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                        <div className="w-10 lg:w-12 h-10 lg:h-12 bg-orange-600 text-white rounded-xl flex justify-center items-center font-bold text-xl shadow-sm">
                            G
                        </div>
                        <div className="tracking-tight">GoldCard</div>
                    </div>

                    <div className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900">
                        {i18n.language === 'zh' ? '支付无界' : 'Global Payments'} <br />
                        <span className="text-orange-600">{i18n.language === 'zh' ? '全新G卡平台' : 'New Era Card'}</span>
                    </div>

                    <div className="text-base lg:text-lg text-gray-500">
                        {i18n.language === 'zh' ? '安全便捷的支付解决方案' : 'Secure and convenient payment solutions'}
                    </div>

                    <div className="flex gap-8 lg:gap-12 mt-2 lg:mt-4">
                        <Feature icon="🔒" title={i18n.language === 'zh' ? "安全加密" : "Secure"} desc={i18n.language === 'zh' ? "银行级安全保障" : "Bank-level security"} />
                        <Feature icon="💳" title={i18n.language === 'zh' ? "方便快捷" : "Instant"} desc={i18n.language === 'zh' ? "卡片即开即用" : "Cards ready instantly"} />
                        <Feature icon="🌍" title={i18n.language === 'zh' ? "全球通用" : "Global"} desc={i18n.language === 'zh' ? "广告支付无忧" : "Pay anywhere"} />
                    </div>
                </div>

                {/* Right Side - Login Card */}
                <div className="flex-1 flex justify-center w-full lg:w-auto">
                    <div className="w-full max-w-[400px] lg:max-w-[420px] bg-white rounded-2xl p-6 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-gray-900">{t('auth.loginTitle')}</div>
                        <div className="text-sm text-gray-500 mb-6 lg:mb-8">{t('auth.loginSubtitle')}</div>

                        <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
                            <div className="relative">
                                <User className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={t('auth.username')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('auth.password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-12 py-3 lg:py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 lg:py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('common.loading') : t('auth.signIn')}
                            </button>
                        </form>

                        <div className="text-center mt-5 lg:mt-6 text-sm text-gray-500">
                            {t('auth.noAccount')}
                            <a href="/register" className="text-orange-600 font-semibold hover:underline ml-1">
                                {t('auth.signUp')}
                            </a>
                        </div>

                        <div className="mt-6 lg:mt-8 pt-5 lg:pt-6 border-t border-gray-100 text-center text-xs text-gray-400 leading-relaxed">
                            🔒 {t('footer.encrypted')} · {t('footer.pciDss')} · {t('footer.waf')}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 lg:py-6 text-xs text-gray-400 bg-white border-t border-gray-100 px-4">
                {t('footer.copyright')}
            </footer>

            <div className="fixed bottom-16 lg:bottom-20 right-4 lg:right-8 w-12 lg:14 h-12 lg:h-14 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer hover:bg-orange-700 transition-colors z-50">
                <MessageSquare className="w-5 lg:w-6 h-5 lg:h-6" />
            </div>
        </div>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center gap-2 lg:gap-3 text-center">
        <div className="w-12 lg:w-14 h-12 lg:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl lg:text-2xl border border-gray-50">
            {icon}
        </div>
        <div>
            <div className="font-semibold text-gray-900 text-sm">{title}</div>
            <div className="text-xs text-gray-500 mt-0.5 lg:mt-1">{desc}</div>
        </div>
    </div>
);

export default Login;
