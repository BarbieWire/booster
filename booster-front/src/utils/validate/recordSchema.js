const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "category-id": {
      "type": "integer",
      "minimum": 1
    },
    "category-name": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "title": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "title-ru": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "title-lv": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "title-ee": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "title-fi": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "long-description": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "long-description-ru": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "long-description-lv": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "long-description-ee": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "long-description-fi": {
      "type": "object",
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": ["__cdata"]
    },
    "colours": {
      "type": "object",
      "properties": {
        "colour": {
          "type": "object",
          "properties": {
            "colour-title": {
              "type": "string",
              "minLength": 0
            },
            "images": {
              "type": "object",
              "properties": {
                "image": {
                  "type": "array",
                  "minItems": 1
                }
              },
              "required": ["image"]
            },
            "modifications": {
              "type": "object",
              "properties": {
                "modification": {
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "object",
                    "properties": {
                      "modification-title": {
                        "type": "object",
                        "properties": {
                          "__cdata": {
                            "type": "string",
                            "minLength": 1
                          }
                        },
                        "required": ["__cdata"]
                      },
                      "weight": {
                        "type": "number",
                        "minimum": 0
                      },
                      "length": {
                        "type": "number",
                        "minimum": 0
                      },
                      "height": {
                        "type": "number",
                        "minimum": 0
                      },
                      "width": {
                        "type": "number",
                        "minimum": 0
                      },
                      "attributes": {
                        "type": "object",
                        "properties": {
                          "barcodes": {
                            "type": "object",
                            "properties": {
                              "barcode": {
                                "type": "object",
                                "properties": {
                                  "__cdata": {
                                    "type": "string",
                                    "minLength": 0
                                  }
                                }
                              }
                            }
                          },
                          "supplier-code": {
                            "type": "object",
                            "properties": {
                              "__cdata": {
                                "type": "string",
                                "minLength": 1
                              }
                            }
                          }
                        },
                        "required": ["supplier-code"]
                      }
                    },
                    "required": ["modification-title", "weight", "length", "height", "width", "attributes"]
                  }
                }
              },
              "required": ["modification"]
            }
          },
          "required": ["images", "modifications"]
        }
      },
      "required": ["colour"]
    }
  },
  "required": [
    "category-id",
    "category-name",
    "title",
    "title-ru",
    "title-lv",
    "title-ee",
    "title-fi",
    "long-description",
    "long-description-ru",
    "long-description-lv",
    "long-description-ee",
    "long-description-fi",
    "colours"
  ]
}



export { schema }