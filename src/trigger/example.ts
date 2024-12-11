import { logger, task, wait } from "@trigger.dev/sdk/v3";
const pool = require('@/src/db/db'); // Import the database pool
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
        event: payload.event, // Use event from the payload
        data: queryResult,    // Query result
      })
      .then(response => {
        logger.log('Callback Success', { response: response.data });
      })
      .catch(error => {
        logger.error('Callback Error', { error });
        throw error; // Throw to ensure task failure if callback fails
      });

      logger.log("Database query successful", { rows: queryResult });
    } catch (error) {
      logger.error("Error during database query", { error });
      throw error; // Rethrow the error to mark the task as failed
    } finally {
      if (connection) {
        connection.release(); // Return the connection to the pool
      }
    }

    return {
      message: "Task completed successfully!",
      queryResult, // Return query results as part of the task's output
    };
  },
});
