const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "category-id": { "type": "integer" },
        "category-name": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "title": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "title-ru": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "title-lv": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "title-ee": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "long-description": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "long-description-ru": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "long-description-lv": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "long-description-ee": {
            "type": "object",
            "properties": {
                "__cdata": { "type": "string" }
            },
            "required": ["__cdata"]
        },
        "video-youtube": { "type": "string" },
        "properties": {
            "type": "object",
            "properties": {
                "property": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "object",
                                "properties": {
                                    "__cdata": { "type": "string" }
                                },
                                "required": ["__cdata"]
                            },
                            "values": {
                                "type": "object",
                                "properties": {
                                    "value": {
                                        "type": "object",
                                        "properties": {
                                            "__cdata": { "type": "string" }
                                        },
                                        "required": ["__cdata"]
                                    }
                                },
                                "required": ["value"]
                            }
                        },
                        "required": ["id", "values"]
                    }
                }
            }
        },
        "colours": {
            "type": "object",
            "properties": {
                "colour": {
                    "type": "object",
                    "properties": {
                        "colour-title": { "type": "string" },
                        "images": {
                            "type": "object",
                            "properties": {
                                "image": {
                                    "type": "object",
                                    "properties": {
                                        "url": {
                                            "type": "array",
                                            "items": { "type": "string" }
                                        }
                                    },
                                    "required": ["url"]
                                }
                            }
                        },
                        "modifications": {
                            "type": "object",
                            "properties": {
                                "modification": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "modification-title": {
                                                "type": "object",
                                                "properties": {
                                                    "__cdata": { "type": "string" }
                                                },
                                                "required": ["__cdata"]
                                            },
                                            "weight": { "type": "number" },
                                            "length": { "type": "number" },
                                            "height": { "type": "number" },
                                            "width": { "type": "number" },
                                            "attributes": {
                                                "type": "object",
                                                "properties": {
                                                    "barcodes": {
                                                        "type": "object",
                                                        "properties": {
                                                            "barcode": {
                                                                "type": "object",
                                                                "properties": {
                                                                    "__cdata": { "type": "string" }
                                                                },
                                                                "required": ["__cdata"]
                                                            }
                                                        },
                                                        "required": ["barcode"]
                                                    },
                                                    "supplier-code": {
                                                        "type": "object",
                                                        "properties": {
                                                            "__cdata": { "type": "string" }
                                                        },
                                                        "required": ["__cdata"]
                                                    },
                                                    "manufacturer-code": {
                                                        "type": "object",
                                                        "properties": {
                                                            "__cdata": { "type": "string" }
                                                        },
                                                        "required": ["__cdata"]
                                                    }
                                                },
                                                "required": ["barcodes", "supplier-code", "manufacturer-code"]
                                            }
                                        },
                                        "required": ["modification-title", "weight", "length", "height", "width", "attributes"]
                                    }
                                }
                            }
                        }
                    },
                    "required": ["colour-title", "images", "modifications"]
                }
            }
        }
    },
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
    ]
}


const Ajv = require('ajv');
const ajv = new Ajv();

const data = {
    "finished": true,
    "category-id": 74,
    "category-name": {
        "__cdata": "Monitor"
    },
    "title": {
        "__cdata": ""
    },
    "title-ru": {
        "__cdata": "rgerger"
    },
    "title-lv": {
        "__cdata": ""
    },
    "title-ee": {
        "__cdata": ""
    },
    "long-description": {
        "__cdata": ""
    },
    "long-description-ru": {
        "__cdata": ""
    },
    "long-description-lv": {
        "__cdata": ""
    },
    "long-description-ee": {
        "__cdata": ""
    },
    "properties": {
        "property": [
            ""
        ]
    },
    "colours": {
        "colour": {
            "colour-title": "",
            "images": {
                "image": [
                    ""
                ]
            },
            "modifications": {
                "modification": [
                    {
                        "modification-title": {
                            "__cdata": "L"
                        },
                        "weight": 1.2,
                        "length": 0.2,
                        "height": 0.1,
                        "width": 1.2,
                        "attributes": {
                            "barcodes": {
                                "barcode": {
                                    "__cdata": ""
                                }
                            },
                            "supplier-code": {
                                "__cdata": "qbJybuqe4mSk"
                            }
                        }
                    }
                ]
            }
        }
    }
}


const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
    console.error('Validation errors:', validate.errors);
} else {
    console.log('Object is valid');
}