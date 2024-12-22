'use client'

import React from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"
import { DottedSeparator } from '@/components/_component/dotted-separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {  FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginFormSchema } from '../schemas'
import { useLogin } from '../api/use-login'
import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth'



  

const SignInCard = () => {

    const {mutate, isPending} = useLogin()

        const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues:{
            email: '',
            password: ''
                }
         })

         const onSubmit = (values: z.infer<typeof loginFormSchema>) => {

            console.log(values)
            mutate({json: values})
          }

  return (
    <Card className='w-full  md:w-[480px] border-none shadow-none'>
        <CardHeader className='flex items-center justify-center text-center p-7'>
            <CardTitle className=' text-2xl'>Welcome back <i className='text-[#e09f05]'>!</i></CardTitle>
        </CardHeader>
        <div className='px-7'>
            <DottedSeparator color='#e09f05'/>
        </div>
        <CardContent className='p-7'>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
            name='email'
            control={form.control}
            render={({ field }) => (

                <FormItem>
                <FormControl>
                <Input  
                   disabled={isPending}
                    type='email'
                    placeholder='Enter Email'
                    {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>

            
            )}
            />

        <FormField
            name='password'
            control={form.control}
            render={({ field }) => (

                <FormItem>
                <FormControl>
                <Input  
                      disabled={isPending}
                    type='password'
                    placeholder='Enter password'
                    {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>

            
            )}
            />
        

                <Button className='w-full' disabled={isPending} size='lg'>Login</Button>
        </form>
        </Form>
        </CardContent>

        <CardContent className='p-7 flex flex-col gap-y-4'>
            <Button disabled={isPending} variant='secondary' onClick={() => signUpWithGoogle()}  size='lg' className='w-full'>
            <FcGoogle className=' size-5' />
                Login with Google
                </Button>
            <Button disabled={isPending} variant='secondary' size='lg' onClick={() => signUpWithGithub()} className='w-full'>
                <FaGithub className=' size-5'/>
                Login with Github
                </Button>
        </CardContent>
    </Card>

  )
}

export default SignInCard