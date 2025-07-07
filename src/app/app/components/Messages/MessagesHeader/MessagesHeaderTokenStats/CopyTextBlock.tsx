'use client';

import React, 
    { useState } from 'react';
import { 
    Copy,
    ShieldCheck, 
    CircleX   
} from 'lucide-react'; 
import { Button } from '@/components/components/ui/button';
import { useToast } from "@/components/hooks/use-toast"

interface ICopyTextBlockProps {
  text: string;
}

const CopyTextBlock: React.FC<ICopyTextBlockProps> = ({ text }) => {

    const { toast } = useToast()
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (error) {
      console.error('Failed to copy!', error);
      if(error !== null){
        toast({
            title: "Error!",
            description: ('Copying text failed!'),
            duration:3000,
            action: (
                <div className="flex flex-col gap-1 justify-center items-center">
                    <CircleX size={40}/>
                    <div className="flex flex-col gap-1 text-sm">
                        Copying text failed!
                    </div>
                </div>
            ),
            variant: "destructive",
        })
    }
    } finally {
        if(copied !== null){
            toast({
                title: "Success!",
                description: 'Copied to clipboard!',
                duration:3000,
                action: (
                    <div className="flex flex-row gap-1">
                        <ShieldCheck size={80}/>
                        <div className="flex flex-col gap-1 text-green-500">
                            Copied to Clipboard!
                        </div>
                    </div>
                )
            })
        }
    }
  };

  return (
      <div className='flex items-center gap-2'>
            <Button
                onClick={handleCopy}
                variant={"default"}
                className="h-6 w-6 p-0"
            >
                <Copy className="w-4 h-4" />
            </Button>
      </div>
  );
};

export default CopyTextBlock;
