import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { PasswordHasherBinding, UserServiceBindings } from './keys';
import { BryptHasher } from './services/hash-password.service';
import { UserManagementService } from './services/user-management.service';
import { JWTAuthenticationComponent, TokenServiceBindings, TokenServiceConstants } from '@loopback/authentication-jwt';
// import { JWTService } from './services/jwt.service';
import crypto from 'crypto';
import { JWTService } from './services/jwt.service';
import { AuthenticationComponent } from '@loopback/authentication';


export { ApplicationConfig };

export class ToDoAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthenticationComponent);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.bind(PasswordHasherBinding.PASSWORD_HASHER).toClass(BryptHasher);
    this.bind(PasswordHasherBinding.ROUNDS).to(10);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(UserManagementService);
    
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
    
  }
}
