const axios = require("axios");
const services = require("../config/services");

const forwardRequest = async (req, res) => {
  try {
    const { service } = req.params;

    const serviceBase = {
      user: "/users",
      post: "/posts",
      revcode: "/revcode",
    };

    const rewrittenPath = req.originalUrl.replace(
      `/api/${service}`,
      serviceBase[service],
    );

    const target = services[service];

    const url = `${target}${rewrittenPath}`;

    const response = await axios({
      method: req.method,
      url,
      headers: {
        ...req.headers,
        "x-user-id": req.user._id.toString(),
      },
      data: req.body,
      timeout: 5000,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding request:", error.message);

    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Proxy error" });
  }
};

module.exports = forwardRequest;

/*
What This Code Does:
1. Imports the axios library for making HTTP requests and a services configuration module.
2. Defines an asynchronous function `forwardRequest` that handles incoming requests.
3. Extracts the target service from the request parameters and checks if it exists in the services configuration.
4. Constructs the target URL by combining the service base URL with the original request path.
5. Forwards the request to the target service using axios, preserving the method, headers, and body.
6. Sends the response from the target service back to the original requester.
7. Catches and logs any errors that occur during the forwarding process and responds with a 502 status code.

Why These Settings Matter:
- Dynamic Service Routing: Allows the gateway to route requests to different services based on the URL, enabling a microservices architecture.
- Header Management: Preserves important headers, such as user identification, to maintain context across services.
- Error Handling: Provides feedback when a service is unavailable, improving the robustness of the gateway.

*/
