// Dashboard page (server component): fetches current user and some counts
// and renders the server-side dashboard layout.
import Sidebar from "@/components/layout/sidebar";
import ProductsChart from "@/components/products-chart";
import { getCurrentuser } from "@/lib/auth"; // server helper to get authenticated user
import prisma from "@/lib/prisma"; // Prisma client singleton for DB access
import { TrendingUp } from "lucide-react";

const DashboardPage = async () => {
  const user = await getCurrentuser();
  // Use optional chaining because `getCurrentuser` may return `null`/`undefined`
  // when no user is signed in. `userId` will be `undefined` in that case.
  const userId = user?.id;

  const [totalProducts, lowStock, allProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    // Count products where quantity is low (at or below 5 units).
    // lowStockAt is an optional threshold field; we use a fixed default of 5
    // for simplicity. Consider using prisma.raw() for per-product thresholds.
    prisma.product.count({
      where: {
        userId,
        quantity: { lte: 5 },
      },
    }),
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ]);

  // Guard: if there's no authenticated user, skip the DB query entirely.
  // This prevents making a query with `userId = undefined` and avoids
  // unnecessary database work. We initialize `totalProducts` to `0`
  // for the unauthenticated case so the rest of the component can
  // render consistently.
  //   let totalProducts = 0;
  //   if (userId) {
  //     // Count products that belong to the current user. This issues a DB
  //     // query via Prisma. The shorthand `{ where: { userId } }` is equivalent to
  //     // `{ where: { userId: userId } }`.
  //     totalProducts = await prisma.product.count({ where: { userId } });
  //   } else {
  //     console.log("No userId found — skipping product count.");
  //   }

  //   const lowStock = await prisma.product.count({
  //     where: {
  //       userId,
  //       lowStockAt: { not: null },
  //       quantity: { lte: 5 },
  //     },
  //   });

  console.log("lowStock:", lowStock);

  const recentProducts = await prisma.product.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log("recentProducts:", recentProducts);

  //   const allProducts = await prisma.product.findMany({
  //     where: { userId },
  //     select: {
  //       price: true,
  //       quantity: true,
  //       createdAt: true,
  //     },
  //   });

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const now = new Date();

  

  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() + 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/{${String(weekStart.getDate().toString()).padStart(2, "0")}}`;

    const weekProducts = allProducts.filter((products) => {
      const productDate = new Date(products.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    console.log(weekProducts, "weekProducts");

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    
    });
    }
    
    console.log(weeklyProductsData, "weeklyProductsData");
  

  return (
    <div className="min-h-screen  bg-gray-100">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* Header */}

        <div className="mb-8 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="md:text-2xl font-semibold text-gray-900">
                Dashboard{" "}
              </h1>
              <div className="text-xs md:text-sm ">
                <p>
                  Welcome Back!{" "}
                  <span className="font-semibold md:text-base text-purple-800">
                    {user?.displayName}
                  </span>
                </p>
                <p>Here is an overview of your inventory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 ">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div className="text-sm">Total Products</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 font-bold">
                    +{totalProducts}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>{" "}
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  ${Number(totalValue).toFixed(0)}
                </div>
                <div className="text-sm">Total Value</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 font-bold">
                    +${Number(totalValue).toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>{" "}
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {lowStock}
                </div>
                <div className="text-sm">Low Stock</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600 font-bold">
                    +{lowStock}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white  rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                New products per week
              </h2>
            </div>
            <div className="h-48">
              <ProductsChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stock Levels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between ">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Levels
              </h2>
            </div>
            <div className="space-y-3">
              {recentProducts.map((prods, i) => {
                const stockLevel =
                  prods.quantity === 0
                    ? 0
                    : prods.quantity <= (prods.lowStockAt || 5)
                    ? 1
                    : 2;

                const bgColors = [
                  "bg-red-600",
                  "bg-yellow-600",
                  "bg-green-600",
                ];
                const textColors = [
                  "text-red-600",
                  "text-yellow-600",
                  "text-green-600",
                ];

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColors[stockLevel]} ${textColors[stockLevel]}`}
                      />
                      <span className="text-sm font-medium ">{prods.name}</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${textColors[stockLevel]}`}>
                      {prods.quantity} units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
