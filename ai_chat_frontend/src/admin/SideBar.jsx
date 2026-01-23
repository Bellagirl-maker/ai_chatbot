import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 font-bold text-xl border-b">
        Admin Dashboard
      </div>

      <nav className="p-4 space-y-2">
        <NavLink
          to="/admin/support-articles"
          className={({ isActive }) =>
            `block p-2 rounded ${
              isActive ? "bg-indigo-500 text-white" : "hover:bg-gray-100"
            }`
          }
        >
          Support Articles
        </NavLink>
      </nav>
    </aside>
  );
}
