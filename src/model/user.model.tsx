import { Identifiable } from "./common-types";
import * as yup from 'yup';

export class UserDTO {
  constructor(public username: string, public password: string) {}
}

export class User {
  username: string; //login име (username - до 15 символа - word characters);
  password: string; //парола (поне 8 символа, поне една цифра и знак различен от буква и цифра);
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class IdentifiableUser extends User implements Identifiable{
  _id: string; //идентификатор на записа (до 24 символа);

  constructor(_id: string, username: string, password: string) {
    super(username, password);
    this._id = _id;
  }
}

// export const userSchema = yup.object().shape({
//   name: yup.string().required(),
//   username: yup
//     .string()
//     .max(15)
//     .matches(/^\w+$/)
//     .required(),
//   password: yup
//     .string()
//     .min(8)
//     .matches(/^(?=.*[0-9])(?=.*[^\w\s]).*$/)
//     .required(),
//   gender: yup.string().required(),
//   role: yup.string().oneOf(['user', 'admin']).required(),
//   photo: yup.string().url().notRequired(),
//   description: yup.string().max(512).required(),
//   accountStatus: yup
//     .string()
//     .oneOf(['active', 'suspended', 'deactivated'])
//     .required(),
//   registrationTime: yup.date().required(),
//   modificationTime: yup.date().required(),
// });

// export const userDtoSchema = yup.object().shape({
//   username: yup
//     .string()
//     .max(15)
//     .matches(/^\w+$/)
//     .required(),
//   password: yup
//     .string()
//     .min(8)
//     .matches(/^(?=.*[0-9])(?=.*[^\w\s]).*$/)
//     .required(),
// });

export function validateUser(user: User){
  let problems = []
  if(user.username.length > 15){
      problems.push("username too long")
  }

  if(user.password.length < 8){
      problems.push("password too short")
  }

  return problems;
}