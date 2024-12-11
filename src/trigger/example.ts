import { logger, task, wait } from "@trigger.dev/sdk/v3";
const pool = require('@/src/db/db'); // Import the database pool
import axios from "axios";

export const helloWorldTask = task({
  id: "hello-world",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: any, { ctx }) => {
    logger.log("Task started", { payload, ctx });

    // Wait for 5 seconds (optional logic)
    await wait.for({ seconds: 5 });

    // Database query logic
    let queryResult;
    let connection;
    try {
      connection = await pool.getConnection(); // Correct method for getting a connection
      const [rows] = await connection.query('SELECT * FROM users'); // Replace `user` with your table name
      queryResult = rows;

      axios.post('http://localhost:8000/api/handle-customers', {
        // id: ctx.run.id,
        // event: 'get-user',
        data : queryResult,
      })
        .then(response => {
          console.log('Success:', response.data);
        })
        .catch(error => {
          console.error('Error:', error);
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
      message: "Hello, world!",
      queryResult, // Return query results as part of the task's output
    };
  },
});
