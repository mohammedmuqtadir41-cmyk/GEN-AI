import { useState } from "react";
import {
  FaBriefcase,
  FaUser,
  FaCloudUploadAlt,
  FaFilePdf,
  FaTrash,
  FaInfoCircle,
  FaStar,
  FaSpinner,
} from "react-icons/fa";
import "../style/Home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [formError, setFormError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const {
    generateReport,
    loading,
    error: apiError,
  } = useInterview({ autoFetch: false });

  const processFile = (file) => {
    if (file) {
      if (file.name.match(/\.(pdf|doc|docx)$/i)) {
        setResume(file);
      } else {
        setFormError("Please upload a PDF or DOCX file.");
      }
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!jobDescription.trim()) {
      setFormError("Job description is required.");
      return;
    }

    if (!resume && !selfDescription.trim()) {
      setFormError("Please provide a resume or a self description.");
      return;
    }

    const report = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile: resume,
    });

    if (!report?._id) {
      setFormError(
        "Unable to generate interview strategy. Please check your inputs and try again.",
      );
      return;
    }

    navigate(`/interview/${report._id}`);
  };

  const isFormValid = Boolean(
    jobDescription.trim() && (resume || selfDescription.trim()),
  );

  return (
    <main className="home">
      {/* Title & Subtitle */}
      <header className="page-header">
        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      {/* Main Form Container */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            {/* Left Column: Target Job Description */}
            <div className="column">
              <div className="column-header">
                <h2>
                  <FaBriefcase className="header-icon pink" /> Target Job
                  Description
                </h2>
                <span className="badge badge-required">REQUIRED</span>
              </div>

              <div className="textarea-wrapper">
                <textarea
                  placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  maxLength={5000}
                  required
                />
                <span className="char-count">
                  {jobDescription.length} / 5000 chars
                </span>
              </div>
            </div>

            {/* Right Column: Your Profile */}
            <div className="column">
              <div className="column-header">
                <h2>
                  <FaUser className="header-icon pink" /> Your Profile
                </h2>
              </div>

              {/* Resume Upload Section */}
              <div className="sub-section">
                <div className="label-row">
                  <label>Upload Resume</label>
                  <span className="badge badge-best">BEST RESULTS</span>
                </div>

                {!resume ? (
                  <label
                    htmlFor="resume-upload"
                    className={`upload-box ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Click to upload or drag & drop</p>
                    <small>PDF or DOCX (Max 5MB)</small>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="file-preview">
                    <div className="file-info">
                      <FaFilePdf className="pdf-icon" />
                      <span>{resume.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResume(null)}
                      className="remove-btn"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="divider">
                <span>OR</span>
              </div>

              {/* Self Description Section */}
              <div className="sub-section">
                <label className="section-label">Quick Self-Description</label>
                <div className="textarea-wrapper">
                  <textarea
                    className="small-textarea"
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Information Notice */}
              <div className="info-notice">
                <FaInfoCircle className="info-icon" />
                <p>
                  Either a <strong>Resume</strong> or a{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="card-footer">
            {formError && <div className="form-error">{formError}</div>}
            {!formError && apiError && (
              <div className="form-error">{apiError}</div>
            )}
            <span className="approx-time">
              AI-Powered Strategy Generation • Approx 30s
            </span>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" /> Generating...
                </>
              ) : (
                <>
                  <FaStar /> Generate My Interview Strategy
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Navigation */}
      <footer className="page-footer">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#help">Help Center</a>
      </footer>
    </main>
  );
};

export default Home;
