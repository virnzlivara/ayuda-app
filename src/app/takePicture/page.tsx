"use client";  
import { QrScanner } from '@/components/QRScanner';
import React from 'react' 

const page = () => {
  return (
    <div>  
      <div className='flex justify-center bg-[#ef2139] py-2'>
        <img src="logo.jpeg" height="auto" width="150px" alt="logo"/>
      </div> 
      <QrScanner/>
      <footer className="flex justify-center text-black">
        Copyright © 2025 v1.0.0
       </footer> 
    </div>
  )
}

export default page
