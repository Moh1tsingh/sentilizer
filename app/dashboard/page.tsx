"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
const page = () => {
  const { status } = useSession();
  const [comments, setComments] = useState<any[]>([]);
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
    setComments(data.data.items);
    setLoading(false);
    setInputLink("");
  };
  return (
    <div className=" w-full min-h-screen bg-neutral-900 text-white flex flex-col justify-center items-center">
      <div className=" max-w-7xl h-[600px] items-center flex gap-x-4">
        {comments.length > 0 && (
          <div className=" w-[500px] max-h-[600px] overflow-auto flex flex-col gap-y-2 p-2">
            {comments.map((comment, i) => {
              return (
                <div className=" text-white bg-neutral-800 rounded-sm">
                  {i}-{comment.snippet.topLevelComment.snippet.textOriginal}
                </div>
              );
            })}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default page;
