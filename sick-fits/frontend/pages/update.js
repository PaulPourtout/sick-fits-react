import PleaseSignIn from '../components/PleaseSignIn';
import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage({ query }) {

    return (
        <div>
            <PleaseSignIn>
                <UpdateProduct id={query.id} />
            </PleaseSignIn>
        </div>
    )
}
