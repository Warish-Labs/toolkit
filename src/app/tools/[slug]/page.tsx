import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools } from "@/src/data/tools";
import { getToolComponent } from "@/src/registry";
import { ToolLayout } from "@/src/ui/layout/tool-layout";
import { getToolSchema } from "@/src/lib/seo";
import type { Metadata } from "next";
import React from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTools().map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const toolComponent = getToolComponent(slug);

  if (!toolComponent) {
    notFound();
  }

  const schemas = getToolSchema(tool);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      
      <ToolLayout tool={tool}>
        {React.createElement(toolComponent)}
      </ToolLayout>
    </>
  );
}
