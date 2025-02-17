import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
export const Camera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          facingMode: { exact: 'environment' }, // Request the back camera
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          // If access granted, set the video stream to the video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCameraPermission(true);
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        });
    }
  }, []);

  const capturePhoto = () => {
   
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to an image (base64 format)
      const imageData = canvas.toDataURL('image/png');
      setPhoto(imageData); // Store the photo
      console.log("photo", imageData)
    }
  };

  return (
    <div>
      <h1>Take a Photo</h1>
      {hasCameraPermission ? (
        <>
          <video ref={videoRef} autoPlay width="100%" height="auto"></video>
          <button onClick={capturePhoto}>Capture Photo</button>
          {photo && (
            <div>
              <h2>Captured Photo:</h2> 
              <Image src={photo} alt="Captured" width={200} height={200} quality={0.3}/>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </>
      ) : (
        <p>No access to the camera. Please enable permissions.</p>
        
      )}
    </div>
  );
}; 
