import React, { useState, useContext, useEffect } from 'react';
import ConfigContext from '../../../context/ConfigContext';

import axios from 'axios';

import classes from './ImagesEditor.module.css'
import fieldClasses from '../../../common/css/fields.module.css'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faEraser, faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';


const ImagesEditor = ({ setRecord, currentImages }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState(currentImages);

    const [website, setWebsite] = useState("")
    const [imageCount, setImageCount] = useState(3)
    const [startIndex, setStartIndex] = useState(0)

    const { configJSON } = useContext(ConfigContext)

    const handleSearch = async () => {
        try {
            if (searchQuery) {
                const query = `https://www.googleapis.com/customsearch/v1?fileType=jpg,png,jpeg&key=${configJSON["GoogleApiKey"]}&cx=${configJSON["GoogleCX"]}&q=${website ? "site:" + website : ""} ${searchQuery}&searchType=image&start=${startIndex}&num=${imageCount || 1}`
                const response = await axios.get(query)

                if (response.status !== 200) {
                    console.log(123)
                }

                const data = response.data;
                const imageResults = data.items.map((item) => item.link);

                setImages(images => {
                    return [...images, ...imageResults]
                });
                setStartIndex(index => index + imageCount)
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        setRecord(draft => {
            draft.product.colours.colour.images.image.url = images
        })
    }, [images])

    function resetStartIndex() {
        setStartIndex(0)
    }

    const handleImageDelete = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleManualAppend = async (e) => {
        const urls = await window.api.generateImageUrl()
        if (urls) {
            setImages([...urls, ...images])
        }
    }


    return (
        <div>
            <div style={{ marginBottom: "5px" }}>
                <h1 className={fieldClasses.title}>Images</h1>
            </div>
            <div className={fieldClasses.container}>
                <div className={fieldClasses.item}>
                    <input
                        type="text"
                        placeholder=" "
                        id="prompt"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <label htmlFor="prompt">prompt: </label>
                </div>

                <div className={fieldClasses.item}>
                    <input
                        min={0}
                        type="text"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        id="website"
                        placeholder=" "
                    />
                    <label htmlFor="website">website: </label>
                </div>

                <div className={fieldClasses.item}>
                    <input
                        min={1}
                        max={10}
                        type="number"
                        value={imageCount}
                        onChange={e => setImageCount(parseInt(e.target.value))}
                        id="imageCount"
                        placeholder=" "
                    />
                    <label htmlFor="imageCount">image count: (max count 10)</label>
                </div>
                <div className={fieldClasses.item}>
                    <button onClick={handleSearch} className={classes.searchButton}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className={fieldClasses.item}>
                    <button onClick={resetStartIndex} className={classes.resetButton}>
                        <FontAwesomeIcon icon={faEraser} />
                    </button>
                </div>
                <div className={fieldClasses.item}>
                    <button onClick={handleManualAppend}>
                        <FontAwesomeIcon icon={faUpload} />
                    </button>
                </div>
            </div>

            <div className={classes.imageContainer}>
                {images.map((image, index) => (
                    <div className={classes.image}>
                        <img src={image} alt={`image_${index}`} />

                        <div className={classes.overlayButton}>
                            <button onClick={() => handleImageDelete(index)} className={classes.btn}>
                                <FontAwesomeIcon icon={faTrashCan} className={classes.icon} />
                            </button>
                            <button className={classes.btn}>
                                <FontAwesomeIcon icon={faEraser} className={classes.icon} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    );
};

export default ImagesEditor;