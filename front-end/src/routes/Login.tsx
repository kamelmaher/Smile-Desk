import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/auth.store';

const LoginPage: React.FC = () => {
    const [data, setData] = useState({ email: "", password: "" })
    const navigate = useNavigate()
    const { login, authLoading, err } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await login(data)
        if (res.success)
            navigate("/")
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="text-3xl font-bold text-blue-600 mb-2">DentaStack</div>
                    <h2 className="text-2xl font-bold text-gray-800">مرحباً بعودتك!</h2>
                    <p className="text-gray-500 mt-2">سجل دخولك لإدارة عيادتك ومواعيدك</p>
                </div>

                {/* Login Form */}
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-right"
                            placeholder="example@mail.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
                            <a href="#" className="text-sm text-blue-600 hover:underline">نسيت كلمة المرور؟</a>
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-right"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                    </div>
                    {
                        err && (
                            <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-3 text-sm font-medium">
                                {err}
                            </p>
                        )
                    }
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition duration-300"
                        onClick={handleSubmit}
                        disabled={authLoading}
                    >
                        {
                            authLoading ? <Spinner color='white' /> :
                                <>
                                    تسجيل الدخول
                                </>
                        }

                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">أو تابع عبر</span>
                    </div>
                </div>

                {/* Register Link */}
                <p className="text-center text-gray-600 mt-8">
                    ليس لديك حساب؟{' '}
                    <NavLink to="/register" className="text-blue-600 font-bold hover:underline">ابدأ الآن مجاناً</NavLink>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;