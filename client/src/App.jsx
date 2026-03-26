import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://ai-resume-analyzer-3fp1.onrender.com/api/analyze",
        formData
      );

      setResult(response.data.result);
    } catch (error) {
      alert("Error analyzing resume");
      console.error(error);
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

        {/* Upload Card */}
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
                  <p className="mt-3 text-green-600 font-medium">
                    ✅ {file.name}
                  </p>
                )}
              </div>
            </label>

            <input
              id="resumeUpload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-10 bg-white text-black rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-indigo-600">
                {result.score}
              </div>
              <p className="text-gray-500">Resume Score</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Section
                title="Strengths"
                items={result.strengths}
                color="green"
              />
              <Section
                title="Weaknesses"
                items={result.weaknesses}
                color="red"
              />
              <Section
                title="Missing Skills"
                items={result.missingSkills}
                color="yellow"
              />
              <Section
                title="Suggestions"
                items={result.suggestions}
                color="blue"
              />
            </div>

            <div className="mt-6 text-center">
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full">
                ATS Compatibility: {result.atsCompatibility}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, items, color }) {
  return (
    <div>
      <h2 className={`text-lg font-semibold text-${color}-600 mb-2`}>
        {title}
      </h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
