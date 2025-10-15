import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TextHoverEffect } from "./text-hover-effect";
import Image from "next/image";

interface FooterProps {
  logo: React.ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  contactEmails: Array<{
    email: string;
  }>;
  githubProfiles: Array<{
    name: string;
    username: string;
    href: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
}

export function Footer({
  socialLinks,
  contactEmails,
  githubProfiles,
  copyright,
}: FooterProps) {
  return (
    <footer className=" pt-5 ContactUs rounded-t-[28px] bg-gradient-to-br from-orange-400 via-pink-400 to-cyan-400">
      <div className="px-4 lg:px-15">
        <div className="grid grid-cols-2 gap-4 items-start">
          <Link href="" className="flex items-center gap-x-2">
            <Image
              src="/assets/hire-ready.svg"
              height="180"
              width="180"
              alt="logo"
            />
          </Link>
          <div className="text-right">
            <h3 className="font-semibold text-xs mb-1">Contact Us</h3>
            <ul className="list-none flex flex-col gap-0.5">
              {contactEmails.map((contact, i) => (
                <li key={i}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-xs text-primary underline-offset-4 hover:underline"
                  >
                    {contact.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 items-start">
          <div className="text-xs text-muted-foreground">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-xs mb-1">GitHub Contributors</h3>
            <div className="flex items-center justify-end gap-2 text-xs">
              {githubProfiles.map((profile, i) => (
                <span key={i}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    @{profile.username}
                  </a>
                  {i < githubProfiles.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 flex justify-between"></div>
      </div>
      <div className="lg:h-[16rem] md:h-[9rem] sm:h-[7rem] h-[5.5rem] flex items-center justify-center">
        <TextHoverEffect text="HIREREADY-AI" />
      </div>
    </footer>
  );
}
