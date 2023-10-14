import React, { useEffect, useState } from 'react';

import classes from "./ImagesEditor.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faUpload, faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';

const DisplayImage = ({ images, imageURL, index, moveImageLeft, moveImageRight, handleImageDelete, setImageFullSize, uploadToServer }) => {
    const [image, setImage] = useState(null);
    const [sizes, setSizes] = useState({})
    const [imageExtension, setImageExtension] = useState("")

    // When the image is loaded, update the state to display it
    useEffect(() => {
        const img = new Image();
        img.src = imageURL;

        img.onload = () => {
            setImage(img);
            setSizes({ width: img.width, height: img.height })
        };
        img.onerror = () => {
            handleImageDelete(index)
        }

        const extension = imageURL.split(".").pop()
        setImageExtension(extension.length <= 5 ? extension : "unknown")

    }, [imageURL, setImage, setSizes, setImageExtension])


    return (
        image && <div className={classes.image}>
            <img src={image.src} alt={`image_${index}`} onClick={() => setImageFullSize(image.src)} />

            <div className={classes.overlayButton}>
                <button onClick={() => handleImageDelete(index)} className={classes.btn}>
                    <FontAwesomeIcon icon={faTrashCan} className={classes.icon} />
                </button>
                <button className={classes.btn} onClick={() => uploadToServer(image.src, index)}>
                    <FontAwesomeIcon icon={faUpload} className={classes.icon} />
                </button>
            </div>

            <div className={classes.controlsButton}>
                {index > 0 && (
                    <button className={classes.btn} onClick={() => moveImageLeft(index)}>
                        <FontAwesomeIcon icon={faLeftLong} className={classes.icon} />
                    </button>
                )}
                {index < images.length - 1 && (
                    <button className={classes.btn} onClick={() => moveImageRight(index)}>
                        <FontAwesomeIcon icon={faRightLong} className={classes.icon} />
                    </button>
                )}
            </div>

            {
                image && <div className={classes.extensionContainer}>
                    <span className={classes.extension}>{imageExtension}</span>
                    <span className={classes.extension}>{sizes.height} x {sizes.width}</span>
                </div>
            }

        </div>
    );
};


export default DisplayImage;