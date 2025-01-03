import { useParams } from "next/navigation"

export const useCallID = () => {
 const params = useParams()
 return params.callID as string
}
  