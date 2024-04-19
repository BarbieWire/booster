async function generateDescriptionStream(language, title, setGeneratedDescription, openai) {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `
                    Based on provided title, please generate a compelling description for a product that highlights its features, benefits, and why it's a must-have for different people. 
                    Use numbered list to display features or/and benefits.
                    Provide the description in ${language}.
                `
            },
            {
                "role": "user",
                "content": `Create description for this title: "${title}"`
            },
        ],
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
    });

    for await (const chunk of response) {
        setGeneratedDescription(text => text += (chunk.choices[0].delta.content || ""))
    }
}

async function translateTitles(title, openai) {
    const titleJSON = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {
                "role": "system",
                "content": `
                    Translate title to multiple languages and return as valid JSON
                    Languages to Translate To:
                    1. Russian
                    2. Latvian
                    3. Finnish
                    4. Estonian
                    5. Lithuanian
                `
            },
            {
                "role": "user",
                "content": `Input title: ${title}`
            }
        ],
        temperature: 0,
        max_tokens: 2512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        functions: [{
            "name": "translate_titles",
            "description": "Translate titles into different languages.",
            "parameters": {
                "type": "object",
                "properties": {
                    "russian_title": {
                        "type": "string",
                        "description": "Title translated into russian."
                    },
                    "latvian_title": {
                        "type": "string",
                        "description": "Title translated into latvian."
                    },
                    "estonian_title": {
                        "type": "string",
                        "description": "Title translated into Estonian."
                    },
                    "lithuanian_title": {
                        "type": "string",
                        "description": "Title translated into Lithuanian."
                    },
                    "finnish_title": {
                        "type": "string",
                        "description": "Title translated into Finnish."
                    }
                },
                "required": [
                    "latvian_title",
                    "estonian_title",
                    "russian_title",
                    "lithuanian_title",
                    "finnish_title"
                ]
            }
        }],
        function_call: { name: "translate_titles" }
    });

    return JSON.parse(titleJSON.choices[0].message.function_call.arguments)
}


async function translateDescriptions(openai, description, descriptionLanguage) {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k-0613",
        messages: [
            {
                "role": "system",
                "content": "Translate product descriptions to multiple languages.\n  \nLanguages to Translate To:\n1. Russian\n2. Latvian\n3. Finnish\n4. Estonian\n5. Lithuanian"
            },
            {
                "role": "user",
                "content": `Input Product Description Language: ${descriptionLanguage} \nInput Product Description: "${description}" \n\nTranslate the product description in quotation marks, into the specified languages.`
            },
        ],
        temperature: 0,
        max_tokens: 12821,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,

        functions: [{
            "name": "translate_text",
            "description": "Function translates product description into multiple languages.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latvian_description": {
                        "type": "string",
                        "description": "description translated into latvian."
                    },
                    "estonian_description": {
                        "type": "string",
                        "description": "description translated into estonian."
                    },
                    "russian_description": {
                        "type": "string",
                        "description": "description translated into russian."
                    },
                    "lithuanian_description": {
                        "type": "string",
                        "description": "description translated into lithuanian."
                    },
                    "finnish_description": {
                        "type": "string",
                        "description": "description translated into finnish."
                    }
                },
                "required": [
                    "latvian_description",
                    "estonian_description",
                    "russian_description",
                    "lithuanian_description",
                    "finnish_description"
                ]
            }
        }],
        function_call: { name: "translate_text" }
    });

    return JSON.parse(response.choices[0].message.function_call.arguments, null, 2)
}


async function translateDescriptionToSpecificLanguage(language, description, openai) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [
                {
                    "role": "system",
                    "content": `Translate the following text into ${language}`
                },
                {
                    "role": "user",
                    "content": `Text: ${description} \nOutput format: text`
                }
            ],
            temperature: 0,
            max_tokens: 2000,
        });
    
        return response.choices[0].message.content
    } catch (error) {
        console.error(error)
        throw error
    }
}


export {
    generateDescriptionStream,
    translateTitles,
    translateDescriptions,
    translateDescriptionToSpecificLanguage,
}