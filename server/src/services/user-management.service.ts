import { UserService } from "@loopback/authentication";
import { Credentials } from "@loopback/authentication-jwt";
import { User } from "../models";
import { UserProfile, securityId } from "@loopback/security";
import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";
import { inject } from "@loopback/core";
import { PasswordHasherBinding } from "../keys";
import { BryptHasher } from "./hash-password.service";
import { HttpErrors } from "@loopback/rest";

export class UserManagementService implements UserService<User, Credentials> {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(PasswordHasherBinding.PASSWORD_HASHER)
        public passwordHasher: BryptHasher
    ) { }

    async verifyCredentials(credentials: Credentials): Promise<User> {
        const { username, password } = credentials;

        if (!username) {
            throw new HttpErrors.Unauthorized('Invalid username');
        }
        if (!password) {
            throw new HttpErrors.Unauthorized('Invalid password')
        }

        const foundUser = await this.userRepository.findOne({
            where: { username }
        })
        if (!foundUser) {
            throw new HttpErrors.Unauthorized('User not exists')
        }

        const passwordIsMatched = await this.passwordHasher.comparePassword(password, foundUser.password);
        if (!passwordIsMatched) {
            throw new HttpErrors.Unauthorized('Password incorrect')
        }
        return foundUser;
    }

    convertToUserProfile(user: User): UserProfile {
        return {
            [securityId]: `${user.id}`,
            username: user.username,
        }
    }

    async handleSignUp(newUser: User): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username: newUser.username }
        })
        if (user) {
            throw new HttpErrors.Unauthorized("User already exists")
        }
        if (!newUser.username) {
            throw new HttpErrors.Unauthorized('Invalid username')
        }
        if (!newUser.password) {
            throw new HttpErrors.Unauthorized('Invalid password')
        }
        newUser.password = await this.passwordHasher.hashPassword(
            newUser.password
        )
        return await this.userRepository.create(newUser);
    }

    async handleChangePassword(userWithNewPassword: { username: string, oldPassword: string, newPassword: string })
        : Promise<User> {

        if (!userWithNewPassword.username) {
            throw new HttpErrors.Unauthorized('Invalid username');
        }
        if (!userWithNewPassword.oldPassword) {
            throw new HttpErrors.Unauthorized('Invalid old password');
        }
        if (!userWithNewPassword.newPassword) {
            throw new HttpErrors.Unauthorized('Invalid new password');
        }

        const user = await this.userRepository.findOne({
            where: { username: userWithNewPassword.username }
        })
        if (!user) {
            throw new HttpErrors.Unauthorized('User not exists');
        }

        const passwordIsMatched = await this.passwordHasher.comparePassword(userWithNewPassword.oldPassword, user.password);
        if (!passwordIsMatched) {
            throw new HttpErrors.Unauthorized('Old password incorrect');
        }

        const hashedPassword = await this.passwordHasher.hashPassword(userWithNewPassword.newPassword);
        user.password = hashedPassword;
        await this.userRepository.update(user);

        return user;
    }

}