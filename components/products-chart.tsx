"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface IChartData {
  week: string;
  products: number;
}

const ProductsChart = ({ data }: { data: IChartData[] }) => {
  return (
    <div className="h-48 w-full ">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 3, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" stroke="#654" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} allowDecimals={false} />
          <Area
            type="monotone"
            dataKey="products"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductsChart;
