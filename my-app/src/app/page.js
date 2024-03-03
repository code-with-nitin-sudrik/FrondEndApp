"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
export default function Home() {
  const router=useRouter()
  return (
    <div style={{display:"flex", justifyContent:"center", flexDirection: 'column',alignItems:'center',justifyContent: 'center', height: '50vh'}}>

        <button onClick={()=>{
          router.push("/user")
        }}>
          User Form
        </button>
    </div>
  )
}
