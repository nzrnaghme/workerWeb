export interface IAdressDetail {
    textAdress: string,
    codeAddress: string
}

export const address = [
    {
        textAdress: 'تهران ستارخان خیابان امیرکبیر کوچه خسروپرویز پلاک 44',
        codeAddress: "4588126497",
    },
]

export interface IAdressInsertDetail {
    userId: string,
    title: string,
    region: string[] | null,
    location: ILocationInsert | null,
    address: string,
    postalCode: string | null,
    isDefault: boolean
}

export interface ILocationInsert {
    latitude: number;
    longitude: number;
    name: string;
    date: string;
}
