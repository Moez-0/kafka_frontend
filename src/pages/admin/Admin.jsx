import React, { useState, useEffect } from "react";
import { FaUser, FaChartBar, FaCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

// Admin Dashboard Component
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("users"); // Track which section is active

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "analytics":
        return <Analytics />;
      case "posts":
        return <PostsManagement />;
      case "settings":
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-secondary text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <button
              onClick={() => setActiveSection("users")}
              className="flex items-center text-lg text-white"
            >
              <FaUser className="mr-2" /> User Management
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setActiveSection("analytics")}
              className="flex items-center text-lg text-white"
            >
              <FaChartBar className="mr-2" /> Analytics
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setActiveSection("posts")}
              className="flex items-center text-lg text-white"
            >
              <FaCog className="mr-2" /> Posts Management
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setActiveSection("settings")}
              className="flex items-center text-lg text-white"
            >
              <FaCog className="mr-2" /> Settings
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-primary text-background p-4 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button className="bg-secondary text-white py-2 px-4 rounded-lg">Logout</button>
        </div>

        {/* Active Section */}
        <div className="bg-background p-6 rounded-lg shadow-lg">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users/all");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderUserTable = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    return (
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border-b py-2 px-4 text-left">Username</th>
            <th className="border-b py-2 px-4 text-left">Email</th>
            <th className="border-b py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border-b py-2 px-4">{user.username}</td>
              <td className="border-b py-2 px-4">{user.email}</td>
              <td className="border-b py-2 px-4">
                <button className="bg-red-500 text-white py-1 px-3 rounded-lg">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <p>Here you can manage all the users of the platform.</p>
      <div className="mt-6">
        {renderUserTable()}
      </div>
    </div>
  );
};

// Analytics Section
const Analytics = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <p>View platform statistics here.</p>
      <div className="mt-6">
        <div className="flex space-x-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold">Total Users</h3>
            <p className="text-2xl">1,245</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold">Active Users</h3>
            <p className="text-2xl">675</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold">New Registrations</h3>
            <p className="text-2xl">89</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Posts Management Section
const PostsManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axiosInstance.get("/posts");
            console.log(response.data);
          setPosts(response.data);
        } catch (err) {
          setError("Failed to load posts.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, []);
  
    const handleDelete = async (postId) => {
      try {
        await axiosInstance.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        setError("Failed to delete post.");
      }
    };
  
    const renderPostTable = () => {
      if (loading) {
        return <p>Loading...</p>;
      }
  
      if (error) {
        return <p className="text-red-500">{error}</p>;
      }
  
      return (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border-b py-2 px-4 text-left">Caption </th>
                <th className="border-b py-2 px-4 text-left">User</th>
                <th className="border-b py-2 px-4 text-left">Actions</th>

            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              // Ensure the key is unique and exists for each post
              <tr key={post.id || post._id || `post-${post.caption}`}>
                {/* Ensure each table row has a unique key */}
                <td className="border-b py-2 px-4">{post.caption}</td>
                <td className="border-b py-2 px-4">{post.user.username}</td>
                <td className="border-b py-2 px-4">
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Posts Management</h2>
        <p>Manage all the posts on the platform.</p>
        <div className="mt-6">
          {renderPostTable()}
        </div>
      </div>
    );
  };

// Settings Section
const Settings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p>Modify platform settings here.</p>
      <div className="mt-6">
        <button className="bg-primary text-white py-2 px-6 rounded-lg">Change Platform Settings</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
