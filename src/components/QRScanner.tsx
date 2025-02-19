import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const QrScanner = () => {
  const [qrCodeResult, setQrCodeResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const qrCode = new Html5Qrcode("qr-reader");
    qrCodeRef.current = qrCode;

    const startScanner = async () => {
      try {
        await qrCode.start(
          { facingMode: "environment" }, // Use back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log("QR Code detected:", decodedText);
            setQrCodeResult(decodedText);
            capturePreview();
            qrCode.stop();
          },
          (error) => console.warn("Scanning error:", error)
        );
      } catch (err) {
        console.error("Failed to start QR scanner:", err);
      }
    };

    startScanner();

    return () => {
      qrCode.stop().catch((err) => console.warn("Error stopping QR scanner:", err));
    };
  }, []);

  // Capture image preview from video stream
  const capturePreview = () => {
    const video = document.querySelector("#qr-reader video") as HTMLVideoElement | null;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setImagePreview(imageDataUrl);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Code Scanner with Preview</h2>

      {/* QR Scanner Container */}
      <div id="qr-reader" className="w-full max-w-md mx-auto" />

      {/* QR Code Result */}
      {qrCodeResult && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded">
          <strong>QR Code Data:</strong> {qrCodeResult}
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4">
          <h4 className="font-semibold">Scanned Image:</h4>
          <img
            src={imagePreview}
            alt="QR Code Preview"
            className="mt-2 border rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default QrScanner;
