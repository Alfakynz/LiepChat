import { readUsers, writeUsers } from '../utils/fileHandler'
import { Request, Response } from 'express'

export async function signup(req: Request, res: Response) {
  const { username, password } = req.body
  const users = await readUsers()

  const userExists = users.some((u: any) => u.username === username)
  if (userExists) {
    return res.status(400).json({ message: 'Username already used' })
  }

  const newUser = { username, password }
  users.push(newUser)
  await writeUsers(users)

  res.status(201).json({ message: 'User signed up with success' })
}

export async function signin(req: Request, res: Response) {
  const { username, password } = req.body
  const users = await readUsers()

  const user = users.find((u: any) => u.username === username && u.password === password)
  if (!user) {
    return res.status(401).json({ message: 'Incorrect log in' })
  }

  res.status(200).json({ message: 'Successful connection', user: { username: user.username } })
}
