'use client';

import { FC, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/DropDownMenu';
import Button from '@/ui/Button';
import { toast } from '@/ui/Toast';
import { Loader2 } from 'lucide-react';
import { createApiKey } from '@/helpers/crete-api-key';
import { useRouter } from 'next/navigation';
import { revokeApiKey } from '@/helpers/revoke-api-key';

interface ApiKeyOptionsProps {
  apiKeyId: string;
  apiKeyKey: string;
}

const ApiKeyOptions: FC<ApiKeyOptionsProps> = ({ apiKeyId, apiKeyKey }) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const router = useRouter();

  const onClickCopy = () => {
    navigator.clipboard.writeText(apiKeyKey);

    toast({
      title: 'Copied',
      message: 'API key copied to clipboard',
      type: 'success',
    });
  };

  const createNewApiKey = async () => {
    setIsCreatingNew(true);

    try {
      await revokeApiKey();
      await createApiKey();

      router.refresh(); //refreshing page, ApiDashBoard component is a server-component and no need state
    } catch (error) {
      toast({
        title: 'Error creating API key',
        message: 'Please try again late',
        type: 'error',
      });
    } finally {
      setIsCreatingNew(false);
    }
  };

  const revokeCurrentApiKey = async () => {
    setIsRevoking(true);

    try {
      await revokeApiKey();

      router.refresh(); //refreshing page, ApiDashBoard component is a server-component and no need state
    } catch (error) {
      toast({
        title: 'Error revoking API key',
        message: 'Please try again late',
        type: 'error',
      });
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isCreatingNew || isRevoking} asChild>
        <Button variant="ghost" className="flex gap-2 items-center">
          <p>{isCreatingNew ? 'Creating new key' : isRevoking ? 'Revoking key' : 'Options'}</p>
          {isCreatingNew || isRevoking ? <Loader2 className="animate-spin h-4 w-4" /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onClickCopy}>Copy</DropdownMenuItem>
        <DropdownMenuItem onClick={createNewApiKey}>Create new key</DropdownMenuItem>
        <DropdownMenuItem onClick={revokeCurrentApiKey}>Revoke key</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApiKeyOptions;
