import { motion } from "framer-motion"
import { features } from "../data/constants";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

export default function FeaturesPage() {
    useEffect(() => {
        scrollTo(0, 0)
    }, [])

    return (
        <div className="bg-white">

            <section className="relative py-24 text-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

                {/* Glow Effect */}
                <div className="absolute w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 top-0 left-0"></div>
                <div className="absolute w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30 bottom-0 right-0"></div>

                <div className="container mx-auto px-6 relative z-10">

                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        ودّع الفوضى في عيادتك  <br />
                        وابدأ إدارة ذكية اليوم
                    </h1>

                    <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                        SmileDesk يساعدك على تنظيم المواعيد، متابعة المرضى، وزيادة كفاءة عيادتك بسهولة
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <NavLink to="/register"
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition">
                            ابدأ مجاناً
                        </NavLink>

                        <NavLink to="/pricing" className="border px-8 py-3 rounded-xl hover:bg-gray-100 transition">
                            قائمة الأسعار
                        </NavLink>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        🎉 تجربة مجانية لمدة 7 أيام — بدون بطاقة ائتمان
                    </p>

                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-6">

                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            كل ما تحتاجه في مكان واحد
                        </h2>
                        <p className="text-gray-600">
                            أدوات مصممة خصيصاً لعيادات الأسنان
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 rounded-3xl bg-white border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <h2 className="text-4xl font-bold mb-6">
                            ليس مجرد نظام… بل أداة لزيادة أرباحك
                        </h2>

                        <p className="text-gray-600 mb-6">
                            باستخدام SmileDesk، يمكنك تقليل الأخطاء، زيادة عدد المرضى،
                            وتحسين تجربة العمل داخل العيادة بشكل ملحوظ.
                        </p>

                        <ul className="space-y-3 text-gray-600">
                            <li>✔ تقليل نسبة غياب المرضى</li>
                            <li>✔ تنظيم كامل للمواعيد</li>
                            <li>✔ توفير الوقت والجهد</li>
                            <li>✔ تجربة احترافية لمرضاك</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl">
                        <div className="h-64 flex items-center justify-center text-gray-400 overflow-hidden">
                            <img src="dashboard.png" alt="صورة توضيحية للوحة التحكم" />
                        </div>
                    </div>

                </div>
            </section>

            <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="container mx-auto px-6">

                    <h2 className="text-4xl font-bold mb-4">
                        جاهز لتطوير عيادتك؟
                    </h2>

                    <p className="mb-8 text-blue-100">
                        ابدأ الآن وجرب النظام مجاناً لمدة 7 أيام
                    </p>

                    <NavLink to={"/register"} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:scale-105 transition">
                        ابدأ الآن
                    </NavLink>

                </div>
            </section>

        </div>
    );
}