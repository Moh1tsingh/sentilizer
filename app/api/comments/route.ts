import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/actions";
import { prisma } from "@/app/utils/db";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (user?.credits === 0)
    return NextResponse.json(
      { message: "Not enough credits" },
      { status: 500 }
    );
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
    let comments: string[] = [];
    comments = [
      ...comments,
      ...data.items.map(
        (item: any) => item.snippet.topLevelComment.snippet.textDisplay
      ),
    ];
    //Gemini api call

    let text0 =
      "i am providing you comments of a youtube video you have to tell me how many are positive and how many are negative and neutral. Your response should only contain three numbers nothing other than that example - '[20,50,30]'. i will directly use 'res.split(',')' to get the tree values. (The comments are separated by ' | ') => " +
      comments.join(" | ");

    const requestBody0 = {
      contents: [
        {
          parts: [{ text: text0 }],
        },
      ],
    };

    let text3 =
      "I am providing you some comments of a particular youtube video, I want you to give me all the most asked questions from them, you can skip the ones which have too many emojis or some unreadable texts like codes.Remember the result you will give should only contain questions nothing other than that. Give the result as ' | ' separated comments which i can put into res.split(' | ') and get the array of comments. Here are the comments (which are separated by ' | ') " +
      comments.join(" | ");

    const requestBody3 = {
      contents: [
        {
          parts: [{ text: text3 }],
        },
      ],
    };

    let text4 =
      "I am providing you some comments of a particular youtube video, I want you to make a summary (around 100-150 words) based on your sentiment analysis of those comments. Here are the comments (which are separated by ' | ') = " +
      comments.join(" | ");

    const requestBody4 = {
      contents: [
        {
          parts: [{ text: text4 }],
        },
      ],
    };

    const response0 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody0),
      }
    );

    const response3 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody3),
      }
    );

    const response4 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody4),
      }
    );
    const finalResponse0 = await response0.json();
    const finalResponse3 = await response3.json();
    const finalResponse4 = await response4.json();
    const commentNumbers =
      finalResponse0.candidates?.[0]?.content?.parts?.[0]?.text
        .replace(/\[|\]/g, "")
        .split(",")
        .map(Number) || 0;
    const mostAskedQuestion =
      finalResponse3.candidates?.[0]?.content?.parts?.[0]?.text.split(" | ") ||
      "No most asked questions found";
    const summary = finalResponse4.candidates?.[0]?.content?.parts?.[0]?.text;

    if (
      commentNumbers[0] > 1 ||
      commentNumbers[1] > 1 ||
      commentNumbers[2] > 1
    ) {
      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          credits: user?.credits! - 1,
        },
      });
    }
    return NextResponse.json({
      commentNumbers,
      mostAskedQuestion,
      summary,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
