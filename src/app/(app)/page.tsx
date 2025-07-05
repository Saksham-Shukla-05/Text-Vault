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
import { Vortex } from "@/components/ui/vortex";

const date = new Date();

const words = [
  { text: "Dive", className: "text-white text-center" },
  { text: "into", className: "text-white text-center" },
  { text: "the", className: "text-white text-center" },
  { text: "World", className: "text-white text-center" },
  { text: "of", className: "text-white text-center" },
  { text: "Anonymous ", className: "text-white text-center" },
  { text: "Feedback", className: "text-white text-center" },
];

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Vortex Layer */}
      <div className="absolute inset-0 -z-10">
        <Vortex
          backgroundColor="black"
          rangeY={1000}
          particleCount={200}
          baseHue={5000}
          className="w-full h-full"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold flex justify-center items-center">
              <TypewriterEffectSmooth words={words} />
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-[#A1A1AA]">
              Text Vault - Where your identity remains a secret.
            </p>
          </section>

          <Carousel plugins={[Autoplay()]} className="w-full max-w-xl  ">
            <CarouselContent className="">
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-2 ">
                    <Card className="min-h-[200px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
                      <CardHeader className="text-center font-semibold text-lg text-white">
                        {message.title}
                      </CardHeader>
                      <CardContent className="h-full p-6 flex items-center justify-center text-white ">
                        <span className="text-center text-base">
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

        <footer className="text-center p-4 md:p-6 bg-black bg-opacity-80 backdrop-blur text-white">
          © {date.getFullYear()} <strong>Text Vault.</strong> All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;
