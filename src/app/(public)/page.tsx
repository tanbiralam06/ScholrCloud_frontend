"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SMS SaaS</h1>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">School Management Made Simple</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Manage students, staff, fees, and more with our all-in-one multi-tenant school management
          system.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </main>
    </div>
  );
}
