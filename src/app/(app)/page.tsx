"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "../../data/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
const date = new Date();
const words = [
  { text: "Dive" },
  { text: "into" },
  { text: "the" },
  { text: "World" },
  { text: "of" },
  { text: "Anonymous " },
  { text: "Feedback" },
];
const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            <TypewriterEffectSmooth words={words} />
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Text Vault - Where your identity remains a secret.
          </p>
        </section>
        <Carousel plugins={[Autoplay()]} className="w-full max-w-lg">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="text-center">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square  items-center justify-center  p-6">
                      <span className="text-center text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © {date.getFullYear()} True Feedback. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
