//region Imports
// * App Routes
import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './routes/AppRoutes.jsx';
//endregion Imports

//region App
const App = () => {
	try {
		return (
			<>
				<ToastContainer autoClose={2000} />
				<AppRoutes />
			</>
		);
	} catch (error) {
		return (
			<div className="container mt-5">
				<h4>Something went wrong</h4>
			</div>
		);
	}
};
//endregion App

export default App;
