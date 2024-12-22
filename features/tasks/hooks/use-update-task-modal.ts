import {useQueryState, parseAsBoolean, parseAsString} from 'nuqs'

export const useUpdateTaskModal = () => {
    const [taskID, setTaskID] = useQueryState(
        'update-task',
        parseAsString
    )

    const open = (id: string) => setTaskID(id);
    const close = () => setTaskID(null);

    return {
        taskID, open,close, setTaskID
    }
}