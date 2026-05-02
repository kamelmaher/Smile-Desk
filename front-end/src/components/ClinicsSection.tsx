import { useEffect } from "react";
import { Link } from "react-router";
import { useClinicStore } from "../store/clinic.store";
import Spinner from "./Spinner";


export default function ClinicsSection() {
    const { clinics, loadClinics, loading } = useClinicStore()
    useEffect(() => {
        loadClinics()
    }, [loadClinics])
    return (
        <section className="py-20 bg-gray-50" dir="rtl">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        العيادات المسجلة لدينا
                    </h2>

                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        مجموعة من العيادات المميزة التي تستخدم نظامنا لإدارة المواعيد
                        وتقديم تجربة أفضل للمرضى.
                    </p>
                </div>

                {/* Cards */}
                {
                    loading ? <Spinner /> :
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {clinics.map((clinic) => (
                                <Link
                                    key={clinic._id}
                                    to={`/clinic/${clinic.slug}`}
                                    className="bg-white rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition p-6 block"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                                        {clinic.clinicName.charAt(0)}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {clinic.clinicName}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-7 mb-5">
                                        {clinic.description}
                                    </p>

                                    <span className="text-blue-600 font-semibold text-sm">
                                        زيارة صفحة العيادة ←
                                    </span>
                                </Link>
                            ))}

                        </div>
                }
            </div>
        </section>
    );
}