import { useImmer } from 'use-immer';

import _ from 'lodash'
import { useEffect } from 'react';


export function useActiveRecord() {
    const [record, setRecord] = useImmer();
    const [modifications, setModifications] = useImmer();
    const [images, setImages] = useImmer();

    function setActiveRecord(recordObject) {
        setRecord(recordObject);
        setModifications(recordObject ? _.cloneDeep(recordObject.product.colours.colour.modifications.modification) : undefined);
        setImages(recordObject ? _.cloneDeep(recordObject.product.colours.colour.images.image) : undefined);
    }

    useEffect(() => {
        if (modifications) setRecord(draft => { draft.product.colours.colour.modifications.modification = modifications })
        if (images) setRecord(draft => { draft.product.colours.colour.images.image = images })
    }, [modifications, images, setRecord])


    return [{
        values: {
            record, modifications, images
        },
        actions: {
            setRecord, setModifications, setImages
        }
    }, setActiveRecord]
}
