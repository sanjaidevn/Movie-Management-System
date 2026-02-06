import { authMiddleware } from "../auth/authMiddleware.js";
import { UserModel } from "../../models/user/userModel.js";

//region Admin Register Gate Middleware (Inline)
// * If no admin exists -> allow public admin register (first admin)
// * If admin exists -> require authMiddleware and admin role
export const adminRegisterGate = async (req, res, next) => {
    try {
        const existingAdmin = await UserModel?.findOne?.({
            Role: 'admin',
            'Is-Deleted': 0,
        })
            ?.select?.({ _id: 1, 'User-Id': 1 })
            ?.lean?.()

        const adminAlreadyExists = Boolean(existingAdmin?.['User-Id'])

        //region If Admin Does Not Exist -> Allow Public
        if (!adminAlreadyExists) {
            return next?.()
        }
        //endregion If Admin Does Not Exist -> Allow Public

        //region If Admin Exists -> Require Auth
        return authMiddleware?.(req, res, next)
        //endregion If Admin Exists -> Require Auth
    } catch (error) {
        // safe fallback: if error, force auth to be safe
        return authMiddleware?.(req, res, next)
    }
}
//endregion Admin Register Gate Middleware (Inline)