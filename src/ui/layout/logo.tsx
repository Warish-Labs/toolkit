"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant: "rounded" | "tight";
  className?: string;
  width?: number;
  height?: number;
  /** If true, show the full lockup with wordmark */
  showWordmark?: boolean;
}

export function Logo({
  variant,
  className = "",
  width = 32,
  height = 32,
  showWordmark = false,
}: LogoProps) {
  const src =
    variant === "rounded"
      ? "/brand/logo-rounded.svg"
      : "/brand/logo-tight.png";

  const alt = "Toolkit by WarishLabs";

  if (showWordmark) {
    return (
      <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg"
          priority
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
            Toolkit
          </span>
          <span className="text-[10px] font-medium leading-none text-muted-foreground">
            by WarishLabs
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      priority
    />
  );
}
