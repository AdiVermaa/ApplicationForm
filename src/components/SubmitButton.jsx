import { useState } from 'react';
import './SubmitButton.css';

const SubmitButton = ({ disabled }) => {
  const [buttonState, setButtonState] = useState('idle'); // idle, loading, success, error

  const getButtonText = () => {
    switch (buttonState) {
      case 'loading':
        return 'Submitting...';
      case 'success':
        return 'Application Submitted!';
      case 'error':
        return 'Submission Failed';
      default:
        return 'Submit Application';
    }
  };

  const handleClick = async () => {
    if (buttonState === 'loading' || disabled) return;
    
    setButtonState('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setButtonState('success');
      
      // Reset button state after 3 seconds
      setTimeout(() => {
        setButtonState('idle');
      }, 3000);
    } catch (error) {
      setButtonState('error');
      
      // Reset button state after 3 seconds
      setTimeout(() => {
        setButtonState('idle');
      }, 3000);
    }
  };

  return (
    <div className="submit-button-container">
      <button
        type="submit"
        className={`submit-button ${buttonState} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        disabled={disabled || buttonState === 'loading'}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default SubmitButton; 