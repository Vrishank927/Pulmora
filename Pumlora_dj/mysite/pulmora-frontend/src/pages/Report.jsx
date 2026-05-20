import { useState } from 'react';
import API from '../api/api';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Report() {
  const [xrayId, setXrayId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    if (!xrayId.trim()) {
      setError('Enter X-Ray ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await API.get(`report/${xrayId.trim()}/`);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Report not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">X-Ray Diagnostic Report</h1>
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-3xl">
            Pulmora AI
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-bold mb-4 text-gray-900">Enter X-Ray ID</label>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="e.g. img_001348_s1"
              className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg"
              value={xrayId}
              onChange={(e) => setXrayId(e.target.value)}
            />
            <Button 
              loading={loading}
              variant="primary" 
              className="px-12 py-4 text-lg font-semibold"
              onClick={fetchReport}
            >
              Load Report
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 p-8 rounded-3xl text-center mb-8">
            <div className="text-2xl mb-4">⚠️</div>
            <div className="text-xl font-semibold">{error}</div>
          </div>
        )}

        {report && (
          <div id="report-content" className="print-section">
            <div className="border-4 border-gray-200 bg-white rounded-3xl shadow-2xl p-12 mb-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl font-black text-gray-900 mb-2">PULMORA AI DIAGNOSTIC REPORT</h1>
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white font-bold shadow-2xl">
                  AI
                </div>
                <p className="text-lg text-gray-600 font-semibold">Chest X-Ray Analysis</p>
              </div>

              {/* Patient Info */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">PATIENT INFORMATION</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="w-32 font-semibold text-gray-700">Name:</span>
                      <span className="font-bold text-xl">{report.patient_name}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className="w-32 font-semibold text-gray-700">Age:</span>
                      <span className="font-bold text-xl">{report.age}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="w-32 font-semibold text-gray-700">Gender:</span>
                      <span className="font-bold text-xl">{report.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 font-semibold text-gray-700">X-Ray ID:</span>
                      <span className="font-bold text-xl">{xrayId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">DIAGNOSIS RESULT</h2>
                <div className="text-center mb-12">
                  <div className={`inline-block px-8 py-6 rounded-3xl text-4xl font-black mb-6 shadow-2xl ${
                    report.prediction === 'Pneumonia' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  }`}>
                    {report.prediction}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-2xl font-bold text-gray-800 mb-4">
                    <span>Confidence:</span>
                    <span className="text-3xl text-blue-600">{Math.round(report.confidence * 100)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="px-6 py-3 bg-orange-100 text-orange-800 rounded-full font-semibold text-xl">
                    Severity: {report.severity}
                  </span>
                </div>
              </div>

              {/* Clinical Summary */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">CLINICAL SUMMARY</h2>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 prose max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-800 text-justify">
                    {report.summary || 'No clinical summary available for this analysis.'}
                  </p>
                </div>
              </div>

              {/* Model Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">MODEL INFORMATION</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-700">Model Version:</span>
                    <span className="font-bold">{report.model_version}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-40 font-semibold text-gray-700">Analysis Date:</span>
                    <span className="font-bold">{new Date(report.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-12 pt-12 border-t-2 border-gray-200">
              <Button 
                className="flex-1 print-btn bg-gray-800 hover:bg-gray-900 text-white py-4 text-xl font-bold shadow-xl"
                onClick={handlePrint}
              >
                🖨️ Print Report
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 py-4 text-xl font-bold"
              >
                💾 Download PDF
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
