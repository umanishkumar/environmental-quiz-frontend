import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}

export default AdminLayout;