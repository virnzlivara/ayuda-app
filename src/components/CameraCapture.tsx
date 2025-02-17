import React, { useState } from 'react';
import  {Camera} from 'react-camera-pro';

export const CameraCapture = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const capture = (dataUri: string) => {
    setPhoto(dataUri); // Capture and display the photo
  };

  return (
    <div>
      <h1>Camera Capture</h1>
      <Camera
        onTakePhoto={(dataUri) => capture(dataUri)}
        idealFacingMode="environment"
        isFullscreen
        imageType="png"
        imageCompression={0.9}
        isMaxResolution
      />
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
}; 
