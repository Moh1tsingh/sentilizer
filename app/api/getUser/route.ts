import { getUser } from "@/app/actions";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
export async function GET() {
  noStore()
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
