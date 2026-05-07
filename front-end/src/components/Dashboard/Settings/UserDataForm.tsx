import { useState } from "react"
import { useAuthStore } from "../../../store/auth.store"
import type { User } from "../../../types/User"
import Spinner from "../../Spinner"

const UserDataForm = () => {
    const { user, updateUser, loading } = useAuthStore()
    const [form, setForm] = useState(user || {} as User)
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        await updateUser(form)
    }

    const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <form
            onSubmit={handleSubmitForm}
            className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover: shadow-md transition space-y-4 ">

            <h3 className="font-bold text-gray-800">بيانات الحساب</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">الاسم</label>
                    <input
                        name="userName"
                        className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        value={form.userName || ""}
                        onChange={handleChangeData}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">البريد الإلكتروني</label>
                    <input
                        name="email"
                        className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        value={form.email || ""}
                        onChange={handleChangeData}
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-600">رقم الهاتف</label>
                    <input
                        name="phoneNumber"
                        className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                        value={form.phoneNumber || ""}
                        onChange={handleChangeData}
                    />
                </div>

            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
                {
                    loading ? <Spinner /> :
                        "حفظ التغييرات"
                }
            </button>

        </form>
    )
}

export default UserDataForm
