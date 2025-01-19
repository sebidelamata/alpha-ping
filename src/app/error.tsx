"use client";

import React from "react";
import Link from "next/link";
import Footer from "./components/Footer";
import { Separator } from "@radix-ui/react-separator";

const ErrorPage:React.FC = () => {
    return(
        <div className="flex h-screen flex-col justify-end text-right">
            <div className="mr-8 grid grid-cols-[auto_max(60%)]">
                <img 
                        src="/bananaPeeled.svg" 
                        alt="Banana" 
                        className="grid h-96 object-contain sm:ml-12 md:ml-24 lg:ml-32"
                        loading="lazy"
                />
                <h1 className="text-3xl">
                    Oops! It seems the server monkey dropped all the bananas.
                </h1>
            </div>
            <Separator className="my-8"/>
            <div className="mr-8 grid grid-cols-[auto_max(60%)]">
                <div></div>
                <p className="font-light">
                    Our team is swinging into action to fix this monkey business. In the meantime, why not take a break and explore other trails in the jungle?
                </p>
            </div>
            <Separator className="my-8"/>
            <div className="mr-8 grid grid-cols-[auto_max(60%)]">
                <div></div>
                <h2 className="text-2xl">
                Error 500: Server Error
                    <Separator className="my-8"/>
                    <Link href={'/'}>
                        <h2 className="text-2xl">Return Home</h2>
                    </Link>
                    <Separator className="mb-4 justify-end border border-accent text-right align-middle lg:ml-96"/>
                </h2>
            </div>
            <Footer/>
        </div>
    )
}

export default ErrorPage;