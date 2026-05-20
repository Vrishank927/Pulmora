import API from '../api/api';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Result() {
  const [xrayId, setXrayId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predict = async () => {
    if (!xrayId.trim()) {
      setError('Enter X-Ray ID');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    try {
      await API.get(`prediction/${xrayId.trim()}/`);
      const res = await API.get(`report/${xrayId.trim()}/`);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{maxWidth: '600px', margin: '0 auto', padding: '40px 20px'}}>
        <Card>
          <div style={{textAlign: 'center', padding: '40px 0'}}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #007bff, #0056b3)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 2s linear infinite'
            }}>
              ⚡
            </div>
            <h2 style={{fontSize: '1.8rem', color: '#007bff', marginBottom: '16px'}}>Running AI Analysis</h2>
            <p>Deep learning models processing your X-ray...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-12">
      <Card className="shadow-xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
            🧠
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-1 leading-tight">AI Diagnosis</h1>
            <p className="text-xl text-gray-600">Get instant pneumonia analysis</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <label className="block text-lg font-bold mb-4">X-Ray ID</label>
            <div style={{display: 'flex', gap: '12px'}}>
              <div className="flex gap-4">
                <input
                  className="input flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter X-Ray ID"
                  value={xrayId}
                  onChange={(e) => setXrayId(e.target.value)}
                />
                <Button variant="secondary" className="px-6 whitespace-nowrap">
                  Quick Preview
                </Button>
              </div>
            </div>
          </div>
          <Button 
            loading={loading}
            variant="primary"
            className="w-full text-lg py-4 font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={predict}
            disabled={!xrayId.trim()}
          >
            Run AI Diagnosis
          </Button>
        </div>

        {report && (
          <div>
            <div style={{
              padding: '32px',
              borderRadius: '16px',
              background: report.prediction === 'Pneumonia' ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'linear-gradient(135deg, #28a745, #20c997)',
              color: 'white',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{fontSize: '3rem', marginBottom: '12px'}}>
                {report.prediction}
              </div>
              <div style={{fontSize: '1.3rem', opacity: 0.9}}>
                Confidence: {Math.round(report.confidence * 100)}%
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px'}}>
              <div>
                <h3 style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', color: '#333'}}>Patient Info</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Name:</span>
                    <span style={{fontWeight: '500'}}>{report.patient_name}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Age:</span>
                    <span style={{fontWeight: '500'}}>{report.age}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Gender:</span>
                    <span style={{fontWeight: '500'}}>{report.gender}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', color: '#333'}}>Model Details</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Model:</span>
                    <span>{report.model_version}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Date:</span>
                    <span>{new Date(report.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{padding: '24px', border: '1px solid #e9ecef', borderRadius: '12px', background: '#f8f9fa'}}>
              <h3 style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', color: '#333'}}>Clinical Summary</h3>
              <p style={{lineHeight: 1.6, color: '#555', whiteSpace: 'pre-wrap'}}>
                {report.summary || 'No summary available.'}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
