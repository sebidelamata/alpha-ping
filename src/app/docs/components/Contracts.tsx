import React from "react";
import Link from "next/link";

const Contracts:React.FC = () => {
    return(
        <div className="relative flex h-screen flex-col gap-4">
            <h2 className="p-4 text-4xl font-bold">
                Contracts
            </h2>
            <ul className="px-4">
                <li className="flex flex-col gap-1 p-2 text-xl">
                    <h3>Arbitrum</h3>
                    <ul className="px-4">
                        <li className="flex gap-1 p-2 text-lg">
                            <p>
                                AlphaPING Contract -  
                            </p>
                            <Link
                                href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_ALPHAPING_CONTRACT_ADDRESS}`}
                                target="_blank"
                            >
                                <strong>{process.env.NEXT_PUBLIC_ALPHAPING_CONTRACT_ADDRESS}</strong>
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default Contracts