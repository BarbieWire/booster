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
                "__cdata": { "type": "string", "minLength": 1 }
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

module.exports = {
    schema
}