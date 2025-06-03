const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
      info: {
      title: 'React Jobs API',
      description: 'API for the React Jobs application that manages job listings and user authentication',
      version: '1.0.0',
    },
    servers: [
      {
        url: "https://react-jobs-api-rutx.onrender.com",
        description: "Production server"
      },
      {
        url: "http://localhost:3500",
        description: "Development server"
      }
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication operations"
      },
      {
        name: "Jobs",
        description: "Job listing operations"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            username: {
              type: "string",
              example: "john_doe"
            },
            role: {
              type: "string",
              enum: [
                "job_seeker",
                "job_poster"
              ],
              example: "job_poster"
            }
          }
        },
        Job: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            title: {
              type: "string",
              example: "Senior React Developer"
            },
            type: {
              type: "string",
              enum: [
                "Full-Time",
                "Part-Time",
                "Remote",
                "Internship"
              ],
              example: "Full-Time"
            },
            description: {
              type: "string",
              example: "We are looking for an experienced React developer..."
            },
            location: {
              type: "string",
              example: "San Francisco, CA"
            },
            salary: {
              type: "string",
              example: "$100K - $125K"
            },
            user_id: {
              type: "integer",
              example: 1
            },
            company: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Tech Solutions Inc."
                },
                description: {
                  type: "string",
                  example: "A leading technology company..."
                },
                contactEmail: {
                  type: "string",
                  example: "jobs@techsolutions.com"
                },
                contactPhone: {
                  type: "string",
                  example: "(123) 456-7890"
                }
              }
            }
          }
        },
        NewJob: {
          type: "object",
          properties: {
            title: {
              type: "string",
              example: "Senior React Developer"
            },
            type: {
              type: "string",
              example: "Full-Time"
            },
            description: {
              type: "string",
              example: "We are looking for an experienced React developer..."
            },
            location: {
              type: "string",
              example: "San Francisco, CA"
            },
            salary: {
              type: "string",
              example: "$100K - $125K"
            },
            company: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "Tech Solutions Inc."
                },
                description: {
                  type: "string",
                  example: "A leading technology company..."
                },
                contactEmail: {
                  type: "string",
                  example: "jobs@techsolutions.com"
                },
                contactPhone: {
                  type: "string",
                  example: "(123) 456-7890"
                }
              }
            }
          },
          required: [
            "title",
            "type",
            "location",
            "salary",
            "company"
          ]
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string"
            },
            details: {
              type: "string"
            }
          }
        }
      }
    },
    paths: {
      "/": {
        get: {
          summary: "API Status check",
          description: "Checks if the API is running",
          tags: [
            "General"
          ],
          responses: {
            200: {
              description: "API is running",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "API is running"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/login": {
        post: {
          summary: "User login",
          description: "Authenticates a user and returns JWT tokens",
          tags: [
            "Authentication"
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "string",
                      example: "john_doe"
                    },
                    pwd: {
                      type: "string",
                      example: "SecureP@ssw0rd"
                    }
                  },
                  required: [
                    "user",
                    "pwd"
                  ]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Login successful"
                      },
                      user: {
                        $ref: "#/components/schemas/User"
                      },
                      accessToken: {
                        type: "string"
                      },
                      refreshToken: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Invalid username or password"
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Login failed"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/register": {
        post: {
          summary: "User registration",
          description: "Registers a new user as either job seeker or job poster",
          tags: [
            "Authentication"
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "string",
                      example: "john_doe"
                    },
                    pwd: {
                      type: "string",
                      example: "SecureP@ssw0rd"
                    },
                    role: {
                      type: "string",
                      enum: [
                        "job_seeker",
                        "job_poster"
                      ],
                      example: "job_seeker"
                    }
                  },
                  required: [
                    "user",
                    "pwd",
                    "role"
                  ]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Registration successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Registration successful"
                      },
                      user: {
                        $ref: "#/components/schemas/User"
                      },
                      accessToken: {
                        type: "string"
                      },
                      refreshToken: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: "Invalid role",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Invalid role selected"
                      }
                    }
                  }
                }
              }
            },
            409: {
              description: "Username already exists",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Username already exists"
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Registration failed"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/refresh-token": {
        post: {
          summary: "Refresh access token",
          description: "Uses a refresh token to generate a new access token",
          tags: [
            "Authentication"
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refreshToken: {
                      type: "string"
                    }
                  },
                  required: [
                    "refreshToken"
                  ]
                }
              }
            }
          },
          responses: {
            200: {
              description: "New access token generated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accessToken: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: "Refresh token required",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Refresh token required"
                      }
                    }
                  }
                }
              }
            },
            403: {
              description: "Invalid refresh token",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Invalid or expired refresh token"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/logout": {
        post: {
          summary: "User logout",
          description: "Invalidates the refresh token",
          tags: [
            "Authentication"
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refreshToken: {
                      type: "string"
                    }
                  }
                }
              }
            }
          },
          responses: {
            204: {
              description: "Successfully logged out"
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Server error"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/jobs": {
        get: {
          summary: "Get all jobs",
          description: "Retrieves all job listings with optional filtering",
          tags: [
            "Jobs"
          ],
          parameters: [
            {
              in: "query",
              name: "_limit",
              schema: {
                type: "integer"
              },
              description: "Limit the number of jobs returned"
            },
            {
              in: "query",
              name: "location",
              schema: {
                type: "string"
              },
              description: "Filter by job location"
            },
            {
              in: "query",
              name: "type",
              schema: {
                type: "string"
              },
              description: "Filter by job type"
            },
            {
              in: "query",
              name: "salary",
              schema: {
                type: "string"
              },
              description: "Filter by salary range"
            }
          ],
          responses: {
            200: {
              description: "A list of jobs",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      jobs: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Job"
                        }
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Failed to fetch jobs"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Create a new job",
          description: "Creates a new job listing (requires job poster role)",
          tags: [
            "Jobs"
          ],
          security: [
            {
              BearerAuth: [

              ]
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NewJob"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Job created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Job"
                  }
                }
              }
            },
            401: {
              description: "Access token required",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Access token required"
                      }
                    }
                  }
                }
              }
            },
            403: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Access denied. Only job posters can perform this action."
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/jobs/{id}": {
        get: {
          summary: "Get job by ID",
          description: "Retrieves a specific job by ID",
          tags: [
            "Jobs"
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer"
              },
              description: "Job ID"
            }
          ],
          responses: {
            200: {
              description: "Job details",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Job"
                  }
                }
              }
            },
            404: {
              description: "Job not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Job not found"
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Failed to fetch job"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        put: {
          summary: "Update job",
          description: "Updates an existing job (requires job poster role and ownership)",
          tags: [
            "Jobs"
          ],
          security: [
            {
              BearerAuth: [

              ]
            }
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer"
              },
              description: "Job ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NewJob"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Job updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Job"
                  }
                }
              }
            },
            401: {
              description: "Access token required",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Access token required"
                      }
                    }
                  }
                }
              }
            },
            403: {
              description: "Unauthorized or not job owner",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "You do not have permission to update this job listing"
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Job not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Job not found"
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: "Delete job",
          description: "Deletes a job (requires job poster role and ownership)",
          tags: [
            "Jobs"
          ],
          security: [
            {
              BearerAuth: [

              ]
            }
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "integer"
              },
              description: "Job ID"
            }
          ],
          responses: {
            200: {
              description: "Job deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Job deleted successfully"
                      },
                      id: {
                        type: "integer",
                        example: 1
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: "Access token required",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Access token required"
                      }
                    }
                  }
                }
              }
            },
            403: {
              description: "Unauthorized or not job owner",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "You do not have permission to delete this job listing"
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Job not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        example: "Job not found"
                      }
                    }
                  }
                }
              }
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./index.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};