"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Now with Multi-Tenant Support
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          School Management
          <br />
          <span className="bg-gradient-to-r from-primary to-[var(--accent-teal)] bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Manage students, staff, fees, and more with our all-in-one multi-tenant school management
          system. Reduce administrative burden and focus on education.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="shadow-lg shadow-primary/25 px-8">
              Start Free Trial
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-8">
            Watch Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          ✓ No credit card required · ✓ 14-day free trial · ✓ Cancel anytime
        </p>
      </section>
    </div>
  );
}
