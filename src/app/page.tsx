import Image from 'next/image'
import Logo_VivoniaCare from '@/public/ViconiaCareLogoobg.svg'
import HouseOfCare from '@/public/Hero3.png'
//import TerminButton from '@/public/TerminButton.png'
//import Link from 'next/link'
import ModalAppointment from '@/components/Modals/ModalAppointment'

export default function Home() {
  return (
    <div className=" flex flex-col min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex flex-col min-h-screen w-full max-w-9xl items-center px-16 dark:bg-black md:items-center">
        <div className="flex-col lg:flex flex-row items-center dark:bg-black">
          <div className="w-full md:w-2/4 flex flex-col items-center justify-center dark:bg-black">
              <Image src={Logo_VivoniaCare} alt="ViconiaCare Logo" width={200} height={200} className="text-center p-6 size-48 md:size-52 lg:size-72"/>
          </div>
              <h1 className=" bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent text-[13vw] font-bold tracking-tight text-gray-900 dark:text-white md:text-[13vw] lg:text-[11vw]">ViconiaCare</h1> 
             
       </div>
       <h1 className="bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-200 bg-clip-text text-transparent text-center text-[10vw] leading-12 md:leading-none font-black tracking-tight dark:text-white sm:text-[8vw] md:text-[10vw] md:mt-[3vh] lg:text-[4vw] lg:mt-[-2vh]">Pflege-verbindet mit Herz & Vielfalt </h1>
           <div className="flex flex-col items-center mt-5 w-full bg-zinc-600/10 dark:bg-black">
           <Image src={HouseOfCare} alt="House of Care" width={3200} height={1800} className="p-1 "/>
           </div>
           <ModalAppointment />
           {/*<div className="absolute right-12 top-[50vh]">
            <Link href="/appointment">
            <Image src={TerminButton} alt="Termin Button" width={200} height={200} className='cursor-pointer'/>
            </Link>
            </div>*/}
      </main>
    </div>
  );
}
