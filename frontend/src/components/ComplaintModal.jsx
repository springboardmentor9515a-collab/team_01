import React from "react";
import { Button } from "./ui/button";
import { X, MapPin, Calendar, User, FileText } from "lucide-react";
import "./Modal.css";

const ComplaintModal = ({ complaint, isOpen, onClose, onAssign, onUpdateStatus, userRole }) => {
  if (!isOpen || !complaint) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Complaint Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">{complaint.title}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {complaint.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{complaint.created_by?.name || 'Unknown'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{complaint.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Description</span>
            </div>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{complaint.description}</p>
          </div>

          {complaint.photo_url && (
            <div>
              <span className="font-medium">Attachment</span>
              <img src={complaint.photo_url} alt="Complaint" className="mt-2 max-w-full h-48 object-cover rounded" />
            </div>
          )}

          {complaint.assigned_to && (
            <div>
              <span className="font-medium">Assigned to: </span>
              <span>{complaint.assigned_to.name}</span>
            </div>
          )}

          {complaint.official_response && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Official Response</span>
              </div>
              <p className="text-gray-700 bg-blue-50 p-3 rounded border-l-4 border-blue-400">{complaint.official_response}</p>
            </div>
          )}

          {complaint.status_history && complaint.status_history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Progress Updates</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {complaint.status_history.map((update, index) => (
                  <div key={index} className="text-sm bg-purple-50 p-2 rounded border-l-4 border-purple-400">
                    <p className="text-gray-700">{update.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {update.status?.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          {userRole === 'admin' && !complaint.assigned_to && (
            <Button onClick={() => onAssign(complaint)} className="bg-blue-600 hover:bg-blue-700">
              Assign Complaint
            </Button>
          )}
          {userRole === 'volunteer' && complaint.assigned_to && complaint.status !== 'resolved' && (
            <Button onClick={() => onUpdateStatus(complaint)} className="bg-green-600 hover:bg-green-700">
              Update Status
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;