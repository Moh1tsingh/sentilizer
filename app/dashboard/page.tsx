"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isBefore, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
const page = () => {
  const MAX_CREDIT_LIMIT = 2;
  const { status } = useSession();
  const [comments, setComments] = useState({
    positiveComments: [],
    negativeComments: [],
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
    const res = await fetch(`/api/comments/?url=${inputLink}`);
    const data = await res.json();
    if (data.message === "Not enough credits") {
      showModal();
    }

    setComments(data);
    setLoading(false);
    setInputLink("");
  };
  let userData;
  let data;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/getUser");

        if (res.status === 401) {
          router.replace("/api/auth/signin");
        } else if (!res.ok) {
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
          data = {
            labels: ["Positive", "Negative"],
            datasets: [
              {
                label: "Comments",
                data: [
                  (
                    (comments.positiveComments.length /
                      (comments.positiveComments.length +
                        comments.negativeComments.length)) *
                    100
                  ).toFixed(2),
                  (
                    (comments.negativeComments.length /
                      (comments.positiveComments.length +
                        comments.negativeComments.length)) *
                    100
                  ).toFixed(2),
                ],
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
              },
            ],
          };
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
        {comments && (
          <div className=" flex  gap-x-4 p-2 ">
            {comments.positiveComments.length > 1 && (
              <div className=" w-[300px] p-2 rounded my-2 bg-green-700/70 flex flex-col gap-y-1">
                <h1 className=" font-semibold">Positive Comments</h1>
                {Array.isArray(comments.positiveComments) &&
                  comments.positiveComments.length > 0 &&
                  comments.positiveComments.map((comment: string, i) => {
                    return (
                      <span>
                        {i + 1}
                        {". "}
                        {comment
                          .replaceAll("&#39;", "'")
                          .replaceAll("<br/>", "")}
                      </span>
                    );
                  })}
              </div>
            )}
            {comments.negativeComments.length > 1 && (
              <div className="w-[300px] p-2 rounded my-2 bg-red-800/70 flex flex-col gap-y-1">
                <h1 className=" font-semibold">Negative Comments</h1>
                {Array.isArray(comments.negativeComments) &&
                  comments.negativeComments.length > 1 &&
                  comments.negativeComments.map((comment: string, i) => {
                    return (
                      <span>
                        {i + 1}
                        {". "}
                        {comment
                          .replaceAll("&#39;", "'")
                          .replaceAll("<br/>", "")}
                      </span>
                    );
                  })}
              </div>
            )}
            {comments.mostAskedQuestion.length > 1 && (
              <div className="w-[300px] p-2 rounded my-2 bg-orange-700/70 flex flex-col gap-y-1">
                <h1 className=" font-semibold">
                  Most Asked Question in Comments
                </h1>
                {Array.isArray(comments.mostAskedQuestion) &&
                  comments.mostAskedQuestion.length > 0 &&
                  comments.mostAskedQuestion.map((comment: string, i) => {
                    return (
                      <span>
                        {i + 1}
                        {". "}
                        {comment
                          .replaceAll("&#39;", "'")
                          .replaceAll("<br/>", "")}
                      </span>
                    );
                  })}
              </div>
            )}
            {comments.summary.length > 1 && (
              <span className="w-[300px] p-2 rounded my-2 bg-neutral-700/70 flex flex-col gap-y-1">
                <h1 className=" font-semibold">
                  Summary with Sentiment Analysis{" "}
                </h1>
                {comments.summary &&
                  comments.summary.replaceAll("*", "").replaceAll("&#39;", "'")}
              </span>
            )}
          </div>
        )}
        <div>
          {(comments.negativeComments.length > 1 ||
            comments.positiveComments.length > 1) && (
            <div className="w-[300px] p-2 rounded my-2 bg-neutral-700/70 flex flex-col gap-y-1">
              <h1 className=" font-semibold">Ratio of Positive - Negative</h1>
              <h1 className=" font-semibold text-green-400">
                {(
                  (comments.positiveComments.length /
                    (comments.positiveComments.length +
                      comments.negativeComments.length)) *
                  100
                ).toFixed(2)}
              </h1>
              <h1 className=" font-semibold text-red-400">
                {(
                  (comments.negativeComments.length /
                    (comments.positiveComments.length +
                      comments.negativeComments.length)) *
                  100
                ).toFixed(2)}
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
