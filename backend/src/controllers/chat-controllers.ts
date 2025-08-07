import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import {
    ChatCompletionUserMessageParam,
    ChatCompletionAssistantMessageParam,
} from "openai/resources/index.mjs";

// Generate a new chat completion
export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message } = req.body;

        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: "User not registered or token malfunctioned" });
        }

        // Convert chats from MongoDB to proper OpenAI message format
        const chats = (user.chats as unknown as { role: string; content: string }[])
            .map(({ role, content }) => {
                if (role === "user") {
                    return { role: "user", content } as ChatCompletionUserMessageParam;
                }
                return { role: "assistant", content } as ChatCompletionAssistantMessageParam;
            });

        // Add new user message
        chats.push({
            content: message,
            role: "user",
        } as ChatCompletionUserMessageParam);

        user.chats.push({ content: message, role: "user" });

        // Send request to OpenAI
        const openai = configureOpenAI();
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: chats,
        });

        const assistantMessage = chatResponse.choices[0].message;
        user.chats.push({
            role: assistantMessage.role!,
            content: assistantMessage.content || "",
        });

        await user.save();

        return res.status(200).json({ chats: user.chats });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Get all chats for the logged-in user
export const getAllChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);

        if (!user)
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res
                .status(401)
                .json({ message: "ERROR", cause: "Permissions didn't match" });
        }

        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

// Delete all chats for the logged-in user
export const deleteAllChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);

        if (!user)
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res
                .status(401)
                .json({ message: "ERROR", cause: "Permissions didn't match" });
        }

        // Clear all chats
        user.chats = [] as any;
        await user.save();

        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};
