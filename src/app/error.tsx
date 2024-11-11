"use client";

import React from "react";
import Link from "next/link";

const ErrorPage:React.FC = () => {
    return(
        <div className="error-page">
            <div className="banana-container">
                <img 
                    src="/bananaPeeled.svg" 
                    alt="Banana" 
                    className="error-banana"
                    loading="lazy"
                />
            </div>
            <div className="error-container">
                <div className="left-placeholder"></div>
                <h1 className="error-page-title">
                    Oops! It seems the server monkey dropped all the bananas.
                </h1>
            </div>
            <div className="error-container">
                <div className="left-placeholder"></div>
                <p className="error-page-body">
                Our team is swinging into action to fix this monkey business. In the meantime, why not take a break and explore other trails in the jungle?
                </p>
            </div>
            <div className="error-container">
                <div className="left-placeholder"></div>
                <h2 className="error-page-status">
                    Error 500: Server Error
                    <Link href={'/'}>
                        <h2 className="error-return-link">Return Home</h2>
                    </Link>
                </h2>
            </div>
        </div>
    )
}

export default ErrorPage;