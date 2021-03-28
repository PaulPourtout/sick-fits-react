import { useUser } from './User';

export default function AdminAccess({children}) {
    const user = useUser();

    if (!user?.role?.canManageProducts) {
        return (
            <>
                <h2>No authorization to access this page.</h2>
                <p>Please connect as admin and retry.</p>
            </>
        )
    }
    return children;
}
