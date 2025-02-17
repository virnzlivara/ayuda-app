"use client"; 
import { CameraCapture } from '@/components/CameraCapture';
// import { PhotoCapture } from '@/components/PhotoCapture'
import React from 'react'

const page = () => {
  return (
    <div>
      {/* <PhotoCapture/> */}
      <CameraCapture/>
    </div>
  )
}

export default page
