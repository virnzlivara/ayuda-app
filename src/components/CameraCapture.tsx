import { useState, useRef } from 'react';
import jsQR from 'jsqr'; // Import the jsQR library

const Camera = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Preview image URL
  const [qrCodeData, setQrCodeData] = useState(null); // Store decoded QR code data
  const fileInputRef = useRef(null);

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create a preview URL for image files
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);

        // Attempt to decode the QR code from the image
        decodeQRCode(url);
      } else {
        setPreviewUrl(null); // Reset preview if not an image
        setQrCodeData(null); // Reset QR code data
      }
    }
  };

  // Decode QR code from the image
  const decodeQRCode = (imageUrl) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Try to decode the QR code from the image data
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        setQrCodeData(qrCode.data); // Set the QR code data if it's valid
      } else {
        setQrCodeData(null); // Reset if no QR code is found
      }
    };
    img.src = imageUrl;
  };

  // Trigger file input when custom button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data); // Response from the server
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Custom upload button */}
      <button
        onClick={triggerFileInput}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Choose a File
      </button>

      {/* Preview section */}
      {previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Preview:</h4>
          <img
            src={previewUrl}
            alt="File Preview"
            style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Show the file name if not an image */}
      {file && !previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Selected File: {file.name}</h4>
        </div>
      )}

      {/* QR Code validation result */}
      {qrCodeData && (
        <div style={{ marginTop: '20px' }}>
          <h4>QR Code Detected:</h4>
          <p>Decoded Data: {qrCodeData}</p>
        </div>
      )}

      {/* No QR code found message */}
      {file && !qrCodeData && previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'red' }}>No valid QR code found in this image.</p>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#008CBA',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '10px',
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default Camera;
