'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/ja';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
  typography: {
    fontFamily: ['var(--font-geist-sans)', 'sans-serif'].join(','),
  },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // useState の初期関数でクライアントを一度だけ生成
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry: false,
      },
    },
  }));

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
