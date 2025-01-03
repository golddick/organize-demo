import { useParams } from "next/navigation"

export const useMeetingID = () => {
 const params = useParams()
 return params.meetingID as string
}
