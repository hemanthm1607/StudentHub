import { HeroSection } from "@/components/landing/HeroSection";
import {
  HowItWorksSection,
  CurriculumShowcaseSection,
  PracticeAndAssessmentSection,
  SkillSwapSection,
  WhyStudentHubSection,
  CtaSection,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <HowItWorksSection />
      <CurriculumShowcaseSection />
      <PracticeAndAssessmentSection />
      <SkillSwapSection />
      <WhyStudentHubSection />
      <CtaSection />
    </div>
  );
}
