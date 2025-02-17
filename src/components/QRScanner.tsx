// "use client"
// // components/QRScanner.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/library';

// const QRScanner: React.FC = () => {
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const codeReader = useRef(new BrowserMultiFormatReader());

//   useEffect(() => {
//     const startScanner = async () => {
//       try {
//         const video = videoRef.current;

//         if (!video) return;

//         // Open the camera
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
//         video.srcObject = stream;

//         // Start decoding QR codes
//         const decodeLoop = () => {
//           codeReader.current.decodeFromVideoDevice(null, video, (result, err) => {
//             if (result) {
//               setScanResult(result.getText());  // Capture QR Code result
//             }
//             if (err) {
//               console.error(err);
//             }
//           });
//         };

//         decodeLoop();
//       } catch (err) {
//         console.error('Error starting QR scanner:', err);
//       }
//     };

//     startScanner();

//     return () => {
//       // Clean up on component unmount (stop the camera)
//       const stream = videoRef.current?.srcObject as MediaStream;
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach(track => track.stop());
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <h1>QR Code Scanner</h1>
//       <video ref={videoRef} width="100%" height="auto" style={{ border: '1px solid #ccc' }} />
//       {scanResult && <div>Scanned QR Code: {scanResult}</div>}
//     </div>
//   );
// };

// export default QRScanner;
