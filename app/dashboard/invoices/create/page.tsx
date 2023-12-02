import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";
import { Customer } from '../../../lib/definitions';


export default async function Page() {
    const customer = await fetchCustomers()

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    { label: 'Create Invoices', href: '/dashboard/invoices/create' }
                ]}
            />
            <Form customers={customer} />
        </main>
    )
}