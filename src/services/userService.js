import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  NotFoundError,
  ValidationError,
} from "../errors/serviceErrors.js";
import prisma from "../lib/prisma.js";

export class UserService {
  constructor({
    prismaClient = prisma,
    passwordHasher = bcrypt,
    tokenProvider = jwt,
    jwtSecret = process.env.JWT_SECRET,
  } = {}) {
    this.prisma = prismaClient;
    this.passwordHasher = passwordHasher;
    this.tokenProvider = tokenProvider;
    this.jwtSecret = jwtSecret;
  }

  async register({ username, password }) {
    if (!username || !password) {
      throw new ValidationError("Username or password cannot be empty!");
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ValidationError("User already exists!");
    }

    const passwordHash = await this.passwordHasher.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, passwordHash },
    });

    return {
      message: "User created successfully!",
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async login({ username, password }) {
    if (!username || !password) {
      throw new ValidationError("Username or password cannot be empty!");
    }

    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new ValidationError("Invalid user!");
    }

    const correctPassword = await this.passwordHasher.compare(
      password,
      user.passwordHash,
    );

    if (!correctPassword) {
      throw new ValidationError("Invalid password!");
    }

    const token = this.tokenProvider.sign(
      { userId: user.id, username: user.username },
      this.jwtSecret,
      { expiresIn: "1d" },
    );

    return {
      message: "Login successful!",
      token,
    };
  }

  async getUser(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found!");
    }

    return user;
  }

  async changePassword(userId, { oldPassword, newPassword }) {
    if (!oldPassword || !newPassword) {
      throw new ValidationError("Passwords cannot be empty!");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found!");
    }

    const correctPassword = await this.passwordHasher.compare(
      oldPassword,
      user.passwordHash,
    );

    if (!correctPassword) {
      throw new ValidationError("Current password is incorrect!");
    }

    const passwordHash = await this.passwordHasher.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: "Password changed successfully!" };
  }
}

export default new UserService();
