import { NavLink } from "react-router";
import ClinicsSection from "../components/ClinicsSection";
import FeatureCard from "../components/Feature";


const HomePage = () => {

  return (
    <div>
      {/* 2. Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center" >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          أدر عيادة أسنانك <span className="text-blue-600">بذكاء</span> ومن أي مكان
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          منصة متكاملة لإدارة المواعيد، ملفات المرضى، والفوترة. صممت خصيصاً لأطباء الأسنان لزيادة الكفاءة وتنظيم الوقت.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <NavLink to={"/register"} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-blue-700 transition">
            أنشئ عيادتك الآن
          </NavLink>
          <NavLink to={"/clinics"} className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition">
            تصفح العيادات المتاحة
          </NavLink>
        </div>

        {/* Dashboard Preview Placeholder */}
        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="bg-gray-800 rounded-2xl p-2 shadow-2xl overflow-hidden border-4 border-gray-200">
            <div className="bg-white rounded-xl aspect-video flex items-center justify-center text-gray-400">
              <img src="/hero.png" alt="Hero Image" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Features Section */}
      <section id="features" className="bg-white py-20" >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">لماذا تختار منصتنا؟</h2>
          <div className="grid md:grid-cols-3 gap-12 text-right">
            <FeatureCard
              title="جدولة ذكية"
              desc="نظام تقويم متقدم يمنع تضارب المواعيد ويرسل تنبيهات آلية للمرضى."
              icon="📅"
            />
            <FeatureCard
              title="ملفات رقمية"
              desc="سجل كامل لكل مريض يشمل التاريخ المرضي، الصور الإشعاعية، والخطط العلاجية."
              icon="📁"
            />
            <FeatureCard
              title="تقارير فورية"
              desc="حلل أداء عيادتك من خلال تقارير تفصيلية عن الدخل وعدد الزيارات."
              icon="📈"
            />
          </div>
        </div>
      </section>

      {/* 3. Clinics Section */}
      <ClinicsSection />
    </div >
  );
};



export default HomePage;