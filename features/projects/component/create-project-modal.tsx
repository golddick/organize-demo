'use client'

import { ResponsiveModal } from '@/components/_component/responsiveModal/Responsive-modal'
import React from 'react'
import { useCreateProjectModal } from '../hooks/use-create-project-modal'
import { CreateProjectForm } from './create-project-form'

export const CreateProjectModal = () => {
    const { isOpen, setIsOpen, close , open} = useCreateProjectModal()
  return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateProjectForm onCancel={close} />
        </ResponsiveModal>
  )
}
