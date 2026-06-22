
import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Title from '../components/Title'
import Category from '../components/Category'
import Popular from '../components/Popular'
import Testimonial from '../components/Testimonial'
import ReadyToOrder from '../components/ReadyToOrder'
import ContactInfo from '../components/ContactInfo'
import FooterLink from '../components/FooterLink'
import Policy from '../components/Policy'

const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <Popular />
      <Testimonial />
      <ReadyToOrder />
      
    </div>
  )
}

export default Home
