import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './shared/context/AppContext';
import Login from './pages/Login';
import SuperAdminDashboard from './apps/SuperAdmin/Dashboard';
import AdminDashboard from './apps/Admin/Dashboard';
import PublicBlogLayout from './apps/PublicBlog/Layout';
import BlogEditor from './shared/components/BlogEditor/BlogEditor';

const isPublicBlogMode = () => {
  const host = window.location.hostname;
  return host !== 'localhost' && host !== 'blogerp.com' && host !== 'www.blogerp.com';
};

function App() {
  const publicMode = isPublicBlogMode();

  return (
    <AppProvider>
      <Router>
        <Routes>
          {publicMode ? (
            <Route path="/*" element={<PublicBlogLayout />} />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/super-admin/*" element={<SuperAdminDashboard />} />
              
              {/* Blog Editor - Full Screen */}
              <Route path="/admin/blogs/create" element={<BlogEditor />} />
              <Route path="/admin/blogs/edit/:id" element={<BlogEditor />} />
              
              <Route path="/admin/*" element={<AdminDashboard />} />
              {/* For testing public blog on localhost/main domain */}
              <Route path="/p/*" element={<PublicBlogLayout />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
