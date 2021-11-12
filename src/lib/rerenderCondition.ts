export function rerenderCondition(value: boolean) {

    return (data: any) => {
        return value ? JSON.stringify(data) : "";
    }

}