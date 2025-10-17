import React, { useState } from "react";
import "./CreatePetition.css";
import { createComplaint } from "../services/api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon path issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CreatePetition = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    signatureGoal: "",

    description: "",
    photo_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "frontend_upload");

    setIsUploading(true);
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dotco7yza/image/upload",
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      if (data.secure_url) {
        setForm((prev) => ({ ...prev, photo_url: data.secure_url }));
        alert("Image uploaded successfully!");
      } else {
        throw new Error("No secure URL in response");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    console.log("Requesting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Got coordinates:", latitude, longitude);

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await resp.json();
          console.log("Reverse geocode response:", data);

          const address =
            data.display_name ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setForm((prev) => ({ ...prev, location: address }));
          setSelectedLatLng({ lat: latitude, lng: longitude });
          alert("Location set to your current position.");
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setForm((prev) => ({ ...prev, location: coordString }));
          setSelectedLatLng({ lat: latitude, lng: longitude });
          alert("Could not determine address. Using coordinates instead.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === 1) {
          alert(
            "Location access denied. Please enable location permissions in your browser settings and try again."
          );
        } else if (error.code === 2) {
          alert(
            "Location unavailable. Please check your device's location settings."
          );
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("Could not retrieve your location.");
        }
      }
    );
  };
  // Open/Close map modal
  const openMap = () => setShowMap(true);
  const closeMap = () => setShowMap(false);

  // Handle map click
  const handleMapSelect = async ({ lat, lng }) => {
    setSelectedLatLng({ lat, lng });
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await resp.json();
      const address =
        data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setForm((prev) => ({ ...prev, location: address }));
      alert("Location picked from map.");
    } catch {
      const coordString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setForm((prev) => ({ ...prev, location: coordString }));
      alert("Using coordinates (reverse geocoding failed).");
    } finally {
      closeMap();
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation to match backend
    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();
    const trimmedLocation = form.location.trim();

    if (trimmedTitle.length < 5 || trimmedTitle.length > 200) {
      alert("Title must be 5-200 characters.");
      return;
    }
    if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
      alert("Description must be 10-2000 characters.");
      return;
    }
    if (!form.category) {
      alert("Please select a category.");
      return;
    }
    if (trimmedLocation.length < 3 || trimmedLocation.length > 200) {
      alert("Location must be 3-200 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build payload
      const payload = {
        title: trimmedTitle,
        description: trimmedDescription,
        category: form.category,
        signatureGoal: "",

        location: trimmedLocation,
      };

      // Only add photo_url if it exists and is valid
      if (form.photo_url && form.photo_url.trim() !== "") {
        payload.photo_url = form.photo_url.trim();
      }

      const res = await createComplaint(payload);

      alert("Petition/Complaint submitted successfully!");

      // Reset form
      setForm({
        title: "",
        category: "",
        signatureGoal: "",

        location: "",
        description: "",
        photo_url: "",
      });
      setSelectedLatLng(null);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);

      // Show detailed error message
      if (error.details && Array.isArray(error.details)) {
        const errorMessages = error.details
          .map((err) => `${err.path || err.param}: ${err.msg}`)
          .join("\n");
        alert(`Validation failed:\n${errorMessages}`);
      } else {
        alert(error.message || "Failed to submit petition/complaint.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-petition-container">
      <div className="CreatePetition-ellipse"></div>
      <div className="CreatePetition-rect1"></div>
      <div className="CreatePetition-rect2"></div>

      <form className="petition-card" onSubmit={handleSubmit}>
        <div className="petition-title">Petition creation -</div>
        <div className="petition-subtitle">Create a New Petition</div>

        <span className="form-label label-title">Petition Title *</span>
        <span className="form-label label-category">Category *</span>
        <span className="form-label label-location">Location *</span>
        <span className="form-label label-signatureGoal">Signature Goal</span>
        <span className="form-label label-description">Description *</span>
        <span className="form-label label-image">Upload Image (Optional)</span>

        <input
          className="input-title"
          type="text"
          name="title"
          placeholder="Give your petition a clear, specific title (5-200 chars)"
          value={form.title}
          onChange={handleChange}
          required
          minLength={5}
          maxLength={200}
        />

        <select
          className="input-category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="sanitation">Sanitation</option>
          <option value="water_supply">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="roads">Roads</option>
          <option value="public_safety">Public Safety</option>
          <option value="other">Other</option>
        </select>

        <input
          className="input-location"
          type="text"
          name="location"
          placeholder="Enter or choose a location (3-200 chars)"
          value={form.location}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={200}
        />

        <div className="location-buttons">
          <button
            type="button"
            className="use-location-btn"
            onClick={handleUseCurrentLocation}
          >
            📍 Use my location
          </button>
          <button type="button" className="pick-map-btn" onClick={openMap}>
            🗺️ Pick on map
          </button>
        </div>
        <input
          className="input-signatureGoal"
          type="number"
          name="signatureGoal"
          placeholder="0"
          min="0"
          value={form.signatureGoal}
          onChange={handleChange}
        />

        <textarea
          className="input-description"
          name="description"
          placeholder="Describe the issue and the change you'd like to see (10-2000 chars)..."
          value={form.description}
          onChange={handleChange}
          required
          minLength={10}
          maxLength={2000}
          rows={6}
        />

        <input
          className="input-image"
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleImageUpload}
          disabled={isUploading}
        />

        {form.photo_url && !isUploading && (
          <div className="image-preview-container">
            <img
              src={form.photo_url}
              alt="Uploaded preview"
              className="image-preview"
            />
          </div>
        )}

        <button
          className="submit-btn"
          type="submit"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? "⏳ Submitting..." : "✅ Submit Petition"}
        </button>
      </form>

      {showMap && (
        <MapModal
          onClose={closeMap}
          onSelect={handleMapSelect}
          initialPosition={selectedLatLng}
        />
      )}
    </div>
  );
};

// Map modal component
function MapModal({ onClose, onSelect, initialPosition }) {
  const defaultPos = initialPosition
    ? [initialPosition.lat, initialPosition.lng]
    : [18.5204, 73.8567]; // Pune coordinates

  function ClickHandler() {
    useMapEvents({
      click(e) {
        onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  return (
    <div className="map-modal">
      <div className="map-modal-content">
        <button className="map-close-btn" onClick={onClose}>
          ✖️ Close
        </button>
        <MapContainer center={defaultPos} zoom={13} className="map-container">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {initialPosition && (
            <Marker position={[initialPosition.lat, initialPosition.lng]} />
          )}
          <ClickHandler />
        </MapContainer>
        <div className="map-hint">👆 Click on the map to pick a location</div>
      </div>
    </div>
  );
}

export default CreatePetition;
