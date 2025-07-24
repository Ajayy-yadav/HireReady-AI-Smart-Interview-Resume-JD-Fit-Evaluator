import { FeatureSteps } from "@/components/feature-section";
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects";
import { HeroSection } from "@/components/hero-section-1";
import { Footer } from "@/components/ui/footer";
import { Github, Hexagon, Twitter } from "lucide-react";
import React from "react";

export default function Main() {
  const features = [
    {
      step: "Step 1",
      title: "Get Ready",
      content:
        "Upload Your Resume & JD: Easily input your resume and the job description for an instant fit analysis.",
      image: "/assets/step1.png",
    },
    {
      step: "Step 2",
      title: "Get Smart",
      content:
        "Practice with AI Coach: Engage in personalized mock interviews and receive real-time, actionable feedback.",
      image: "/assets/step2.png",
    },
    {
      step: "Step 3",
      title: "Get Hired",
      content:
        "Track & Succeed: Monitor your progress, review detailed performance analytics, and gain the confidence to land your dream job.",
      image: "/assets/step3.png",
    },
  ];
  return (
    <div className="flex flex-col">
      <HeroSection />

      <FeaturesSectionWithHoverEffects />

      <FeatureSteps
        features={features}
        title="Your Job Prep Journey"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
      <Footer
        logo={<Hexagon className="h-5 w-5" />}
        brandName="Hire Ready"
        socialLinks={[
          {
            icon: <Twitter className="h-5 w-5" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com",
            label: "GitHub",
          },
        ]}
        contactEmails={[
          { email: "tipanaboinaajay@gmail.com" },
          { email: "pyatlavishnuvardhan@gmail.com" },
        ]}
        copyright={{
          text: "© 2025 HireReady-AI",
          license: "All rights reserved",
        }}
      />
    </div>
  );
}
