"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
const page = () => {
  const { status } = useSession();
  const [comments, setComments] = useState({
    positiveComments: [],
    negativeComments: [],
    mostAskedQuestion: [],
    summary: "",
  });
  const router = useRouter();
  if (status === "unauthenticated") router.replace("/api/auth/signin");
  const [inputLink, setInputLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputLink.length == 0) return;
    setLoading(true);
    const res = await fetch(`/api/comments/?url=${inputLink}`);
    const data = await res.json();
    setComments(data);
    console.log(data);
    setLoading(false);
    setInputLink("");
  };
  return (
    <div className=" w-full min-h-screen bg-neutral-900 text-white flex  justify-center items-center">
      <div className=" max-w-7xl  items-center justify-center flex flex-col  gap-x-4">
        <form onSubmit={handleSubmit} className="space-y-2 w-96">
          <Input
            type="text"
            placeholder="Paste YouTube link here"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 text-center"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white"
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </form>
        {comments && (
          <div className=" flex  gap-x-4 p-2 ">
            <div className=" w-[300px] p-2 rounded my-2 bg-green-700/70">
              <h1>Positive Comments</h1>
              {Array.isArray(comments.positiveComments) &&
                comments.positiveComments.map((comment, i) => {
                  return (
                    <div>
                      {i + 1} {comment}
                    </div>
                  );
                })}
            </div>
            <div className="w-[300px] p-2 rounded my-2 bg-red-800/70">
              <h1>Negative Comments</h1>
              {Array.isArray(comments.negativeComments) &&
                comments.negativeComments.map((comment, i) => {
                  return (
                    <div>
                      {i + 1} {comment}
                    </div>
                  );
                })}
            </div>
            <div className="w-[300px] p-2 rounded my-2 bg-orange-700/70">
              <h1>Most Asked Question in Comments</h1>
              {Array.isArray(comments.mostAskedQuestion) &&
                comments.mostAskedQuestion.map((comment, i) => {
                  return (
                    <div>
                      {i + 1} {comment}
                    </div>
                  );
                })}
            </div>
            <div className="w-[300px] p-2 rounded my-2 bg-neutral-700/70">
              <h1>Summary with Sentiment Analysis </h1>
              {comments.summary.replace("**", "") ?? ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
