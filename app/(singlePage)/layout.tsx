import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";

import { Metadata } from "next";





export const metadata: Metadata = {
  title: "ORGANIZE",
  description: " A TASK AND A CALL APP ",
  icons:{
    icon: '/icons/gnb.png'
  }
};

export default function SinglePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main className="bg-neutral-100 min-h-screen ">
            <div className=" mx-auto max-w-screen-2xl p-4">
            <nav className='flex justify-between items-center h-[73px]'>
                <Link href='/space'>
                    <Image src='/logo/gnt.png' alt='LOGO' width={150} height={50} className=' object-contain'/>
                </Link>
                <UserButton/>
        </nav>
                <div className=" flex flex-col items-center justify-center py-4">
                    {children}
                </div>
            </div>
        </main>

  );
}
