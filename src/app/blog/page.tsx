import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';
import { getAllBlogPosts } from '@/lib/blog/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — UK Landlord Compliance Guides',
  description: 'Expert guides on landlord compliance, Making Tax Digital, Renters\' Rights Act, EPC requirements, and certificate tracking for UK landlords.',
};

const categoryColors: Record<string, string> = {
  compliance: 'bg-green-100 text-green-700',
  tax: 'bg-blue-100 text-blue-700',
  legislation: 'bg-purple-100 text-purple-700',
  guides: 'bg-amber-100 text-amber-700',
  news: 'bg-red-100 text-red-700',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-[#1E3A5F]" />
              <span className="text-xl font-bold text-[#1E3A5F]">LandlordShield</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Pricing</Link>
              <Link href="/blog" className="text-sm text-[#1E3A5F] font-medium">Blog</Link>
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/signup"><Button size="sm" className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start Free</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            UK Landlord Compliance Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert guides, regulatory updates, and compliance tips for UK private landlords.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1E3A5F] mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-sm text-[#1E3A5F] font-medium flex items-center gap-1">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 LandlordShield by Avantware. All rights reserved. England &amp; Wales only.</p>
        </div>
      </footer>
    </div>
  );
}
