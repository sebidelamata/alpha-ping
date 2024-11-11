import React from "react";
import Link from "next/link";

const ErrorPage:React.FC = () => {
    return(
        <div className="error-page">
            <div className="banana-container">
                <img src="/bananaPeeled.svg" alt="Banana" className="error-banana"/>
            </div>
            <div className="error-container">
                <div className="left-placeholder"></div>
                <h1 className="error-page-title">
                    Oh no! It seems we've gone bananas searching for this page.
                </h1>
            </div>
            <div className="error-container">
                <div className="left-placeholder"></div>
                <p className="error-page-body">
                    Our team is on the lookout, but in the meantime, why not explore other vines? If you're lost in the jungle, give us a holler, and we'll help you find your way back to civilization!
                </p>
            </div>
            <div className="error-container">
                <div className="left-placeholder"></div>
                <h2 className="error-page-status">
                    Error 404: Page Not Found 
                    <Link href={'/'}>
                        <h2 className="error-return-link">Return Home</h2>
                    </Link>
                </h2>
            </div>
        </div>
    )
}

export default ErrorPage;