import { useState, useEffect } from "react";

const useCountdown = (timeSeconds: number) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(timeSeconds)
    const [expired, setExpired] = useState<boolean>(false)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                clearInterval(intervalId);
                setExpired(true);
                return 0;
                }
                return prev - 1;
            });
            }, 1000);
        
            return () => clearInterval(intervalId);
    }, [])

    return {
        secondsLeft,
        expired
    }
}

export default useCountdown;