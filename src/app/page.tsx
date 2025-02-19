 "use client";
import Camera from "@/components/CameraCapture"; 
import { Loader } from "@/components/Loader/Loader";

export default function Home() { 
  return (
    <div > 
      <div className='flex justify-center bg-[#ef2139] py-2'>
        <img src="logo.jpeg" height="auto" width="150px" alt="logo"/>
      </div> 
        <Camera  />
       
       <footer className="flex justify-center text-black">
        Copyright © 2025 v1.0.0
       </footer>  
    </div>
  );
}
