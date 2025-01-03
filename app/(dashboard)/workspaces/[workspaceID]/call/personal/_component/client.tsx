"use client";


import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import { useGetCallByID } from "@/hooks/useGetCallByID";
import { useToast } from "@/hooks/use-toast";
import { getCurrent } from "@/features/auth/queries";
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID";


const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};


interface PersonalRoomClientProps {
  user: {
    $id: string;
    name: string;
    meetingId?: string; 
  };
}

const PersonalRoomClient =  ({user}:PersonalRoomClientProps) => {

  const router = useRouter();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const workspaceID = useWorkspaceID()
  const meetingId = user.$id

  const { call } = useGetCallByID(meetingId);

  console.log(client)

  const startRoom = async () => {
    if (!client || !meetingId) return(
      console.log('no client or meeting id')
    )

    const newCall = client.call("default", meetingId);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            title: `${user.name}'meeting` || ''
          },
        },
      });
    }

    router.push(`/call/${meetingId}?personal=true`);
  };





  const meetingLink = `  ${window.location.origin}/meetings/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-black ">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.name}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="" variant={'default'} onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
        variant={'secondary'}
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoomClient;
