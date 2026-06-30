import { Outlet } from "react-router"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { Slide, ToastContainer } from "react-toastify"
// import { Analytics } from "@vercel/analytics/react"
const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <NavBar />
            <Outlet />
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover={false}
                transition={Slide}
                rtl
                theme="light"
            />
            {/* <Analytics /> */}
        </div>
    )
}

export default MainLayout
