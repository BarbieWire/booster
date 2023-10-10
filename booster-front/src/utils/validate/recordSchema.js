const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "category-id",
    "category-name",
    "title",
    "title-ru",
    "title-lv",
    "title-ee",
    "long-description",
    "long-description-ru",
    "long-description-lv",
    "long-description-ee",
    "properties",
    "colours"
  ],
  "properties": {
    "category-id": {
      "type": "integer"
    },
    "category-name": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "title": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "title-ru": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "title-lv": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "title-ee": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "long-description": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "long-description-ru": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "long-description-lv": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "long-description-ee": {
      "type": "object",
      "required": ["__cdata"],
      "properties": {
        "__cdata": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "colours": {
      "type": "object",
      "required": ["colour"],
      "properties": {
        "colour": {
          "type": "object",
          "required": ["images", "modifications"],
          "properties": {
            "images": {
              "type": "object",
              "required": ["image"],
              "properties": {
                "image": {
                  "type": "object",
                  "required": ["url"],
                  "properties": {
                    "url": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                }
              }
            },
            "modifications": {
              "type": "object",
              "required": ["modification"],
              "properties": {
                "modification": {
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "object",
                    "required": [
                      "modification-title",
                      "weight",
                      "length",
                      "height",
                      "width",
                      "attributes"
                    ],
                    "properties": {
                      "modification-title": {
                        "type": "object",
                        "required": ["__cdata"],
                        "properties": {
                          "__cdata": {
                            "type": "string",
                            "minLength": 1
                          }
                        }
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
                        "required": [
                          "barcodes",
                          "supplier-code",
                        ],
                        "properties": {
                          "barcodes": {
                            "type": "object",
                            "required": ["barcode"],
                            "properties": {
                              "barcode": {
                                "type": "object",
                                "required": ["__cdata"],
                                "properties": {
                                  "__cdata": {
                                    "type": "string",
                                    "minLength": 1
                                  }
                                }
                              }
                            }
                          },
                          "supplier-code": {
                            "type": "object",
                            "required": ["__cdata"],
                            "properties": {
                              "__cdata": {
                                "type": "string",
                                "minLength": 1
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}


export { schema }