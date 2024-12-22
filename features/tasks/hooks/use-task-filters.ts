import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'
import { TaskStatus } from '../types'


export const useTaskFilters = () => {
  return useQueryStates ({
    projectID : parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeID: parseAsString,
    dueDate: parseAsString,
    search: parseAsString
  }
  )
}
