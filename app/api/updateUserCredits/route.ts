import { getUser } from "@/app/actions";
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore()
  const user = await getUser();
  if (!user)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  const updatedUser = await prisma.user.update({
    where:{
        id:user.id
    },
    data:{
        credits:2
    }
  })
  return NextResponse.json({ updatedUser });
}
