import { Hono } from "hono";
import {z} from 'zod'
import {zValidator} from '@hono/zod-validator'
import { SignUpFormSchema, loginFormSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import {deleteCookie, setCookie} from 'hono/cookie'
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { redirect } from "next/navigation";

const app = new Hono()




.get(
    "/current", sessionMiddleWare, (c) => {
        const user = c.get('user')

        return c.json({data: user})

    }
)


.post(
    "/login",
 zValidator('json', loginFormSchema), 
async (c) => {
    const {email, password } = c.req.valid('json')
      // Connecting to DB or creating Appwrite client
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(
          email,
          password
      )

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/space",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
     })

    //  redirect("/");
    return c.json({success: true})
})


.post(
    "/register",
 zValidator('json', SignUpFormSchema), 
async (c) => {
    const  {  name, email,  password } = c.req.valid('json')
    console.log({ name, email, password });

    // Ensure data is valid (you may want to validate again here as a safety net)
    if (!email || !name || !password) {
        return c.json({ error: 'Missing required fields' }, { status: 400 });
        }

     // Connecting to DB or creating Appwrite client
    const { account } = await createAdminClient();

    // Create user with proper argument order
    await account.create(
        ID.unique(),
        email,
        password,
        name,
    )

    const session = await account.createEmailPasswordSession(
        email,
        password
    )

 setCookie(c, AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
 })
    
    //   redirect("/account");

    return c.json({success: true})
})


.post("/logout", sessionMiddleWare, async (c) => {
    const account = c.get('account')
    deleteCookie(c, AUTH_COOKIE)
    await account.deleteSession('current')

    return c.json({success: true})
})

export default app;