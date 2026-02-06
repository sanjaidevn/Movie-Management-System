//region Imports

// * React core library and hook for handling side effects on mount
import { useEffect } from 'react';
// * Redux provider for store injection and hook for dispatching actions
import { Provider, useDispatch } from 'react-redux';
// * Router wrapper for enabling client-side navigation
import { BrowserRouter } from 'react-router-dom';

// * Global Redux store configuration instance
import { store } from '../store/store.js';

// * User-related thunks and actions for session persistence and status tracking
import { getUserThunk } from '../../redux/user/userSlice.js';
// * Auth actions for managing user sessions and manual logout triggers
import { forceLogout, setAuthUser } from '../../redux/auth/authSlice.js';

//endregion Imports

//region Inner Provider Wrapper
const InnerProviders = ({ children }) => {
  try {
    const dispatch = useDispatch();

    useEffect(() => {
      const init = async () => {
        try {
          const user = await dispatch?.(getUserThunk?.())?.unwrap?.();
          dispatch?.(setAuthUser?.(user ?? null));
        } catch (err) {
          dispatch?.(forceLogout?.());
        }
      };

      init?.();
    }, [dispatch]);

    return <>{children}</>;
  } catch (error) {
    return <>{children}</>;
  }
};
//endregion Inner Provider Wrapper

//region App Providers
const AppProviders = ({ children }) => {
  try {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <InnerProviders>{children}</InnerProviders>
        </BrowserRouter>
      </Provider>
    );
  } catch (error) {
    return <>{children}</>;
  }
};
//endregion App Providers

export { AppProviders };
