import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import FuseLayout from '@fuse/core/FuseLayout';
import { selectMainTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import FuseTheme from '@fuse/core/FuseTheme';
import MockAdapterProvider from '@mock-api/MockAdapterProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import { queryClient } from 'src/configs/queryClient';
import rtlPlugin from 'stylis-plugin-rtl';
import { AuthRouteProvider } from './auth/AuthRouteProvider';
import withAppProviders from './withAppProviders';

import { TenantProvider } from './providers/TenantProvider';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point')
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point')
	}
};

/**
 * The main App component.
 */
function App() {
	/**
	 * The language direction from the Redux store.
	 */
	const langDirection = useSelector(selectCurrentLanguageDirection);

	/**
	 * The main theme from the Redux store.
	 */
	const mainTheme = useSelector(selectMainTheme);

	return (
		<MockAdapterProvider>
			<TenantProvider>
				<QueryClientProvider client={queryClient}>
					<CacheProvider value={createCache(emotionCacheOptions[langDirection] as Options)}>
						<FuseTheme
							theme={mainTheme}
							direction={langDirection}
						>
							<AuthRouteProvider>
								<SnackbarProvider
									maxSnack={5}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right'
									}}
									classes={{
										containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
									}}
								>
									<FuseLayout layouts={themeLayouts} />
								</SnackbarProvider>
							</AuthRouteProvider>
						</FuseTheme>
					</CacheProvider>
				</QueryClientProvider>
			</TenantProvider>
		</MockAdapterProvider>
	);
}

export default withAppProviders(App);
