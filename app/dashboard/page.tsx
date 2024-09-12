"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isBefore, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Chart } from "../components/Chart";
const page = () => {
  const MAX_CREDIT_LIMIT = 2;
  const { status } = useSession();
  const [comments, setComments] = useState({
    commentNumbers: [],
    mostAskedQuestion: [],
    summary: "",
  });
  const [inputLink, setInputLink] = useState("");
  const [noCredits, setNoCredits] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<
    | {
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        credits: number;
        createdAt: Date;
        updatedAt: Date;
      }
    | undefined
  >();
  const router = useRouter();
  if (status === "unauthenticated") router.replace("/api/auth/signin");
  const showModal = () => {
    //Todo - show modal here
    console.log("You dont have enough credits");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user?.credits === 0) {
      setNoCredits(true);
      return;
    }
    if (inputLink.length == 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/?url=${inputLink}`);
      const data = await res.json();
      if (data.message === "Not enough credits") {
        showModal();
      }
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
      setInputLink("");
    }
  };
  let userData;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/getUser");

        if (res.status === 401 || !res) {
          router.replace("/api/auth/signin");
        } else {
          userData = await res.json();
          const lastUpdated = new Date(userData.updatedAt);
          const yesterday = subDays(new Date(), 1);

          if (
            userData.credits < MAX_CREDIT_LIMIT &&
            isBefore(lastUpdated, yesterday)
          ) {
            const updateRes = await fetch("/api/updateUserCredits");

            if (updateRes.ok) {
              const updatedUser = await updateRes.json();
              setUser(updatedUser);
            } else {  
              console.error(
                "Failed to update user credits:",
                updateRes.statusText
              );
            }
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [router, comments.summary]);

  return (
    <div className=" w-full min-h-screen bg-neutral-900 text-white flex  justify-center items-center">
      <div className=" max-w-7xl  items-center justify-center flex flex-col pt-[100px] min-h-screen  gap-x-4">
        <form onSubmit={handleSubmit} className="space-y-2 w-96">
          <Input
            type="text"
            placeholder="Paste YouTube link here"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 text-center"
          />
          {!loading ? (
            <Button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Generate
            </Button>
          ) : (
            <Button
              disabled={true}
              type="submit"
              className="w-full bg-green-600 text-white"
            >
              Generating <Loader2 className="ml-2 animate-spin size-5" />
            </Button>
          )}

          {user && (
            <h1 className=" font-semibold text-zinc-300">
              Remaining credits: {user?.credits}
            </h1>
          )}
          {noCredits && (
            <h1 className=" text-red-500 font-semibold w-full text-center">
              You don't have enough credits!
            </h1>
          )}
        </form>

        <div className=" flex  gap-x-4 p-2 ">
          {Array.isArray(comments.mostAskedQuestion) &&
            comments.mostAskedQuestion.length > 0 && (
              <div className="w-[300px] p-2 rounded my-2 bg-orange-700/70 flex flex-col gap-y-1">
                <h1 className="font-semibold">
                  Most Asked Question in Comments
                </h1>
                {comments.mostAskedQuestion.map((comment: string, i) => (
                  <span key={i}>
                    {i + 1}.{" "}
                    {comment.replaceAll("&#39;", "'").replaceAll("<br/>", "")}
                  </span>
                ))}
              </div>
            )}
          {typeof comments.summary === "string" &&
            comments.summary.length > 1 && (
              <div className="w-[300px] p-2 rounded my-2 bg-neutral-700/70 flex flex-col gap-y-1">
                <h1 className="font-semibold">
                  Summary with Sentiment Analysis
                </h1>
                <span>
                  {comments.summary
                    .replaceAll("*", "")
                    .replaceAll("&#39;", "'")}
                </span>
              </div>
            )}
          {(comments.commentNumbers[0] > 1 ||
            comments.commentNumbers[1] > 1) && (
            <div className=" rounded my-2 flex flex-col gap-y-1">
              <Chart
                negativePercentage={Math.floor(
                  (comments.commentNumbers[1] /
                    (comments.commentNumbers[0] +
                      comments.commentNumbers[1] +
                      comments.commentNumbers[2])) *
                    100
                )}
                positivePercentage={Math.floor(
                  (comments.commentNumbers[0] /
                    (comments.commentNumbers[0] +
                      comments.commentNumbers[1] +
                      comments.commentNumbers[2])) *
                    100
                )}
                neutralPercentage={Math.floor(
                  (comments.commentNumbers[2] /
                    (comments.commentNumbers[0] +
                      comments.commentNumbers[1] +
                      comments.commentNumbers[2])) *
                    100
                )}
              />
            </div>
          )}
        </div>

        {!comments.summary && <h1>No analysis</h1>}
      </div>
    </div>
  );
};

export default page;
