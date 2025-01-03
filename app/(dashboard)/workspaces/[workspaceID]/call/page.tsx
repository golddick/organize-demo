import { getCurrent } from "@/features/auth/queries";
import { MeetingClient } from "./client";
import { redirect } from "next/navigation";


const Page = async() => {
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-up")
  }
  const ID = user?.$id


  return( 
  <MeetingClient id={ID}/>)
};

export default Page;
