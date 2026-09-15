import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.tsx'
import "./app.css"
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient.ts';

dayjs.locale('ar');



createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
