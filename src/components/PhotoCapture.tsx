"use client";
// components/PhotoCapture.tsx
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// import emailjs from '@emailjs/browser';

export const PhotoCapture: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); 
  const streamRef = useRef<MediaStream | null>(null); // Store the video stream to stop it later
  // const public_key="4MaFJTqir5a9b2Yb2";
  // const samplebase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
  // Start the video stream (camera)
  const startCamera = async () => {
    try {
      const video = videoRef.current;
      if (video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera: ', err);
    }
  };

  const stopCamera= () => {
    const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks (video and audio if available)
      }
  }

  // Capture photo and convert it to base64
  const capturePhoto = () => {
    stopCamera();
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video feed
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to base64
        const imageBase64 = canvas.toDataURL('image/jpeg');
        setBase64Image(imageBase64);
      }
    }
  };

  const tryAgain = ()=> {
    setBase64Image(null);
    startCamera()
    // setBase64Image(null);
   
  }

  const sendToEmail = () => {
    // emailjs.send("service_j3s74za","template_d3387ws",{
    //   to_name: "TO RECEIVER",
    //   from_name: "TO SENDER",
    //   qrCode: samplebase64,//base64Image,
    //   message: "QR CODE",
    //   reply_to: "virnzlivara@gmail.com",
    //   });
    alert(base64Image)

  }

  // Start camera when the component is mounted
  useEffect(() => {
  //   emailjs.init({
  //     publicKey: public_key,
  //     // Do not allow headless browsers
  //     blockHeadless: true,
  //     blockList: {
  //       // Block the suspended emails
  //       // list: ['foo@emailjs.com', 'bar@emailjs.com'],
  //       // The variable contains the email address
  //       watchVariable: 'userEmail',
  //     },
  //     limitRate: {
  //       // Set the limit rate for the application
  //       id: 'app',
  //       // Allow 1 request per 10s
  //       throttle: 10000,
  //     }
  // });
    startCamera();
    return () => {
        stopCamera();
    };
  }, []);

  return (
    <div>
      <h1>Capture Photo</h1>
     
      {base64Image ? (
        <div>
          <h2>Captured Photo:</h2>
          {base64Image && <Image src={base64Image} alt="Captured" width={200} height={200} quality={0.3}/>}
          
          <h3>Base64 String:</h3>
          <textarea value={base64Image} readOnly rows={10} style={{ width: 200 }} />
        </div>
      ) :  <div>
      <video ref={videoRef} width="100%" height="auto" autoPlay></video>
    </div>}
      <div className='flex justify-between'>
        <button onClick={capturePhoto}>Capture Photo</button>
        <button onClick={tryAgain}>Try Again</button>
        <button onClick={sendToEmail}>Send to Email</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}; 
