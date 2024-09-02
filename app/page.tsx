import { getServerSession } from "next-auth";
export default async function Home() {
  // const session = await getServerSession(authOptions);
  return (
    <div className=" w-full min-h-screen">
      <div className=" w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 ">
        <h1 className=" text-4xl font-semibold text-white">
          Utilize the sentiments of your audience
        </h1>
      </div>
    </div>
  );
}
