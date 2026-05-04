import { dashboardPages } from '../../data/constants'
import { NavLink } from 'react-router-dom'

const DashboardLinks = () => {
    return (
        dashboardPages.map((page) => (
            <NavLink
                key={page.visible}
                to={page.link}
                end
                className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition
    ${isActive
                        ? "bg-blue-500 text-white shadow"
                        : "text-blue-600 hover:bg-blue-100"
                    }`
                }
            >
                {page.visible}
            </NavLink>
        ))
    )
}

export default DashboardLinks
