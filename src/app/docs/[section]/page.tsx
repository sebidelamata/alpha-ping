'use client';

import React from "react";
import { useParams } from "next/navigation";
import Overview from "../components/Overview";
import Litepaper from "../components/Litepaper";
import Roadmap from "../components/Roadmap";
import TechnicalDocs from "../components/TechnicalDocs";
import Contracts from "../components/Contracts";
import Team from "../components/Team";
import Governance from "../components/Governance";
import Tokenomics from "../components/Tokenomics";
import Airdrop from "../components/Airdrop";

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
      return <Governance/>;
    case "tokenomics":
      return <Tokenomics/>;
    case "airdrop":
      return <Airdrop/>;
    default:
      return <h2>Section not found</h2>;
  }
}
