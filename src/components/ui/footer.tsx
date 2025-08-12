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
  copyright: {
    text: string;
    license?: string;
  };
}

export function Footer({
 
  socialLinks,
  contactEmails,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-16 ContactUs rounded-t-[28px] bg-gradient-to-br from-orange-400 via-pink-400 to-cyan-400">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href=""
            className="flex items-center gap-x-2"
            
          >
            <Image
                              src="/assets/logo-transparent-svg.svg"
                              height="250"
                              width="250"
                              alt="logo"
                            />
            {/* <span className="font-bold text-xl">{brandName}</span> */}
          </Link>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 flex justify-between">
          <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>{copyright.text}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
          <div className="lg:mt-0 lg:col-[4/11] ">
            <h3 className="font-semibold text-sm mb-0.5">Contact Us</h3>
            <ul className="list-none flex flex-col lg:justify-end ">
              {contactEmails.map((contact, i) => (
                <li key={i}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {contact.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="lg:h-[17rem] md:h-[9rem] sm:h-[7rem] h-[5.5rem] flex items-center justify-center">
        <TextHoverEffect text="HIREREADY-AI" />
      </div>
    </footer>
  );
}
