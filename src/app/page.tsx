import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Welcome to Vallaroo</h1>
      <p className="text-gray-600">
        This is the home page. You can browse stores by navigating to /store/[storeId]
      </p>
    </div>
  );
};

export default HomePage;