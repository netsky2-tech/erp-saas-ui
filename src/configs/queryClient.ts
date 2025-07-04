import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

const queryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1
		}
	}
};

export const queryClient = new QueryClient(queryClientConfig);
