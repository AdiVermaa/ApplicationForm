import { useState, useEffect } from 'react';
import './ApplicationForm.css';

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    console.log('ApplicationForm mounted');
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    console.log('Moving to next step');
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  console.log('ApplicationForm rendering, currentStep:', currentStep, 'isLoaded:', isLoaded);

  return (
    <div className="application-form-container">
      <h2>Application Form (Step {currentStep})</h2>
      <div className="form-section">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
            />
          </div>
          <div className="form-navigation">
            <button
              type="button"
              className="nav-button next"
              onClick={handleNext}
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm; 