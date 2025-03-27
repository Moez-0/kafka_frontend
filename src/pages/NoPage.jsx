import React from "react";
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary text-center px-6">
      <h1 className="text-6xl font-bold font-goldman mb-4">404</h1>
      <p className="text-2xl mb-6">"Even Kafka would be confused..."</p>
      <p className="text-lg text-primary mb-8">
        This page doesn’t exist, just like my sense of direction in life.
      </p>
     
      <Link to="/" className="bg-primary text-background py-2 px-6 rounded-lg text-lg font-semibold hover:opacity-80 transition">
        Take Me Home
      </Link>
    </div>
  );
};

export default NoPage;
