'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { clearAccessToken } from '../../session/session';
import { logoutRequest } from '../api/logoutRequest';

export function useLogout(onLogoutSuccess?: () => void) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      clearAccessToken();
      onLogoutSuccess?.();
      await queryClient.cancelQueries();
      queryClient.clear();
      router.replace(ROUTES.signIn);
    },
  });
}
