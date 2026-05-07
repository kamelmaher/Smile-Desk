import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth.store';
import Spinner from '../components/Spinner';

const RegisterPage: React.FC = () => {
    const { register, authLoading, err } = useAuthStore()
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        clinicName: '',
        phoneNumber: '',
        description: ""
    });
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await register(formData)
        if (res.success) navigate("/")
    };

    useEffect(() => {
        scrollTo(0, 0)
    }, [])
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* الجانب الأيسر: معلومات توضيحية */}
                <div className="md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">انضم إلينا</h2>
                    <p className="text-blue-100 mb-6 text-sm">
                        ابدأ بتنظيم عيادتك الرقمية اليوم واحصل على أدوات إدارة متكاملة.
                    </p>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">✓ سهولة الاستخدام</li>
                        <li className="flex items-center gap-2">✓ أمان تام للبيانات</li>
                    </ul>
                </div>

                {/* الجانب الأيمن: نموذج التسجيل */}
                <div className="md:w-2/3 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-right">إنشاء حساب جديد</h2>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الاسم الكامل</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                placeholder="أدخل اسمك الثلاثي"
                                onChange={e => setFormData({ ...formData, userName: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">البريد الإلكتروني</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                placeholder="email@example.com"
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اسم العيادة</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                placeholder="عيادة الابتسامة"
                                onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">وصف العيادة</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                placeholder="الوصف (اختياري)"
                                rows={3}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الهاتف</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                placeholder="رقم الهاتف"
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">كلمة المرور</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                                placeholder="••••••••"
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className='md:col-span-2'>
                            {
                                err &&
                                <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 mt-3 text-sm font-medium">
                                    {err}
                                </p>
                            }
                        </div>
                        <button
                            type="submit"
                            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                            onClick={handleSubmit}
                        >
                            {
                                authLoading ? <Spinner color='white' /> :
                                    <>
                                        إنشاء الحساب
                                    </>
                            }
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        لديك حساب بالفعل؟ <NavLink to="/login" className="text-blue-600 font-bold hover:underline">سجل دخولك</NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;