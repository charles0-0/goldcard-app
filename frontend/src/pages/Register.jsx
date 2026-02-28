import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Lock, MessageSquare, Eye, EyeOff, Gift } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('auth.password') + ' mismatch');
            return;
        }

        if (!inviteCode) {
            setError(t('auth.inviteCode') + ' required');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username, 
                    email,
                    password,
                    invite_code: inviteCode
                })
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await res.json();
            } else {
                data = { message: await res.text() || res.statusText };
            }

            if (res.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.detail || data.message || t('auth.registerError'));
            }
        } catch (err) {
            console.error(err);
            setError('Registration error: ' + (err.message || 'Unknown error'));
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
                        {i18n.language === 'zh' ? '开启您的' : 'Start Your'} <br />
                        <span className="text-orange-600">{i18n.language === 'zh' ? 'G卡之旅' : 'GoldCard Journey'}</span>
                    </div>

                    <div className="text-base lg:text-lg text-gray-500">
                        {i18n.language === 'zh' ? '加入全球领先的支付平台' : 'Join the world\'s leading payment platform'}
                    </div>

                    <div className="flex gap-8 lg:gap-12 mt-2 lg:mt-4">
                        <Feature icon="🔒" title={i18n.language === 'zh' ? "安全加密" : "Secure"} desc={i18n.language === 'zh' ? "银行级安全保障" : "Bank-level security"} />
                        <Feature icon="💳" title={i18n.language === 'zh' ? "方便快捷" : "Instant"} desc={i18n.language === 'zh' ? "卡片即开即用" : "Cards ready instantly"} />
                        <Feature icon="🌍" title={i18n.language === 'zh' ? "全球通用" : "Global"} desc={i18n.language === 'zh' ? "广告支付无忧" : "Pay anywhere"} />
                    </div>
                </div>

                {/* Right Side - Register Card */}
                <div className="flex-1 flex justify-center w-full lg:w-auto">
                    <div className="w-full max-w-[400px] lg:max-w-[420px] bg-white rounded-2xl p-6 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-gray-900">{t('auth.registerTitle')}</div>
                        <div className="text-sm text-gray-500 mb-5 lg:mb-6">{t('auth.registerSubtitle')}</div>

                        {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</div>}

                        <form onSubmit={handleRegister} className="space-y-4 lg:space-y-5">
                            <div className="relative">
                                <User className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={t('auth.username')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <User className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder={t('auth.email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Gift className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={t('auth.inviteCode')}
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('auth.password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-12 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder={t('auth.confirmPassword')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-sm"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('common.loading') : t('auth.signUp')}
                            </button>
                        </form>

                        <div className="text-center mt-5 lg:mt-6 text-sm text-gray-500">
                            {t('auth.hasAccount')}
                            <a href="/login" className="text-orange-600 font-semibold hover:underline ml-1">
                                {t('auth.signIn')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center py-4 lg:py-6 text-xs text-gray-400 bg-white border-t border-gray-100 px-4">
                {t('footer.copyright')}
            </footer>
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

export default Register;
