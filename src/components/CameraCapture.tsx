"use client";
import { useState, useRef } from "react";
// import jsQR from "jsqr";  
import { Modal } from "./Modal/Modal";
import { Upload } from "./Upload/Upload";
import { Preview } from "./Preview/Preview"; 
import { API } from "@/common/api";
import { ErrorType } from "./Modal/constants";
import { fetchWithTimeout } from "@/common/services";
import { Email } from "./Email/email";  
import Link from "next/link";
import { useRouter } from "next/navigation";
 

export const Camera = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Preview image URL
  // const [qrCodeData, setQrCodeData] = useState<string | null>(null); // Store decoded QR code data
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>(ErrorType.error);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [screenWidth, setScreenWidth] = useState(0);
  // const [screenHeight, setScreenHeight] = useState(0); 
  const route = useRouter();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        decodeQRCode(url);
      } else {
        setPreviewUrl(null);
        // setQrCodeData(null);
      }
    }
  };

  const decodeQRCode = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        // if (qrCode) {
        //   setQrCodeData(qrCode.data);
        // } else {
        //   setQrCodeData(null);
        // }
      }
    };
    img.src = imageUrl;
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      setMessage("");
      fileInputRef.current.click();
    }
  };

  const closeModal = () => {
    setMessage("");
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file to upload.");
    setShowLoading(true);
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

  // useEffect(() => { 
  //   if (typeof window !== "undefined" && window.screen) {
  //     setScreenWidth(window.screen.width);
  //     setScreenHeight(window.screen.height);
  //   }
  // }, []);

  const scanImage = ()=>{
    route.push("/takePicture");
  }
 

  return (
    <div className="p-4">
      {message && (
        <Modal type={messageType} message={message} close={closeModal} />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="flex justify-between w-full">
        <div className="gap-2 flex">
        <button
          className={`${!showLoading ? 'bg-[#1b4198] ': 'bg-[#939598]'}   py-4 px-4 text-2xl rounded-md`}
          onClick={triggerFileInput}
          disabled={showLoading}
        >
          Choose a file
        </button>

        <button
          className={`${!showLoading ? 'bg-[#1b4198] ': 'bg-[#939598]'}   py-4 px-4 text-2xl rounded-md`}
          onClick={scanImage}
          disabled={showLoading}
        >
          Scan QR
        </button>
        </div>

        {previewUrl && (
           <Email handleUpload={handleUpload} showLoading={showLoading}/>
        )}
      </div>

      <div className="rounded-lg overflow-hidden shadow-md py-7 px-5">
        {previewUrl ? (
          <Preview previewUrl={previewUrl} />
        ) : (
          <Upload handleFileChange={handleFileChange} />
        )}
        </div>  
      </div> 
      
      
    );
  }; 