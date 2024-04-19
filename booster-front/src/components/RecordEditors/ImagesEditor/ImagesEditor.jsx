import React, { useState, useContext } from 'react';
import ConfigContext from '../../../context/ConfigContext';
import UserMessagesContext from '../../../context/UserMessagesContext';

import DisplayImage from './Image';

import axios from 'axios';

import classes from './ImagesEditor.module.css'
import fieldClasses from '../../../common/css/fields.module.css'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';


const ImagesEditor = ({ images, setImages }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [website, setWebsite] = useState("")

    const [imageCount, setImageCount] = useState(3)
    const [startIndex, setStartIndex] = useState(0)

    const [imageFullSize, setImageFullSize] = useState("")

    const { configJSON } = useContext(ConfigContext)
    const { createMessageHelper } = useContext(UserMessagesContext)

    const handleSearch = async () => {
        try {
            if (searchQuery) {
                const query = `https://www.googleapis.com/customsearch/v1?&key=${configJSON["GoogleApiKey"]}&cx=${configJSON["GoogleCX"]}&q=${website ? "site:" + website : ""} ${searchQuery}&searchType=image&start=${startIndex}&num=${imageCount || 1}`
                const response = await axios.get(query)

                const items = response.data.items
                if (!items || items.length < 1) {
                    createMessageHelper("failure", "Google could not find any images for the requested prompt", "handleSearch")
                    return
                }

                const imageResults = response.data.items.map((item) => {
                    return { url: item.link }
                });

                setImages(images => {
                    return [...images, ...imageResults]
                });
                setStartIndex(index => index + imageCount)
            }
        } catch (error) {
            createMessageHelper("failure", "Error fetching images", "handleSearch")
        }
    };

    const handleImageDelete = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleManualAppend = async (e) => {
        let result = await window.api.generateImageUrl()
        if (result) {
            const urls = result.map(data => { return { url: data.url } })
            setImages([...urls, ...images])
        }
    }

    const moveImageLeft = (index) => {
        const updatedImages = [...images];
        const temp = updatedImages[index];
        updatedImages[index] = updatedImages[index - 1];
        updatedImages[index - 1] = temp;
        setImages(updatedImages);
    };

    const moveImageRight = (index) => {
        const updatedImages = [...images];
        const temp = updatedImages[index];
        updatedImages[index] = updatedImages[index + 1];
        updatedImages[index + 1] = temp;
        setImages(updatedImages);
    };

    const uploadToServer = async (imageURL, index) => {
        const result = await window.api.uploadToServer(imageURL)
        if (result) setImages(draft => {
            draft[index] = { url: result.url }
        })
    }

    return (
        <div className='editorSectionContainer'>
            <h1>Images</h1>
            <p>Provide a search query for a field named "prompt"</p>
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
                    <button
                        onClick={handleSearch}
                        className={classes.searchButton}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                <div className={fieldClasses.item}>
                    <button
                        onClick={() => setStartIndex(0)}
                        className={classes.resetButton}
                    >
                        <FontAwesomeIcon icon={faEraser} />
                        <span>Zero Search Index</span>
                    </button>
                </div>
                <div className={fieldClasses.item}>
                    <button onClick={handleManualAppend}>
                        <FontAwesomeIcon icon={faUpload} />
                        <span>Upload To Cloudinary</span>
                    </button>
                </div>

            </div>

            <div className={classes.imageContainer}>
                {
                    images.map((image, index) => {
                        return <DisplayImage
                            key={`image_${index}`}
                            imageURL={image.url}
                            images={images}
                            index={index}
                            moveImageLeft={moveImageLeft}
                            moveImageRight={moveImageRight}
                            handleImageDelete={handleImageDelete}
                            setImageFullSize={setImageFullSize}

                            uploadToServer={uploadToServer}
                        />
                    })
                }
            </div>

            {
                imageFullSize && <div
                    className={classes.imageFullSizeContainer}
                    onClick={() => setImageFullSize("")}
                >
                    <img src={imageFullSize} alt="" />
                </div>
            }


        </div>
    );
};

export default ImagesEditor;