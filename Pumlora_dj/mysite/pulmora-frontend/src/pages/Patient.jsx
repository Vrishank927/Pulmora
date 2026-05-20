import API from '../api/api';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Patient() {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    smoking_status: '',
    known_conditions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('patient/profile/');
        setForm({
          full_name: res.data.full_name || '',
          age: res.data.age || '',
          gender: res.data.gender || '',
          phone: res.data.phone || '',
          smoking_status: res.data.smoking_status || '',
          known_conditions: res.data.known_conditions || '',
        });
      } catch (err) {
        // No profile
      }
    };
    fetchProfile();
  }, []);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = {
        ...form,
        age: parseInt(form.age) || 0,
      };
      await API.post('patient/create/', data);
      setSuccess('Patient profile saved successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save profile';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '32px 0'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <Card>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #007bff, #0056b3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              👤
            </div>
            <div>
              <h1 style={{fontSize: '2.2rem', color: '#007bff', margin: 0}}>Patient Profile</h1>
              <p style={{color: '#666', margin: 0}}>Update your medical information</p>
            </div>
          </div>

          {error && (
            <div className="error" style={{marginBottom: '24px'}}>
              {error}
            </div>
          )}
          {success && (
            <div className="success" style={{marginBottom: '24px'}}>
              {success}
            </div>
          )}

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Full Name</label>
              <input
                className="input"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Age</label>
              <input
                className="input"
                type="number"
                placeholder="Enter age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Gender</label>
              <select
                className="input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Phone</label>
              <input
                className="input"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Smoking Status</label>
              <select
                className="input"
                value={form.smoking_status}
                onChange={(e) => setForm({ ...form, smoking_status: e.target.value })}
              >
                <option value="">Select Status</option>
                <option value="Never">Never</option>
                <option value="Former">Former</option>
                <option value="Current">Current</option>
              </select>
            </div>

            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Known Conditions</label>
              <textarea
                className="input"
                rows="4"
                placeholder="List known medical conditions (if any)"
                value={form.known_conditions}
                onChange={(e) => setForm({ ...form, known_conditions: e.target.value })}
                style={{resize: 'vertical'}}
              />
            </div>
          </div>

          <Button 
            loading={loading}
            variant="primary"
            style={{width: '100%', marginTop: '32px'}}
            onClick={submit}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
