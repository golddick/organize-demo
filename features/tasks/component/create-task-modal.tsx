'use client'

import { ResponsiveModal } from '@/components/_component/responsiveModal/Responsive-modal'
import React from 'react'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import { CreateTaskFormWrapper } from './create-task-form-wrapper'

export const CreateTaskModal = () => {
    const { isOpen, setIsOpen, close , open} = useCreateTaskModal()
  return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateTaskFormWrapper onCancel={close}/>
        </ResponsiveModal>
  )
}
