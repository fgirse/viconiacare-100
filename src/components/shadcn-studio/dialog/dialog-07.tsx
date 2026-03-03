
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import TerminButton from "@/public/images/buttonGruenobg.svg";
import BookingSection from "@/src/components/booking/BookingSection";

const DialogFullScreenDemo = () => {
  return (
    <Dialog>
     <DialogTrigger asChild>
        <Image
          src={TerminButton}
          alt="Termin Button"
          width={200}
          height={200}
          className="z-50 absolute w-36 top-[80vh] right-1 cursor-pointer top-[84vh] md:w-36 md:top-[15vh] md:right-12 lg:w-54"
        />
      </DialogTrigger>
      <DialogContent className='mb-8 flex h-[calc(100vh-2rem)] min-w-[calc(100vw-2rem)] flex-col justify-between gap-0 p-0'>
        <DialogTitle className="sr-only">Termin buchen</DialogTitle>
        <BookingSection/>
      </DialogContent>
    </Dialog>
  )
}

export default DialogFullScreenDemo
