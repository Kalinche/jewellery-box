import { ObjectId } from "mongodb";
import { Identifiable } from "./common-types";

export enum Currency {
    BGN = 'лв.',
    USD = '$',
    EUR = '€'
}

enum JewelleryType {
    BRACELET = 'bracelet',
    NECKLACE = 'necklace',
    RING = 'ring',
    EARRINGS = 'earrings',
    OTHER = 'other'
}

enum Gender {
    WOMEN = 'women',
    MEN = 'men',
    UNISEX = 'unisex'
}

class Jewellery {
    jewellerId: ObjectId;
    name: string;
    price: number;           // цена в лева (две числа след десетичната запетая)
    currency: Currency;
    visibility: boolean;     // видимост
    craftingTime: number;    // време за изработка в минути
    count: number;           // брой
    photos: string[];        // снимки като URL адреси
    collection: string;      // име на колекцията
    type: JewelleryType;     // тип бижу (гривна, огърлица и т.н.)
    tags: string[];          // етикети
    style: string;           // стил
    gender: Gender;          // пол (жена, мъж, унисекс)
    description: string;     // дълго описание
    serialNumber: number;

    constructor(params: {
        jewellerId: ObjectId;
        name: string;
        price: number;
        currency: Currency;
        visibility: boolean;
        craftingTime: number;
        count: number;
        photos: string[];
        collection: string;
        type: JewelleryType;
        tags: string[];
        style: string;
        gender: Gender;
        description: string;
        serialNumber: number;
    }) {
        this.jewellerId = params.jewellerId
        this.name = params.name
        this.price = params.price;
        this.currency = params.currency;
        this.visibility = params.visibility;
        this.craftingTime = params.craftingTime;
        this.count = params.count;
        this.photos = params.photos;
        this.collection = params.collection;
        this.type = params.type;
        this.tags = params.tags;
        this.style = params.style;
        this.gender = params.gender;
        this.description = params.description;
        this.serialNumber = params.serialNumber
    }
}

class IdentifiableJewellery extends Jewellery implements Identifiable {
    _id: string;

    constructor(
        _id: string,
        jewellerId: ObjectId,
        name: string,
        price: number,
        currency: Currency,
        visibility: boolean,
        craftingTime: number,
        count: number,
        photos: string[],
        collection: string,
        type: JewelleryType,
        tags: string[],
        style: string,
        gender: Gender,
        description: string,
        serialNumber: number,
    ) {
        super({
            jewellerId,
            name,
            price,
            currency,
            visibility,
            craftingTime,
            count,
            photos,
            collection,
            type,
            tags,
            style,
            gender,
            description,
            serialNumber
        });
        this._id = _id;
    }
}

class JewelleryDTO {
    name?: string;
    type!: JewelleryType;
    collection?: string;
    material?: string;
    description?: string;
    price!: number;
    currency!: Currency;
    imageUrl?: string;

    constructor(init: Partial<JewelleryDTO>) {
        Object.assign(this, init);
    }
}

const validateRequiredFields = (jewellery: JewelleryDTO): string[] => {
    const errors: string[] = [];

    if (!jewellery.type) {
        errors.push("Type is required.");
    }

    if (jewellery.price <= 0) {
        errors.push("Price must be a positive number.");
    } else if (jewellery.price > 100000) {  // You can adjust this limit based on your needs.
        errors.push("Price seems too high.");
    }

    return errors;
};


export { Jewellery, IdentifiableJewellery, JewelleryType, Gender, JewelleryDTO, validateRequiredFields };
