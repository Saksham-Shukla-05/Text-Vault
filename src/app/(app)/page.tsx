"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "../../data/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { EyeOff, MessagesSquare, Link2 } from "lucide-react";

const date = new Date();

const features = [
  {
    icon: EyeOff,
    label: "Truly anonymous",
    desc: "Senders never create an account and their identity is never stored.",
  },
  {
    icon: Link2,
    label: "One link to share",
    desc: "Drop it in your bio, a group chat, or a story — anyone can send a message.",
  },
  {
    icon: MessagesSquare,
    label: "You choose what's public",
    desc: "Messages land privately in your inbox. Nothing is posted without you.",
  },
];

const anonymousSenders = [
  "Anonymous",
  "A friend",
  "Someone",
  "A follower",
  "A classmate",
  "Anonymous",
  "A stranger",
  "Someone",
];

const Home = () => {
  return (
    <div className="w-full">
      <main className="flex flex-col items-center px-5 sm:px-8 md:px-12 lg:px-16 pt-16 pb-20 sm:pt-20 sm:pb-28">
        {/* Hero */}
        <section className="text-center mb-16 md:mb-24 max-w-2xl w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Ask anything.
            <br />
            Get honest answers.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Share your link and let people send you anonymous messages —
            questions, feedback, or whatever&apos;s on their mind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="px-8">
              <Link href="/sign-up">Create your link</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-20 md:mb-28">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <feature.icon className="w-6 h-6 text-indigo-600 mb-4" />
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Example messages */}
        <section className="w-full max-w-2xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-foreground mb-10">
            What people send
          </h2>

          <Carousel
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            opts={{ align: "center", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {messages.slice(0, 8).map((msg, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-2 md:pl-4 basis-full md:basis-4/5 lg:basis-3/4"
                >
                  <Card className="mx-auto">
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium text-sm">
                          ?
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {anonymousSenders[idx % anonymousSenders.length]}
                        </p>
                      </div>
                      <p className="text-base sm:text-lg text-foreground leading-relaxed">
                        {msg.content}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 sm:-left-4 lg:-left-12 hidden sm:flex" />
            <CarouselNext className="right-0 sm:-right-4 lg:-right-12 hidden sm:flex" />
          </Carousel>
        </section>
      </main>

      <footer className="py-10 text-center text-sm text-muted-foreground border-t border-border">
        © {date.getFullYear()} Text Vault
      </footer>
    </div>
  );
};

export default Home;
