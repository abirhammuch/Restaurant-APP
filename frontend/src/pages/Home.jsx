import React from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Category from "../components/Category";
import Popular from "../components/Popular";
import Testimonial from "../components/Testimonial";
import ReadyToOrder from "../components/ReadyToOrder";

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: {
    opacity: 0,
    y: -24,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

const Home = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-hidden"
    >
      <Hero />
      <Category />
      <Popular />
      <Testimonial />
      <ReadyToOrder />
    </motion.div>
  );
};

export default Home;
