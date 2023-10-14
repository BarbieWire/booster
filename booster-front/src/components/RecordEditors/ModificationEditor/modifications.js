const MODIFICATIONS = {
    'XS': { "weight": 0.4, "length": 0.2, "height": 0.1, "width": 0.15 },
    'S': { "weight": 0.5, "length": 0.25, "height": 0.15, "width": 0.15 },
    'M': { "weight": 0.6, "length": 0.3, "height": 0.15, "width": 0.25 },
    'L': { "weight": 0.8, "length": 0.4, "height": 0.17, "width": 0.25 },
    'XL': { "weight": 1, "length": 0.5, "height": 0.2, "width": 0.25 },
    '2XL': { "weight": 1.2, "length": 0.75, "height": 0.25, "width": 0.4 },
    '3XL': { "weight": 2, "length": 0.9, "height": 0.4, "width": 0.5 },
}

const generateSupplierCode = () => {
    let capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowers = "abcdefghijklmnopqrstuvwxyz",
        digits = "0123456789"

    let str = capitals + lowers + digits;

    let code = "";
    for (let i = 1; i <= 12; i++) {
        let char = Math.floor(Math.random() * str.length + 1);
        code += str.charAt(char)
    }

    return code;
}

const createModification = (modificationTitle) => {
    if (MODIFICATIONS.hasOwnProperty(modificationTitle)) {
        const modification = {
            "modification-title": {
                "__cdata": modificationTitle
            },
            ...MODIFICATIONS[modificationTitle],
            "attributes": {
                "barcodes": {
                    "barcode": {
                        "__cdata": ""
                    }
                },
                "supplier-code": {
                    "__cdata": generateSupplierCode()
                }
            }
        }
        return modification
    }
    return null
}


export {
    createModification
}