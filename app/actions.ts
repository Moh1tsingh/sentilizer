"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "./utils/auth"

export async function getUser(){
    const user = await getServerSession(authOptions)
    if(user) return user
    else return null
}