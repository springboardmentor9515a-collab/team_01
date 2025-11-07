import React, { useState } from "react";
import { X, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

const ResponseModal = ({ complaint, isOpen, onClose, onSubmit }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    setLoading(true);
    try {
      await onSubmit(complaint.complaint_id, response);
      setResponse("");
      onClose();
    } catch (error) {
      console.error("Error submitting response:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Add Response
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Complaint:</h4>
          <p className="text-sm text-gray-600">{complaint.title}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Official Response *
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none"
              rows="4"
              placeholder="Enter your official response..."
              required
            />
          </div>



          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !response.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Submitting..." : "Submit Response"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResponseModal;