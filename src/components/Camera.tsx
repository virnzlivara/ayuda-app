import { isDesktop } from '@/common/utils';
import { useRef, useState, useEffect } from 'react';
// type hasPermissionProps = {
//   hasPermission: boolean;
// }
const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);  // Ref to display the video feed
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref to the canvas for taking photos
  // const [hasPermission, setHasPermission] = useState<boolean>(false); // State to track camera permission
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // State to store captured image

  useEffect(() => {
    // Function to access the camera and start the video stream
    const startCamera = async () => {

      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: { exact: 'environment' }, // Request the back camera
        },
      };

      if (isDesktop()) {
        constraints = { video: true }
      }

      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream; 
        }
      } catch (error) {
        console.error('Error accessing webcam: ', error); 
      }
    };

    startCamera();

    // Cleanup: stop video tracks when the component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Take a photo and store it in capturedImage state
  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Draw the video frame on the canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // Convert the canvas image to a data URL (base64)
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  // Optionally: Function to save the image or share it
  const saveImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = 'captured-image.png';
      link.click();
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Camera Capture</h1>

       
        <>
          {/* Video preview */}
          <video
            ref={videoRef}
            autoPlay
            width="320"
            height="240"
            style={{ border: '2px solid black' }}
          />
          <br />
          <button onClick={takePhoto} style={{ padding: '10px 20px', marginTop: '10px' }}>
            Take Photo
          </button>

          {/* Canvas (hidden, used for capturing image) */}
          <canvas
            ref={canvasRef}
            width="320"
            height="240"
            style={{ display: 'none' }}
          />

          {/* Show captured image preview */}
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
