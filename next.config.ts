import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Next only serves quality values listed here; the gallery requests 90
       (the default 75 visibly softened detailed photos). */
    qualities: [90],
  },
};

export default nextConfig;
