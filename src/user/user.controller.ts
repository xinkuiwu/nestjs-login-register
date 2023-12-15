import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Res, ValidationPipe } from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService

  constructor(private readonly userService: UserService) {}
  @Post('login')
  async login(@Body(ValidationPipe) user: LoginDto,
              @Res({
                passthrough: true
              }) res: Response)
  {
    console.log(user);
    const foundUser = await this.userService.login(user)
    if(foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username
        }
      })
      res.setHeader('token', token)
      return 'login success'
    } else {
      return 'login fail'
    }
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    console.log(user);
    return await this.userService.register(user)
  }

}
