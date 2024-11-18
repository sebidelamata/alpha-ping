
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Team:React.FC = () => {

    return(
        <div className="team-container">
            <h2>Team</h2>
            <ul>
                <li className="team-li">
                    <h3>
                        Founder:
                    </h3>
                    <Image 
                        src={'https://ipfs.io/ipfs/QmZ9jpBCcaC8izFoNiqRtrXq7d5pHnAFSy71hqVE29GWEk/0.png'}
                        alt="Boxers in Predicaments 0"
                        width={90}
                        height={70}
                    />
                    <h4>
                        Sebi de la Mata
                    </h4>
                    <Link 
                        href={'https://www.sebidelamata.com'}
                        target="_blank"
                    >
                        Site
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Team;