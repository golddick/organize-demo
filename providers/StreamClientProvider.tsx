'use client'

import { tokenProvider } from "@/actions/stream.actions";
import { PageLoader } from "@/components/_component/PageLoader";
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID";


import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
  } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  
  export const StreamVideoProvider = ({user,children}: {children: ReactNode; user: { $id: string; name: string } | null;
  }) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>()




    useEffect(() => {
        if ( !user) return
        if (!apiKey) {
            throw new Error ('Stream Api key missing')
        }

        const client = new StreamVideoClient({
            apiKey,
            user:{
                id: user.$id ||'!anon',
                name:user.name || 'meeting'
                // image: user.imageUrl,
            },
            tokenProvider  
        })
        
        setVideoClient(client)
    },[user])

    if (!videoClient) {
        return <PageLoader/>
    }


    return (
      <StreamVideo client={videoClient}>
            {children}
      </StreamVideo>
    );
  };

