import { useUser } from './User';
import SignIn from './SignIn';

export default function({children}) {
    const user = useUser();

    if (!user) return <SignIn/>;
    return children;
}
