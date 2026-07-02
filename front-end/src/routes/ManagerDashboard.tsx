import { useEffect, useState } from "react";
import { useClinicStore } from "../store/clinic.store";
import { useUserStore } from "../store/user.store";
import Spinner from "../components/Spinner";
import { plans } from "../data/constants";
import type { Clinic } from "../types/Clinic";

const ManagerDashboard = () => {
    const { loading, users, getUsers } = useUserStore()
    const { loading: clinicsLoading, subscribe, getAllClinics } = useClinicStore()
    const [clinics, setClinics] = useState<Clinic[]>([])
    useEffect(() => {
        getUsers()
        const fetchClinics = async () => {
            const data = await getAllClinics()
            setClinics(data)
        }
        fetchClinics()
    }, [getUsers, getAllClinics])

    const handleChange = async (clinicId: string, plan: string) => {
        await subscribe(clinicId, plan)
    }
    useEffect(() => {
        scrollTo(0, 0)
    }, [])
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-6">لوحة تحكم المدير</h1>
            {loading || clinicsLoading ?
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
                            {users.map((user) => {
                                const clinic = clinics.find(clinic => clinic.userId == user._id)
                                return <tr key={user._id} className="border-t" >
                                    <td className="p-4 font-medium text-gray-800">
                                        {user.userName}
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
                            }

                            )}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <p className="text-center p-6 text-gray-500">
                            لا يوجد مستخدمين
                        </p>
                    )}
                    {/* <Pagination /> */}
                </div>
            }
        </div >
    );
};

export default ManagerDashboard;