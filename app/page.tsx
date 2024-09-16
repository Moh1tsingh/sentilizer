"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart, MessageCircle, Zap } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LandingPage() {
  const session = useSession();
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-neutral-100">
      <main className="flex-1">
        <section className="w-full mt-16 py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  YouTube Comment Sentiment Analyzer
                </h1>
                <p className="mx-auto max-w-[700px] text-neutral-400 md:text-xl">
                  Unlock the power of AI to analyze YouTube comments. Understand
                  sentiment, identify trends, and engage with your audience like
                  never before.
                </p>
              </div>
              <div className="space-x-4">
                {!session.data?.user ? (
                  <Button
                    size="lg"
                    className=" bg-white text-black hover:bg-neutral-300"
                    onClick={() =>
                      signIn("google", { callbackUrl: "/dashboard" })
                    }
                  >
                    Sign Up Free
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className=" bg-neutral-100 text-black hover:bg-neutral-300"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-neutral-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Senitlizer Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="bg-neutral-700 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-6 h-6 mr-2" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Visualize comment sentiment with an intuitive pie chart
                  showing positive, negative, and neutral feedback distribution.
                </CardContent>
              </Card>
              <Card className="bg-neutral-700 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-6 h-6 mr-2" />
                    Top Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Identify the most frequently asked questions in your video
                  comments to improve your content and boost engagement.
                </CardContent>
              </Card>
              <Card className="bg-neutral-700 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Trend Identification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Spot emerging trends and topics in your comments to stay ahead
                  of your audience's interests and address their concerns
                  proactively.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-neutral-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How Senitlizer Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-4 lg:gap-12">
              <Card className="bg-neutral-800 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-600 text-neutral-100">
                      1
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                  <p>
                    Create your free Senitlizer account to get started with
                    YouTube comment analysis.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-800 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-600 text-neutral-100">
                      2
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Enter YouTube URL
                  </h3>
                  <p>
                    Paste the URL of any YouTube video you want Senitlizer to
                    analyze.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-800 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-600 text-neutral-100">
                      3
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                  <p>
                    Senitlizer's AI processes the comments, analyzing sentiment
                    and identifying key questions and trends.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-neutral-800 text-neutral-100 border-none">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center ">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-600 text-neutral-100">
                      4
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="text-xl font-semibold mb-2">View Insights</h3>
                  <p>
                    Get a comprehensive Senitlizer report with visualizations
                    and actionable insights for your video.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Zap className="h-12 w-12 text-neutral-400" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Free Credits System
              </h2>
              <p className="max-w-[700px] text-neutral-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start using Senitlizer for free. Every user receives 2 credits
                per day, and each video analysis uses 1 credit.
              </p>
              <Button
                size="lg"
                className="px-2 bg-neutral-100 text-black hover:bg-neutral-300"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Sign Up and Get Your Free Senitlizer Credits
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
