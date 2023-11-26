'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import Custom403 from '../pages/403';


export default function Health() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user){
      router.push("/login")
    }
}, [user]);

if (!user) {
  return <div><Custom403/></div>
}
  
  return (
    <div className="bg-eggshell p-2 min-h-screen flex flex-col">
        <div className="mb-10 flex flex-col w-full p-4">
        <div style={{ marginTop: '-5%' }} >
        <button className="mt-3 mb-4" onClick={() => router.push('/tpage')}>
          <Header  headerText="Your Health"></Header>
        </button>
        
      <p className="text-darkgrey mb-4">Let Compass remove the hassle of recalling when to take your medications and 
          when you have important medical appointments.</p>   
    
      <Link href="/viewappointments">
            <div className="rounded-3xl  flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 " style={{backgroundColor: '#0880AE' }}>
              <div>
                <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
                  Appointments
                </p>
                <p className="text-[14px] text-white font-IBM Plex Sans  text-start">
                Reminders for those important events.
                </p>
              </div>
            </div>
      </Link>
      <br></br>


      <Link href="/getMedications">
            <div className="rounded-3xl flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 " style={{backgroundColor: 'var(--Black, #2C2738)' }}>
              
              <div>
                <p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
                Medications
                </p>
                <p className="text-[14px] text-white font-IBM Plex Sans  text-start">
                Never miss a crucial dose.
                </p>
              </div>
            </div>
      </Link>
      <br></br>

    </div>
  </div>
</div>
);
}