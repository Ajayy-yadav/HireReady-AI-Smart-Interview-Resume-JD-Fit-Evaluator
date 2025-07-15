import { FeatureSteps } from "@/components/feature-section";
import { HeroSection } from "@/components/hero-section-1";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import React from "react";

export default function Main() {
  const features = [
    { 
      step: 'Step 1', 
      title: 'Learn the Basics',
      content: 'Start your Web3 journey by learning the basics of blockchain.', 
      image: 'https://static.vecteezy.com/system/resources/thumbnails/049/855/871/small_2x/stunning-high-resolution-nature-and-landscape-backgrounds-breathtaking-scenery-in-hd-photo.jpg' 
    },
    { 
      step: 'Step 2',
      title: 'Deep Dive',
      content: 'Dive deep into blockchain fundamentals and smart contract development.',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/049/855/871/small_2x/stunning-high-resolution-nature-and-landscape-backgrounds-breathtaking-scenery-in-hd-photo.jpg'
    },
    { 
      step: 'Step 3',
      title: 'Build Projects',
      content: 'Graduate with hands-on Web3 experience through building decentralized applications.',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/049/855/871/small_2x/stunning-high-resolution-nature-and-landscape-backgrounds-breathtaking-scenery-in-hd-photo.jpg'
    },
  ]
  return <div className="flex flex-col"> 
    <HeroSection />
    <TextRevealByWord 
    text="Clear you dream company Interviews with HireReady AI, Match your Resume with Job Description and get Compatibility Score. Clear you dream company Interviews with HireReady AI, Match your Resume with Job Description and get Compatibility Score"/>

    <FeatureSteps 
        features={features}
        title="Your Journey Starts Here"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />

  </div>;
}
