"use client";
import Image, { ImageProps } from "next/image";
import {
  FALLBACK_IMAGE,
  validateImageUrl,
} from "../../utils/custom/getValidatedImageSrc";
import { useLayoutEffect, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | StaticImport;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt,
  className,
  width,
  height,
  fill,
  sizes,
  onError,
  ...props
}: SafeImageProps) {
  const [imageState, setImageState] = useState({
    isLoading: true,
    imageError: false,
  });

  const validatedSrc = validateImageUrl(src, fallbackSrc);
  const displaySrc = imageState.imageError ? fallbackSrc : validatedSrc;
  const accessToken = useAppSelector((state) => state.auth.token.accessToken);
  const imageSrc = getImageUrl(displaySrc.toString(), accessToken);

  useLayoutEffect(() => {
    setImageState({
      isLoading: true,
      imageError: false,
    });
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={cn(
        "object-contain",
        className,
        imageState.imageError && "object-contain",
      )}
      onLoad={() => setImageState({ isLoading: false, imageError: false })}
      onError={() => setImageState({ isLoading: false, imageError: true })}
      width={width}
      height={height}
      fill={fill}
      sizes={
        sizes || fill
          ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          : undefined
      }
      {...props}
    />
  );
}

function getImageUrl(url: string | StaticImport, accessToken: string) {
  let originalUrl = decodeURIComponent(url.toString());

  if (originalUrl.startsWith("/")) return originalUrl;

  // Secure domain detection using hostname match
  const SECURE_DOMAIN = new URL(process.env.NEXT_PUBLIC_SERVER_URL!).hostname;
  const reqDomain = new URL(originalUrl).hostname;

  // if its public domain, return original url
  if (reqDomain !== SECURE_DOMAIN) return originalUrl;

  // Append access token for secure domains
  const finalImageUrl = new URL(originalUrl);
  finalImageUrl.searchParams.set("token", accessToken);
  return finalImageUrl.toString();
}
