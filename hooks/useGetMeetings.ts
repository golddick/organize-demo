
import { getCurrent } from "@/features/auth/queries";
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import React, { useEffect, useState } from 'react'



interface UseGetMeetingProps {
    id: string;
  }

export const useGetMeeting = ({id}:UseGetMeetingProps) => {
const [call, setCall] = useState<Call[]>([])
const client = useStreamVideoClient()
const [isCallLoading, setIsCallLoading] = useState(false)
const workspaceID= useWorkspaceID()
console.log('d id',id)

useEffect(() => {
    
    const loadMeetings = async () => {
        if(!client ||!id) return
        setIsCallLoading(true)
        
        try {


        const { calls } = await client.queryCalls({
           sort:[{field:'starts_at', direction:1}],
           filter_conditions:{
            'starts_at':{$exists: true},
            $or:[
                {created_by_user_id: id},
                {members: {$in:[workspaceID]}},
                { 'workspace': workspaceID,}
            ]
           }
          });
        setCall(calls)
    } catch (error) {
        console.log(error)
    } finally{
        setIsCallLoading(false)
    }
}

loadMeetings()
}, [client,id])

const now = new Date()

const endedCalls = call.filter(({state: {startsAt, endedAt}}: Call) => {
    return ( startsAt && new Date(startsAt) < now || !!endedAt )
})
const upcomingCalls = call.filter(({state: {startsAt, endedAt}}: Call) => {
    return ( startsAt && new Date(startsAt) >= now && !endedAt )
})




return {endedCalls,upcomingCalls,callRecordings:call ,isCallLoading}
}
