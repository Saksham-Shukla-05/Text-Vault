"use client";

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
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Vortex } from "@/components/ui/vortex";
import { Lock, Shield, MessageSquare } from "lucide-react";

const date = new Date();

const words = [
  { text: "Anonymous", className: "text-teal-400 font-bold" },
  { text: "Feedback", className: "text-white" },
  { text: "—", className: "text-white/70" },
  { text: "No", className: "text-white" },
  { text: "Traces.", className: "text-white" },
];

const features = [
  { icon: Lock, label: "100% Anonymous", desc: "No names. No traces." },
  {
    icon: Shield,
    label: "End-to-End Encrypted",
    desc: "Your words stay private",
  },
  {
    icon: MessageSquare,
    label: "Unfiltered Truth",
    desc: "Honest opinions, no judgment",
  },
];

const anonymousSenders = [
  "Shadow",
  "Veiled",
  "Whisper",
  "Ghost",
  "Hidden",
  "Echo",
  "Void",
  "Phantom",
];

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Subtle background */}
      <div className="absolute inset-0 z-0">
        <Vortex
          backgroundColor="transparent"
          rangeY={900}
          particleCount={70}
          baseHue={200}
          className="w-full h-full opacity-15"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-5 sm:px-8 md:px-12 lg:px-16 pt-16 pb-20">
          {/* Hero */}
          <section className="text-center mb-16 md:mb-24 max-w-4xl w-full">
            <div className="mb-10">
              <TypewriterEffectSmooth
                words={words}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              />
            </div>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Say anything. Hear anything.
              <span className="block mt-2 font-medium text-slate-400">
                No identity. No logs. Just truth.
              </span>
            </p>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mb-20 md:mb-28">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl bg-slate-900/50 backdrop-blur-lg border border-slate-800 hover:border-teal-800/70 transition-all group"
              >
                <feature.icon className="w-10 h-10 text-teal-500 mb-5 opacity-90 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.label}
                </h3>
                <p className="text-slate-400 text-base">{feature.desc}</p>
              </div>
            ))}
          </section>

          {/* Centered Carousel */}
          <section className="w-full max-w-3xl mx-auto">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10 md:mb-14">
              Real Messages — From Nobody
            </h2>

            <Carousel
              plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
              opts={{
                align: "center", // ← key fix: centers active slide
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {messages.slice(0, 8).map((msg, idx) => (
                  <CarouselItem
                    key={idx}
                    className="pl-2 md:pl-4 basis-full md:basis-4/5 lg:basis-3/4 xl:basis-2/3" // responsive width
                  >
                    <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden mx-auto">
                      <CardContent className="p-7 sm:p-9 md:p-10">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-medium text-sm">
                            ?
                          </div>
                          <div>
                            <p className="text-slate-300 font-medium">
                              {anonymousSenders[idx % anonymousSenders.length]}
                            </p>
                            <p className="text-xs text-slate-600">Anonymous</p>
                          </div>
                        </div>

                        <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed mb-6">
                          {msg.content}
                        </p>

                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-amber-400 text-xl">
                              ★
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-0 sm:left-2 md:-left-10 lg:-left-14 bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-800 hidden sm:flex" />
              <CarouselNext className="right-0 sm:right-2 md:-right-10 lg:-right-14 bg-slate-900/70 border-slate-700 text-slate-300 hover:bg-slate-800 hidden sm:flex" />
            </Carousel>
          </section>
        </main>

        <footer className="relative z-10 py-12 text-center text-slate-600 border-t border-slate-900/50">
          <p>
            © {date.getFullYear()} Text Vault. All rights reserved.
            <span className="mx-3">•</span>
            No logs. No traces. Just truth.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
