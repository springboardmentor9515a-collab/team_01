import React from "react";
import { Button } from "./ui/button";
import { X, AlertTriangle } from "lucide-react";
import "./Modal.css";

const DeleteConfirmModal = ({ complaint, isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen || !complaint) return null;

  const canDelete = true; // Allow deletion of any complaint

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delete Complaint</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-medium text-red-800">Warning</h3>
              <p className="text-sm text-red-600">This action cannot be undone.</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">{complaint.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{complaint.location}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
              complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              complaint.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {complaint.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>


        </div>

        <div className="flex gap-2 mt-6">
          {canDelete ? (
            <Button
              onClick={() => onConfirm(complaint.complaint_id)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Deleting..." : "Delete Complaint"}
            </Button>
          ) : (
            <Button disabled className="bg-gray-300 text-gray-500">
              Cannot Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;