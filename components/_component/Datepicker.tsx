"use client"



import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 


interface DatePickerProps {
    value: Date | undefined
    onChange: (date: Date | null) => void;
    className?: string;
    placeholder?: string
}

const DateTimePicker = ({value, onChange, className, placeholder = 'select date'}:DatePickerProps) => {

  return (
    <div className=' w-full  border border-input  flex items-start justify-between rounded-lg  overflow-hidden focus:ring-0 ring-0 focus-visible:outline-none focus-visible:ring-0'>
      <DatePicker
        className={cn(' w-full lg:w-[400px]  px-2 focus:ring-0 ring-0 focus-visible:outline-none focus-visible:ring-0 ml-2 ', className) }
        showIcon
        isClearable
        selected={value}
        onChange={onChange} // Handle date change
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15} // Time intervals (e.g., every 15 minutes)
        dateFormat="MMMM d, yyyy h:mm aa" // Format both date and time
        timeCaption="Time"
        placeholderText={placeholder}
        icon= {<CalendarIcon className="mr-2 pr-3 mb-[-10px]" />}
      />
    </div>
  );

};

export default DateTimePicker;

