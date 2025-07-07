import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import settingsConfig from 'app/configs/settingsConfig';
import { Navigate } from 'react-router-dom';
import UsersPage from '../features/users/pages/UsersPage';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';

const routeConfigs: FuseRouteConfigsType = [ExampleConfig, SignOutConfig, SignInConfig, SignUpConfig];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/example" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: '/users',
		element: <UsersPage />
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;
