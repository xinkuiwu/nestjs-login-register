import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header("authorization") || "";

    const bearer = authorization.split(" ");

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException("登陆token错误");

    }

    const token = bearer[1];

    try {
      const data = this.jwtService.verify(token);
      (request as any).user = data.user;
      return true;
    } catch (e) {
      throw new UnauthorizedException("登陆token失效，请重新登陆");
    }

  }
}
