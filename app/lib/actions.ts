'use server';
// All funtions in this file will be executed in the server, THIS FILLES NEVER REACH THE CLIENT

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoiceFormSchema = CreateInvoiceSchema.omit({
  id: true,
  date: true,
});

export async function createInvoice(formData: FormData) {
  // Object.fromEntries(formData.entries()) geting all vaalus of formData
  const { customerId, amount, status } = CreateInvoiceFormSchema.parse(
    Object.fromEntries(formData.entries()),
  );

  /// transform to avoid money rounding error
  const amountInCents = amount * 100;

  // Create actual Data Format :: 2023-11-25

  const [date] = new Date().toISOString().split('T');
  // https://vercel.com/docs/storage/vercel-postgres
  await sql`INSERT INTO Invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
