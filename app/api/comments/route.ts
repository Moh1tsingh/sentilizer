import { NextRequest, NextResponse } from "next/server";
import fs from "fs"

export async function GET(req: NextRequest) {
  const link = req.nextUrl.searchParams.get("url");
  if (!link) return NextResponse.json({ message: "Invalid Request" });
  try {
    const urlObj = new URL(link);
    const videoID = urlObj.searchParams.get("v");
    if (!videoID) throw new Error("Invalid YouTube URL");

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${process.env.YOUTUBE_API_KEY}&maxResults=100`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await res.json();
    let comments:string[] = []
    comments = [
      ...comments,
      ...data.items.map(
        (item:any) => item.snippet.topLevelComment.snippet.textDisplay
      ),
    ];
    let totalComment = comments.join(",")
    fs.writeFile("comments.txt", totalComment , (err)=>{
      if(err) return NextResponse.json({message:"Error fetching or storing comments"})
    });
    return NextResponse.json({ data });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
