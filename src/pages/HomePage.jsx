import React from 'react';
import Header from '../components/Header'; // Corrected path
import HeroSection from '../components/homepage/HeroSection'; // Corrected path
import FeaturesSection from '../components/homepage/FeaturesSection'; // Corrected path
import CoursesSection from '../components/homepage/CoursesSection'; // Corrected path
import DocumentsSection from '../components/homepage/DocumentsSection'; // Corrected path
import TestimonialsSection from '../components/homepage/TestimonialsSection'; // Corrected path
import BlogSection from '../components/homepage/BlogSection'; // Corrected path
import Footer from '../components/Footer'; // Corrected path

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Only use one header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Courses Section */}
      <CoursesSection />
      
      {/* Documents Section */}
      <DocumentsSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Blog Section */}
      <BlogSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
