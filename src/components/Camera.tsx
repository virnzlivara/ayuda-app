import React, { useEffect, useRef, useState } from 'react';

export const Camera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // If access granted, set the video stream to the video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCameraPermission(true);
          }
        })
        .catch((error) => {
          // Handle errors (e.g., no permission or camera access denied)
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        });
    }
  }, []);

  return (
    <div>
      <h1>Camera Access</h1>
      {hasCameraPermission ? (
        <video ref={videoRef} autoPlay width="100%" height="auto"></video>
      ) : (
        <p>No access to the camera. Please enable permissions.</p>
      )}
    </div>
  );
}; 
