import { useState, useEffect } from 'react';
import './WorkExperience.css';

const MAX_RESPONSIBILITIES_LENGTH = 500;

const WorkExperience = ({ updateFormData }) => {
  const [workData, setWorkData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    isCurrentJob: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setWorkData(prev => ({
      ...prev,
      [name]: newValue,
      // Clear end date if current job is checked
      ...(name === 'isCurrentJob' && checked ? { endDate: '' } : {})
    }));
  };

  const getCharacterCount = () => {
    const remaining = MAX_RESPONSIBILITIES_LENGTH - workData.responsibilities.length;
    return {
      count: remaining,
      className: remaining < 50 ? 
        remaining <= 0 ? 'limit-reached' : 'limit-near' 
        : ''
    };
  };

  useEffect(() => {
    updateFormData(workData);
  }, [workData, updateFormData]);

  const characterCount = getCharacterCount();

  return (
    <div className="form-section">
      <h2>Work Experience</h2>
      <div className="form-group">
        <label htmlFor="company">Company Name</label>
        <input
          type="text"
          id="company"
          name="company"
          value={workData.company}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="position">Position</label>
        <input
          type="text"
          id="position"
          name="position"
          value={workData.position}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={workData.startDate}
          onChange={handleChange}
          required
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={workData.endDate}
          onChange={handleChange}
          disabled={workData.isCurrentJob}
          min={workData.startDate}
          max={new Date().toISOString().split('T')[0]}
        />
        <label className="current-job-checkbox">
          <input
            type="checkbox"
            name="isCurrentJob"
            checked={workData.isCurrentJob}
            onChange={handleChange}
          />
          This is my current job
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="responsibilities">Responsibilities</label>
        <textarea
          id="responsibilities"
          name="responsibilities"
          value={workData.responsibilities}
          onChange={handleChange}
          required
          maxLength={MAX_RESPONSIBILITIES_LENGTH}
          placeholder="Describe your key responsibilities and achievements..."
          className={characterCount.className}
        />
        <span className="char-count">
          {characterCount.count} characters remaining
        </span>
      </div>
    </div>
  );
};

export default WorkExperience; 