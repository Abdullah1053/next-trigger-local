import { logger, task, wait } from "@trigger.dev/sdk/v3";
const pool = require('@/src/db/db'); 
import axios from "axios";

export const helloWorldTask = task({
  id: "hello-world",
  maxDuration: 300,
  run: async (payload: any, { ctx }) => {
    logger.log("Task started", { payload, ctx });

    await wait.for({ seconds: 5 });

    let queryResult;
    let connection;
    try {
      connection = await pool.getConnection();

      const [rows] = await connection.query('SELECT * FROM users WHERE group_id = ?', [payload.group_id]);
      queryResult = rows;

      await axios.post(payload.callback_url, {
        id: ctx.run.id,
        event: payload.event, 
        data: queryResult,   
      })
      .then(response => {
        logger.log('Callback Success', { response: response.data });
      })
      .catch(error => {
        logger.error('Callback Error', { error });
        throw error; 
      });

      logger.log("Database query successful", { rows: queryResult });
    } catch (error) {
      logger.error("Error during database query", { error });
      throw error; 
    } finally {
      if (connection) {
        connection.release(); 
      }
    }

    return {
      message: "Task completed successfully!",
      queryResult, 
    };
  },
});
