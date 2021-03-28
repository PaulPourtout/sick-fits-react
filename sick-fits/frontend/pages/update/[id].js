import AdminAccess from '../../components/AdminAccess';
import PleaseSignIn from '../../components/PleaseSignIn';
import UpdateProduct from '../../components/UpdateProduct';

export default function UpdatePage({ query }) {

    return (
        <AdminAccess>
            <UpdateProduct id={query.id} />
        </AdminAccess>
    )
}
