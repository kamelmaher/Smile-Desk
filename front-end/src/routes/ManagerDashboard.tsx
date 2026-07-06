import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { plans } from "../data/constants";
import { useLoadAminClinics, useSubscribe } from "../hooks/useClinics";

const ManagerDashboard = () => {
    const { data, isLoading } = useLoadAminClinics()
    const clinics = data?.clinics || []
    const { mutateAsync: subscribe } = useSubscribe()

    const handleChange = async (clinicId: string, plan: string) => {
        await subscribe({ clinicId, plan })
    }
    useEffect(() => {
        scrollTo(0, 0)
    }, [])
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-6">لوحة تحكم المدير</h1>
            {isLoading ?
                <Spinner /> :
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4">المستخدم</th>
                                <th className="p-4">العيادة</th>
                                <th className="p-4">تاريخ الاشتراك</th>
                                <th className="p-4">صالح حتى</th>
                                <th className="p-4">الخطة</th>
                                <th className="p-4">تغيير الخطة</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                clinics.map(clinic => (
                                    <tr key={clinic._id} className="border-t" >
                                        <td className="p-4 font-medium text-gray-800">
                                            {clinic.clinicName}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {clinic?.clinicName}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {clinic?.createdAt.split("T")[0]}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {clinic?.validTo.split("T")[0]}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {clinic?.plan}
                                        </td>

                                        <td className="p-4">
                                            <select
                                                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={e => handleChange(clinic!._id, e.target.value)}
                                                value={clinic?.plan}
                                            >
                                                <option value="">اختر الخطة</option>
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
            }
        </div >
    );
};

export default ManagerDashboard;