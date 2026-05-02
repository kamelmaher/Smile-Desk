import { useState } from "react";

type User = {
    _id: string;
    name: string;
    clinicName: string;
    paymentStatus: "pending" | "paid" | "rejected";
};

const ManagerDashboard = () => {
    // mock data مؤقت
    const [users, setUsers] = useState<User[]>([
        {
            _id: "1",
            name: "Ahmad Ali",
            clinicName: "Smile Clinic",
            paymentStatus: "pending",
        },
        {
            _id: "2",
            name: "Sara Khaled",
            clinicName: "Dental Care",
            paymentStatus: "paid",
        },
    ]);

    const handleChange = (id: string, value: User["paymentStatus"]) => {
        setUsers((prev) =>
            prev.map((user) =>
                user._id === id ? { ...user, paymentStatus: value } : user
            )
        );
    };

    const getStatusStyle = (status: User["paymentStatus"]) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-600";
            case "rejected":
                return "bg-red-100 text-red-600";
            default:
                return "bg-yellow-100 text-yellow-600";
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-6">لوحة تحكم المدير</h1>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 text-left">المستخدم</th>
                            <th className="p-4 text-left">العيادة</th>
                            <th className="p-4 text-left">الحالة</th>
                            <th className="p-4 text-left">تغيير الحالة</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t">
                                <td className="p-4 font-medium text-gray-800">
                                    {user.name}
                                </td>

                                <td className="p-4 text-gray-600">
                                    {user.clinicName}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                            user.paymentStatus
                                        )}`}
                                    >
                                        {user.paymentStatus === "pending" && "قيد الانتظار"}
                                        {user.paymentStatus === "paid" && "تم الدفع"}
                                        {user.paymentStatus === "rejected" && "مرفوض"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <select
                                        value={user.paymentStatus}
                                        onChange={(e) =>
                                            handleChange(
                                                user._id,
                                                e.target.value as User["paymentStatus"]
                                            )
                                        }
                                        className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="paid">تم الدفع</option>
                                        <option value="rejected">مرفوض</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <p className="text-center p-6 text-gray-500">
                        لا يوجد مستخدمين
                    </p>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;