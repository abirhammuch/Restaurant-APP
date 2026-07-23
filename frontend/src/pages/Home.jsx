import React from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import Popular from "../components/Popular";
import Testimonial from "../components/Testimonial";
import ReadyToOrder from "../components/ReadyToOrder";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Category />
      <Popular />
      <Testimonial />
      <ReadyToOrder />
    </div>
  );
};

export default Home;
