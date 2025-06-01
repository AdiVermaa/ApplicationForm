import { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import html2pdf from 'html2pdf.js'
import 'react-quill/dist/quill.snow.css'
import './App.css'

// Custom hook for smooth number animation
const useAnimatedNumber = (targetNumber, duration = 500) => {
  const [displayNumber, setDisplayNumber] = useState(0)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const startValueRef = useRef(0)

  useEffect(() => {
    startValueRef.current = displayNumber
    startTimeRef.current = null

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const progress = (timestamp - startTimeRef.current) / duration
      
      if (progress < 1) {
        const value = startValueRef.current + (targetNumber - startValueRef.current) * easeOutQuad(progress)
        setDisplayNumber(Math.round(value))
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayNumber(targetNumber)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetNumber, duration])

  return displayNumber
}

// Easing function for smooth animation
const easeOutQuad = (t) => t * (2 - t)

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: [],
    about: '',
    resume: null,
    salaryExpectation: '',
    preferredLocation: '',
    noticePeriod: '',
    currentEmployment: '',
    languages: [],
    availableForInterview: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const fileInputRef = useRef(null)
  const progressTimeout = useRef(null)
  const [isProgressAnimating, setIsProgressAnimating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const animatedProgress = useAnimatedNumber(progress)

  const skillOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
    'HTML/CSS', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript',
    'Angular', 'Vue.js', 'MongoDB', 'DevOps', 'Agile', 'UI/UX'
  ]

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Hindi', 'Arabic', 'Portuguese', 'Russian'
  ]

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Education & Experience' },
    { id: 3, title: 'Skills & Additional Info' },
    { id: 4, title: 'Employment Details' },
    { id: 5, title: 'Review & Submit' }
  ]

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : ''
      case 'phone':
        return value && !/^\+?[\d\s-]{10,}$/.test(value) ? 'Invalid phone number' : ''
      case 'education':
        return !value.trim() ? 'Education is required' : ''
      case 'experience':
        return !value.trim() ? 'Work experience is required' : ''
      case 'skills':
        return value.length === 0 ? 'Please select at least one skill' : ''
      case 'about':
        return !value.trim() ? 'Please tell us about yourself' : ''
      case 'resume':
        return !value ? 'Please upload your resume' : ''
      case 'salaryExpectation':
        return !value.trim() ? 'Salary expectation is required' : ''
      case 'preferredLocation':
        return !value.trim() ? 'Preferred location is required' : ''
      case 'noticePeriod':
        return !value.trim() ? 'Notice period is required' : ''
      case 'currentEmployment':
        return !value.trim() ? 'Current employment is required' : ''
      case 'languages':
        return value.length === 0 ? 'Please select at least one language' : ''
      case 'availableForInterview':
        return !value.trim() ? 'Available for interview is required' : ''
      case 'portfolioUrl':
        return !value.trim() ? 'Portfolio URL is required' : ''
      case 'linkedinUrl':
        return !value.trim() ? 'LinkedIn URL is required' : ''
      case 'githubUrl':
        return !value.trim() ? 'GitHub URL is required' : ''
      default:
        return ''
    }
  }

  // Auto-save with debounce
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      setIsSaving(true)
      localStorage.setItem('jobApplicationForm', JSON.stringify(formData))
      setTimeout(() => setIsSaving(false), 1000)
    }, 500)

    return () => clearTimeout(saveTimeout)
  }, [formData])

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('jobApplicationForm')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  // Function to simulate progress loading
  const simulateProgress = () => {
    setIsProgressAnimating(true)
    let currentProgress = animatedProgress
    
    progressTimeout.current = setInterval(() => {
      const remainingProgress = 90 - currentProgress
      const increment = Math.min(
        remainingProgress,
        Math.random() * (10 - 3) + 3 // Random increment between 3 and 10
      )
      currentProgress = Math.min(currentProgress + increment, 90)
      setProgress(currentProgress)
      
      if (currentProgress >= 90) {
        clearInterval(progressTimeout.current)
      }
    }, 300) // Slower interval for smoother animation
  }

  const completeProgress = () => {
    clearInterval(progressTimeout.current)
    setProgress(100)
    setTimeout(() => {
      setIsProgressAnimating(false)
    }, 800) // Match this with CSS transition duration
  }

  // Calculate form completion percentage
  useEffect(() => {
    const requiredFields = ['name', 'email', 'education', 'experience', 'skills', 'about', 'resume', 'salaryExpectation', 'preferredLocation', 'noticePeriod', 'currentEmployment', 'languages', 'availableForInterview', 'portfolioUrl', 'linkedinUrl', 'githubUrl']
    const filledRequired = requiredFields.filter(field => 
      Array.isArray(formData[field]) 
        ? formData[field].length > 0 
        : field === 'about' || field === 'experience' || field === 'education'
          ? formData[field]?.trim() 
          : formData[field]
    ).length
    
    const newProgress = Math.round((filledRequired / requiredFields.length) * 100)
    
    // Only update if progress has changed
    if (newProgress !== progress) {
      // Clear any existing timeout
      if (progressTimeout.current) {
        clearTimeout(progressTimeout.current)
      }
      
      // Update progress after a short delay
      progressTimeout.current = setTimeout(() => {
        setProgress(newProgress)
      }, 300)
    }
  }, [formData])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (progressTimeout.current) {
        clearTimeout(progressTimeout.current)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time validation
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleRichTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkillsChange = (skill) => {
    setFormData(prev => {
      const newSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
      
      // Validate skills
      const error = validateField('skills', newSkills)
      setErrors(prev => ({
        ...prev,
        skills: error
      }))
      
      return {
        ...prev,
        skills: newSkills
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleFileUpload = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }))
    } else {
      alert('Please upload a PDF or Word document')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileChange = (e) => {
    handleFileUpload(e.target.files[0])
  }

  const handleFocus = (field) => {
    setFocusedField(field)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const nextStep = () => {
    // Validate current step
    let stepErrors = {}
    if (currentStep === 1) {
      stepErrors = {
        name: validateField('name', formData.name),
        email: validateField('email', formData.email),
        phone: validateField('phone', formData.phone)
      }
    } else if (currentStep === 2) {
      stepErrors = {
        education: validateField('education', formData.education),
        experience: validateField('experience', formData.experience)
      }
    } else if (currentStep === 3) {
      stepErrors = {
        skills: validateField('skills', formData.skills),
        about: validateField('about', formData.about),
        resume: validateField('resume', formData.resume)
      }
    } else if (currentStep === 4) {
      stepErrors = {
        salaryExpectation: validateField('salaryExpectation', formData.salaryExpectation),
        preferredLocation: validateField('preferredLocation', formData.preferredLocation),
        noticePeriod: validateField('noticePeriod', formData.noticePeriod),
        currentEmployment: validateField('currentEmployment', formData.currentEmployment),
        languages: validateField('languages', formData.languages),
        availableForInterview: validateField('availableForInterview', formData.availableForInterview),
        portfolioUrl: validateField('portfolioUrl', formData.portfolioUrl),
        linkedinUrl: validateField('linkedinUrl', formData.linkedinUrl),
        githubUrl: validateField('githubUrl', formData.githubUrl)
      }
    } else if (currentStep === 5) {
      stepErrors = {
        // No additional validation for the final step
      }
    }

    const hasErrors = Object.values(stepErrors).some(error => error)
    if (hasErrors) {
      setErrors(prev => ({
        ...prev,
        ...stepErrors
      }))
      return
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const generatePDF = async () => {
    const element = confirmationRef.current
    const opt = {
      margin: 1,
      filename: `job_application_${formData.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    try {
      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Final validation
    const finalErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      education: validateField('education', formData.education),
      experience: validateField('experience', formData.experience),
      skills: validateField('skills', formData.skills),
      about: validateField('about', formData.about),
      resume: validateField('resume', formData.resume),
      salaryExpectation: validateField('salaryExpectation', formData.salaryExpectation),
      preferredLocation: validateField('preferredLocation', formData.preferredLocation),
      noticePeriod: validateField('noticePeriod', formData.noticePeriod),
      currentEmployment: validateField('currentEmployment', formData.currentEmployment),
      languages: validateField('languages', formData.languages),
      availableForInterview: validateField('availableForInterview', formData.availableForInterview),
      portfolioUrl: validateField('portfolioUrl', formData.portfolioUrl),
      linkedinUrl: validateField('linkedinUrl', formData.linkedinUrl),
      githubUrl: validateField('githubUrl', formData.githubUrl)
    }

    const hasErrors = Object.values(finalErrors).some(error => error)
    if (hasErrors) {
      setErrors(finalErrors)
      return
    }

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      alert('Application submitted successfully!')
      
      // Clear form data first
      setFormData({
        name: '',
        email: '',
        phone: '',
        education: '',
        experience: '',
        skills: [],
        about: '',
        resume: null,
        salaryExpectation: '',
        preferredLocation: '',
        noticePeriod: '',
        currentEmployment: '',
        languages: [],
        availableForInterview: '',
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: ''
      })
      
      // Reset other states
      setCurrentStep(1)
      setErrors({})
      setProgress(0)
      setFocusedField(null)
      
      // Clear localStorage after successful submission
      localStorage.removeItem('jobApplicationForm')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission confirmation
  const handleSubmitConfirmation = (e) => {
    if (e) {
      e.preventDefault()
    }
    
    // Check if already submitting
    if (isSubmitting) {
      return;
    }
    
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to submit your application? Please review all information carefully before submitting.')
    if (confirmed) {
      handleSubmit()
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className={`form-section ${focusedField === 'name' ? 'focused' : ''}`}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className={`form-section ${focusedField === 'email' ? 'focused' : ''}`}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className={`form-section ${focusedField === 'phone' ? 'focused' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus('phone')}
                onBlur={handleBlur}
                className={errors.phone ? 'error' : ''}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </>
        )

      case 2:
        return (
          <>
            <div className={`form-section ${focusedField === 'education' ? 'focused' : ''}`}>
              <label htmlFor="education">Education Background *</label>
              <ReactQuill
                value={formData.education}
                onChange={(value) => handleRichTextChange('education', value)}
                onFocus={() => handleFocus('education')}
                onBlur={handleBlur}
                placeholder="Enter your educational background"
              />
              {errors.education && <span className="error-message">{errors.education}</span>}
            </div>

            <div className={`form-section ${focusedField === 'experience' ? 'focused' : ''}`}>
              <label htmlFor="experience">Work Experience *</label>
              <ReactQuill
                value={formData.experience}
                onChange={(value) => handleRichTextChange('experience', value)}
                onFocus={() => handleFocus('experience')}
                onBlur={handleBlur}
                placeholder="Describe your work experience"
              />
              {errors.experience && <span className="error-message">{errors.experience}</span>}
            </div>
          </>
        )

      case 3:
        return (
          <>
            <div className={`form-section ${focusedField === 'skills' ? 'focused' : ''}`}>
              <label>Skills *</label>
              <div className="skills-grid">
                {skillOptions.map(skill => (
                  <label key={skill} className="skill-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillsChange(skill)}
                    />
                    {skill}
                  </label>
                ))}
              </div>
              {errors.skills && <span className="error-message">{errors.skills}</span>}
            </div>

            <div className={`form-section ${focusedField === 'about' ? 'focused' : ''}`}>
              <label htmlFor="about">Tell us about yourself *</label>
              <ReactQuill
                value={formData.about}
                onChange={(value) => handleRichTextChange('about', value)}
                onFocus={() => handleFocus('about')}
                onBlur={handleBlur}
                placeholder="Share anything else you'd like us to know"
              />
              {errors.about && <span className="error-message">{errors.about}</span>}
            </div>

            <div 
              className={`form-section file-upload-section ${focusedField === 'resume' ? 'focused' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="resume">Upload Resume/CV (PDF or Word) *</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleFileChange}
                  onFocus={() => handleFocus('resume')}
                  onBlur={handleBlur}
                  accept=".pdf,.doc,.docx"
                  className={`file-input ${errors.resume ? 'error' : ''}`}
                  ref={fileInputRef}
                />
                <div className="file-upload-content">
                  <i className="upload-icon">📄</i>
                  <p>Drag and drop your file here or click to browse</p>
                  <span className="file-types">Accepted formats: PDF, DOC, DOCX</span>
                </div>
              </div>
              {formData.resume && (
                <p className="file-name">Selected file: {formData.resume.name}</p>
              )}
              {errors.resume && <span className="error-message">{errors.resume}</span>}
            </div>
          </>
        )

      case 4:
        return (
          <>
            <div className={`form-section ${focusedField === 'salaryExpectation' ? 'focused' : ''}`}>
              <label htmlFor="salaryExpectation">Salary Expectation *</label>
              <input
                type="text"
                id="salaryExpectation"
                name="salaryExpectation"
                value={formData.salaryExpectation}
                onChange={handleChange}
                onFocus={() => handleFocus('salaryExpectation')}
                onBlur={handleBlur}
                className={errors.salaryExpectation ? 'error' : ''}
                placeholder="Enter your expected salary"
              />
              {errors.salaryExpectation && <span className="error-message">{errors.salaryExpectation}</span>}
            </div>

            <div className={`form-section ${focusedField === 'preferredLocation' ? 'focused' : ''}`}>
              <label htmlFor="preferredLocation">Preferred Location *</label>
              <input
                type="text"
                id="preferredLocation"
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleChange}
                onFocus={() => handleFocus('preferredLocation')}
                onBlur={handleBlur}
                className={errors.preferredLocation ? 'error' : ''}
                placeholder="Enter your preferred location"
              />
              {errors.preferredLocation && <span className="error-message">{errors.preferredLocation}</span>}
            </div>

            <div className={`form-section ${focusedField === 'noticePeriod' ? 'focused' : ''}`}>
              <label htmlFor="noticePeriod">Notice Period (in days) *</label>
              <input
                type="number"
                id="noticePeriod"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                onFocus={() => handleFocus('noticePeriod')}
                onBlur={handleBlur}
                className={errors.noticePeriod ? 'error' : ''}
                placeholder="Enter notice period in days"
                min="0"
                max="180"
              />
              {errors.noticePeriod && <span className="error-message">{errors.noticePeriod}</span>}
            </div>

            <div className={`form-section ${focusedField === 'currentEmployment' ? 'focused' : ''}`}>
              <label htmlFor="currentEmployment">Current Employment *</label>
              <input
                type="text"
                id="currentEmployment"
                name="currentEmployment"
                value={formData.currentEmployment}
                onChange={handleChange}
                onFocus={() => handleFocus('currentEmployment')}
                onBlur={handleBlur}
                className={errors.currentEmployment ? 'error' : ''}
                placeholder="Enter your current employment"
              />
              {errors.currentEmployment && <span className="error-message">{errors.currentEmployment}</span>}
            </div>

            <div className={`form-section ${focusedField === 'languages' ? 'focused' : ''}`}>
              <label>Languages *</label>
              <div className="languages-grid">
                {languageOptions.map(language => (
                  <label key={language} className="language-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          languages: prev.languages.includes(language)
                            ? prev.languages.filter(l => l !== language)
                            : [...prev.languages, language]
                        }))
                      }}
                    />
                    {language}
                  </label>
                ))}
              </div>
              {errors.languages && <span className="error-message">{errors.languages}</span>}
            </div>

            <div className={`form-section ${focusedField === 'availableForInterview' ? 'focused' : ''}`}>
              <label htmlFor="availableForInterview">Available for Interview From *</label>
              <input
                type="date"
                id="availableForInterview"
                name="availableForInterview"
                value={formData.availableForInterview}
                onChange={handleChange}
                onFocus={() => handleFocus('availableForInterview')}
                onBlur={handleBlur}
                className={errors.availableForInterview ? 'error' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.availableForInterview && <span className="error-message">{errors.availableForInterview}</span>}
            </div>

            <div className={`form-section ${focusedField === 'portfolioUrl' ? 'focused' : ''}`}>
              <label htmlFor="portfolioUrl">Portfolio URL *</label>
              <input
                type="text"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                onFocus={() => handleFocus('portfolioUrl')}
                onBlur={handleBlur}
                className={errors.portfolioUrl ? 'error' : ''}
                placeholder="Enter your portfolio URL"
              />
              {errors.portfolioUrl && <span className="error-message">{errors.portfolioUrl}</span>}
            </div>

            <div className={`form-section ${focusedField === 'linkedinUrl' ? 'focused' : ''}`}>
              <label htmlFor="linkedinUrl">LinkedIn URL *</label>
              <input
                type="text"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                onFocus={() => handleFocus('linkedinUrl')}
                onBlur={handleBlur}
                className={errors.linkedinUrl ? 'error' : ''}
                placeholder="Enter your LinkedIn URL"
              />
              {errors.linkedinUrl && <span className="error-message">{errors.linkedinUrl}</span>}
            </div>

            <div className={`form-section ${focusedField === 'githubUrl' ? 'focused' : ''}`}>
              <label htmlFor="githubUrl">GitHub URL *</label>
              <input
                type="text"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                onFocus={() => handleFocus('githubUrl')}
                onBlur={handleBlur}
                className={errors.githubUrl ? 'error' : ''}
                placeholder="Enter your GitHub URL"
              />
              {errors.githubUrl && <span className="error-message">{errors.githubUrl}</span>}
            </div>
          </>
        )

      case 5:
        return (
          <div className="review-section">
            <h3>Review Your Information</h3>
            <div className="review-item">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
            </div>
            <div className="review-item">
              <h4>Education</h4>
              <div dangerouslySetInnerHTML={{ __html: formData.education }} />
            </div>
            <div className="review-item">
              <h4>Experience</h4>
              <div dangerouslySetInnerHTML={{ __html: formData.experience || 'Not provided' }} />
            </div>
            <div className="review-item">
              <h4>Skills</h4>
              <div className="review-skills">
                {formData.skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="review-item">
              <h4>About</h4>
              <div dangerouslySetInnerHTML={{ __html: formData.about || 'Not provided' }} />
            </div>
            <div className="review-item">
              <h4>Resume</h4>
              <p>{formData.resume ? formData.resume.name : 'No resume uploaded'}</p>
            </div>
            <div className="review-item">
              <h4>Additional Information</h4>
              <p><strong>Salary Expectation:</strong> {formData.salaryExpectation}</p>
              <p><strong>Preferred Location:</strong> {formData.preferredLocation}</p>
              <p><strong>Notice Period:</strong> {formData.noticePeriod}</p>
              <p><strong>Current Employment:</strong> {formData.currentEmployment}</p>
              <p><strong>Languages:</strong> {formData.languages.join(', ')}</p>
              <p><strong>Available for Interview:</strong> {formData.availableForInterview}</p>
              <p><strong>Portfolio URL:</strong> {formData.portfolioUrl}</p>
              <p><strong>LinkedIn URL:</strong> {formData.linkedinUrl}</p>
              <p><strong>GitHub URL:</strong> {formData.githubUrl}</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
    document.body.classList.toggle('dark-mode')
  }

  // Handle multiple file uploads
  const handleMultipleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date()
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  // Send confirmation email
  const sendConfirmationEmail = async () => {
    setShowEmailConfirmation(true)
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('Confirmation email sent successfully!')
    setShowEmailConfirmation(false)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <button 
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>

      <div className={`form-container`}>
        <header className="form-header">
          <h1>Job Application Form</h1>
          <p className="form-description">
            Please fill out this form to apply for a position with us. Fields marked with * are required.
          </p>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-info">
              <span className="progress-text">
                {progress}% Complete
              </span>
              <span className="progress-detail">
                {progress === 100 
                  ? "All required fields completed!" 
                  : "Please fill in all required fields"}
              </span>
              {isSaving && <span className="saving-indicator">Saving...</span>}
            </div>
          </div>
        </header>

        {/* Email confirmation modal */}
        {showEmailConfirmation && (
          <div className="email-confirmation">
            <h3>Application Submitted!</h3>
            <p>We're sending you a confirmation email with your application details.</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="form-content">
          <div className="steps-progress">
            {steps.map(step => (
              <div
                key={step.id}
                className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
              >
                <div className="step-number">{step.id}</div>
                <div className="step-title">{step.title}</div>
              </div>
            ))}
          </div>

          <div className="form-fields">
            <form onSubmit={handleSubmitConfirmation}>
              {renderStepContent()}
              <div className="form-footer">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="nav-button prev-button"
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="nav-button next-button"
                    disabled={isSubmitting}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
