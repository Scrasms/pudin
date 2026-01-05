/**
 * Given an object representing the columns to be selected by a DB query, parses it into a single string
 * @param {object} columns - columns to be selected by DB query
 * @returns - columns to be selected in DB query as a string
 */
const columnsToString = (columns) => {
    // Default to return no columns
    let columnString = "1";
    if (columns) {
        columnString = Object.keys(columns).join(", ");
    }

    return columnString;
};

export { columnsToString };
