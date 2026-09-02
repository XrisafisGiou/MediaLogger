import aiService from "../services/aiService.js";

export async function chat(req, res, next) {
  try {
    const { messages } = req.body;

    const result =
      await aiService.chat(
        req.user.userId,
        messages,
      );

    res.json(result);
  } catch (error) {
    next(error);
  }
}