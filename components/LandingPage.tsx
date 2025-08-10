"use client";

import React, { useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, CheckCircle, Star, Play, Zap, Brain, Target, Shield, BarChart3, Users, TrendingUp } from 'lucide-react';
import { PricingTable } from './PricingTable';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing?: () => void;
}

export function LandingPage({ onGetStarted, onViewPricing }: LandingPageProps) {
  const heroRef = useRef(null);

  useEffect(() => {
    // Smooth scroll animation for hero section
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (heroRef.current) {
          heroRef.current.style.transition = 'all 0.8s ease-out';
          heroRef.current.style.opacity = '1';
          heroRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">SmartSEO AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-black transition-colors">Reviews</a>
              <Button variant="outline" size="sm" onClick={onGetStarted}>
                Sign In
              </Button>
              <Button size="sm" onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Your Competitors<br />
              <span className="text-blue-600">Hate Us.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Automated SEO audits, fixes, and rankings — faster than any agency, and without the BS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Free 7-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-gray-50"
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>
            
            {/* Dashboard Mockup */}
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-500">smartseo.ai/dashboard</div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">94</div>
                      <div className="text-sm text-gray-600">SEO Score</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">2.3s</div>
                      <div className="text-sm text-gray-600">Page Speed</div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">847</div>
                      <div className="text-sm text-gray-600">Keywords Tracked</div>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract AI Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-blue-100 rounded-full opacity-20"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-purple-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-blue-200 rounded-full opacity-25"></div>
        </div>
      </section>

      {/* Pain Point Callout */}
      <section className="bg-gray-50 py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-4 bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-xl font-medium text-gray-900">
              Still paying for SEO reports you don't understand? We turn them into actions.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Features That Actually Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No fluff, no buzzwords. Just tools that make your SEO better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="Write Product Pages Faster Than Your Intern"
              description="AI content generation & optimization that doesn't sound like a robot wrote it."
              color="blue"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Fix Your H Tags Before Google Notices"
              description="HTML structure & schema automation. Because manually checking 500 pages is insane."
              color="green"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Spot Broken Links Like a Hawk"
              description="Internal/external link analysis that catches problems before your users do."
              color="purple"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Spy on Competitors Without Feeling Creepy"
              description="Competitor & SERP intelligence that's actually useful (and legal)."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-24">
          <DetailedFeature
            title="Stop Chasing Keywords. Start Owning Them."
            description="Our AI doesn't just find keywords—it finds the gaps your competitors missed. Then it writes content that actually ranks."
            imagePosition="right"
            features={[
              "SERP analysis in real-time",
              "Content gap identification",
              "Automatic keyword clustering",
              "Intent-based optimization"
            ]}
          />
          
          <DetailedFeature
            title="Audit and Fix Your Site While You Netflix."
            description="Set it and forget it. Our automation runs 24/7, finding and fixing SEO issues faster than you can say 'page speed optimization'."
            imagePosition="left"
            features={[
              "Automated technical audits",
              "One-click fixes for common issues",
              "Performance monitoring",
              "Mobile-first optimization"
            ]}
          />
          
          <DetailedFeature
            title="Turn Competitor Tears Into Your Traffic."
            description="See exactly what's working for your competitors, then do it better. Because inspiration is just a nice word for competitive advantage."
            imagePosition="right"
            features={[
              "Competitor content analysis",
              "Backlink opportunity detection",
              "SERP feature optimization",
              "Market share tracking"
            ]}
          />
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              They ditched their old SEO guy too.
            </h2>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="h-8 w-24 bg-gray-300 rounded"></div>
              <div className="h-8 w-32 bg-gray-300 rounded"></div>
              <div className="h-8 w-28 bg-gray-300 rounded"></div>
              <div className="h-8 w-36 bg-gray-300 rounded"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Went from page 3 to page 1 in 6 weeks. My agency was taking 6 months to do what SmartSEO did in 6 days."
              author="Sarah Chen"
              role="E-commerce Director"
              rating={5}
            />
            <TestimonialCard
              quote="Finally, an SEO tool that doesn't require a PhD to understand. The recommendations actually make sense."
              author="Mike Rodriguez"
              role="Marketing Manager"
              rating={5}
            />
            <TestimonialCard
              quote="Cut our SEO costs by 80% and doubled our organic traffic. The math is pretty simple."
              author="Jessica Park"
              role="Startup Founder"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingTable onGetStarted={onGetStarted} className="bg-white" />
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Rank Like a Machine?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Start your 7-day free trial. No credit card. No excuses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg rounded-xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-xl"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">SmartSEO AI</span>
            </div>
            <div className="flex space-x-8 text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 SmartSEO AI. All rights reserved. Made with ❤️ for people who hate bad SEO.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <Card className="p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <CardContent className="space-y-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-black">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function DetailedFeature({ title, description, imagePosition, features }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={imagePosition === 'left' ? 'lg:col-start-2' : ''}>
        <h3 className="text-3xl md:text-4xl font-bold text-black mb-6">
          {title}
        </h3>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${imagePosition === 'left' ? 'lg:col-start-1' : ''}`}>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, rating }) {
  return (
    <Card className="p-8 border border-gray-200">
      <CardContent className="space-y-4">
        <div className="flex space-x-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-gray-700 leading-relaxed">
          "{quote}"
        </blockquote>
        <div>
          <div className="font-medium text-black">{author}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </CardContent>
    </Card>
  );
}