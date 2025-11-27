import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-purple-300 flex items-center justify-center ">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Inventory Management
          </h1>
          <p className="mb-8 text-xl text-gray-600  max-w-xl mx-auto">
            Streamline your Inventory with our powerful easy-to-use Management
            system. Track products, monitor stock levels, and gain valuable
            insights.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 ease-linear">
              Sign In
            </Link>
            <Link href="#" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-100 transition-all duration-300 ease-linear ">Learn More</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
