import { TokenService } from "@loopback/authentication";
import { TokenServiceBindings } from "@loopback/authentication-jwt";
import { inject } from "@loopback/core";
import { HttpErrors } from "@loopback/rest";
import { UserProfile, securityId } from "@loopback/security";
import { promisify } from "util";

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);

export class JWTService implements TokenService {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SECRET)
        private jwtSecret: string,
        @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
        private jwtExpiresIn: string,
    ) { }

    verifyToken(token: string): Promise<UserProfile> {
        throw new Error("Method not implemented.");
    }

    revokeToken?(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async generateToken(userProfile: UserProfile): Promise<string> {
        let token: string;

        if (!userProfile) {
            throw new HttpErrors.Unauthorized('Error generate token: userProfile is null');
        }

        const userInfoForToken = {
            id: userProfile[securityId],
            name: userProfile.username
        }

        try {
            token = await signAsync(userInfoForToken, this.jwtSecret, {
                expiresIn: Number(this.jwtExpiresIn),
            });
        } catch (error) {
            throw new HttpErrors.Unauthorized(`Error generate token: ${error}`)
        }

        return token;
    }
}



