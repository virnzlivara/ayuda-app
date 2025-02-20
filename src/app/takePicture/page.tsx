"use client";  
import { Footer } from '@/components/Footer/Footer';  
import { Head } from '@/components/Head/head';
import { QrScanner } from '@/components/QRScanner';  

const page = () => {
  return (
    <div>   
      <Head/>
      <QrScanner/>
      <Footer />
       
    </div>
  )
}

export default page
