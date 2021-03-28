import AdminAccess from '../components/AdminAccess';
import CreateProduct from '../components/CreateProduct';
import PleaseSignIn from '../components/PleaseSignIn';

export default function SellPage() {
  return (
      <AdminAccess>
        <CreateProduct/>
      </AdminAccess>
  );
}
