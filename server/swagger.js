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
      },
      {
        name: "Users",
        description: "User profile operations"
      },
      {
        name: "Applications",
        description: "Job application operations"
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

        Application: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            job_id: {
              type: "integer",
              example: 1
            },
            user_id: {
              type: "integer",
              example: 2
            },
            resume_path: {
              type: "string",
              nullable: true,
              example: "http://localhost:3500/uploads/resumes/1623456789-resume.pdf"
            },
            cover_letter: {
              type: "string",
              example: "I am very interested in this position..."
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2025-06-01T12:00:00Z"
            }
          }
        },

        ApplicationWithUser: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            job_id: {
              type: "integer",
              example: 1
            },
            user_id: {
              type: "integer",
              example: 2
            },
            resume_path: {
              type: "string",
              nullable: true,
              example: "http://localhost:3500/uploads/resumes/1623456789-resume.pdf"
            },
            cover_letter: {
              type: "string",
              example: "I am very interested in this position..."
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2025-06-01T12:00:00Z"
            },
            username: {
              type: "string",
              example: "jane_smith"
            },
            profile_image_url: {
              type: "string",
              nullable: true,
              example: "http://localhost:3500/uploads/1623456789-profile.jpg"
            },
            user_created_at: {
              type: "string",
              format: "date-time",
              example: "2025-05-01T12:00:00Z"
            }
          }
        },

        JobApplication: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            job_id: {
              type: "integer",
              example: 1
            },
            user_id: {
              type: "integer",
              example: 2
            },
            resume_path: {
              type: "string",
              nullable: true,
              example: "http://localhost:3500/uploads/resumes/1623456789-resume.pdf"
            },
            cover_letter: {
              type: "string",
              example: "I am very interested in this position..."
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2025-06-01T12:00:00Z"
            },
            job_title: {
              type: "string",
              example: "Senior React Developer"
            },
            company_name: {
              type: "string",
              example: "Tech Solutions Inc."
            }
          }
        },

        PendingApplication: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            job_id: {
              type: "integer",
              example: 1
            },
            user_id: {
              type: "integer",
              example: 2
            },
            resume_path: {
              type: "string",
              nullable: true,
              example: "http://localhost:3500/uploads/resumes/1623456789-resume.pdf"
            },
            cover_letter: {
              type: "string",
              example: "I am very interested in this position..."
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2025-06-01T12:00:00Z"
            },
            job_title: {
              type: "string", 
              example: "Senior React Developer"
            },
            applicant_name: {
              type: "string",
              example: "jane_smith"
            }
          }
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
      },
      "/users/profile": {
        put: {
          summary: "Update user profile",
          description: "Updates user profile information including profile image upload",
          tags: ["Users"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    profileImage: {
                      type: "string",
                      format: "binary",
                      description: "Profile image file"
                    }
                  }
                }
              }
            },
            responses: {
              200: {
                description: "Profile updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        username: { type: "string" },
                        role: { type: "string" },
                        profileImageUrl: { 
                          type: "string",
                          nullable: true
                        },
                        created_at: { type: "string", format: "date-time" }
                      }
                    }
                  }
                }
              },
              401: { $ref: "#/components/responses/UnauthorizedError" },
              404: { description: "User not found" },
              500: { $ref: "#/components/responses/ServerError" }
            }
          }
        }
      },

      "/users/profile/image": {
        delete: {
          summary: "Delete profile image",
          description: "Removes the user's profile image",
          tags: ["Users"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Profile image deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      username: { type: "string" },
                      role: { type: "string" },
                      profileImageUrl: { 
                        type: "string",
                        nullable: true
                      },
                      created_at: { type: "string", format: "date-time" }
                    }
                  }
                }
              }
            },
            401: { $ref: "#/components/responses/UnauthorizedError" },
            404: { description: "User not found" },
            500: { $ref: "#/components/responses/ServerError" }
          }
        }
      },

      "/jobs/{id}/apply": {
        post: {
          summary: "Apply for a job",
          description: "Submit a job application with resume and cover letter",
          tags: ["Applications"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "Job ID"
            }
          ],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    resume: {
                      type: "string",
                      format: "binary",
                      description: "Resume file (PDF, DOC, DOCX)"
                    },
                    coverLetter: {
                      type: "string",
                      description: "Cover letter text"
                    }
                  }
                }
              }
            },
            responses: {
              201: {
                description: "Application submitted successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        application: { $ref: "#/components/schemas/Application" }
                      }
                    }
                  }
                }
              },
              401: { $ref: "#/components/responses/UnauthorizedError" },
              403: { 
                description: "Forbidden - only job seekers can apply", 
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string" }
                      }
                    }
                  }
                }
              },
              404: { description: "Job not found" },
              409: { description: "Already applied to this job" },
              500: { $ref: "#/components/responses/ServerError" }
            }
          }
        }
      },

      "/jobs/{id}/applications": {
        get: {
          summary: "Get job applications",
          description: "Retrieves all applications for a specific job (requires job ownership)",
          tags: ["Applications"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "Job ID"
            }
          ],
          responses: {
            200: {
              description: "List of applications",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      applications: {
                        type: "array",
                        items: { $ref: "#/components/schemas/ApplicationWithUser" }
                      }
                    }
                  }
                }
              }
            },
            401: { $ref: "#/components/responses/UnauthorizedError" },
            403: { description: "Forbidden - not the job owner" },
            404: { description: "Job not found" },
            500: { $ref: "#/components/responses/ServerError" }
          }
        }
      },

      "/jobs/{jobId}/applications/{appId}": {
        put: {
          summary: "Update application status",
          description: "Approve or reject a job application",
          tags: ["Applications"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "jobId",
              required: true,
              schema: { type: "integer" },
              description: "Job ID"
            },
            {
              in: "path",
              name: "appId",
              required: true,
              schema: { type: "integer" },
              description: "Application ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["approved", "rejected"],
                      description: "New application status"
                    }
                  },
                  required: ["status"]
                }
              }
            },
            responses: {
              200: {
                description: "Application status updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        application: { $ref: "#/components/schemas/Application" }
                      }
                    }
                  }
                }
              },
              400: { description: "Invalid status value" },
              401: { $ref: "#/components/responses/UnauthorizedError" },
              403: { description: "Forbidden - not the job owner" },
              404: { description: "Job or application not found" },
              500: { $ref: "#/components/responses/ServerError" }
            }
          }
        }
      },

      "/jobs/{id}/check-application": {
        get: {
          summary: "Check application status",
          description: "Checks if the current user has applied to a job",
          tags: ["Applications"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "Job ID"
            }
          ],
          responses: {
            200: {
              description: "Application status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      hasApplied: { type: "boolean" },
                      status: { 
                        type: "string",
                        nullable: true,
                        enum: ["pending", "approved", "rejected"]
                      }
                    }
                  }
                }
              }
            },
            401: { $ref: "#/components/responses/UnauthorizedError" },
            500: { $ref: "#/components/responses/ServerError" }
          }
        }
      },

      "/users/applications": {
        get: {
          summary: "Get user applications",
          description: "Retrieves all applications submitted by the current job seeker",
          tags: ["Applications"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "List of user's job applications",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      applications: {
                        type: "array",
                        items: { $ref: "#/components/schemas/JobApplication" }
                      }
                    }
                  }
                }
              }
            },
            401: { $ref: "#/components/responses/UnauthorizedError" },
            403: { description: "Forbidden - only job seekers can access" },
            500: { $ref: "#/components/responses/ServerError" }
          }
        }
      },

      "/users/pending-applications": {
        get: {
          summary: "Get pending applications",
          description: "Retrieves all pending applications for jobs posted by the current job poster",
          tags: ["Applications"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "List of pending applications",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      applications: {
                        type: "array",
                        items: { $ref: "#/components/schemas/PendingApplication" }
                      }
                    }
                  }
                }
              }
            },
            401: { $ref: "#/components/responses/UnauthorizedError" },
            403: { description: "Forbidden - only job posters can access" },
            500: { $ref: "#/components/responses/ServerError" }
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