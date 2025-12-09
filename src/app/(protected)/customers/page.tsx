import { getCustomers } from "./actions";
import CustomerList from "@/components/customers/CustomerList";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return <CustomerList customers={customers} />;
}
