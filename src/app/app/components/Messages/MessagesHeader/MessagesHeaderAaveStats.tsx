'use client';

import React from "react";
import Link from "next/link";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useAaveDetailsContext } from "src/contexts/AaveDetailsContext";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { Separator } from "@/components/components/ui/separator";
import { Badge } from "@/components/components/ui/badge";

const MessagesHeaderAaveStats:React.FC = () => {

    const { 
        selectedChannelMetadata,
    } = useChannelProviderContext()
    const { aaveAccount, aaveAssetDetails } = useAaveDetailsContext()

    if(
        aaveAccount !== null &&
        selectedChannelMetadata !== null &&
        selectedChannelMetadata?.protocol &&
        selectedChannelMetadata?.protocol === 'aave'
    ){
        return(
            <div className="flex flex-row flex-wrap w-full gap-4 text-xl">
                <div className="flex flex-col h-full justify-evenly">
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
                </div>
                {
                    aaveAssetDetails !== null &&
                    <div className="flex flex-col justify-evenly">
                        <Badge className="text-lg">
                            Supply APY: { 
                                Number(aaveAssetDetails.supplyRate) * 100 < 0.01 ?
                                "< 0.01" :
                                (Number(aaveAssetDetails.supplyRate) * 100).toFixed(2)
                            }%
                        </Badge>
                        <Badge className="text-lg">
                            Borrow APY: { 
                                (Number(aaveAssetDetails.borrowRate) * 100).toFixed(2) 
                            }%
                        </Badge>
                    </div>

                }
                    <div className="flex flex-col h-full justify-evenly">
                        <div 
                            className={
                                // render color based on health factor
                                Number(aaveAccount?.healthFactor) <= 1.1 ?
                                "text-red-500" :
                                Number(aaveAccount?.healthFactor) <= 5.0 ?
                                "text-yellow-500" :
                                "text-green-500"
                            }
                            > 
                                Health Factor: {
                                    aaveAccount?.healthFactor === "115792089237316195423570985008687907853.269984665640564039457584007913129639935" ? 
                                    "∞" :
                                    Number(aaveAccount?.healthFactor).toFixed(2)
                                }
                        </div>
                        <div className="justify-end flex">
                                Can Borrow: ${ 
                                humanReadableNumbers(Number(aaveAccount?.availableBorrows).toString()) 
                                }
                        </div>
                    </div>
                    <ul className="flex flex-col text-sm justify-evenly">
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
                    <ul className="flex flex-col h-full justify-evenly">
                        <li className="w-full justify-end flex">
                            Effective LTV: {
                                    aaveAccount?.healthFactor === "115792089237316195423570985008687907853.269984665640564039457584007913129639935" ? 
                                    "0" :
                                    ((1 / Number(aaveAccount?.healthFactor)*100)).toFixed(2)
                                }%
                        </li>
                        <li className="w-full justify-end flex">
                            Max LTV: {
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