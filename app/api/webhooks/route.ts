import  { NextRequest, NextResponse } from 'next/server';
import logger from '@/utils/logger';
import { tasks ,configure } from "@trigger.dev/sdk/v3";
import { helloWorldTask } from '@/src/trigger/example';

export async function POST(req: NextRequest , res: NextResponse) {

  configure({
    secretKey: "tr_dev_mrUX6577f70QWJi4UUGA",
    baseURL: "http://localhost:3040"
  });
  if (req.method === 'POST') {
    try {
      const payload = req.body;
      logger.info('Received webhook:', payload);
      let handler :any;
      handler = await tasks.trigger<typeof helloWorldTask>("hello-world", payload);


      return NextResponse.json({ message: 'Webhook received successfully',id:handler.id , event:"get-user" });
    } catch (error) {
      logger.error(
        `Error processing webhook: ${(error as Error).stack || (error as Error).message}`
      );
     return  NextResponse.json({ message: 'Internal Server Error' });
    }
  } else {
    // Reject non-POST requests

    return NextResponse.json({ message: `Method ${req.method} Not Allowed` } ,
     {
      status: 405,
      headers: { Allow: 'POST' },
    }
    );
  }
}
