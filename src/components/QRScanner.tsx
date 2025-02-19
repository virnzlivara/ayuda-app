"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { base64ToFile } from "@/common/utils";
import { API } from "@/common/api";
import { fetchWithTimeout } from "@/common/services"; 
import { useRouter } from "next/navigation";
import { Email } from "./Email/email";
import { Modal } from "./Modal/Modal";
import { ErrorType } from "./Modal/constants";

export const QrScanner = () => {
  const [qrCodeResult, setQrCodeResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [autoSend, setAutoSend] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>(ErrorType.error);
  const router = useRouter(); 
 

  const stopScanner = async () => {
    if (qrCodeRef.current && isScanning) {
      try {
        await qrCodeRef.current.stop();
        qrCodeRef.current.clear();
        setIsScanning(false);
        console.log("Scanner stopped");
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const startScanner = () => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new Html5Qrcode("qr-reader");

      qrCodeRef.current.start(
        { facingMode: "environment" }, // Use rear camera by default
        {
          fps: 10, // Frames per second
          qrbox: { width: 300, height: 300 }, // Scanner box size
        },
        (decodedText) => {
          console.log("QR Code:", decodedText);
          setQrCodeResult(decodedText);
          capturePreview();
          stopScanner(); // Stop after successful scan
        },
        (errorMessage) => {
          // Ignore "NotFoundException" to prevent console spam
          if (!errorMessage.includes("NotFoundException")) {
            console.error("Scanning error:", errorMessage);
          }
        }
      ).then(() => setIsScanning(true))
      .catch(console.error);
    }
  }; 

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner(); // Clean up on unmount
    };
  }, []);
  
  const capturePreview = async () => { 
    const video = document.querySelector(
      "#qr-reader video"
    ) as HTMLVideoElement | null;
    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setImagePreview(imageDataUrl);
        if (autoSend) {
            handleUpload();
        }
         
      }
    }
  };

  const handleUpload = async () => {
    setShowLoading(true);
    const file = base64ToFile(imagePreview!, "scannedImage");
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetchWithTimeout(
          process.env.NEXT_PUBLIC_END_POINT + API.upload,
          {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(5000),
          }
        );
        if (res.error) {
          setMessageType(ErrorType.error);
          setMessage(res.error);
        } else {
          setMessageType(ErrorType.success);
          setMessage("QR Code Sent!");
        }
        setShowLoading(false);
  };

  const closeModal = () => {
    setMessage(""); 
    setImagePreview(null);
    setQrCodeResult(null);
  };
  
  const onBack = () => { 
    router.back();
  }
  return (
    <div className="p-4">
       {message && (
        <Modal type={messageType} message={message} close={closeModal} />
      )}
        <div className="flex justify-between">
      <button
      onClick={onBack}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition-all duration-300"
    >
      ← Back
    </button>
      <label className="text-black">
        <input className="accent-pink-500" type="checkbox" checked={autoSend} onChange={(e)=>{ 
            setAutoSend(e.target.checked)
        }} />
        Auto send
        </label>
        </div> 
      {qrCodeResult ? (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded hidden">
          <strong>QR Code Data:</strong> {qrCodeResult}
        </div> 
      ): <div id="qr-reader" className="w-full max-w-md mx-auto" />}
      <div className="flex justify-between w-full py-5">
        {imagePreview && (
          <Email handleUpload={handleUpload} showLoading={showLoading}/>
        )}
      </div> 
      {imagePreview && (
        <div className="mt-4"> 
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
 
