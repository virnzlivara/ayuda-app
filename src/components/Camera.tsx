import { useRef, useState, useEffect } from 'react';

const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Ref to display video
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref to the canvas 
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Captured image

  useEffect(() => {
    // Function to access camera and start video stream
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // setHasPermission(true);
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        // setHasPermission(false);
      }
    };

    startCamera();

    // Cleanup function to stop video stream when the component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture photo when button is clicked
  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Draw the current video frame to the canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // Convert the canvas to a data URL (base64 image)
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  // Optionally: Save the captured image
  const saveImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = 'captured-image.png';
      link.click();
    }
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative', padding: '20px' }}>
      <h1>Camera Capture</h1>

       
        <>
          {/* Video element to show the live feed */}
          <video
            ref={videoRef}
            autoPlay
            width="320"
            height="240"
            style={{
              border: '2px solid black',
              position: 'relative',
              zIndex: 1, // Ensure video is below the button
            }}
          />
          {/* Capture button overlaid on top of the video */}
          <button
            onClick={takePhoto}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '15px 30px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              zIndex: 2, // Make sure the button is on top of the video
            }}
          >
            Capture
          </button>

          {/* Hidden canvas element used for taking the photo */}
          <canvas
            ref={canvasRef}
            width="320"
            height="240"
            style={{ display: 'none' }}
          />

          {/* Show the captured image preview */}
          {capturedImage && (
            <div style={{ marginTop: '20px' }}>
              <h3>Captured Image</h3>
              <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%' }} />
              <br />
              <button onClick={saveImage} style={{ marginTop: '10px' }}>
                Save Image
              </button>
            </div>
          )}
        </>
       
    </div>
  );
};

export default CameraCapture;
