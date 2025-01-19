
import React from "react";
import Link from "next/link";
import Footer from "src/app/components/Footer";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/components/ui/avatar"
  import { 
    Globe
} from "lucide-react"

const Team:React.FC = () => {

    return(
        <div className="relative flex h-screen w-screen flex-col gap-4">
            <h2 className="p-4 text-4xl font-bold">
                Team
            </h2>
            <ul className="mb-8 flex grow px-4 align-middle">
                <li className="flex justify-center align-middle">
                    <h3 className="justify-center p-4 align-middle text-2xl font-bold">
                        Founder:
                    </h3>
                    <Avatar className="mt-3">
                        <AvatarImage src={'https://ipfs.io/ipfs/QmZ9jpBCcaC8izFoNiqRtrXq7d5pHnAFSy71hqVE29GWEk/0.png'} alt="@sebidelamata" />
                        <AvatarFallback className="bg-accent">Sd</AvatarFallback>
                    </Avatar>
                    <h4 className="justify-center p-4 pl-6 align-middle text-2xl">
                        Sebi de la Mata
                    </h4>
                    <Link 
                        href={'https://www.sebidelamata.com'}
                        target="_blank"
                        className="justify-center align-middle"
                    >
                    <Globe className="mt-5 justify-center align-middle text-accent"/>
                    </Link>
                </li>
            </ul>
            <Footer/>
        </div>
    )
}

export default Team;