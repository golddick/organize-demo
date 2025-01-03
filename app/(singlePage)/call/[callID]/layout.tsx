
import { getCurrent } from "@/features/auth/queries";
import { StreamVideoProvider } from "@/providers/StreamClientProvider";
import "@stream-io/video-react-sdk/dist/css/styles.css";
// import { Metadata } from "next";





// export const metadata: Metadata = {
//   title: "ORGANIZE",
//   description: " A TASK AND A VIDEO APP ",
//   icons:{
//     icon: '/icons/gnb.png'
//   }
// };

export default async function MeetingLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const user = await getCurrent();
  return (
    
    <main className=" w-full p-10">

        <StreamVideoProvider user={user}>

        {children}
        </StreamVideoProvider>
    </main>
  )
}
