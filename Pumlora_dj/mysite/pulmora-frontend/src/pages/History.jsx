import { useState, useEffect } from 'react';
import API from '../api/api';
import { getUserReports } from '../api/api';
import Card from '../components/Card';
import Button from '../components/Button';

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUserReports();
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (prediction) => {
    return prediction === 'Pneumonia' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'mild': 'bg-yellow-500',
      'moderate': 'bg-orange-500',
      'severe': 'bg-red-500'
    };
    return colors[severity?.toLowerCase()] || 'bg-gray-500';
  };

  const pneumoniaCount = reports.filter(r => r.prediction === 'Pneumonia').length;
  const normalCount = reports.length - pneumoniaCount;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-spin">
            <span className="text-2xl">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading History</h1>
          <p className="text-gray-600">Fetching your diagnosis history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">History Dashboard</h1>
          <p className="text-xl text-gray-600">Your complete AI diagnosis history</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8">
          {error} <Button onClick={fetchReports} className="ml-4">Retry</Button>
        </div>
      )}

      {reports.length === 0 ? (
        <Card className="text-center py-20">
          <span className="text-6xl mb-6 block">📋</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No History Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Run an AI diagnosis to populate your history.
          </p>
          <Button variant="primary" className="px-8">Go to AI Diagnosis</Button>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-6 lg:grid-cols-3 mb-12">
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">{reports.length}</div>
              <div className="text-lg text-gray-600">Total Reports</div>
            </Card>
            <Card className="text-center p-8 bg-red-50">
              <div className="text-4xl font-bold text-red-600 mb-2">{pneumoniaCount}</div>
              <div className="text-lg text-gray-600">Pneumonia Cases</div>
            </Card>
            <Card className="text-center p-8 bg-green-50">
              <div className="text-4xl font-bold text-green-600 mb-2">{normalCount}</div>
              <div className="text-lg text-gray-600">Normal Cases</div>
            </Card>
          </div>

          {/* Reports Table */}
          <Card>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Diagnosis History</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Diagnosis</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Severity</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Confidence</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPredictionColor(report.prediction)}`}>
                          {report.prediction}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(report.severity_level)} text-white`}>
                          {report.severity_level}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium">{Math.round(report.confidence_score * 100)}%</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{new Date(report.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="print-btn"
                          onClick={() => window.open(`/report/${report.xray_test}`, '_blank')}
                        >
                          View Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
