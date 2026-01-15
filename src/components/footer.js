import React from "react";
import Link from "next/link";
export function Footer({ }) {
  return (
    <footer className="h-[100px] w-full bg-payne-gray text-white grid place-items-center z-[auto] ">
      <div className="text-center">
        <div>© 2023 |{" "}
          <a target="_blank" href="https://socialcloudeventures.com/">
            Social Cloude Ventures
          </a></div>
        <Link href="/privacy">Privacy Policy</Link>
      </div>

    </footer>
  );
}
