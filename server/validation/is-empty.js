/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 20:39:22
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-22 20:40:24
 * @ Github: https://github.com/tyutjohn
 */

const isEmpty = value => {
    return (value == undefined || 
           value === null || 
           (typeof value === 'object' && Object.keys(value).length === 0) || 
           (typeof value === 'string' && value.trim().length === 0)
    );
};

module.exports=isEmpty;