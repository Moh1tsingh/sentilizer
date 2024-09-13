import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function Chart({
  positivePercentage,
  negativePercentage,
  neutralPercentage,
}: {
  positivePercentage: Number;
  negativePercentage: Number;
  neutralPercentage:Number
}) {
  const data = [
    { name: "Positive Comments", value: positivePercentage },
    { name: "Negative Comments", value: negativePercentage },
    { name: "Neutral Comments", value: neutralPercentage },
  ];
  const COLORS = ["#008000", "#ba181b", "#1a5b92"];

  return (
    <Card className=" bg-neutral-800 outline-none border-none">
      <CardHeader>
        <CardTitle className=" text-white">Sentiment Analysis</CardTitle>
        <CardDescription className=" text-zinc-500">
          Comparison of Positive, Negative and Neutral Comments
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 w-full my-3 py-0">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={130}
              label
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
