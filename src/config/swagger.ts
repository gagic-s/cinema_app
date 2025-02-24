import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express"; // ✅ Use Application instead of Express

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cinema API",
      version: "1.0.0",
      description: "API documentation for the Cinema application",
    },
    components: {
      schemas: {
        MovieResponse: {
          type: "object",
          properties: {
            createdAt: { type: "string", format: "date-time" },
            duration: { type: "number" },
            movie_id: { type: "string", format: "uuid" },
            name: { type: "string" },
            originalName: { type: "string" },
            posterImage: { type: "string" },
            updatedAt: { type: "string", format: "date-time" },
            screenings: {
              type: "array",
              items: { $ref: "#/components/schemas/Screening" },
            },
            genres: {
              type: "array",
              items: { $ref: "#/components/schemas/Genre" },
            },
          },
        },
        Screening: {
          type: "object",
          properties: {
            screening_id: { type: "string", format: "uuid" },
            ticketPrice: { type: "number" },
            screeningDate: { type: "string", format: "date" },
            screeningTime: { type: "string", format: "time" },
          },
        },
        Genre: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
        Movie: {
          type: "object",
          properties: {
            movie_id: {
              type: "string",
              format: "uuid",
              example: "8c1a546c-c271-49ee-9ad8-a906878c5fb0",
            },
            name: {
              type: "string",
              example: "poster",
            },
            originalName: {
              type: "string",
              example: "New movie",
            },
            posterImage: {
              type: "string",
              format: "url",
              example:
                "https://res.cloudinary.com/da4cs8h8r/image/upload/v1739881269/movie_posters/t76aolas6ada356uvtgu.jpg",
            },
            posterPublicId: {
              type: "string",
              example: "movie_posters/t76aolas6ada356uvtgu",
            },
            duration: {
              type: "integer",
              example: 66,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-02-18T12:21:10.433Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-02-18T12:21:10.433Z",
            },
          },
        },
      },
    },

    servers: [{ url: "http://localhost:8000/api" }], // Ensure port matches your app
  },
  apis: ["./src/routes/*.ts"], // Ensure it points to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:5000/api-docs");
};
