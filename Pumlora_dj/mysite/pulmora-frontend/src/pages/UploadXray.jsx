import API from '../api/api';
import { useState, useCallback, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function UploadXray() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState('PA');
  const [xrayId, setXrayId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setError('');
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setImagePreview(preview);
    } else {
      setImagePreview(null);
    }
  }, []);

  const upload = async () => {
    if (!file) {
      setError('Select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);
    setXrayId(null);

    const formData = new FormData();
    formData.append('xray_image', file);
    formData.append('image_type', imageType);

    try {
      const res = await API.post('xray/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      setXrayId(res.data.id);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setImagePreview(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <div style={{padding: '32px 0', maxWidth: '1000px', margin: '0 auto'}}>
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
            📁
          </div>
          <div>
            <h1 style={{fontSize: '2.2rem', color: '#007bff', margin: 0}}>Upload X-Ray</h1>
            <p style={{color: '#666', margin: 0}}>Upload your chest X-ray image</p>
          </div>
        </div>

        {error && <div className="error" style={{marginBottom: '24px'}}>{error}</div>}

        <div style={{border: '3px dashed #dee2e6', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', marginBottom: '32px', cursor: 'pointer', transition: 'all 0.3s'}} 
             onClick={() => document.getElementById('file-input')?.click()}
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => {
               e.preventDefault();
               const droppedFile = e.dataTransfer.files[0];
               if (droppedFile?.type.startsWith('image/')) handleFileSelect(droppedFile);
             }}
             title="Click or drag to upload">
          {imagePreview ? (
            <div style={{marginBottom: '24px'}}>
              <img 
                src={imagePreview} 
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  marginBottom: '16px'
                }}
              />
              <div style={{display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center'}}>
                <span style={{fontSize: '14px', color: '#666'}}>{file.name}</span>
                <Button variant="danger" onClick={removeFile} style={{padding: '4px 12px', fontSize: '14px'}}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div style={{fontSize: '48px', marginBottom: '24px', opacity: 0.5}}>📁</div>
              <div>
                <p style={{fontSize: '1.3rem', fontWeight: '500', color: '#333', marginBottom: '8px'}}>Drop your X-Ray here</p>
                <p style={{color: '#666'}}>PNG, JPG up to 10MB</p>
              </div>
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{display: 'none'}}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>

        <div style={{display: 'flex', gap: '24px', flexDirection: 'column'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Image Type</label>
            <select
              className="input"
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              style={{padding: '12px 16px'}}
            >
              <option value="PA">PA (Posterior-Anterior)</option>
              <option value="AP">AP (Anterior-Posterior)</option>
            </select>
          </div>

          <Button 
            loading={loading}
            variant="primary"
            style={{width: '100%'}}
            onClick={upload}
            disabled={!file}
          >
            {loading ? `${uploadProgress}% Uploading...` : 'Upload X-Ray'}
          </Button>
        </div>

        {xrayId && (
          <div style={{
            marginTop: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>✅</div>
            <h2 style={{fontSize: '1.8rem', marginBottom: '8px'}}>Success!</h2>
            <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '2px'}}>
              {xrayId}
            </div>
            <p>Use this ID in AI Diagnosis</p>
          </div>
        )}
      </Card>
    </div>
  );
}
