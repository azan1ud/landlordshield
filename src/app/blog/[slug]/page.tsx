import Link from 'next/link';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const categoryColors: Record<string, string> = {
  compliance: 'bg-green-100 text-green-700',
  tax: 'bg-blue-100 text-blue-700',
  legislation: 'bg-purple-100 text-purple-700',
  guides: 'bg-amber-100 text-amber-700',
  news: 'bg-red-100 text-red-700',
};

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const allPosts = getAllBlogPosts().filter((p) => p.slug !== slug).slice(0, 2);

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Organization', name: 'LandlordShield' },
    publisher: { '@type': 'Organization', name: 'LandlordShield', url: 'https://landlordshield.vercel.app' },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-[#1E3A5F]" />
              <span className="text-xl font-bold text-[#1E3A5F]">LandlordShield</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Pricing</Link>
              <Link href="/blog" className="text-sm text-[#1E3A5F] font-medium">Blog</Link>
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/signup"><Button size="sm" className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start Free</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1E3A5F] mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                {post.category}
              </span>
              <span className="text-xs text-gray-500">{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {post.author}</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>
          </div>

          <div
            className="prose prose-gray max-w-none prose-headings:text-[#1E3A5F] prose-a:text-[#1E3A5F] prose-a:underline prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </article>

        {/* CTA */}
        <Card className="mt-12 border-2 border-[#1E3A5F]">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">Track your compliance automatically</h3>
            <p className="text-sm text-gray-600 mb-4">
              LandlordShield monitors all your certificates, deadlines, and regulatory changes in one dashboard.
            </p>
            <Link href="/signup">
              <Button className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">
                Start Free — 1 Property <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <div className="mt-12">
          <NewsletterSignup />
        </div>

        {/* Related Posts */}
        {allPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {allPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[p.category] || 'bg-gray-100 text-gray-700'}`}>
                        {p.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#1E3A5F] mt-2 line-clamp-2">{p.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{p.readTime}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 LandlordShield by Avantware. All rights reserved. England &amp; Wales only.</p>
        </div>
      </footer>
    </div>
  );
}
