import { useState } from "react"
import { useInovicesStore, type createInvoiceType } from "../../store/invoice.store"
import Spinner from "../Spinner"

type CreateInvoiceModalProps = {
    setIsModalOpen: (isOpen: boolean) => void
    isOpen: boolean,
    handleCreateInvoice: (data: createInvoiceType) => Promise<void>
}
const CreateInvoiceModal = ({ setIsModalOpen, isOpen, handleCreateInvoice }: CreateInvoiceModalProps) => {
    const { loading, err } = useInovicesStore()
    const [invoiceData, setInvoiceData] = useState({
        type: "",
        amount: 0,
        details: ""
    });

    const createInvoice = async () => {
        await handleCreateInvoice(invoiceData as createInvoiceType)
        if (!err) setIsModalOpen(false)
    }

    return (
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">إنشاء فاتورة جديدة</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">النوع</label>
                        <select
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none"
                            value={invoiceData.type}
                            onChange={e => setInvoiceData(prev => ({ ...prev, type: e.target.value as "income" | "outcome" }))}
                        >
                            <option value="">اختر النوع</option>
                            <option value="income">دخل</option>
                            <option value="outcome">مصروف</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">المبلغ</label>
                        <input
                            type="number"
                            placeholder="أدخل المبلغ"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none"
                            value={invoiceData.amount}
                            onChange={e => setInvoiceData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">التفاصيل</label>
                        <textarea
                            rows={4}
                            placeholder="اكتب تفاصيل الفاتورة"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none"
                            value={invoiceData.details}
                            onChange={e => setInvoiceData(prev => ({ ...prev, details: e.target.value }))}
                        />
                    </div>
                </div>
                {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600">
                        إلغاء
                    </button>
                    <button onClick={createInvoice} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                        {
                            loading ? <Spinner /> :
                                "إنشاء"
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateInvoiceModal