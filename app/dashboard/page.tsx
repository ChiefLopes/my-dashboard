// Dashboard page (server component): fetches current user and some counts
// and renders the server-side dashboard layout.
import Sidebar from "@/components/layout/sidebar";
import { getCurrentuser } from "@/lib/auth"; // server helper to get authenticated user
import prisma from "@/lib/prisma"; // Prisma client singleton for DB access
import { TrendingUp } from "lucide-react";

const DashboardPage = async () => {
  const user = await getCurrentuser();
  // Use optional chaining because `getCurrentuser` may return `null`/`undefined`
  // when no user is signed in. `userId` will be `undefined` in that case.
  const userId = user?.id;

  // Debug: log the resolved user id (remove in production)
  console.log(userId);

  // Guard: if there's no authenticated user, skip the DB query entirely.
  // This prevents making a query with `userId = undefined` and avoids
  // unnecessary database work. We initialize `totalProducts` to `0`
  // for the unauthenticated case so the rest of the component can
  // render consistently.
  let totalProducts = 0;
  if (userId) {
    // Count products that belong to the current user. This issues a DB
    // query via Prisma. The shorthand `{ where: { userId } }` is equivalent to
    // `{ where: { userId: userId } }`.
    totalProducts = await prisma.product.count({ where: { userId } });
  } else {
    console.log("No userId found — skipping product count.");
  }

  const lowStock = await prisma.product.count({ where: { userId } });

  console.log("lowStock:", lowStock);

  const recentProducts = await prisma.product.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const allProducts = await prisma.product.findMany({
    where: { userId },
    select: {
      price: true,
      quantity: true,
      createdAt: true,
    },
  });

  console.log("allProducts:", allProducts);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  console.log("totalValue:", totalValue);

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
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 ">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>

            <div className="grid-cols-3 gap-6">
              <div className="text-cente">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div>Total Products</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-800 font-bold">
                    +{totalProducts}
                  </span>
                  <TrendingUp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
