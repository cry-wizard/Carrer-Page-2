import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/my-applications" element={
            <ProtectedRoute>
              <MyApplicationsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;

