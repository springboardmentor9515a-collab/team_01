import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'citizen': return 'Citizen';
      case 'admin': return 'Administrator';
      case 'volunteer': return 'Volunteer';
      default: return 'User';
    }
  };

  const renderRoleSpecificContent = () => {
    if (!user) return null;

    switch(user.role) {
      case 'citizen':
        return (
          <div className="citizen-panel">
            <h3>Citizen Panel</h3>
            <p>Submit and track your complaints</p>
            <button>Create New Complaint</button>
            <button>View My Complaints</button>
          </div>
        );
      
      case 'admin':
        return (
          <div className="admin-panel">
            <h3>Admin Panel</h3>
            <p>Manage all complaints and users</p>
            <button>View All Complaints</button>
            <button>Assign Complaints</button>
            <button>User Management</button>
          </div>
        );
      
      case 'volunteer':
        return (
          <div className="volunteer-panel">
            <h3>Volunteer Panel</h3>
            <p>Handle assigned complaints</p>
            <button>View Assigned Complaints</button>
            <button>Update Complaint Status</button>
          </div>
        );
      
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Welcome, {user.name}!</strong></p>
          <p>Role: {getRoleDisplay(user.role)}</p>
          <p>Email: {user.email}</p>
          {user.location && <p>Location: {user.location}</p>}
        </div>
      )}
      
      {renderRoleSpecificContent()}
    </div>
  );
}