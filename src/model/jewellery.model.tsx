import { Identifiable } from "./common-types";

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
    price: number;           // цена в лева (две числа след десетичната запетая)
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

    constructor(params: {
        price: number;
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
    }) {
        this.price = params.price;
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
    }
}

class IdentifiableJewellery extends Jewellery implements Identifiable {
    _id: string; // идентификатор на записа (до 24 символа);

    constructor(
        _id: string,
        price: number,
        visibility: boolean,
        craftingTime: number,
        count: number,
        photos: string[],
        collection: string,
        type: JewelleryType,
        tags: string[],
        style: string,
        gender: Gender,
        description: string
    ) {
        super({
            price,
            visibility,
            craftingTime,
            count,
            photos,
            collection,
            type,
            tags,
            style,
            gender,
            description
        });
        this._id = _id;
    }
}

export { Jewellery, IdentifiableJewellery, JewelleryType, Gender };
