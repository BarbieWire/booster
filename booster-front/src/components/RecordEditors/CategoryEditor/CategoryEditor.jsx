import React, {useState, useEffect} from 'react';

import cats from "./Categories.json"


const CategoryEditor = ({setRec, preselected}) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([])

    useEffect(() => {
        setRec(draft => {
            if (selectedCategory.id) {
                draft.product["category-id"] = selectedCategory.id
                draft.product["category-name"].__cdata = selectedCategory.title
            }
        })
    }, [selectedCategory])

    useEffect(() => {
        const data = [...cats].sort((a, b) => a.id - b.id)
        setCategories(data)
    }, [])

    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value);
        const selectedCategoryObject = categories.find((category) => category.id === categoryId);
        setSelectedCategory(selectedCategoryObject);
    };

    return (
        <div>
            <label htmlFor="categoryDropdown">Select a Category:</label>
            <select
                id="categoryDropdown"
                onChange={handleCategoryChange}
                defaultValue={preselected}
            >
                {categories.map((category) => (
                    <option key={category.id} value={category.id} selected={category.id === preselected}>
                        {category.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryEditor;