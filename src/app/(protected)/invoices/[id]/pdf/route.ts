import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getInvoice } from "../../actions";
import { getUserSettings } from "../../../settings/actions";
import { generateInvoicePdf } from "@/lib/pdf/generateInvoicePdf";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;

  const [invoice, settings] = await Promise.all([
    getInvoice(id),
    getUserSettings(),
  ]);

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  if (!settings) {
    return new NextResponse("User settings not found", { status: 400 });
  }

  try {
    const pdfBuffer = await generateInvoicePdf(invoice, settings);

    const filename = `Rechnung_${invoice.invoice_number}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
