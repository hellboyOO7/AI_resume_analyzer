import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7001";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected && selected.type !== "application/pdf") {
      setError("Only PDF files allowed");
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload a resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/api/analyze`, formData);

      setResult(response.data.result);
    } catch (err) {
      setError("Failed to analyze resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Resume Analyzer
        </h1>

        <UploadCard
          file={file}
          loading={loading}
          onFileChange={handleFileChange}
          onAnalyze={handleAnalyze}
        />

        {error && <div className="mt-4 text-red-300 text-center">{error}</div>}

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}

function UploadCard({ file, loading, onFileChange, onAnalyze }) {
  return (
    <div className="bg-white text-black rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <label
          htmlFor="resumeUpload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-400 rounded-2xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition"
        >
          <div className="text-center">
            <p className="text-indigo-600 font-semibold text-lg">
              Click to upload resume
            </p>
            <p className="text-sm text-gray-500 mt-1">PDF files only</p>

            {file && (
              <p className="mt-3 text-green-600 font-medium">✅ {file.name}</p>
            )}
          </div>
        </label>

        <input
          id="resumeUpload"
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            Analyzing...
          </span>
        ) : (
          "Analyze Resume"
        )}
      </button>
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <div className="mt-10 bg-white text-black rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <ScoreCircle score={result.score} />
        <p className="text-gray-500 mt-2">Resume Score</p>
      </div>

      <p className="text-center text-gray-600 mb-4">
        Domain: <span className="font-semibold">{result.domain}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Strengths" items={result.strengths} color="green" />
        <Section title="Weaknesses" items={result.weaknesses} color="red" />
        <Section
          title="Missing Skills"
          items={result.missingSkills}
          color="yellow"
        />
        <Section title="Suggestions" items={result.suggestions} color="blue" />
      </div>

      <div className="mt-6 text-center">
        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full">
          ATS Compatibility: {result.atsCompatibility}
        </span>
      </div>
    </div>
  );
}

function ScoreCircle({ score }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-indigo-600">
        {score}
      </div>
      <svg className="w-full h-full">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="lightgray"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="indigo"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
        />
      </svg>
    </div>
  );
}

function Section({ title, items, color }) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };

  return (
    <div>
      <h2 className={`text-lg font-semibold ${colorMap[color]} mb-2`}>
        {title}
      </h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {items?.length > 0 ? (
          items.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li className="text-gray-400">No data available</li>
        )}
      </ul>
    </div>
  );
}
