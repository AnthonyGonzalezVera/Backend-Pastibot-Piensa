import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ✅ Verifica que el usuario exista y la contraseña coincida
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // ✅ Devuelve token y datos del usuario
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
      }
    };
  }

  // ✅ Hashea la contraseña y registra al usuario
  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.usersService.create({
      ...userData,
      password: hashedPassword
    });
    return this.login(newUser);
  }
}
