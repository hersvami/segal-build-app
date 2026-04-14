import type { Company } from "../types/domain";

export const COMPANIES: Record<string, Company> = {
  "segal-build": {
    id: "segal-build",
    name: "Segal Build Pty Ltd",
    tagline: "Building Your Dreams",
    color: "bg-red-900",
    abn: "89 644 915 702",
    phone: "0414 222 203",
    email: "james@thesegals.com.au",
    logo: "/logos/segal-build.png",
  },
  segval: {
    id: "segval",
    name: "Segval",
    tagline: "Quality Construction",
    color: "bg-slate-800",
    abn: "12 345 678 901",
    phone: "0414 222 203",
    email: "hello@segval.com.au",
    logo: "/logos/segval.png",
  },
};