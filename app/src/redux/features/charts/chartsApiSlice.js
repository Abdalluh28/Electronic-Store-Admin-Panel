const { apiSlice } = require('../../api/apiSlice')



export const chartsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductsChart: builder.query({
            query: () => ({
                url: '/chart/products',
                method: 'GET'
            })
        }),
        getCategoriesChart: builder.query({
            query: () => ({
                url: '/chart/categories',
                method: 'GET'
            })
        }),
        getUsersChart: builder.query({
            query: () => ({
                url: '/chart/users',
                method: 'GET'
            })
        }),
    })
})


export const { useGetProductsChartQuery, useGetCategoriesChartQuery, useGetUsersChartQuery } = chartsApiSlice