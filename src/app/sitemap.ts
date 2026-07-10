import type { MetadataRoute } from "next";
import { getAllTools } from "@/src/data/tools";
import { getAllCategories } from "@/src/data/categories";
import { SITE_CONFIG } from "@/src/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const categories = getAllCategories();

  const baseUrl = SITE_CONFIG.url;

  // Static routes
  const mainHubs = ["", "/tools", "/categories"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/tools" ? 0.9 : 0.8,
  }));

  const infoPages = ["/about", "/privacy-policy", "/terms", "/disclaimer"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/about" ? 0.5 : 0.3,
  }));

  // Tools routes
  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Categories routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...mainHubs, ...infoPages, ...toolRoutes, ...categoryRoutes];
}
