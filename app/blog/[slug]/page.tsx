import { notFound } from "next/navigation"
import { getBlogPost, getRecentPosts } from "@/lib/blog-data"
import { BlogPostContent } from "@/components/blog-post-content"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: `${post.title} | Technozlife Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const recentPosts = getRecentPosts(3).filter((p) => p.slug !== slug)

  return <BlogPostContent post={post} recentPosts={recentPosts} />
}
