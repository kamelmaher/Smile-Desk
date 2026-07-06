import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { plans } from "../../data/constants";
import { useLoadClinic } from "../../hooks/useClinics";

const Plan = () => {
    const { data } = useLoadClinic()
    const selectedClinic = data?.clinic || null
    
    const daysLeft = dayjs(selectedClinic.validTo).diff(dayjs(), 'day');
    const isExpired = daysLeft < 0;
    const planType = selectedClinic.plan === plans.ANNUAL ? 'الخطة السنوية' :
        selectedClinic.plan === plans.MONTHLY ?
            'الخطة الشهرية' : selectedClinic.plan === plans.LIFETIME ? "مدى الحياة" : "الخطة المجانية"


    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">تفاصيل الاشتراك</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                    {isExpired ? 'منتهي' : 'نشط'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* نوع الخطة */}
                <div className="space-y-1">
                    <p className="text-gray-500 text-sm">الخطة الحالية</p>
                    <p className="text-lg font-semibold text-blue-600">
                        {planType}
                    </p>
                </div>

                {/* تاريخ الانتهاء */}
                <div className="space-y-1">
                    <p className="text-gray-500 text-sm">تاريخ انتهاء الصلاحية</p>
                    <p className="text-lg font-semibold">
                        {dayjs(selectedClinic.validTo).format('DD MMMM YYYY')}
                    </p>
                </div>

                {/* الأيام المتبقية */}
                <div className="space-y-1">
                    <p className="text-gray-500 text-sm">الوقت المتبقي</p>
                    <p className={`text-lg font-bold ${daysLeft <= 3 ? 'text-orange-500' : 'text-gray-800'}`}>
                        {isExpired ? 'انتهت الصلاحية' : `${daysLeft} يوم`}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${daysLeft <= 3 ? 'bg-orange-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <NavLink to={"/pricing"} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    تجديد الاشتراك
                </NavLink>
                <NavLink to={"/pricing"} className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
                    تغيير الخطة
                </NavLink>
            </div>
        </div>
    )
}

export default Plan
