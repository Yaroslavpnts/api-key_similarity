'use client';

import { FC, useState } from 'react';
import Button from '@/ui/Button';
import { signIn, signOut } from 'next-auth/react';
import { toast } from '@/ui/Toast';

/*
    Создали отдельный второй компонент SignOutButton (который идентичный компоненту SignInButton),
    только разные функции вызывают эти компоненты, можно было бы сделать один компонент и передавать туда функцию,
    которую компонент должен вызывать при клике, НО в next js 13 версии с добавление server-side & client-side компонент
    Нельзя рендерить client-side компонент из server-side компонента и передавать в него как проп функцию
    Я так понимаю из-за того, что она не сериализируется
*/

interface SignOutButtonProps {}

const SignOutButton: FC<SignOutButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const signUserOut = async () => {
    setIsLoading(true);

    try {
      await signOut();
    } catch (error) {
      toast({
        title: 'Error signing out',
        message: 'Please try again later',
        type: 'error',
      });
    }

    setIsLoading(false);
  };

  return (
    <Button onClick={signUserOut} isLoading={isLoading}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
