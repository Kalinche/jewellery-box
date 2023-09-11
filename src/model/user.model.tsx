import { Identifiable } from "./common-types";

type ValidEmail = string;
type ValidGSM = string;
type ValidPassword = string;

export class UserDTO {
  name!: string;          // Име на потребителя
  username!: string;      // login име (username - до 15 символа - word characters)
  brandName?: string;     // Име на марката или фирмата
  password!: ValidPassword;      // парола (поне 8 символа, поне една цифра и знак различен от буква и цифра)
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
  password: ValidPassword;      // парола (поне 8 символа, поне една цифра и знак различен от буква и цифра);
  registrationDate: Date; // Дата на регистрация
  bio: string;           // Кратка биография или описание
  email: ValidEmail;
  gsm: ValidGSM;           // GSM номер за контакт
  website: string;       // Уеб сайт

  constructor(
    name: string,
    username: string,
    brandName: string,
    password: ValidPassword,
    registrationDate: Date,
    bio: string,
    email: ValidEmail,
    gsm: ValidGSM,
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

export function validatePassword(password: string, confirmPassword: string): string[] {
  const errors: string[] = [];
  if (password.length < 10 || password.length > 30) {
    errors.push("Password should be between 10 to 30 characters long.");
  }
  if (password !== confirmPassword) {
    errors.push("Passwords do not match!");
  }
  if (!/\d/.test(password)) {
    errors.push("Password should contain at least one number.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password should contain at least one uppercase letter.");
  }
  if (!/^[a-zA-Z0-9]*$/.test(password)) {
    errors.push("Password should only contain Latin characters and numbers.");
  }
  return errors;
}

export function validateGSM(gsm: string): string[] {
  const errors: string[] = [];
  if (!/^0[89][0-9]{8}$/.test(gsm)) {
    errors.push("Invalid gsm format. Should be in the form of 0894758365");
  }
  return errors;
}

export function validateEmail(email: ValidEmail): string[] {
  const errors: string[] = [];
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!emailPattern.test(email)) {
    errors.push("Invalid email format.");
  }
  return errors;
}

export function validateRequiredFields(user: UserDTO): string[] {
  const errors: string[] = [];
  if (!user.username || !user.password || !user.name || !user.email) {
    errors.push("Fields for username, password, name, and email should not be empty.");
  }
  return errors;
}
