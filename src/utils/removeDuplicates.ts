const removeDuplicates = (array: any[]) => {
    return array.filter((item, index) => array.indexOf(item) === index);
};

export default removeDuplicates;
