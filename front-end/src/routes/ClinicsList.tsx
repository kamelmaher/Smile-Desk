import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Spinner from "../components/Spinner";
import Pagination from "../components/Paginiation";
import { useLoadClinics } from "../hooks/useClinics";

export default function ClinicsPage() {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useLoadClinics(page)

    const clinics = data?.clinics || []
    const totalPages = data?.pages || 1

    useEffect(() => {
        scrollTo(0, 0)
    }, [])
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        العيادات المسجلة لدينا
                    </h1>
                    <p className="text-gray-500 mt-2">
                        تصفح جميع العيادات المشتركة في منصة Smile Desk
                    </p>
                </div>

                {/* Clinics Grid */}
                {
                    isLoading ?
                        <Spinner />
                        :
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                clinics.map((clinic) => (
                                    <div
                                        key={clinic._id}
                                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition"
                                    >
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                                            {clinic.clinicName}
                                        </h2>

                                        <p className="text-gray-500 text-sm leading-7 mb-5">
                                            {clinic.description}
                                        </p>

                                        <NavLink
                                            to={`/clinic/${clinic.slug}`}
                                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                                        >
                                            زيارة الصفحة
                                        </NavLink>
                                    </div>
                                ))
                            }
                        </div>
                }

                {/* Pagination */}
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

            </div>
        </div>
    );
}