import Image from 'next/image'
import Logo_VivoniaCare from '@/public/images/ViconiaCareLogoobg.svg';
import HouseOfCare from '@/public/images/Hero4.png';
import TestimonialsSection from '@/src/components/TestimonialsSection';
import Dialog7 from '@/src/components/shadcn-studio/dialog/dialog-07';
import BookingSection from '@/src/components/booking/BookingSection';
import ServicesSection from '@/components/ServicesSection'
import WyUsSection from '@/src/components/WhyUsSection';
//import { About16 } from '@/components/about16';
  
export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className=" flex flex-col min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex flex-col min-h-screen w-full max-w-9xl items-center px-16 dark:bg-black md:items-center">
        <div className="flex-col lg:flex flex-row items-center dark:bg-black">
          <div className="w-full md:w-2/4 flex flex-col items-center justify-center dark:bg-black">
              <Image src={Logo_VivoniaCare} alt="ViconiaCare Logo" width={200} height={200} className="text-center p-6 size-48 md:size-52 lg:size-72"/>
          </div>
              <h1 className=" bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent text-[19vw] font-passionate tracking-tight text-gray-900 dark:text-white md:text-[15vw] lg:text-[11vw]">ViconiaCare</h1> 
             
       </div>
       <h1 className="font-sans bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-200 bg-clip-text text-transparent text-center text-[10vw] leading-12 md:leading-none font-black tracking-tight dark:text-white sm:text-[8vw] md:text-[5vw] md:mt-[0vh] lg:text-[3.66rem] lg:mt-[-4vh]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Pflege-menschlich modern und fair </h1>
           <div className="flex flex-col items-center mt-8 w-[95vw] md:w-[89vw] lg:w-[60vw] bg-stone-50 dark:bg-black">
           <Image src={HouseOfCare} alt="House of Care" width={1600} className="bg-stone-50 rounded-xl  p-5 "/>
           </div>
           <Dialog7 />
            <ServicesSection />
            <WyUsSection />
            <BookingSection/>
            <TestimonialsSection/>
           
      </main>
    </div>
  );
}
