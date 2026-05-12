// components/OtpForm.tsx

import { useRef, useState } from "react";
import { useSmsStore } from "../../store/sms.store";
import Spinner from "../Spinner";

type Props = {
    onVerify: (otp: string) => Promise<void>;
    loading?: boolean;
};

export default function OtpForm({
    onVerify,
    loading = false,
}: Props) {

    const OTP_LENGTH = 5;

    const [otp, setOtp] = useState<string[]>(
        Array(OTP_LENGTH).fill("")
    );
    const { smsLoading } = useSmsStore()
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = async (
        value: string,
        index: number
    ) => {

        // only numbers
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;

        setOtp(updatedOtp);

        // move next
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // auto verify
        const finalOtp = updatedOtp.join("");

        if (finalOtp.length === OTP_LENGTH) {
            await onVerify(finalOtp);
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {

        // back to previous input
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {

        e.preventDefault();

        const pastedData = e.clipboardData
            .getData("text")
            .trim();

        if (!/^\d+$/.test(pastedData)) return;

        const pastedOtp = pastedData
            .slice(0, OTP_LENGTH)
            .split("");

        const updatedOtp = [
            ...pastedOtp,
            ...Array(OTP_LENGTH - pastedOtp.length).fill("")
        ];

        setOtp(updatedOtp);

        // focus last filled input
        const lastIndex =
            pastedOtp.length >= OTP_LENGTH
                ? OTP_LENGTH - 1
                : pastedOtp.length;

        inputRefs.current[lastIndex]?.focus();

        // auto verify if complete
        if (pastedOtp.length === OTP_LENGTH) {
            onVerify(pastedOtp.join(""));
        }
    };

    return (
        <div className="w-full bg-white p-4 max-w-lg rounded-2xl shadow-xl overflow-hidden min-h-[300px] max-h-[90vh] flex flex-col justify-center gap-4">

            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-blue-700">
                    تحقق من رقم الهاتف
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                    أدخل رمز التحقق المرسل إلى هاتفك
                </p>
            </div>

            {/* OTP Inputs */}
            <div
                className="flex justify-center gap-3"
                dir="ltr"
            >
                {
                    smsLoading ? <Spinner /> :
                        otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                value={digit}
                                maxLength={1}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                onPaste={handlePaste}
                                onChange={(e) =>
                                    handleChange(
                                        e.target.value,
                                        index
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                                className="
                            w-14 h-14
                            rounded-xl
                            border border-gray-300
                            text-center
                            text-2xl
                            font-bold
                            outline-none
                            transition-all
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                        "
                            />
                        ))
                }

            </div>

            {/* Loading */}
            {loading && (
                <p className="text-center text-sm text-blue-600">
                    جاري التحقق...
                </p>
            )}

        </div>
    );
}