import React, {useCallback, useState, useEffect} from 'react'
import { Task, TaskStatus } from '../types'
import { DragDropContext , Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import { KanbanColumnHeader } from './KanbanColumnHeader';
import { KanbanCard } from './kanban-card';

const boards: TaskStatus[] =[
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,

]

type TasksState = {
    [key in TaskStatus] : Task[]
}

interface TaskKanbanProps {
    data: Task[]
    onChange: (task:{$id: string; status: TaskStatus; position: number}[]) => void
}

export const TaskKanban = ({data, onChange}:TaskKanbanProps) => {
    const [tasks, setTasks] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        }

        data.forEach((task) => {
            initialTasks[task.status].push(task)
        })

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        })

        return initialTasks
    })

    useEffect(() => {
        const newTask: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        }

        data.forEach((task) => {
            newTask[task.status].push(task)
        })

        Object.keys(newTask).forEach((status) => {
            newTask[status as TaskStatus].sort((a, b) => a.position - b.position)
        })

        setTasks(newTask)

    }, [data])


    const onDragEnd = useCallback((result: DropResult) => {
        // If there's no destination, return early (nothing to do)
        if (!result.destination) return;
    
        const { destination, source } = result;
    
        // Get the source and destination status (columns)
        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;
    
        // Early exit if the task is dropped in the same position
        if (sourceStatus === destStatus && source.index === destination.index) return;
    
        // Create the updates payload that will be used to update the status and position
        let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];
    
        // Set the tasks state (immutable update)
        setTasks((prevTasks) => {
            // Clone the previous tasks structure
            const newTasks = { ...prevTasks };
    
            // Remove the task from the source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            if (!movedTask) {
                console.error('No task found at the source index')
                return prevTasks;
            }

            const updatedMovedTask = sourceStatus !== destStatus ?
            { ...movedTask, status: destStatus } : movedTask
    
    
            // Add the updated columns back to the new tasks object
            newTasks[sourceStatus] = sourceColumn;

             // Add the task to the destination column (insert it at the destination index)
             const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index, 0, updatedMovedTask);

            newTasks[destStatus] = destColumn;

            // prepare minimal update payload

            updatesPayload = []
    
            // Create the payload with the updated status and position for the moved task
            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destStatus, 
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            });
    
            return newTasks;
        });
        

        onChange(updatesPayload)

        if (updatesPayload.length > 0) {
            // Make an API call or update the backend with the updatesPayload
            console.log('Updated tasks:', updatesPayload);
        }
    }, [onChange]);
    
  return (
    <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex overflow-x-auto'>
                {boards.map((board) => {
                    return(
                        <div key={board} className='flex-1 mx-2 bg-muted p-2 rounded-md min-w-[200px]'>
                            <KanbanColumnHeader board={board} taskCount={tasks[board].length}/>
                            <Droppable droppableId={board}>
                            {(provided) => (
                                <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="min-h-[200px] py-1"
                                >
                                {tasks[board].map((task, index) => (
                                    <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                    {(provided) => (
                                        <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        > 
                                            <KanbanCard task={task}/>
                                        </div>
                                    )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                </div>
                            )}
                            </Droppable>

                        </div>
                    )
                })}
        </div>
    </DragDropContext>
  )
}
