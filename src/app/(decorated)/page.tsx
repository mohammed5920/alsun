/* eslint-disable @next/next/no-img-element */

import { CourseTagBadge, CourseTagStyles } from "@/components/alsun/marketing/courseTagBadge";
import { DarkSection } from "@/components/alsun/navbar";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { readUser } from "@/lib/data/user";
import { prisma } from "@/lib/prisma";
import { groupTags } from "@/lib/types/tags";
import { CourseTagType } from "@prisma/client";
import { ArrowRight, Laptop, Repeat, School } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function SectionHeader({
  title,
  subtitle,
  accentText,
}: {
  title: string;
  subtitle: string;
  accentText: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
      <h2 className="font-alsun-serif text-secondary text-4xl font-bold md:text-5xl">
        {title} <span className="text-primary">{accentText}</span>
      </h2>
      <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-screen">
      <Hero />

      <DarkSection>
        <AboutUs />
      </DarkSection>

      <Courses />
      <HybridExplainer />
      <UpcomingEvents />

      <DarkSection>
        <FinalCTA />
      </DarkSection>
    </div>
  );
}

function Hero() {
  return (
    <section className="animate-in blur-in-3xl flex h-screen max-w-screen flex-col items-center justify-center gap-2 px-8 pt-12 pb-16 text-center transition-none duration-1000 md:gap-6">
      <div className="border-primary relative mx-auto mb-8 hidden w-fit rounded-2xl border-x-2 bg-white/15 p-4 pl-4 text-xl tracking-tighter shadow-md backdrop-blur-[1px] md:block">
        <p className="text-secondary font-alsun-serif">
          📅 <strong className="font-bold">Upcoming Event:</strong> Cultural Night – This Friday at
          7 PM!
        </p>
        <Link href="#events" className="text-primary transition-colors hover:saturate-50">
          Learn more &rarr;
        </Link>
      </div>

      <div className="max-w-[75vw]">
        <h1 className="font-alsun-serif tracking-tightest text-5xl font-extrabold text-balance text-slate-900 md:text-6xl">
          <span className="text-primary">Level Up</span> Your Language Skills.
        </h1>
      </div>

      <div className="tracking-tighter">
        <p className="mt-6 text-xl text-balance text-slate-700 text-shadow-2xs text-shadow-black/20 md:text-2xl">
          We offer certified courses, native-speaking tutors, and an internationally recognized
          curriculum to help you master your goals.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-fit items-center gap-4 text-xl tracking-tighter">
        <button
          onClick={async () => {
            "use server";
            const user = await readUser();
            redirect(user ? "/learn" : "/signup?redirect=courses");
          }}
          className="bg-primary z-10 cursor-pointer transform rounded-lg p-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-teal-700"
        >
          Get Started
        </button>
        <Link
          href="/courses"
          className="bg-secondary z-10 transform rounded-lg p-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-slate-900"
        >
          View Courses
        </Link>
      </div>
    </section>
  );
}

function AboutUs() {
  const stats = [
    { value: "600+", label: "Students Enrolled" },
    { value: "4+", label: "Years of Experience" },
    { value: "5+", label: "Partner Institutions" },
    { value: "98%", label: "Student Satisfaction" },
  ];

  return (
    <section className="bg-secondary relative text-white">
      <img
        src="https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2IGv0Q2bqaLy05K8Ud67OHTQGvkDglcjt2SXJ"
        alt="Our Language Center"
        className="absolute inset-0 h-full w-full object-cover opacity-10 blur-md"
      />
      <div className="relative mx-auto max-w-7xl px-8 py-16 text-center">
        <h2 className="font-alsun-serif mb-4 text-5xl font-bold">
          About <span className="text-primary">Us</span>
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-balance text-lg text-slate-300">
          We are a hybrid language learning hub, combining the warmth of in-person classes with the
          flexibility of online learning. Our brick-and-mortar center is a community space where
          cultures meet, languages flourish, and lifelong friendships are made.
        </p>

        <div className="grid grid-cols-2 md:gap-8 gap-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-600/50 bg-slate-700/50 p-2 backdrop-blur-sm"
            >
              <p className="text-2xl md:text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm tracking-wider text-slate-400 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function DynamicContents() {
  const fetched = await prisma.course.findMany({
    where: { isPublic: true },
    select: { tags: true },
  });
  const groupedTags = groupTags(fetched.flatMap((course) => course.tags));

  return (
    <>
      {Object.entries(groupedTags).map(([group, tags]) => {
        const style = CourseTagStyles[group as CourseTagType];
        const { icon: Icon } = style;

        return (
          <div
            key={group}
            className="h-fit max-w-xs rounded-xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Icon className="text-secondary size-7" />
              <h3 className="text-secondary text-2xl font-bold">{group}</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <Link
                  href={`/courses?tags=${tag.name.toLowerCase()}`}
                  key={tag.tagId}
                  className="transition-all hover:scale-102 hover:saturate-200"
                >
                  <CourseTagBadge tag={tag} />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function Courses() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-8">
        <SectionHeader
          title="Explore Our"
          accentText="Courses"
          subtitle="Find the perfect course by browsing our diverse categories and tags."
        />

        <div className="flex flex-wrap justify-center gap-8">
          <Suspense fallback={<div className="animate-pulse">Loading courses...</div>}>
            <DynamicContents />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function HybridExplainer() {
  const advantages = [
    {
      Icon: School,
      title: "Learn On-Site",
      description: "Engage face-to-face with peers and teachers in our vibrant classrooms.",
    },
    {
      Icon: Laptop,
      title: "Learn Online",
      description: "Access live and recorded lessons from anywhere in the world.",
    },
    {
      Icon: Repeat,
      title: "Switch Anytime",
      description: "Seamlessly move between online and in-person classes to suit your schedule.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-8 lg:grid-cols-2">
        <div className="relative h-96">
          <img
            src="https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2IGv0Q2bqaLy05K8Ud67OHTQGvkDglcjt2SXJ"
            alt="In-person class"
            className="h-full w-full rounded-xl object-cover shadow-2xl"
          />
          <img
            src="https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2PcBcrCFB9WlUrwTkO7CM4EYvQ8N3qofSXIuj"
            alt="Online lesson"
            className="absolute -right-4 -bottom-12 h-auto w-3/5 rounded-xl border-8 border-white object-cover shadow-2xl"
          />
        </div>

        <div className="relative">
          <h2 className="font-alsun-serif text-secondary mb-6 text-4xl font-bold md:text-5xl">
            The <span className="text-primary">Hybrid</span> Advantage
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Learn anywhere, anytime—without losing the human connection. Our hybrid model blends the
            best of in-person immersion with the flexibility of online lessons.
          </p>

          <ul className="space-y-6">
            {advantages.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <div className="bg-secondary shrink-0 rounded-full p-3">
                  <span className="text-2xl text-white">
                    <item.Icon />
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function UpcomingEvents() {
  //placeholder events until the event system has been added
  const events = [
    {
      title: "Open House: Meet the Teachers",
      date: "August 24, 2025",
      location: "On-Site – Main Campus",
      description:
        "Tour our classrooms, speak with instructors, and experience a live language lesson.",
      image: "https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza2YSTrTAHnqbfDQdKGsZVk8WzSPCr43owv9XFO",
    },
    {
      title: "Free Online Pronunciation Workshop",
      date: "September 2, 2025",
      location: "Online (Zoom)",
      description:
        "Join our expert tutors for a 90-minute deep dive into accent reduction techniques.",
      image: "https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza20AFga3LxMzl7o4BpSW3RbsjXaEDnNLvGmZ51",
    },
    {
      title: "Cultural Exchange Evening",
      date: "September 15, 2025",
      location: "On-Site – Main Campus",
      description: "Share food, music, and traditions with our diverse student community.",
      image: "https://m6nqhl3udl.ufs.sh/f/bemDMs9Bqza22eqQVqcQJr76vgZFknPRUlC1csSTf9NoA0ba",
    },
  ];

  return (
    <section className="bg-slate-50 py-16" id="events">
      <div className="mx-auto px-8">
        <SectionHeader
          title="Upcoming"
          accentText="Events"
          subtitle="Join us in person or online for engaging activities, workshops, and cultural experiences."
        />

        <Carousel className="relative mx-auto max-w-6xl">
          <CarouselContent className="my-2 flex gap-8">
            {events.map((event) => (
              <CarouselItem
                key={event.title}
                className="max-w-sm shrink-0 pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="overflow-hidden rounded-lg bg-slate-50 shadow-sm transition-shadow hover:shadow-md">
                  <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-secondary mb-2 text-xl font-semibold">{event.title}</h3>
                    <p className="text-primary text-sm font-medium">
                      {event.date} • {event.location}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">{event.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 transform" />
          <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 transform" />
        </Carousel>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <div className="bg-secondary relative py-16">
      <div className="to-primary absolute h-[60%] w-full bg-linear-to-r from-orange-800 opacity-20 mix-blend-lighten blur-2xl"></div>
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-8 text-center">
        <h2 className="font-alsun-serif mb-4 text-4xl font-extrabold text-white md:text-5xl">
          Ready to Start Your Journey?
        </h2>
        <p className="mb-8 max-w-xl text-lg text-white/70">
          Join our community of learners today and take the first step towards fluency. Your
          adventure in language awaits.
        </p>
        <Link href="/signup">
          <button className="bg-secondary cursor-pointer hover:bg-primary hover:shadow-primary/40 relative mx-auto rounded-full px-8 py-4 text-lg font-light text-white transition-all duration-300 hover:font-semibold hover:tracking-wide hover:shadow-2xl">
            <span className="flex items-center">
              Get started{" "}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
