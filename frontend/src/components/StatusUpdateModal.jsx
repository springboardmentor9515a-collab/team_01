import React, { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import "./Modal.css";

const StatusUpdateModal = ({ complaint, isOpen, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || "");
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "in_review", label: "In Review" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" }
  ];

  const handleUpdate = async () => {
    if (!selectedStatus || selectedStatus === complaint.status) return;
    
    setLoading(true);
    try {
      await onUpdate(complaint.complaint_id, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Status</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{complaint.title}</h3>
            <p className="text-sm text-gray-600">Current: {complaint.status?.replace('_', ' ').toUpperCase()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleUpdate}
            disabled={!selectedStatus || selectedStatus === complaint.status || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;