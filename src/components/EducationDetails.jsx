import { useState, useEffect } from 'react';
import './EducationDetails.css';

const EducationDetails = ({ updateFormData }) => {
  const [educationData, setEducationData] = useState({
    degree: '',
    institution: '',
    fieldOfStudy: '',
    graduationYear: '',
    gpa: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    updateFormData(educationData);
  }, [educationData, updateFormData]);

  return (
    <div className="form-section">
      <h2>Education Details</h2>
      <div className="form-group">
        <label htmlFor="degree">Degree</label>
        <select
          id="degree"
          name="degree"
          value={educationData.degree}
          onChange={handleChange}
          required
        >
          <option value="">Select Degree</option>
          <option value="bachelors">Bachelor's</option>
          <option value="masters">Master's</option>
          <option value="phd">Ph.D.</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="institution">Institution</label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={educationData.institution}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="fieldOfStudy">Field of Study</label>
        <input
          type="text"
          id="fieldOfStudy"
          name="fieldOfStudy"
          value={educationData.fieldOfStudy}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="graduationYear">Graduation Year</label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          value={educationData.graduationYear}
          onChange={handleChange}
          min="1900"
          max="2030"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="gpa">GPA</label>
        <input
          type="number"
          id="gpa"
          name="gpa"
          value={educationData.gpa}
          onChange={handleChange}
          step="0.01"
          min="0"
          max="4"
          required
        />
      </div>
    </div>
  );
};

export default EducationDetails; 