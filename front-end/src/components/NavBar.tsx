import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import Spinner from './Spinner'
import { useAuthStore } from '../store/auth.store'
import { ChevronDown, X, Menu } from 'lucide-react'

const NavBar = () => {
    const { isAuthenticated, user, fetchUser, loading, logout } = useAuthStore()
    useEffect(() => {
        if (!isAuthenticated)
            fetchUser()
    }, [fetchUser, isAuthenticated])
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handler = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 ">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">

                {/* Logo */}
                <NavLink to="/" className="text-2xl font-bold text-blue-600" onClick={() => setIsOpen(false)}>
                    SmileDesk
                </NavLink>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-6">

                    <NavLink to="/features" className="text-gray-600 hover:text-blue-600 transition">
                        المميزات
                    </NavLink>

                    <NavLink to="/pricing" className="text-gray-600 hover:text-blue-600 transition">
                        الأسعار
                    </NavLink>

                    <NavLink to="/clinics" className="text-gray-600 hover:text-blue-600 transition">
                        العيادات
                    </NavLink>


                    {loading ? (
                        <Spinner />
                    ) : isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                            >
                                الحساب
                                <ChevronDown size={16} />
                            </button>

                            {/* Dropdown */}
                            <div
                                className={`absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg transition-all duration-200 ${dropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                                    }`}
                            >
                                <NavLink
                                    to={user?.role === "manager" ? "/manager-dashboard" : "/dashboard"}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    لوحة التحكم
                                </NavLink>

                                <button
                                    onClick={() => {
                                        logout()
                                        setDropdownOpen(false)
                                    }}
                                    className="w-full text-right px-4 py-2 hover:bg-red-50 text-red-600"
                                >
                                    تسجيل الخروج
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <NavLink to="/login" className="text-gray-700">
                                تسجيل دخول
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm"
                            >
                                ابدأ مجاناً
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 pb-6 flex flex-col gap-4 bg-white/90 backdrop-blur-lg">

                    <NavLink to="/features" onClick={() => setIsOpen(false)}>
                        المميزات
                    </NavLink>


                    <NavLink to="/pricing" onClick={() => setIsOpen(false)}>
                        الأسعار
                    </NavLink>

                    <NavLink to="/clinics" onClick={() => setIsOpen(false)}>
                        العيادات
                    </NavLink>

                    {loading ? (
                        <Spinner />
                    ) : isAuthenticated ? (
                        <>
                            <NavLink
                                to={user?.role === "manager" ? "/manager-dashboard" : "/dashboard"}
                                onClick={() => setIsOpen(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                            >
                                لوحة التحكم
                            </NavLink>

                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                تسجيل الخروج
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={() => setIsOpen(false)}>
                                تسجيل دخول
                            </NavLink>

                            <NavLink
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                            >
                                ابدأ مجاناً
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav >
    )
}

export default NavBar
