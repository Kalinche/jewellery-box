import { Request as ExpressRequest } from "express"

export interface Identifiable {
  _id?: string;
}

export interface ResourceType<T> extends Function {
  typeId: string;
  new(...args: any[]): T;
}

export interface Request extends ExpressRequest {
  userId?: string;
}