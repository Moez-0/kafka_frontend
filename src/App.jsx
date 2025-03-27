import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Homepage from './pages/Home'
import NoPage from './pages/NoPage'
import Explore from './pages/Explore'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Add from './pages/Add'
import MyPosts from './pages/MyPosts'
import AdminDashboard from './pages/admin/Admin'
import KafkaChatbot from './pages/Therapist'
import { AuthProvider } from './context/AuthContext' // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute' // Import ProtectedRoute
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
function App() {
  return (

    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="explore" element={<Explore />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            
            {/* Protect Add route */}
            <Route path="post" element={<ProtectedRoute><Add /></ProtectedRoute>} />
            <Route path="myposts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="chat" element={<ProtectedRoute><KafkaChatbot /></ProtectedRoute>} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
