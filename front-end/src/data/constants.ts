
export const dashboardPages = [
    { visible: "الصفحة الرئيسية", link: "" },
    { visible: "المواعيد", link: "appointments" },
    { visible: "الخطة", link: "plan" },
    { visible: "الاعدادات", link: "settings" },
]

export const appointmentStatus = {
    pending: "pending",
    accepted: "accepted",
    declined: "declined",
}

export const plans = {
    MONTHLY: "monthly",
    ANNUAL: "annual",
    FREE: "free",
    LIFETIME: "lifetime"
}

export const plansData = [
    {
        value: plans.MONTHLY,
        text: "شهري",
        price: "₪100",
        duration: "/شهر",
        description: "مثالية للبدء وتجربة جميع ميزات SmileDesk",
        highlight: false,
        features: [
            "إدارة المواعيد الأساسية",
            "إضافة المرضى وحجوزاتهم",
            "لوحة تحكم متميزة",
            "دعم فني",
        ],
    },
    {
        value: plans.ANNUAL,
        text: "سنوي",
        price: "₪400",
        duration: "/سنة",
        description: "وفر أكثر من 50% مقارنة بالدفع الشهري",
        highlight: true,
        badge: "الأكثر اختياراً",
        features: [
            "جميع ميزات الباقة الشهرية",
            "تقارير وإحصائيات متقدمة",
            "إدارة كاملة للمواعيد والمرضى",
            "تخصيص إعدادات العيادة",
            "خدمة SMS للاشعارات",
            "دعم فني أولوية",
        ],

    },
    {
        value: plans.LIFETIME,
        text: "مدى الحياة",
        price: "₪850",
        duration: "/مرة واحدة",
        description: "ادفع مرة واحدة واستمتع بالخدمة مدى الحياة",
        highlight: false,
        features: [
            "جميع الميزات بدون قيود",
            "تحديثات مستقبلية مجانية",
            "نظام متكامل لإدارة العيادة",
            "تخصيص كامل للنظام",
            "دعم فني مميز مدى الحياة",
        ],
    },
];

export const features = [
    {
        title: "إدارة المواعيد بدون فوضى",
        description:
            "نظّم جميع مواعيد المرضى بسهولة وتجنب الحجز المزدوج أو الأخطاء.",
        icon: "📅",
    },
    {
        title: "سجل مريض متكامل",
        description:
            "جميع بيانات المرضى محفوظة في مكان واحد وآمن وسهل الوصول.",
        icon: "🦷",
    },
    {
        title: "تقليل نسبة الغياب",
        description:
            "تذكيرات تلقائية للمرضى قبل الموعد لزيادة الالتزام.",
        icon: "🔔",
    },
    {
        title: "تقارير ذكية",
        description:
            "إحصائيات واضحة تساعدك على تحسين أداء العيادة.",
        icon: "📊",
    },
    {
        title: "إدارة الفريق",
        description:
            "تحكم كامل في الأطباء والمساعدين والصلاحيات.",
        icon: "👨‍⚕️",
    },
    {
        title: "سهولة الاستخدام",
        description:
            "واجهة بسيطة وسريعة — بدون تعقيد تقني.",
        icon: "⚡",
    },
];

export const APPOINTMENT_DURATION = .5