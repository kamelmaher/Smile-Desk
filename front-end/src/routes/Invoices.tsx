import { useEffect, useState } from "react";
import { useInovicesStore, type createInvoiceType, type invoiceQueryFilters } from "../store/invoice.store";
import Spinner from "../components/Spinner";
import CreateInvoiceModal from "../components/Dashboard/CreateInvoiceModal";

export default function InvoicesPage() {
    const [filters, setFilters] = useState<invoiceQueryFilters>({
        type: "",
        minAmount: null,
        maxAmount: null
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { invoices, overview, getInvoices, getOverview, createInvoice, loading } = useInovicesStore()

    useEffect(() => {
        getInvoices(filters)
    }, [getInvoices, filters])

    useEffect(() => {
        getOverview()
    }, [getOverview])

    const handleCreateInvoice = async (data: createInvoiceType) => {
        await createInvoice(data)
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">الفواتير</h2>
                    <p className="mt-1 text-sm text-gray-500">عرض جميع الفواتير والتصفية حسب النوع والمبلغ</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    + إنشاء فاتورة
                </button>
            </div>
            {
                overview &&
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">إجمالي الفواتير</p>
                        <p className="mt-2 text-2xl font-bold text-gray-800">{overview.totalInvoices}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">إجمالي الدخل</p>
                        <p className="mt-2 text-2xl font-bold text-emerald-600">₪{overview.totalIncome}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">إجمالي المصروف</p>
                        <p className="mt-2 text-2xl font-bold text-rose-600">₪{overview.totalOutcome}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">الرصيد</p>
                        <p className={`mt-2 text-2xl font-bold ${overview.balance >= 0 ? "text-blue-600" : "text-rose-600"}`}>₪{overview.balance}</p>
                    </div>
                </div>
            }

            <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">التوزيع حسب النوع</h3>
                        <span className="text-sm text-gray-500">دخل مقابل مصروف</span>
                    </div>
                    <div className="space-y-4">
                        {
                            overview && <>
                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                                        <span>دخل</span>
                                        <span>₪{overview?.totalIncome}</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-gray-100">
                                        <div className={`h-3 rounded-full bg-emerald-500`} style={{ width: `${Math.max((overview.totalIncome / Math.max(overview.totalIncome + overview.totalOutcome, 1)) * 100, 8)}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                                        <span>مصروف</span>
                                        <span>₪{overview?.totalOutcome}</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-gray-100">
                                        <div className={`h-3 rounded-full bg-rose-500`} style={{ width: `${Math.max((overview.totalOutcome / Math.max(overview.totalIncome + overview.totalOutcome, 1)) * 100, 8)}%` }} />
                                    </div>
                                </div>
                            </>

                        }

                    </div>
                </div>
            </div>

            {/* Filters      */}
            <div className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-3">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">النوع</label>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as "income" | "outcome" | "" }))}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none"
                    >
                        <option value="">الكل</option>
                        <option value="income">دخل</option>
                        <option value="outcome">مصروف</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">أقل مبلغ</label>
                    <input
                        type="number"
                        value={filters.minAmount || ""}
                        onChange={(e) => setFilters(prev => ({ ...prev, minAmount: +e.target.value }))}
                        placeholder="أدخل المبلغ"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">أعلى مبلغ</label>
                    <input
                        type="number"
                        value={filters.maxAmount || ""}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: +e.target.value }))}
                        placeholder="أدخل المبلغ"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="space-y-3">

                {
                    loading ?
                        <Spinner /> :
                        invoices.map((invoice) => (
                            <div key={invoice._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                                {invoice.type === "income" ? "دخل" : "مصروف"}
                                            </span>
                                            <span className="text-sm text-gray-500">{new Date(invoice.createdAt).toLocaleDateString("en-GB")}</span>
                                        </div>
                                        <h3 className="mt-2 text-lg font-semibold text-gray-800">{invoice.details}</h3>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-sm text-gray-500">المبلغ</p>
                                        <p className="text-xl font-bold text-gray-800">₪{invoice.amount}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>

            {
                isModalOpen && (
                    <CreateInvoiceModal setIsModalOpen={setIsModalOpen} handleCreateInvoice={handleCreateInvoice} isOpen={isModalOpen} />
                )
            }
        </div >
    );
}
