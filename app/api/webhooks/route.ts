import  { NextRequest, NextResponse } from 'next/server';
import logger from '@/utils/logger';
import { tasks ,configure } from "@trigger.dev/sdk/v3";
import { helloWorldTask } from '@/src/trigger/example';

export async function POST(req: NextRequest, res: NextResponse) {
  configure({
    secretKey: "tr_dev_mrUX6577f70QWJi4UUGA",
    baseURL: "http://localhost:3040"
  });

  if (req.method === 'POST') {
    let payload :any;
    try {
      // const rawBody = await req.text();
      logger.info('The whole request:', { req: JSON.stringify(req) });
      const body = await req.json();

      // Extract data from the parsed body
      const { address, ...rest } = body;
  
      payload = body;
  
      // payload = JSON.parse(rawBody);
      // logger.info(`Received webhook: ${payload}`);
      // logger.info(`Received body json:,${JSON.stringify(body)}`);
      // logger.info(`the whole ,${req.headers + req.url + req}`);

      if (!payload || !payload.event) {
        return NextResponse.json({
          message: 'Bad Request: Missing event in payload'
        }, { status: 400 });
      }

      let handler;

      switch (payload.event) {
        case "get-user":
          handler = await tasks.trigger<typeof helloWorldTask>("hello-world", payload);
          return NextResponse.json({
            message: 'Webhook processed successfully',
            id: handler.id,
            event: payload.event
          });

        case "update-user":
          // handler = await tasks.trigger<typeof updateUserTask>("update-user", payload);
          handler = await tasks.trigger<typeof helloWorldTask>("hello-world", payload);
          return NextResponse.json({
            message: 'User updated successfully',
            id: handler.id,
            event: payload.event
          });

        case "delete-user":
          // handler = await tasks.trigger<typeof deleteUserTask>("delete-user", payload);
          handler = await tasks.trigger<typeof helloWorldTask>("hello-world", payload);

          return NextResponse.json({
            message: 'User deleted successfully',
            id: handler.id,
            event: payload.event
          });

        default:
          logger.warn(`Unhandled event type: ${payload.event}`);
          return NextResponse.json({
            message: `Unhandled event type: ${payload.event}`
          }, { status: 400 });
      }

    } catch (error) {
      logger.error(`Error processing webhook: ${(error as Error).stack || (error as Error).message}`);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({
      message: `Method ${req.method} Not Allowed`
    }, {
      status: 405,
      headers: { Allow: 'POST' }
    });
  }
}
