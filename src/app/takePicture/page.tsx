"use client"; 
import Camera from '@/components/CameraCapture'; 
import { QrScanner } from '@/components/QRScanner';
import React from 'react' 

const page = () => {
  return (
    <div> 
      {/* <Camera  /> */}
      <QrScanner/>
    </div>
  )
}

export default page
