import React from "react";
import { Link } from "react-router-dom";

const HomeNav:React.FC = () => {
    return(
        <div className="home-navbar-container">
            <ul>
                <li>
                    <Link to={'/app'} target="_blank">
                        App
                    </Link>
                    <Link to={'https://github.com/sebidelamata/alpha-ping'} target="_blank">
                        Protocol
                    </Link>
                    <Link to={'/docs'} target="_blank">
                        Docs
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default HomeNav