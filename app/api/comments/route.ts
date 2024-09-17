import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/app/actions";
import { unstable_noStore as noStore } from "next/cache";
import {prisma} from "@/app/utils/db";

export async function GET(req: NextRequest) {
  noStore();
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

    const [videoData, commentsData] = await Promise.all([
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoID}&key=${process.env.YOUTUBE_API_KEY}`
      ).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch video details");
        return res.json();
      }),
      fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${process.env.YOUTUBE_API_KEY}&maxResults=100`
      ).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
      }),
    ]);

    const videoInfo = videoData.items[0];
    const videoTitle = videoInfo.snippet.title;
    const thumbnails = videoInfo.snippet.thumbnails;
    const thumbnailUrl = thumbnails.maxres
      ? thumbnails.maxres.url
      : thumbnails.high.url;
    const likeCount = videoInfo.statistics.likeCount;

    const comments = commentsData.items.map(
      (item: any) => item.snippet.topLevelComment.snippet.textDisplay
    );

    const commentString = comments.join(" | ");

    const [sentimentResponse, questionsResponse, summaryResponse] =
      await Promise.all([
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `i am providing you comments of a youtube video you have to tell me how many are positive and how many are negative and neutral. Your response should only contain three numbers nothing other than that example - '[20,50,30]'. i will directly use 'res.split(',')' to get the tree values. (The comments are separated by ' | ') => ${commentString}`,
                    },
                  ],
                },
              ],
            }),
          }
        ).then((res) => res.json()),
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `I am providing you some comments of a particular youtube video, I want you to give me all the asked questions from them, you can skip the ones which have too many emojis or some unreadable texts like codes.Remember the result you will give should only contain questions nothing other than that. Give the result as ' | ' separated comments which i can put into res.split(' | ') and get the array of comments. Here are the comments (which are separated by ' | ') ${commentString}`,
                    },
                  ],
                },
              ],
            }),
          }
        ).then((res) => res.json()),
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `I am providing you some comments of a particular youtube video, I want you to make a summary (around 100-150 words) based on your sentiment analysis of those comments. Here are the comments (which are separated by ' | ') = ${commentString}`,
                    },
                  ],
                },
              ],
            }),
          }
        ).then((res) => res.json()),
      ]);

    const commentNumbers =
      sentimentResponse.candidates?.[0]?.content?.parts?.[0]?.text
        .replace(/\[|\]/g, "")
        .split(",")
        .map(Number) || [0, 0, 0];
    const mostAskedQuestion =
      questionsResponse.candidates?.[0]?.content?.parts?.[0]?.text.split(
        " | "
      ) || ["No most asked questions found"];
    const summary = summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (
      commentNumbers[0] > 1 ||
      commentNumbers[1] > 1 ||
      commentNumbers[2] > 1
    ) {
      await prisma.user.update({
        where: { id: user?.id },
        data: { credits: user?.credits! - 1 },
      });
    }

    return NextResponse.json({
      videoTitle,
      thumbnailUrl,
      likeCount,
      commentNumbers,
      mostAskedQuestion,
      summary,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
