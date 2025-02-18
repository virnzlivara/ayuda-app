import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr'; // Import the jsQR library

const Camera = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Preview image URL
  const [qrCodeData, setQrCodeData] = useState<string | null>(null); // Store decoded QR code data
  const [message, setMessage] = useState<string | null>(null);
  // Explicitly type the ref to HTMLInputElement
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create a preview URL for image files
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);

        // Attempt to decode the QR code from the image
        decodeQRCode(url);
      } else {
        setPreviewUrl(null); // Reset preview if not an image
        setQrCodeData(null); // Reset QR code data
      }
    }
  };

  // Decode QR code from the image
  const decodeQRCode = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Get image data from canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Try to decode the QR code from the image data
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) {
          setQrCodeData(qrCode.data); // Set the QR code data if it's valid
        } else {
          setQrCodeData(null); // Reset if no QR code is found
        }
      }
    };
    img.src = imageUrl;
  };

  // Trigger file input when custom button is clicked
  const triggerFileInput = () => {
    // Ensure fileInputRef.current is not null before trying to access it
    if (fileInputRef.current) {
      setMessage("");
      fileInputRef.current.click();
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(process.env.END_POINT + '/api/upload', {
      method: 'POST',
      body: formData,
    });
    debugger
    if (!res.ok) {
      setMessage('Error Uploading.');
    } else {
      const data = await res.json();
      setMessage('Error Uploading.');
      console.log(data); // Response from the server
    }
   
  };

useEffect(() => {
  // This will run only on the client-side
  if (typeof window !== 'undefined' && window.screen) {
    setScreenWidth(window.screen.width);
    setScreenHeight(window.screen.height);
  }
}, []); 

useEffect(()=> {
  if (file && !qrCodeData && previewUrl){
    // setMessage("Are you sure you want to send this photo?")
  }

  if (qrCodeData){
    // setMessage("QR Code detected.")
  }
}, [file, qrCodeData, previewUrl]);

  return (
    <div className='p-4'>
      <div className='flex justify-center m-10'>LOGO HERE</div> 
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    <div className='flex justify-between w-full  '>
    
      <button
        onClick={triggerFileInput}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
       
        Choose a File
      </button>
      

      {previewUrl && <button
        onClick={handleUpload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#008CBA',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      > 
        Email this photo
      </button>}

      
      </div>

      
      <div className='mt-6 flex justify-center'>
        <p className='font-bold'>{message}</p>
      </div> 
      
    <div className="rounded-lg overflow-hidden shadow-md py-7 px-5">  
        {previewUrl ? (
          <div className='flex justify-center h-full'>
          <div style={{ marginTop: '20px', border: 2 }} className='d-flex justify-center'>  
          <img
            src={previewUrl}
            alt="File Preview"
            style={{ maxWidth: `${screenWidth - 40}px`, maxHeight: `${screenHeight - 200}px`, objectFit: 'cover' }}
          />
        </div>
        </div>
      ) :  
      // <img src="https://placehold.co/800x1000" alt="Thumbnail" className="w-full h-full object-cover" />
      <label htmlFor="uploadFile1"
      className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-4 border-gray-300 border-dashed mx-auto font-[sans-serif]">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
        <path
          d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
          data-original="#000000" />
        <path
          d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
          data-original="#000000" />
      </svg>
      Upload file

      <input type="file" id='uploadFile1'  accept="image/*"  className="hidden" onChange={handleFileChange} hidden/>
      {/* <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p> */}
    </label>
      }
      </div>
 
      {/* Show the file name if not an image */}
      {file && !previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Selected File: {file.name}</h4>
        </div>
      )}  
    </div>
  );
};

export default Camera;
