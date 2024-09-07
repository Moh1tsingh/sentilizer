"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "./utils/auth"
import { prisma } from "./utils/db"

export async function getUser(){
    const user = await getServerSession(authOptions)
    if(!user) return 

    let dbuser = await prisma.user.findFirst({
        where:{
            id:user.user.id
        }
    })
    return dbuser
}