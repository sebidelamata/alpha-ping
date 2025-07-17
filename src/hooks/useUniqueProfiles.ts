import { useMemo } from 'react';
import { useChannelProviderContext } from '../contexts/ChannelContext';
import { useMessagesProviderContext } from '../contexts/MessagesContext';

const useUniqueProfiles = () => {
  const { currentChannel } = useChannelProviderContext();
  const { messages } = useMessagesProviderContext();

  const uniqueProfiles = useMemo(() => {
    if (!currentChannel || !messages) return new Set<string>();
    
    return new Set<string>(
      messages
        .filter(message => message.channel === currentChannel.id.toString())
        .map(message => message.account)
    );
  }, [currentChannel, messages]);

  return { uniqueProfiles }
};

export default useUniqueProfiles;