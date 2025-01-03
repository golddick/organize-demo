"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  desc?: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingListCard = ({
  icon,
  title,
  date,
  desc,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex min-h-auto w-full flex-col justify-between rounded-xl bg-black border-gold border-2 text-white px-5 py-4 xl:max-w-[500px] gap-4">
      <article className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-white">{desc}</p>
            <p className="text-base font-extralight  rounded-lg">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>

        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button onClick={handleClick}  className="rounded  px-6 bg-white text-black hover:text-white">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 px-6"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingListCard;
