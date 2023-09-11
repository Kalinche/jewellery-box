import { Identifiable } from "./common-types";

type ValidGSM = string;
type ValidEmail = string;

export class UserDTO {
  name!: string;          // Име на потребителя
  username!: string;      // login име (username - до 15 символа - word characters)
  brandName?: string;     // Име на марката или фирмата
  password!: string;      // парола (поне 8 символа, поне една цифра и знак различен от буква и цифра)
  bio?: string;           // Кратка биография или описание
  email!: ValidEmail;
  gsm?: ValidGSM;           // GSM номер за контакт
  website?: string;       // Уеб сайт

  constructor(config: Partial<UserDTO>) {
    Object.assign(this, config);
  }
}

export class User {
  name: string;          // Име на потребителя
  username: string;      // login име (username - до 15 символа - word characters);
  brandName: string;     // Име на марката или фирмата
  password: string;      // парола (поне 8 символа, поне една цифра и знак различен от буква и цифра);
  registrationDate: Date; // Дата на регистрация
  bio: string;           // Кратка биография или описание
  email: string;
  gsm: string;           // GSM номер за контакт
  website: string;       // Уеб сайт

  constructor(
    name: string,
    username: string,
    brandName: string,
    password: string,
    registrationDate: Date,
    bio: string,
    email: string,
    gsm: string,
    website: string
  ) {
    this.name = name;
    this.username = username;
    this.brandName = brandName;
    this.password = password;
    this.registrationDate = registrationDate;
    this.bio = bio;
    this.email = email;
    this.gsm = gsm;
    this.website = website;
  }
}

export class IdentifiableUser extends User implements Identifiable {
  _id: string; // идентификатор на записа (до 24 символа);

  constructor(
    _id: string,
    name: string,
    username: string,
    brandName: string,
    password: string,
    registrationDate: Date,
    bio: string,
    email: string,
    gsm: string,
    website: string
  ) {
    super(name, username, brandName, password, registrationDate, bio, email, gsm, website);
    this._id = _id;
  }
}