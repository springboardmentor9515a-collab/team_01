import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#D7E9ED] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#2B4D4A]">Welcome to CIVIX Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="bg-[#407470] text-white px-4 py-2 rounded-lg hover:bg-[#2B4D4A]"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            {/*<h2 className="text-xl font-semibold mb-4">User Information</h2>*/}
            <div className="space-y-2">
              {/*<p><strong>Name:</strong> {user.name}</p>*/}
              {/*<p><strong>Email:</strong> {user.email}</p>*/}
              {/*<p><strong>Role:</strong> {user.role}</p>*/}
              {/*<p><strong>Location:</strong> {user.location || 'Not specified'}</p>*/}
              {/*<p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}