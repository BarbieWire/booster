const MODIFICATIONS = {
    'S': { "weight": 1, "length": 1, "height": 1, "width": 1 },
    'M': { "weight": 2, "length": 2, "height": 2, "width": 2 },
    'L': { "weight": 3, "length": 3, "height": 3, "width": 3 },
    'XL': { "weight": 4, "length": 4, "height": 4, "width": 4 },
}

const generateSupplierCode = () => {
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789';

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