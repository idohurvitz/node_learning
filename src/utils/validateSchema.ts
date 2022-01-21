interface SchemaInterface {
    [key: string]: any
}

const schema: SchemaInterface = {
    date: {
        unix_timestamp: "^[0-9]+$", date_string: "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$"
    }
}


export default schema