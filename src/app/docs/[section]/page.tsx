'use client';

import React from "react";
import { useParams } from "next/navigation";
import Overview from "../components/Overview";
import Litepaper from "../components/Litepaper";
import Roadmap from "../components/Roadmap";
import TechnicalDocs from "../components/TechnicalDocs";
import Contracts from "../components/Contracts";
import Team from "../components/Team";

export default function SectionPage() {
  const { section } = useParams();

  switch (section) {
    case "overview":
      return <Overview />;
    case "litepaper":
      return <Litepaper />;
    case "roadmap":
      return <Roadmap />;
    case "techdocs":
      return <TechnicalDocs />;
    case "contracts":
      return <Contracts />;
    case "team":
      return <Team />;
    case "governance":
      return <h2>Governance</h2>;
    case "tokenomics":
      return <h2>Tokenomics</h2>;
    case "airdrop":
      return <h2>Airdrop</h2>;
    default:
      return <h2>Section not found</h2>;
  }
}
