import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const AuthForm = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    emailOrContact: "",
    password: "",
    contactnumber: "",
    address: "",
    doorNo: "",
    roadAreaColony: "",
    landmark: "",
    city: "",
    District: "",
    state: "",
    pincode: "",
    addressType: "fullAddress",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z ]*$/.test(value)) return;
    if (name === "contactnumber" && !/^\d{0,10}$/.test(value)) return;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (updatedData.addressType === "fullAddress") {
        updatedData.address = [
          updatedData.doorNo,
          updatedData.roadAreaColony,
          updatedData.landmark,
          updatedData.city,
          updatedData.District,
          updatedData.state,
          updatedData.pincode,
        ]
          .filter(Boolean)
          .join(", ");
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isRegistered) {
      if (formData.name.trim() === "") {
        alert("Name is required and should contain only alphabets.");
        return;
      }
      if (!/^\d{10}$/.test(formData.contactnumber)) {
        alert("Contact number must be exactly 10 digits.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrContact)) {
        alert("Please enter a valid email.");
        return;
      }
    }

    try {
      if (isRegistered) {
        const response = await axios.post("https://milkdash.onrender.com/login", {
          emailOrContact: formData.emailOrContact,
          password: formData.password,
        });

        alert(response.data.message);

        if (response.status === 200) {
          const userId = response.data.userId;
          const sessionExpiry = new Date().getTime() + 30 * 60 * 1000;
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("sessionExpiry", sessionExpiry.toString());
          navigate("/");
        }
      } else {
        const response = await axios.post("https://milkdash.onrender.com/signup", {
          name: formData.name,
          email: formData.emailOrContact,
          contactnumber: formData.contactnumber,
          address: formData.address,
          password: formData.password,
        });

        alert(response.data.message);
        setIsRegistered(true);
      }
    } catch (err) {
      console.error("Full error:", err);

      if (err.response && err.response.data && err.response.data.message) {
        const errorMsg = err.response.data.message;

        if (errorMsg.includes("Duplicate entry") && errorMsg.includes("users.email")) {
          alert("This email is already registered. Please use another email.");
        } else if (errorMsg.includes("Duplicate entry") && errorMsg.includes("users.contactnumber")) {
          alert("This mobile number is already used. Please use another number.");
        } else {
          alert(errorMsg);
        }

        return;
      }

      alert("An error occurred. Please try again.");
    }
  };
return (
    <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-content">
          <h2>{isRegistered ? "Login" : "Register"}</h2>

          {!isRegistered && (
            <>
              <div className="input-container">
                <label className="input-label">Name</label>
                <input
                  className="input-field"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-container">
                <label className="input-label">Contact Number</label>
                <input
                  className="input-field"
                  type="text"
                  name="contactnumber"
                  placeholder="Contact Number"
                  value={formData.contactnumber}
                  onChange={handleChange}
                  required
                />
              </div>

              

              {formData.addressType === "fullAddress" && (
                <div className="address-container">
                  {["doorNo", "roadAreaColony", "landmark", "city", "District", "state", "pincode"].map((field) => (
                    <div className="input-container" key={field}>
                      <label className="input-label">
                        {field === "doorNo"
                          ? "Door Number"
                          : field === "roadAreaColony"
                          ? "Road/Area/Colony"
                          : field === "city"
                          ? "City"
                          : field === "District"
                          ? "District"
                          : field === "state"
                          ? "State"
                          : field === "pincode"
                          ? "Pincode"
                          : "Nearest Landmark (optional)"}
                      </label>
                      <input
                        className="input-field"
                        type="text"
                        name={field}
                        placeholder={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field !== "landmark"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="input-container">
            <label className="input-label">{isRegistered ? "Email or Contact Number" : "Email"}</label>
            <input
              className="input-field"
              type="text"
              name="emailOrContact"
              placeholder="Email"
              value={formData.emailOrContact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">{isRegistered ? "Login" : "Register"}</button>
        </form>

        <p className="toggle-text">
          {isRegistered ? (
            <>
              New User?{" "}
              <span onClick={() => setIsRegistered(false)} className="toggle-link">
                Register Now
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsRegistered(true)} className="toggle-link">
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
