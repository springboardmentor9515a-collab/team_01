import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { getVolunteers } from "../services/api";
import "./Modal.css";

const AssignComplaintModal = ({ complaint, isOpen, onClose, onAssign }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingVolunteers, setFetchingVolunteers] = useState(false);

  useEffect(() => {
    const fetchVolunteers = async () => {
      if (isOpen) {
        setFetchingVolunteers(true);
        try {
          const response = await getVolunteers();
          setVolunteers(response.volunteers || []);
        } catch (error) {
          console.error('Error fetching volunteers:', error);
          // Fallback to empty array if API fails
          setVolunteers([]);
        } finally {
          setFetchingVolunteers(false);
        }
      }
    };
    
    fetchVolunteers();
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedVolunteer) return;
    
    setLoading(true);
    try {
      await onAssign(complaint.complaint_id, selectedVolunteer);
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assign Complaint</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{complaint.title}</h3>
            <p className="text-sm text-gray-600">{complaint.location}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Volunteer</label>
            {fetchingVolunteers ? (
              <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50">
                Loading volunteers...
              </div>
            ) : (
              <select
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={volunteers.length === 0}
              >
                <option value="">
                  {volunteers.length === 0 ? "No volunteers available" : "Choose a volunteer..."}
                </option>
                {volunteers.map((vol) => (
                  <option key={vol._id} value={vol._id}>
                    {vol.name} ({vol.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleAssign}
            disabled={!selectedVolunteer || loading || fetchingVolunteers || volunteers.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Assigning..." : "Assign"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignComplaintModal;