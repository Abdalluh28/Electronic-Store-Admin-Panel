import React, { useEffect, useState } from 'react';
import { useGetNewProductsQuery, useGetTopProductsQuery } from '../redux/features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../redux/features/categories/categoriesApiSlice';
import { Spinner } from 'react-bootstrap';

export default function FeaturedProducts({ active }) {
    const { data: newProducts, isLoading: newProductsLoading, isSuccess: newProductsSuccess } = useGetNewProductsQuery();
    const { data: topProducts, isLoading: topProductsLoading, isSuccess: topProductsSuccess } = useGetTopProductsQuery();
    const { data: categories } = useGetCategoriesQuery();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [featuredImages, setFeaturedImages] = useState([]);

    useEffect(() => {
        if (newProductsSuccess && topProductsSuccess) {
            if (active === 0) {
                setProducts(newProducts.products);
            } else if (active === 1) {
                setProducts(topProducts.products);
            }

            setIsLoading(false);
        }
    }, [newProductsLoading, topProductsLoading, active]);

    useEffect(() => {
        const fetchImagesSequentially = async () => {
            if (products) {
                const imageUrls = [];
                for (const product of products) {
                    try {
                        const imageUrl = `${process.env.REACT_APP_API_URL}${product.images[0]}`
                        imageUrls.push(imageUrl);
                    } catch (error) {
                        console.error('Error fetching image:', error);
                        imageUrls.push(''); // Handle fetch error or provide a fallback
                    }
                }
                setFeaturedImages(imageUrls);
            }
        };

        fetchImagesSequentially();
    }, [products]);


    return (
        <>
            

        </>
    );
}
