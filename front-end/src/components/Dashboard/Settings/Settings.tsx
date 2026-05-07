import { useEffect, useState } from "react";
import UserDataForm from "./UserDataForm";
import WorkingHours from "./WorkingHours";
import { uploadImage } from "../../../services/image";
import { useClinicStore } from "../../../store/clinic.store";
import Spinner from "../../Spinner";

export default function Settings() {
    const { selectedClinic, updateLoading, updateClinic } = useClinicStore()
    const [form, setForm] = useState(selectedClinic)
    const [image, setImage] = useState<string | null>(selectedClinic.logo || "")
    const [imageLoading, setImageLoading] = useState(false)
    const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }



    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // preview
        const preview = URL.createObjectURL(file)
        setImage(preview)

        // upload
        setImageLoading(true)
        const url = await uploadImage(file)

        // store in form state
        setForm({
            ...form,
            logo: url,
        })
        setImageLoading(false)
    }

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imageLoading)
            await updateClinic(form)
    }

    useEffect(() => {
        return () => {
            if (image) URL.revokeObjectURL(image)
        }
    }, [image])

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">الإعدادات</h2>
                <p className="text-gray-500">إدارة بيانات العيادة والحساب</p>
            </div>

            {/* Clinic Info */}
            <form
                onSubmit={handleSubmitForm}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition space-y-4"
            >

                <h3 className="font-bold text-gray-800">بيانات العيادة</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* Clinic Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">اسم العيادة</label>
                        <input
                            name="clinicName"
                            className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            value={form.clinicName || ""}
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
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">رقم الهاتف</label>
                        <input
                            name="phoneNumber"
                            className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            value={form.phoneNumber || ""}
                            onChange={handleChangeData}
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">العنوان</label>
                        <input
                            name="address"
                            className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            value={form.address || ""}
                            onChange={handleChangeData}
                        />
                    </div>

                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">الوصف</label>
                    <textarea
                        className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full"
                        rows={3}
                        value={form.description || ""}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </div>

                {/* Image */}
                <div className="space-y-2">
                    <label className="text-gray-600 text-sm">صورة العيادة</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-200 rounded-xl p-3 w-full"
                    />

                    {image && (
                        <div className="mt-2">
                            <img
                                src={image}
                                alt="clinic preview"
                                className="w-32 h-32 object-cover rounded-xl border"
                            />
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
                    disabled={updateLoading || imageLoading}
                >
                    {updateLoading || imageLoading ? <Spinner /> : "حفظ التغييرات"}
                </button>

            </form>
            <WorkingHours />

            <UserDataForm />

        </div>
    );
}