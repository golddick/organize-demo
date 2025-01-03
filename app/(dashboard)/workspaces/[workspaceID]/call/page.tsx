import { getCurrent } from "@/features/auth/queries";
import { MeetingClient } from "./client";


const Page = async() => {
  const user = await getCurrent()
  const ID = user?.$id


  return( 
  <MeetingClient id={ID}/>)
};

export default Page;
