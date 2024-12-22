'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ErrorPage = () => {
  return (
    <div className='h-screen flex gap-y-4 flex-col items-center justify-center'>
        <AlertTriangle className=' size-7'/>
        <p className='text-sm text-muted-foreground'>something went wrong</p>
        <Button asChild variant='secondary' size='sm' >
            <Link href='/space'>Back to home</Link>
        </Button>
    </div>
  )
}

export default ErrorPage