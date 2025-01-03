

import { getCurrent } from "@/features/auth/queries";
import { MeetingPageClient } from "./_component/client";
import { redirect } from "next/navigation";

const MeetingPage =  async() => {

  const user = await getCurrent()

  if (!user) {
    redirect("/sign-up")
  }


  return <MeetingPageClient />;
};

export default MeetingPage;
