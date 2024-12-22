import React, { useState } from 'react'
import { Task } from '../types'
import { format, getDay, parse, startOfWeek, addMonths, subMonths} from 'date-fns'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { enUS} from 'date-fns/locale'
import './task-calender.css'

import 'react-big-calendar/lib/css/react-big-calendar.css';  
import { EventCard } from './event-card'
import { CustomToolbar } from './custom-toolbar'

const locales = {
    'en-US': enUS,
  }
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })

interface TaskCalenderProps {
    data: Task[]
}

export const TaskCalender = ({data}:TaskCalenderProps) => {
    const [value, setValue] = useState( 
        data.length > 0 ? new Date(data[0].dueDate) : new Date()
    )

    const events = data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id
    }))

    const handleNavigate = (action: 'PREV' | "NEXT" | "TODAY") => {
        if (action === 'PREV') {
            setValue(subMonths(value, 1));
        }else if (action === 'NEXT') {
            setValue(addMonths(value, 1))
        }else if (action === 'TODAY') {
            setValue(new Date())
        }
    }
  return (
    <div>
    <Calendar
      localizer={localizer}
      events={events}
      date={value}
      views={['month']}
      defaultView='month'
      toolbar
      showAllEvents
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat:(date, culture, localizer) => localizer?.format(date, "EEE", culture) ?? ''
      }}
      components={{
        eventWrapper: ({ event}) => (
            <EventCard
            id={event.id}
            title={event.title}
            project={event.project}
            assignee={event.assignee}
            status={event.status}
              />
        ),
        toolbar: () => (
            <CustomToolbar 
            date={value}
            handleNavigate={handleNavigate}
            />
        )
      }}
    />
  </div>
  )
}
