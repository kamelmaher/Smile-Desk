import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { plans } from "../data/constants";
import { useLoadAminClinics, useSubscribe } from "../hooks/useClinics";
import type { ClinicSubscription } from "../types/Clinic";

const ManagerDashboard = () => {
    const { data, isLoading } = useLoadAminClinics()
    const clinics = data?.clinics || []
    const { mutateAsync: subscribe, isPending: isSubscribing, error: subscribeError } = useSubscribe()
    const handleChange = async (clinicId: string, plan: ClinicSubscription["plan"]) => {
        if (plan === plans.TRIAL) return
        await subscribe({ clinicId, plan })
    }
    const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString("ar") : "-"

    useEffect(() => {
        scrollTo(0, 0)
    }, [])
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-6">لوحة تحكم المدير</h1>
            {isLoading ?
                <Spinner /> :
                <>
                    {subscribeError && <p className="mb-4 text-red-600">تعذر تحديث الاشتراك</p>}
                    <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-sm text-center">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-4">العيادة</th>
                                    <th className="p-4">بيانات التواصل</th>
                                    <th className="p-4">العنوان</th>
                                    <th className="p-4">تاريخ الاشتراك</th>
                                    <th className="p-4">انتهاء التجربة / الاشتراك</th>
                                    <th className="p-4">الخطة</th>
                                    <th className="p-4">الحالة</th>
                                    <th className="p-4">تغيير الخطة</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    clinics.length > 0 &&
                                    clinics.map(clinic => (
                                        <tr key={clinic._id} className="border-t" >
                                            <td className="p-4 text-gray-600">
                                                <div className="font-semibold text-gray-900">{clinic.clinicName}</div>
                                                <div className="text-xs text-gray-400">/{clinic.slug}</div>
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                <div>{clinic.phoneNumber || "-"}</div>
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {clinic.address || "-"}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {formatDate(clinic.subscription.startedAt)}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {formatDate(clinic.subscription.currentPeriodEnd || clinic.subscription.trialEndsAt)}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {clinic.subscription.plan}
                                            </td>

                                            <td className="p-4 text-gray-600">
                                                {clinic.subscription.status}
                                            </td>

                                            <td className="p-4">
                                                <select
                                                    className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onChange={e => handleChange(clinic._id, e.target.value as ClinicSubscription["plan"])}
                                                    value={clinic.subscription.plan}
                                                    disabled={isSubscribing}
                                                >
                                                    <option value={plans.TRIAL}>تجربة</option>
                                                    <option value={plans.MONTHLY}>{plans.MONTHLY}</option>
                                                    <option value={plans.ANNUAL}>{plans.ANNUAL}</option>
                                                    <option value={plans.LIFETIME}>{plans.LIFETIME}</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))

                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div >
    );
};

export default ManagerDashboard;