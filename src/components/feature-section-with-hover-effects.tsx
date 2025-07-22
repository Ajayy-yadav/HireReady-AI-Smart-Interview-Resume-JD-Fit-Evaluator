import { cn } from "@/lib/utils";
import { AiOutlineFileSearch } from "react-icons/ai";
import { BsPersonVideo2 } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
import { MdHistory } from "react-icons/md";
import { RiVoiceAiLine } from "react-icons/ri";
import { BsDatabaseFillLock } from "react-icons/bs";
import { MdChildFriendly } from "react-icons/md";
import { MdCompare } from "react-icons/md";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Instant Resume-JD Match",
      description:
        "Upload your resume and job description to instantly see your compatibility score and detailed alignment insights.",
      icon: <AiOutlineFileSearch className="h-6 w-6"/>,
    },
    {
      title: "AI Interview Coach",
      description:
        "Practice unlimited mock interviews with an AI that asks contextual questions based on your unique profile and the job.",
      icon: <BsPersonVideo2  className="h-6 w-6"/>,
    },
    {
      title: "Real-Time Feedback",
      description:
        "Get immediate, actionable feedback on your responses, covering clarity, technical accuracy, and STAR format.",
      icon: <VscFeedback  className="h-6 w-6" />,
    },
    {
      title: "History",
      description: "Our AI remembers your past interactions, personalizing future questions and feedback for continuous improvement.",
      icon: <MdHistory className="h-7 w-7"/>,
    },
    {
      title: "Voice Interaction ",
      description: "Practice with natural voice input and receive AI questions audibly, enhancing your realistic interview experience.",
      icon: <RiVoiceAiLine  className="h-6 w-6"/>,
    },
    {
      title: "Secure & Private Data",
      description:
        "Your personal data, resumes, and interview history are securely stored and strictly protected.",
      icon: <BsDatabaseFillLock  className="h-6 w-6"/>,
    },
    {
      title: "User-Friendly Interface",
      description:
        "Effortlessly navigate through features, upload documents, and access insights with our intuitive design.",
      icon: <MdChildFriendly className="h-6 w-6"/>,
    },
    {
      title: "Skill Match Insights",
      description: "See what skills you have vs what's required, along with percentage match & improvement suggestions.",
      icon: <MdCompare className="h-6 w-6"/>,
    },
  ];
  return (
    <div className="pt-12">
    
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center">
              Why Choose {" "}
      <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        HireReady AI
      </span>
            </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-8 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col   py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "dark:border-neutral-800",
        index < 4 && " dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
