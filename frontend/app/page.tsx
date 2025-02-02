import Image from "next/image";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121712] text-[#E8E8E8] flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00E676] to-[#00FF8D] bg-clip-text text-transparent">
            Discover Your Learning Path
          </h1>
          
          <p className="text-[#A0A0A0] text-xl max-w-2xl mx-auto">
            Take our assessment test to receive personalized content tailored to your skill level
          </p>
        </div>

        <div className="mt-16">
          <Link href="/taketest">
            <Button 
              className="bg-[#00C853] hover:bg-[#00FF8D] text-black text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
            >
              Start Assessment
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
