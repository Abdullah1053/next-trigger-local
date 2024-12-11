import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the payload
    const { event, data }: { event: WebhookEvent; data: WebhookData } = body;
    if (!event || !data) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    console.log("Webhook received:", { event, data });

    // Call the processing function
    await processWebhookEvent(event, data);

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function saveOrderToDatabase(orderData: OrderCreatedData) {
  console.log("Saving order to database:", orderData);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function handlePayment(paymentData: PaymentCompletedData) {
  console.log("Handling payment:", paymentData);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

type WebhookEvent = "order.created" | "payment.completed" | "unknown";

interface OrderCreatedData {
  orderId: number;
  customerName: string;
  amount: number;
}

interface PaymentCompletedData {
  paymentId: string;
  amount: number;
}

type WebhookData = OrderCreatedData | PaymentCompletedData;


// Function to process the webhook event
async function processWebhookEvent(event: WebhookEvent, data: WebhookData) {
    switch (event) {
      case "order.created":
        const orderData = data as OrderCreatedData;
        console.log(`Processing order with ID: ${orderData.orderId}`);
        await saveOrderToDatabase(orderData);
        break;
  
      case "payment.completed":
        const paymentData = data as PaymentCompletedData;
        console.log(`Processing payment with ID: ${paymentData.paymentId}`);
        await handlePayment(paymentData);
        break;
  
      default:
        console.warn(`Unknown event type: ${event}`);
        break;
    }
  }
