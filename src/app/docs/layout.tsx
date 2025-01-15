'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sectionNames = {
  "overview": "Overview",
  "litepaper": "Litepaper",
  "roadmap": "Roadmap",
  "techdocs": "Technical Docs",
  "contracts": "Contracts",
  "governance": "Governance",
  "tokenomics": "Tokenomics",
  "airdrop": "Airdrop",
  "team": "Team"
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSection = pathname.split("/")[2] || "overview";

  return (
    <div className="docs-container">
      <div className="selector-container">
        <div className="logo-container-docs">
          <img src="../Apes.svg" alt="AlphaPING Logo" className="logo" loading="lazy" />
        </div>
        <ul className="selector">
          {Object.keys(sectionNames).map((sectionName) => (
            <li
              key={sectionName}
              className={`selector-li ${activeSection === sectionName ? "active" : ""}`}
            >
              <Link href={`/docs/${sectionName}`}>
                {sectionNames[sectionName as keyof typeof sectionNames]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="doc-body">
        <h1 className="page-title">AlphaPING Docs</h1>
        {children}
      </div>
    </div>
  );
}
