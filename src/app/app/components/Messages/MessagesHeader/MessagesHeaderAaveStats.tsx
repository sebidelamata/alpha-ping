'use client';

import React from "react";
import Link from "next/link";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { Separator } from "@/components/components/ui/separator";

const MessagesHeaderAaveStats:React.FC = () => {

    const { selectedChannelMetadata } = useChannelProviderContext()
    const { aaveAccount } = useUserProviderContext()

    if(
        aaveAccount !== null &&
        selectedChannelMetadata !== null &&
        selectedChannelMetadata.protocol &&
        selectedChannelMetadata.protocol === 'aave'
    ){
        return(
            <div className="flex flex-row flex-wrap w-full gap-4 text-xl">
                <Link 
                    className="text-accent flex flex-wrap gap-2 justify-center"
                    href="https://app.aave.com/"
                    target="_blank"
                >
                    <Avatar className="size-6">
                        <AvatarImage 
                            src='https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png' 
                            alt="Token Logo"
                            loading="lazy"
                        />
                        <AvatarFallback>
                            Aave
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        Aave Position
                    </div>
                </Link>
                <div>
                    Supplied: {selectedChannelMetadata.name}
                </div>
                    <div 
                        className={
                            // render color based on health factor
                            Number(aaveAccount?.healthFactor) <= 1.1 ?
                            "text-red-500" :
                            Number(aaveAccount?.healthFactor) <= 2.0 ?
                            "text-yellow-500" :
                            "text-green-500"
                        }
                        > 
                            Health Factor: {
                            Number(aaveAccount?.healthFactor).toFixed(2)
                            }
                    </div>
                    <ul className="flex flex-col text-xs">
                        <li className="w-full justify-end flex">
                            Assets: ${
                            humanReadableNumbers(Number(aaveAccount?.totalCollateral).toString())
                            }
                        </li>
                        <li className="w-full justify-end flex">
                            - Debt: ${
                            humanReadableNumbers(Number(aaveAccount?.totalDebt).toString())
                            }
                        </li>
                        <Separator className="my-1 h-[2px] w-full bg-accent" />
                        <li className="w-full justify-end flex">
                            Net Worth: ${ 
                            humanReadableNumbers(
                                (
                                Number(aaveAccount?.totalCollateral) -
                                Number(aaveAccount?.totalDebt)
                                ).toString()
                            )
                            }
                        </li>
                    </ul>
                    <div className="justify-end flex">
                            Can Borrow: ${ 
                            humanReadableNumbers(Number(aaveAccount?.availableBorrows).toString()) 
                            }
                    </div>
                    <ul className="flex flex-col">
                        <li className="w-full justify-end flex">
                            Current LTV: {
                            (Number(aaveAccount?.ltv) * 100).toFixed(2)
                            }%
                        </li>
                        <li className="w-full justify-end flex">
                            Liquidation LTV: {
                            (Number(aaveAccount?.currentLiquidationThreshold) * 100).toFixed(2)
                            }%
                        </li>
                    </ul>
            </div>
        )
    } else {
        return
    }

}

export default MessagesHeaderAaveStats