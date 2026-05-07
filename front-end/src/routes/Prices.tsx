import { plansData } from "../data/constants";

const handleSubscribe = (planName: string, price: string) => {
    const message = `مرحباً، أرغب بالاشتراك في نظام SmileDesk

الخطة: ${planName}
السعر: ${price}

هل يمكن تزويدي بتفاصيل الدفع؟`;

    const phone = "972569691698";

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export default function Pricing() {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6 text-center">

                <h2 className="text-4xl font-bold mb-4">
                    خطط بسيطة وشفافة
                </h2>

                <p className="text-gray-600 mb-12">
                    🎉 احصل على 7 أيام مجانية عند إنشاء حسابك — بدون أي التزام
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {plansData.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-3xl p-[1px] transition duration-300 ${plan.highlight
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 scale-105"
                                : "bg-gray-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-400"
                                }`}
                        >
                            <div className="bg-white rounded-3xl p-8 h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition">

                                {/* Badge */}
                                {plan.badge && (
                                    <span className="absolute -top-3 right-6 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                                        {plan.badge}
                                    </span>
                                )}

                                {/* Title */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {plan.text}
                                    </h3>

                                    <div className="mb-4">
                                        <span className="text-4xl font-extrabold">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">
                                            {plan.duration}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Features */}
                                <ul className="text-sm text-gray-600 space-y-2 my-6 text-right">
                                    {
                                        plan.features.map(feature => <li key={feature}>✔ {feature}</li>)
                                    }
                                </ul>

                                {/* Button */}
                                <button
                                    className={`w-full py-3 rounded-xl font-medium transition ${plan.highlight
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    onClick={() => handleSubscribe(plan.text, plan.price)}
                                >
                                    ابدأ الآن
                                </button>
                                <span className="text-xs text-gray-500">سيتم تحويلك الى Whats App لاتمام عملية الدفع.</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}