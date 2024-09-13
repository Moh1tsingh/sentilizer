"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isBefore, subDays } from "date-fns";
import { Loader2, ThumbsUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Chart } from "../components/Chart";
import Image from "next/image";
const page = () => {
  const MAX_CREDIT_LIMIT = 2;
  const { status } = useSession();
  const [ytData, setYtData] = useState({
    videoTitle: "",
    thumbnailUrl: "",
    likeCount: 0,
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
      setYtData(data);
    } catch (error) {
      console.error("Error fetching ytData:", error);
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
  }, [router, ytData.summary]);

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
        {ytData.thumbnailUrl && (
          <div className=" w-3/4 my-5 flex flex-col gap-y-1 items-start">
            <Image
              src={ytData.thumbnailUrl}
              alt={ytData.videoTitle}
              width={800}
              height={350}
              className="w-full rounded-lg"
            />
            <div className=" w-full flex justify-between">
              <h1 className=" font-medium text-xl">{ytData.videoTitle}</h1>
              <p className="flex max-h-7 gap-x-1 mt-1 items-center justify-center font-medium  bg-neutral-700 text-white/80 py-1 px-3 rounded-xl">
                <ThumbsUpIcon className=" size-4" />
                {ytData.likeCount}
              </p>
            </div>
          </div>
        )}

        <div className=" flex  gap-x-4 p-2 ">
          {Array.isArray(ytData.mostAskedQuestion) &&
            ytData.mostAskedQuestion.length > 0 && (
              <div className="w-[300px] max-h-[425px] overflow-auto p-3 rounded my-2 bg-neutral-800 flex flex-col gap-y-1 hide-scrollbar">
                <h1 className="font-semibold">Most Asked Question in Comments</h1>
                {ytData.mostAskedQuestion.map((comment: string, i) => (
                  <span
                    key={i}
                    className=" text-sm border-b border-neutral-600 py-1"
                  >
                    {i + 1}.{" "}
                    {comment.replaceAll("&#39;", "'").replaceAll("<br/>", "")}
                  </span>
                ))}
              </div>
            )}
          {typeof ytData.summary === "string" && ytData.summary.length > 1 && (
            <div className="w-[300px] max-h-[425px] overflow-auto p-3 rounded my-2 bg-neutral-800 flex flex-col gap-y-1 hide-scrollbar">
              <h1 className="font-semibold">Summary with Sentiment Analysis</h1>
              <span className="text-sm">
                {ytData.summary.replaceAll("*", "").replaceAll("&#39;", "'")}
              </span>
            </div>
          )}
          {(ytData.commentNumbers[0] > 1 ||
            ytData.commentNumbers[1] > 1 ||
            ytData.commentNumbers[2] > 1) && (
            <div className=" rounded my-2 flex flex-col gap-y-1">
              <Chart
                negativePercentage={Math.floor(
                  (ytData.commentNumbers[1] /
                    (ytData.commentNumbers[0] +
                      ytData.commentNumbers[1] +
                      ytData.commentNumbers[2])) *
                    100
                )}
                positivePercentage={Math.floor(
                  (ytData.commentNumbers[0] /
                    (ytData.commentNumbers[0] +
                      ytData.commentNumbers[1] +
                      ytData.commentNumbers[2])) *
                    100
                )}
                neutralPercentage={Math.floor(
                  (ytData.commentNumbers[2] /
                    (ytData.commentNumbers[0] +
                      ytData.commentNumbers[1] +
                      ytData.commentNumbers[2])) *
                    100
                )}
              />
            </div>
          )}
        </div>

        {!ytData.summary && <h1>No analysis</h1>}
      </div>
    </div>
  );
};

export default page;
