import { Binding, BindingKey } from "@loopback/core";
import { PasswordHasher } from "./services/hash-password.service";
import exp from "constants";
import { Credentials } from "@loopback/authentication-jwt";
import { UserService } from "@loopback/authentication";
import { User } from "./models";


export namespace PasswordHasherBinding {
    export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.passwordHasher');
    export const ROUNDS = BindingKey.create<number>('services.passwordHasher.round');
}

export namespace UserServiceBindings {
    export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user');
}

