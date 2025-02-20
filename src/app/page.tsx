"use client";
import { Camera } from "@/components/CameraCapture";
import { Footer } from "@/components/Footer/Footer";   
import { Head } from "@/components/Head/head";

export default function Home() {
  return (
    <div> 
      <Head/>
      <Camera /> 
      <Footer />
    </div>
  );
}
