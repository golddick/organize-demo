import { useParams } from "next/navigation";

import React from 'react'

export const useTaskID = () => {
  const  params = useParams()
  return params.taskID as string
}
