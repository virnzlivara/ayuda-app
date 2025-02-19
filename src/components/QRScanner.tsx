"use client";
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
// import { Html5QrcodeScanner } from 'html5-qrcode/esm/html5-qrcode-scanner';
// import dynamic from 'next/dynamic';
// const Html5QrcodeScanner = dynamic(
//   () => import('html5-qrcode/esm/html5-qrcode-scanner'),
//   { ssr: false }
// );

export const QrScanner = () => {
  const [qrCodeResult, setQrCodeResult] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
        'qr-reader', // 1. elementId (target container ID)
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning box dimensions
          supportedScanTypes:[Html5QrcodeScanType.SCAN_TYPE_CAMERA], // Ensure only camera is used
        },
        true // 3. verbose (set to true for debug logs)
      );
 
    scanner.render(
      (decodedText) => {
        console.log('QR Code detected:', decodedText);
        setQrCodeResult(decodedText);
        scanner.clear(); // Stop scanning after detection
      },
      (errorMessage) => {
        console.warn('Scan error:', errorMessage);
      }
    );

    return () => {
      scanner.clear(); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>

      {/* QR Code Scanner Container */}
      <div id="qr-reader" ref={scannerRef} className="w-full max-w-md mx-auto" />

      {/* QR Code Result */}
      {qrCodeResult && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded">
          <strong>QR Code Data:</strong> {qrCodeResult}
        </div>
      )}
    </div>
  );
}; 
