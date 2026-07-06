import { useEffect } from "react";
import { useParams } from "react-router";
import Spinner from "../components/Spinner";
import { features } from "../data/Features";
import { formatWorkingHours } from "../utils/clinics";
import BookingForm from "../components/Dashboard/BookForm";
import { useLoadClinicBySlug } from "../hooks/useClinics";

export default function ClinicPage() {
    const { slug } = useParams();
    const { data, isLoading } = useLoadClinicBySlug(slug || "")
    const selectedClinic = data?.clinic || null

    useEffect(() => {
        scrollTo(0, 0)
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            {isLoading ? (
                <Spinner />
            ) :
                selectedClinic ?
                    (
                        <>
                            {/* Hero Section */}
                            <div className="bg-white pt-10 pb-20 px-6">
                                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                                    <div className="text-right space-y-6">
                                        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                                            صحتك أولويتنا
                                        </h1>
                                        <p className="text-lg text-gray-600">
                                            احجز موعدك بسهولة مع أفضل الأطباء في <span className="text-blue-500 font-bold">{selectedClinic.clinicName}</span> واحصل على رعاية صحية متميزة.
                                        </p>

                                        <div className="flex gap-4 pt-4">
                                            <a
                                                className="cursor-[pointer] bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                                href="#book-appointment"
                                            >
                                                احجز موعدك الآن
                                            </a>
                                            <a
                                                href="#about"
                                                className="text-blue-600 font-semibold px-6 py-3 hover:bg-blue-50 rounded-xl transition cursor-[pointer]">
                                                اعرف المزيد
                                            </a>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                                            <img
                                                src={selectedClinic.logo}
                                                alt="Clinic Interior"
                                                className="w-full h-[400px] object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-6xl mx-auto px-6 -mt-16">
                                <div className="bg-white p-6 rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                    {features.map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-1">
                                                {/* يمكنك وضع الأيقونات هنا */}
                                                <span className="text-xl">{item.icon}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                                            <p className="text-xs text-gray-500">{item.sub}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div id="about" className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
                                {/* About */}
                                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                                    <h2 className="text-2xl font-bold mb-4">عن العيادة</h2>
                                    <p className="text-gray-600 leading-relaxed">{selectedClinic.description}</p>
                                </div>

                                {/* Info Column */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                                    <h2 className="text-xl font-semibold">معلومات العيادة</h2>

                                    {
                                        selectedClinic.address &&
                                        <div>
                                            <p className="text-gray-500 text-sm">العنوان</p>
                                            <p className="font-medium">{selectedClinic.address}</p>
                                        </div>
                                    }

                                    {
                                        selectedClinic.phoneNumber &&
                                        <div>
                                            <p className="text-gray-500 text-sm">رقم الهاتف</p>
                                            <p className="font-medium">{selectedClinic.phoneNumber}</p>
                                        </div>
                                    }

                                    {
                                        selectedClinic.email &&
                                        <div>
                                            <p className="text-gray-500 text-sm">الايميل</p>
                                            <p className="font-medium">{selectedClinic.email}</p>
                                        </div>
                                    }

                                    <div>
                                        <p className="text-gray-500 text-sm">أوقات العمل</p>
                                        <p className="font-medium">{formatWorkingHours(selectedClinic.workingHours!)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto px-6 pb-20" id="book-appointment">
                                <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                                    <h2 className="text-3xl font-bold mb-3">احجز موعدك الآن</h2>
                                    <p className="text-gray-500 mb-8">اختر الوقت المناسب لك وسيتم تأكيد الحجز من قبل العيادة</p>
                                    <BookingForm />
                                </div>
                            </div>
                        </>
                    )
                    :
                    <p>clinic Not found</p>
            }
        </div>
    );
}