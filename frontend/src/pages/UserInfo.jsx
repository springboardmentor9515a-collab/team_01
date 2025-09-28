import React from "react";

import logoCivix from "../assets/logo-civix.png";
import userPfp from "../assets/user-pfp.png";
import pencilPfp from "../assets/pfp-edit-pencil.png";
import "./UserInfo.css";
import CreatePoll from "./CreatePoll";

function UserInfo() {
  const [profileImage, setProfileImage] = React.useState(userPfp);
  const [role, setRole] = React.useState("Citizen");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [age, setAge] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [idVerification, setIdVerification] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [submitMsg, setSubmitMsg] = React.useState("");
  const fileInputRef = React.useRef(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(contact))
      newErrors.contact = "Contact must be 10 digits";
    if (!age.trim()) newErrors.age = "Age is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!idVerification.trim())
      newErrors.idVerification = "ID Verification is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMsg("");
    if (validate()) {
      // Show all user input in console
      console.log({
        firstName,
        lastName,
        email,
        contact,
        age,
        role,
        location,
        idVerification,
        profileImage,
      });
      alert("Profile submitted successfully!");
      // Reset all fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setContact("");
      setAge("");
      setRole("Citizen");
      setLocation("");
      setIdVerification("");
      setProfileImage(userPfp);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setSubmitMsg("");
    }
  };

  return (
    <div className="ui-root">
      <div className="ellipse ellipse-bg-main" />

      <div className="ellipse ellipse-bg-top-left" />

      <div className="ellipse ellipse-bg-blur" />
      <div className="rect rect-gradient-1" />
      <div className="rect rect-gradient-2" />
 

      <header className="ui-topbar">
        <div className="ui-topbar-inner">
          <img className="ui-logo" src={logoCivix} alt="CIVIX" />
        </div>
      </header>

      <main className="ui-main">
        <div className="ui-glass"></div>
        <section className="ui-profile">
          <h1 className="ui-title">User Details</h1>
          <div className="ui-avatar-wrap">
            <div className="ui-avatar-ring"></div>
            <img className="ui-avatar" src={profileImage} alt="User" />
            <button
              type="button"
              className="ui-avatar-edit"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              onClick={handleEditClick}
              aria-label="Edit profile picture"
            >
              <img
                src={pencilPfp}
                alt="Edit"
                style={{ width: "100%", height: "100%" }}
              />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </section>
        <hr
          className="center-line"
          style={{ backgroundColor: "black", border: "2px solid black" }}
        />
        <form className="ui-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Name Row */}
          <div className="ui-row">
            <label className="ui-label">First Name :</label>
            <input
              className="ui-input"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className="ui-label">Last Name :</label>
            <input
              className="ui-input"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          {errors.firstName && (
            <div style={{ color: "red", marginLeft: 130, marginBottom: 8 }}>
              {errors.firstName}
            </div>
          )}
          {errors.lastName && (
            <div style={{ color: "red", marginLeft: 540, marginBottom: 8 }}>
              {errors.lastName}
            </div>
          )}

          {/* Email and Contact Row */}
          <div className="ui-row">
            <label className="ui-label">E-mail Id :</label>
            <input
              className="ui-input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="ui-label">Contact no. :</label>
            <input
              className="ui-input"
              placeholder="0000000000"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          {errors.email && (
            <div style={{ color: "red", marginLeft: 130, marginBottom: 8 }}>
              {errors.email}
            </div>
          )}
          {errors.contact && (
            <div style={{ color: "red", marginLeft: 540, marginBottom: 8 }}>
              {errors.contact}
            </div>
          )}

          {/* Age and Role Row */}
          <div className="ui-row">
            <label className="ui-label">Age :</label>
            <input
              className="ui-input"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <label className="ui-label">Role :</label>
            <div className="ui-role">
              <button
                type="button"
                className={`ui-chip${role === "Citizen" ? " ui-chip--on" : ""}`}
                onClick={() => setRole("Citizen")}
                style={{
                  cursor: "pointer",
                  transition: "background 0.2s",
                  border:
                    role === "Citizen" ? "2px solid #2b4d4a" : "1px solid #ccc",
                  background: role === "Citizen" ? "#e0f7fa" : undefined,
                }}
                onMouseOver={(e) => {
                  if (role !== "Citizen")
                    e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseOut={(e) => {
                  if (role !== "Citizen") e.currentTarget.style.background = "";
                }}
                title="Click to select Citizen"
              >
                Citizen
              </button>
              <button
                type="button"
                className={`ui-chip${
                  role === "Official" ? " ui-chip--on" : ""
                }`}
                onClick={() => setRole("Official")}
                style={{
                  cursor: "pointer",
                  transition: "background 0.2s",
                  border:
                    role === "Official"
                      ? "2px solid #2b4d4a"
                      : "1px solid #ccc",
                  background: role === "Official" ? "#e0f7fa" : undefined,
                }}
                onMouseOver={(e) => {
                  if (role !== "Official")
                    e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseOut={(e) => {
                  if (role !== "Official")
                    e.currentTarget.style.background = "";
                }}
                title="Click to select Official"
              >
                Official
              </button>
            </div>
          </div>
          {errors.age && (
            <div style={{ color: "red", marginLeft: 130, marginBottom: 8 }}>
              {errors.age}
            </div>
          )}

          {/* Location and ID Row */}
          <div className="ui-row">
            <label className="ui-label">Location :</label>
            <input
              className="ui-input"
              placeholder="City, State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <label className="ui-label">ID Verification :</label>
            <input
              className="ui-input"
              placeholder="Govt. ID"
              value={idVerification}
              onChange={(e) => setIdVerification(e.target.value)}
            />
          </div>
          {errors.location && (
            <div style={{ color: "red", marginLeft: 130, marginBottom: 8 }}>
              {errors.location}
            </div>
          )}
          {errors.idVerification && (
            <div style={{ color: "red", marginLeft: 540, marginBottom: 8 }}>
              {errors.idVerification}
            </div>
          )}

          <div className="ui-actions">
            <button className="ui-save" type="submit">
              Save
            </button>
          </div>
          {submitMsg && (
            <div style={{ color: "green", marginTop: 16, textAlign: "center" }}>
              {submitMsg}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default UserInfo;
