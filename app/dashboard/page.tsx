"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isBefore, subDays } from "date-fns";
import { Github, GithubIcon, Loader2, ThumbsUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Chart } from "../components/Chart";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
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
    toast.error("Not Enough Credits.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user?.credits === 0) {
      showModal();
      return;
    }
    if (inputLink.length == 0) {
    
      toast.error("Please enter valid url.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    };
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/?url=${inputLink}`);
      const data = await res.json();
      if (data.message === "Not enough credits") {
        showModal();
      }else if (data.message === "Invalid Request") {
        toast.error("Please enter valid url.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setYtData(data);
    } catch (error) {
      console.error("Error fetching ytData:", error);
    } finally {
      setLoading(false);
      setInputLink("");
    }
  };
  
  useEffect(() => {
    let userData;
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
    <div className=" w-full min-h-screen bg-neutral-900 bg-grid-white/[0.05]  text-white flex overflow-hidden  justify-center items-center">
      <div className="absolute  h-full pointer-events-none inset-0 flex items-center justify-center   [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"></div>
      <div className=" max-w-7xl  items-center justify-center flex flex-col pt-[100px] min-h-screen  gap-x-4 ">
        {!ytData.summary && (
          <h1 className=" absolute top-60 max-sm:top-[8rem] max-sm:w-full max-sm:text-center max-sm:text-3xl text-balance  text-5xl font-semibold tracking-tight text-white/90">
            Paste video url to start the analysis
          </h1>
        )}
        {!ytData.thumbnailUrl ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-2 w-[500px] max-sm:w-full max-sm:-mt-20"
          >
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
            <div className="w-[300px] sm:w-full text-wrap bg-neutral-700/60 p-2 rounded-lg text-neutral-300">
              <p className="w-full text-xs">
                Disclaimer: Currently Sentilizer only uses 100 comments for
                sentiment analysis. <br /> Sentilizer only works on Youtube
                videos and shorts.
              </p>
            </div>
          </form>
        ) : (
          <Button
            className=" bg-green-600 hover:bg-green-700"
            onClick={() => window.location.reload()}
          >
            Generate another analysis
          </Button>
        )}
        {ytData.thumbnailUrl && (
          <div className=" w-3/4 max-sm:w-11/12 my-5 flex flex-col gap-y-1 items-start">
            <Image
              src={ytData.thumbnailUrl}
              alt={ytData.videoTitle}
              width={800}
              height={350}
              className="w-full rounded-lg"
            />
            <div className=" w-full flex justify-between">
              <h1 className=" font-medium text-xl max-sm:text-sm">
                {ytData.videoTitle}
              </h1>
              <p className="flex max-h-7 gap-x-1 mt-1 items-center justify-center font-medium  bg-neutral-700 text-white/80 py-1 px-3 rounded-xl">
                <ThumbsUpIcon className=" size-4" />
                {ytData.likeCount}
              </p>
            </div>
          </div>
        )}

        <div className=" flex  gap-x-4 p-2 max-sm:flex-col max-sm:items-center text-white/85 ">
          {Array.isArray(ytData.mostAskedQuestion) &&
            ytData.mostAskedQuestion.length > 0 && (
              <div className="w-[300px] max-sm:w-[320px] max-h-[435px] overflow-auto p-3 rounded my-2 bg-neutral-800 flex flex-col gap-y-1 hide-scrollbar">
                <h1 className="font-semibold">
                  Most Asked Question in Comments
                </h1>
                {ytData.mostAskedQuestion.map((comment: string, i) => (
                  <span
                    key={i}
                    className=" text-sm  border-b border-neutral-600 py-1"
                  >
                    {i + 1}.{" "}
                    {comment
                      .replaceAll("&#39;", "&apos;")
                      .replaceAll("<br/>", "")
                      .replaceAll("&quot;", '"')}
                  </span>
                ))}
              </div>
            )}
          {typeof ytData.summary === "string" && ytData.summary.length > 1 && (
            <div className="w-[300px] max-sm:w-[320px] max-h-[435px] overflow-auto p-3 rounded-md my-2 bg-neutral-800 flex flex-col gap-y-1 hide-scrollbar">
              <h1 className="font-semibold">Summary with Sentiment Analysis</h1>
              <span className="text-sm">
                {ytData.summary
                  .replaceAll("*", "")
                  .replaceAll("&#39;", "&apos;")}
              </span>
            </div>
          )}
          {ytData.commentNumbers &&
            (ytData.commentNumbers[0] > 1 ||
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
      </div>
      <ToastContainer />
      <div className="absolute z-10 left-1/2 bottom-1 -translate-x-1/2 max-sm:text-xs max-sm:text-nowrap max-sm:bottom-3  ">
        Developed by{" "}
        <a className="font-medium text-cyan-200" href="https://www.github.com/moh1tsingh">
          Mohitsingh Thakur.
        </a>
      </div>
    </div>
  );
};

export default Page;
