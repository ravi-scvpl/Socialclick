"use client";
import { useEffect } from "react";

export const AdBanner = (props) => {
  const rawId = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim();
  const isPlaceholder =
    !rawId ||
    rawId.includes("0000000000000000") ||
    rawId === "ca-pub-";
  const adsenseId = rawId
    ? rawId.startsWith("ca-pub-")
      ? rawId
      : `ca-pub-${rawId}`
    : null;

  useEffect(() => {
    if (isPlaceholder || !adsenseId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, [isPlaceholder, adsenseId]);

  if (isPlaceholder || !adsenseId) {
    return null;
  }

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          overflow: 'hidden',
        }}
        data-ad-client={adsenseId}
        {...props}
        data-ad-slot="1800190570"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
};
export default AdBanner;
