import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator";
import { JWT_REFRESH_SECRET } from "../config/config";



export const registerUser = async (data: any) => {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("User with email already exists", 409);
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new AppError("Something went wrong while registering the user", 500);
    }

    return createdUser;
};

export const loginUser = async (data: any) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User does not exist", 404);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AppError("Invalid user credentials", 401);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return {
        user: loggedInUser,
        accessToken,
        refreshToken,
    };
};

export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
};

export const refreshAccessTokenService = async (incomingRefreshToken: string) => {
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            JWT_REFRESH_SECRET as string
        ) as any;

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new AppError("Invalid refresh token", 401);
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new AppError("Refresh token is expired or used", 401);
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new AppError("Invalid refresh token", 401);
    }
};
