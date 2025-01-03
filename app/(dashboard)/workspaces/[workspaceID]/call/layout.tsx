
import { getCurrent } from "@/features/auth/queries";
import { StreamVideoProvider } from "@/providers/StreamClientProvider";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Metadata } from "next";





export const metadata: Metadata = {
  title: "ORGANIZE",
  description: " A TASK AND A CALL APP ",
  icons:{
    icon: '/icons/gnb.png'
  }
};

export default async function MeetingLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const user = await getCurrent();
  return (
    
    <main className="">

        <StreamVideoProvider user={user}>

        {children}
        </StreamVideoProvider>
    </main>
  )
}
