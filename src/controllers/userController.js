import userService from "../services/userService.js";

export async function register(req, res) {
  const result = await userService.register(req.body);
  return res.json(result);
}

export async function login(req, res) {
  const result = await userService.login(req.body);
  return res.json(result);
}

export async function identification(req,res) {
  const user = await userService.getUser(req.user.userId);
  return res.json(user);
}

export async function changePassword(req, res) {
  const result = await userService.changePassword(
    req.user.userId,
    req.body,
  );
  return res.json(result);
}
