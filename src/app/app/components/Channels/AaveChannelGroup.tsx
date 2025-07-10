'use client';

import React, {
    useState,
    useEffect
} from "react";
import { 
    Collapsible, 
    CollapsibleTrigger, 
    CollapsibleContent 
} from "@/components/components/ui/collapsible";
import { 
    SidebarMenuButton, 
    SidebarMenuItem,
    SidebarMenuSub 
} from "@/components/components/ui/sidebar";
import { 
    HoverCard, 
    HoverCardTrigger, 
    HoverCardContent 
} from "@/components/components/ui/hover-card";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Channel from "./Channel";
import { 
  ethers, 
  formatUnits 
} from 'ethers';
import AaveL2LendingPool from '../../../../lib/aaveL2PoolABI.json'
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { AlphaPING } from "typechain-types";

interface IAaveChannelGroup{
    channels: {
        channel: AlphaPING.ChannelStructOutput,
        metadata: tokenMetadata
    }[]
}

const AaveChannelGroup:React.FC<IAaveChannelGroup> = ({ channels }) => {

    const { signer } = useEtherProviderContext()
    const { 
        account, 
        aaveAccount, 
        setAaveAccount 
    } = useUserProviderContext()

    // we are going to use this timer to refetch a new aave detail every 60 seconds
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Timer to update lastUpdated every 60 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
        setLastUpdated(new Date());
        }, 60 * 1000); // 60 seconds in milliseconds
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run once on mount
      
    // we need to find the user account details for aave if the user has any aave tokens
    useEffect(() => {
        const fetchAaveDetails = async (account: string) => {
        const aaveLendingPool = new ethers.Contract(
            // aave lending pool address
            "0x794a61358d6845594f94dc1db02a252b5b4814ad",
            AaveL2LendingPool.abi,
            signer
          );
          try{
            const accountData = await aaveLendingPool.getUserAccountData(account)
            console.log('accountData: ', accountData)
            if (accountData) {
              console.log('accountData: ', accountData)
    
              // Raw values are BigNumbers; convert them to human‑readable strings
              const cleanedAccountData: AaveUserAccount = {
                totalCollateral: formatUnits(accountData.totalCollateralBase, 8),
                totalDebt: formatUnits(accountData.totalDebtBase, 8),
                availableBorrows: formatUnits(accountData.availableBorrowsBase, 8),
                // liquidation threshhold in bps
                currentLiquidationThreshold: (Number(accountData.currentLiquidationThreshold) / 10000).toString(), 
                // ltv is in bps
                ltv: (Number(accountData.ltv) / 10000).toString(),
                healthFactor: formatUnits(accountData.healthFactor, 18)
              };
              console.log('user aave data:', cleanedAccountData);
              setAaveAccount(cleanedAccountData);
            } else {
                console.warn('No aave account data found for this user:', accountData);
                return;
            }
          } catch(error: unknown){
            if(error !== undefined || error !== null){
                console.warn("Error unable to fetch aave user account details for: " + signer + ": " + (error as Error).toString())
                return;
            }
          }
        }
    
        // only run this function if the user is part of an aave channel
        
        fetchAaveDetails(account)
      }, [
        account, 
        signer, 
        setAaveAccount,
        lastUpdated
      ])

    return(
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                <HoverCard>
                    <HoverCardTrigger asChild>
                <CollapsibleTrigger asChild>
                        <SidebarMenuButton >
                            <div className="flex items-center justify-start gap-4">
                            <Avatar className="size-4">
                                <AvatarImage 
                                    src='https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png' 
                                    alt="Token Logo"
                                    loading="lazy"
                                />
                                <AvatarFallback>
                                    Aave
                                </AvatarFallback>
                            </Avatar>
                            <p>
                                Aave
                            </p>
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
                                {
                                aaveAccount?.healthFactor === "115792089237316195423570985008687907853.269984665640564039457584007913129639935" ? 
                                "∞" :
                                Number(aaveAccount?.healthFactor).toFixed(2)
                                }
                            </div>
                            </div>  
                        </SidebarMenuButton>    
                    </CollapsibleTrigger>
                    </HoverCardTrigger>
                        <HoverCardContent className="bg-primary text-secondary">
                        <div className="w-full">
                            <div className="w-full justify-end flex text-xl text-accent">
                            Aave Stats
                            </div>
                            <ul className="flex flex-col gap-2 justify-end">
                            <li
                                className={
                                // render color based on health factor
                                Number(aaveAccount?.healthFactor) <= 1.1 ?
                                "text-red-500 w-full justify-end flex" :
                                Number(aaveAccount?.healthFactor) <= 2.0 ?
                                "text-yellow-500 w-full justify-end flex" :
                                "text-green-500 w-full justify-end flex"
                                }
                            >
                                Health Factor: {
                                Number(aaveAccount?.healthFactor).toFixed(2)
                                }
                            </li>
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
                            <li className="w-full justify-end flex">
                                = Net Worth: ${ 
                                humanReadableNumbers(
                                    (
                                    Number(aaveAccount?.totalCollateral) -
                                    Number(aaveAccount?.totalDebt)
                                    ).toString()
                                )
                                }
                            </li>
                            <br/>
                            <li className="w-full justify-end flex">
                                Can Borrow: ${ 
                                humanReadableNumbers(Number(aaveAccount?.availableBorrows).toString()) 
                                }
                            </li>
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
                            <li className="w-full justify-end flex text-xl">
                                <Link
                                href="https://app.aave.com/"
                                target="_blank"
                                >
                                    <ExternalLink className="text-accent"/>
                                </Link>
                            </li>
                            </ul>
                        </div>
                        </HoverCardContent>
                    </HoverCard>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                        {
                            channels.map(({ channel, metadata }) => (
                                <SidebarMenuItem key={channel.tokenAddress}>
                                <Channel 
                                    channel={channel} 
                                    tokenMetadata={metadata} 
                                />
                                </SidebarMenuItem>
                            ))
                        }
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
                </Collapsible>
    )
}

export default AaveChannelGroup;