import { useState, useEffect } from 'react';
import './PersonalDetails.css';

const PersonalDetails = ({ updateFormData, errors }) => {
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  useEffect(() => {
    updateFormData(personalData);
  }, [personalData, updateFormData]);

  const getErrorMessage = (field) => {
    if (!touched[field]) return '';
    if (!personalData[field]?.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'email' && !/\S+@\S+\.\S+/.test(personalData.email)) {
      return 'Please enter a valid email address';
    }
    if (field === 'phone' && !/^\+?[\d\s-]{10,}$/.test(personalData.phone)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  return (
    <div className="form-section">
      <h2>Personal Details</h2>
      <div className={`form-group ${touched.firstName && !personalData.firstName ? 'error' : ''}`}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={personalData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {getErrorMessage('firstName') && (
          <div className="error-message">{getErrorMessage('firstName')}</div>
        )}
      </div>
      <div className={`form-group ${touched.lastName && !personalData.lastName ? 'error' : ''}`}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={personalData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {getErrorMessage('lastName') && (
          <div className="error-message">{getErrorMessage('lastName')}</div>
        )}
      </div>
      <div className={`form-group ${touched.email && getErrorMessage('email') ? 'error' : ''}`}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={personalData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {getErrorMessage('email') && (
          <div className="error-message">{getErrorMessage('email')}</div>
        )}
      </div>
      <div className={`form-group ${touched.phone && getErrorMessage('phone') ? 'error' : ''}`}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={personalData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="+1 (123) 456-7890"
        />
        {getErrorMessage('phone') && (
          <div className="error-message">{getErrorMessage('phone')}</div>
        )}
      </div>
      <div className={`form-group ${touched.address && !personalData.address ? 'error' : ''}`}>
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={personalData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {getErrorMessage('address') && (
          <div className="error-message">{getErrorMessage('address')}</div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails; 